import { sign, verify } from "jsonwebtoken";

export const createToken = async (data: any, expiry: string | undefined) => {
  return sign(
    {
      id: data.id,
    },
    process.env.JWT_SECRET || "JWT_SECRET",
    { expiresIn: expiry || "1h" }
  );
};

export const verifyToken = async (token: string) => {
  try {
    const decoded = verify(token, process.env.JWT_SECRET || "JWT_SECRET");
    return decoded;
  } catch (error) {
    throw new Error("Token verification failed");
  }
};
