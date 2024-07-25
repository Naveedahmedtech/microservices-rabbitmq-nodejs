import { oauth2Client } from "@/config/google.config";
import { getHashPassword } from "@/utils/hash";
import { createToken } from "@/utils/jwt";
import prismaClient from "@/utils/prisma";
import { sendErrorResponse } from "@/utils/responseHandler";
import { Response } from "@/config/express.config";

// ** external libraries
import axios from "axios";
import qs from "querystring";



export const registerUserService = async (userData: any) => {
  const { email, password, role } = userData;
  const signup_type = "EMAIL";
  const hashPassword = await getHashPassword(password);

  const user = await prismaClient.user.create({
    data: {
      email,
      password: hashPassword,
      role,
      signup_type,
    },
  });

  const accessToken = await createToken(user, process.env.ACCESS_TOKEN_EXPIRY);
  const refreshToken = await createToken(
    user,
    process.env.REFRESH_TOKEN_EXPIRY
  );
  return { accessToken, refreshToken };
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
  const signup_type = "GOOGLE";
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

  const ticket = await oauth2Client.verifyIdToken({
    idToken: tokens.id_token!,
    audience: CLIENT_ID,
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

  const accessToken = await createToken(user, process.env.ACCESS_TOKEN_EXPIRY);
  const refreshToken = await createToken(
    user,
    process.env.REFRESH_TOKEN_EXPIRY
  );
  return { accessToken, refreshToken };
};

const FACEBOOK_APP_ID = process.env.FB_APP_ID!;
const FACEBOOK_APP_SECRET = process.env.FB_SECRET!;
const FACEBOOK_REDIRECT_URI = process.env.FB_REDIRECT_URI!;

export const getFacebookUrl = () => {
  const params = {
    client_id: FACEBOOK_APP_ID,
    redirect_uri: FACEBOOK_REDIRECT_URI,
    scope: "email,public_profile",
    response_type: "code",
  };
  return `https://www.facebook.com/v12.0/dialog/oauth?${qs.stringify(params)}`;
};

export const handleFacebookCallback = async (code: string) => {
  const tokenResponse = await axios.get(
    `https://graph.facebook.com/v12.0/oauth/access_token`,
    {
      params: {
        client_id: FACEBOOK_APP_ID,
        redirect_uri: FACEBOOK_REDIRECT_URI,
        client_secret: FACEBOOK_APP_SECRET,
        code,
      },
    }
  );

  const accessToken = tokenResponse.data.access_token;

  const userResponse = await axios.get(`https://graph.facebook.com/me`, {
    params: {
      fields: "id,name,email,picture",
      access_token: accessToken,
    },
  });

  const { id, email, name, picture } = userResponse.data;

  const user = await prismaClient.user.create({
    data: {
      email,
      full_name: name,
      image: picture.data.url,
      signup_type: "FACEBOOK",
    },
  });

  return user;
};
