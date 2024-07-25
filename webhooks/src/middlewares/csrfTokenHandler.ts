import { CustomError } from "@/utils/CustomError";
import Tokens from "csrf";
import { Request, Response, NextFunction } from "express";

const tokens = new Tokens();
// store secret local or user session (recommended)
let secret: string = "";

export const csrfTokenHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  secret = tokens.secretSync();
  const token = tokens.create(secret);
  res.cookie("xsrf-token", token);
  res.locals.csrfToken = token;
  next();
};

const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["xsrf-token"] as string;
  if (!token || !tokens.verify(secret, token)) {
    const error = new CustomError("Invalid CSRF token", 403);
    return next(error);
  }

  next();
};

export default csrfProtection;
