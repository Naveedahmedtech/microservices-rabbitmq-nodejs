// ** config
import { oauth2Client } from "@/config/google.config";
import { Response } from "@/config/express.config";
// ** utils
import prismaClient from "@/utils/prisma";
import { getHashPassword } from "@/utils/hash";
import { createToken, verifyToken } from "@/utils/jwt";
import { CustomError } from "@/utils/CustomError";
import { sendErrorResponse } from "@/utils/responseHandler";
// ** constants
import { ENV } from "@/constants";
// ** external libraries
import axios from "axios";
import qs from "querystring";
import { registrationBodyT, SignUpMethodT } from "@/types";



export const registerUserService = async (userData: registrationBodyT) => {
  const { email, password, role } = userData;
  const signup_type: SignUpMethodT = "EMAIL";
  try {
    const hashPassword: string = await getHashPassword(password);

    const user = await prismaClient.user.create({
      data: {
        email,
        password: hashPassword,
        role,
        signup_type,
      },
    });

    const accessToken: string = await createToken(
      user,
      process.env.ACCESS_TOKEN_EXPIRY
    );
    const refreshToken: string = await createToken(
      user,
      process.env.REFRESH_TOKEN_EXPIRY
    );
    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

export const getGoogleUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
  });
};

export const handleGoogleCallback = async (res: Response, code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  const signup_type: SignUpMethodT = "GOOGLE";

  const ticket = await oauth2Client.verifyIdToken({
    idToken: tokens.id_token!,
    audience: ENV.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload()!;
  if (!payload) {
    sendErrorResponse(
      res,
      "Sorry we're having issuing with your google account!"
    );
  }
  const user = await prismaClient.user.create({
    data: {
      email: payload.email!,
      full_name: payload.name,
      role: "USER",
      signup_type,
    },
  });

  const accessToken: string = await createToken(user, ENV.ACCESS_TOKEN_EXPIRY);
  const refreshToken: string = await createToken(
    user,
    ENV.REFRESH_TOKEN_EXPIRY
  );
  return { accessToken, refreshToken };
};



export const getFacebookUrl = () => {
  const params = {
    client_id: ENV.FACEBOOK_APP_ID,
    redirect_uri: ENV.FACEBOOK_REDIRECT_URI,
    scope: ENV.FACEBOOK_SCOPE || "email,public_profile",
    response_type: ENV.FACEBOOK_RESPONSE_TYPE ||"code",
  };
  return `${ENV.FACEBOOK_OAUTH_URL}?${qs.stringify(params)}`;
};

export const handleFacebookCallback = async (code: string) => {
  const tokenResponse = await axios.get(ENV.FACEBOOK_VERIFY_URL, {
    params: {
      client_id: ENV.FACEBOOK_APP_ID,
      redirect_uri: ENV.FACEBOOK_REDIRECT_URI,
      client_secret: ENV.FACEBOOK_APP_SECRET,
      code,
    },
  });

  const accessToken: string = tokenResponse.data.access_token;

  const userResponse = await axios.get(ENV.FACEBOOK_RESPONSE_URL, {
    params: {
      fields: ENV.FACEBOOK_FIELDS || "id,name,email,picture",
      access_token: accessToken,
    },
  });

  const { id, email, name, picture } = userResponse.data;

  const signup_type: SignUpMethodT = "FACEBOOK";

  const user = await prismaClient.user.create({
    data: {
      email,
      full_name: name,
      image: picture.data.url,
      signup_type: signup_type,
    },
  });

  return user;
};


export const verifyRegistrationService = async (token: string) => {
  try {
    const decodedToken = await verifyToken(token);
    if (
      typeof decodedToken !== "object" ||
      !decodedToken.hasOwnProperty("id")
    ) {
      throw new CustomError("Invalid token structure", 401);
    }

    await prismaClient.user.update({
      where: {
        id: decodedToken.id,
      },
      data: {
        isEmailVerified: true,
      },
    });
  } catch (error) {
    throw error;
  }
}

