// his file handles generating the "digital keys" (tokens) for users.
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "kisan-ai-super-secret-key";

export const signToken = (userId) => {
  return jwt.sign({ id: userId }, SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
};
