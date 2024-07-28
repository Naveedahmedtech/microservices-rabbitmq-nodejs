import { ENV } from "@/constants";
import { sign, verify } from "jsonwebtoken";

export const createToken = async (data: any, expiry: string | undefined) => {
  return sign(
    {
      id: data.id,
    },
    ENV.JWT_SECRET || "JWT_SECRET",
    { expiresIn: expiry || "1h" }
  );
};

export const verifyToken = async (token: string) => {
  try {
    const decoded = verify(token, ENV.JWT_SECRET || "JWT_SECRET");
    return decoded;
  } catch (error) {
    throw new Error("Token verification failed");
  }
};
