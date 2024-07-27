import { NextFunction, Request, Response } from "@/config/express.config";
import {
  getFacebookUrl,
  getGoogleUrl,
  handleFacebookCallback,
  handleGoogleCallback,
  registerUserService,
} from "@/services/auth";
import { CustomError } from "@/utils/CustomError";
import { verifyToken } from "@/utils/jwt";
import prismaClient from "@/utils/prisma";
import { publishToRabbitMQ } from "@/utils/rabbitmqPublisher";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/utils/responseHandler";

// ** external libraries
import amqp from "amqplib/callback_api";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUser = await registerUserService(req.body);

    // Prepare data for email
    const payload = {
      email: req.body.email,
      access_token: newUser.accessToken,
    };

    const message = JSON.stringify(payload);

    // Publish the message to RabbitMQ
    publishToRabbitMQ(
      "amqp://localhost",
      "email_exchange",
      "account.registration",
      message
    );
    return sendSuccessResponse(
      res,
      "User record entered in the database successfully. Please verify email to complete registration",
      newUser,
      201
    );
  } catch (error: Error | any) {
    // Handle registration errors
    if (error.code === "P2002") {
      const fieldName = error.meta.target[0];
      const err = new CustomError(`${fieldName} already exists!`, 409);
      return next(err);
    }
    return next(error);
  }
};

export const registerWithGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authUrl = getGoogleUrl();
    res.redirect(authUrl);
  } catch (error: Error | any) {
    next(error);
  }
};

export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code = req.query.code as string;
  if (!code) {
    // handle with JOI
    sendErrorResponse(
      res,
      "Code is missing",
      400,
      "Code is missing in the query params"
    );
  }
  try {
    await handleGoogleCallback(res, code);
    res.redirect(process.env.FRONTED_URL!);
  } catch (error: Error | any) {
    // P2002 code for unique fields
    if (error.code === "P2002") {
      const fieldName = error.meta.target[0];
      const err = new CustomError(`${fieldName} has already exists!`, 409);
      next(err);
    }
    next(error);
  }
};

export const registerWithFacebook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authUrl = getFacebookUrl();
    res.redirect(authUrl);
  } catch (error: Error | any) {
    next(error);
  }
};

export const facebookCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code = req.query.code as string;
  if (!code) {
    return sendErrorResponse(
      res,
      "Code is missing",
      400,
      "Code is missing in the query params"
    );
  }
  try {
    await handleFacebookCallback(code);
    res.redirect(process.env.FRONTED_URL!);
  } catch (error: Error | any) {
    // P2002 code for unique fields
    if (error.code === "P2002") {
      const fieldName = error.meta.target[0];
      const err = new CustomError(`${fieldName} has already exists!`, 409);
      next(err);
    }
    next(error);
  }
};

// VERIFICATIONS
export const verifyRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.query.registrationToken as string;
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

    return sendSuccessResponse(
      res,
      "Registration verification successfully done!",
      "Thank you for confirming your registration! welcome to our site",
      201
    );
  } catch (error) {
    next(error);
  }
};

// FIND USERS
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prismaClient.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return sendSuccessResponse(
      res,
      "Users retrieved successfully!",
      users,
      201
    );
  } catch (error) {
    next(error);
  }
};

// DELETE USERS
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await prismaClient.user.delete({
      where: {
        id: req.params.id,
      },
    });
    return sendSuccessResponse(
      res,
      "User deleted successfully!",
      "The user has been deleted permanently from the database!",
      201
    );
  } catch (error) {
    next(error);
  }
};
