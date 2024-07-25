import { NextFunction, Request, Response } from "@/config/express.config";
import logger from "@/utils/logger";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/utils/responseHandler";
import { handleAccountRegistration } from "@/utils/webhookHelper";

export const emailWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { event_type } = req.body;
  try {
    switch (event_type) {
      case "account_registration":
        const {
          data: { email, access_token },
        } = req.body;
        const result = await handleAccountRegistration(email, access_token);
        return sendSuccessResponse(
          res,
          "Email send successfully",
          "We've sent you a verification link on your email address. Please verify it to complete the registration!",
          201
        );
      default:
        logger.error("Invalid event type");
        return sendErrorResponse(res, "Invalid Event type", 400);
    }
  } catch (error: Error | any) {
    next(error);
  }
};
