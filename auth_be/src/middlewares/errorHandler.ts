import { Request, Response, NextFunction } from "@/config/express.config";
import { CustomError } from "@/utils/CustomError";
import logger from "@/utils/logger";
import { sendErrorResponse } from "@/utils/responseHandler";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("EBADCSRFTOKEN", err.code);
  const statusCode = err instanceof CustomError ? err.statusCode : err.code === "EBADCSRFTOKEN" ? 403 : 500;
  const message =
    err instanceof CustomError ? err.message : err.code === "EBADCSRFTOKEN" ? "Invalid CSRF TOKEN" : "INTERNAL SERVER ERROR!";

  logger.error(message, { statusCode, stack: err.stack });

  let stack = err.stack;
  if (process.env.NODE_ENV === "prod") {
    stack = "";
  }

  sendErrorResponse(res, message, statusCode, stack);
};
