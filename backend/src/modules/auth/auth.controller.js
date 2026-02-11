// (The API Handler) Create/Update user and return token.
import { register, login } from "./auth.service.js";

export const registerHandler = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone is required" });
    const { user, token } = await register(phone);
    res.status(201).json({ message: "User registered successfully", token, user });
  } catch (err) {
    if (err.message.includes("already exists")) return res.status(409).json({ error: err.message });
    next(err);
  }
};

export const loginHandler = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone is required" });
    const { user, token } = await login(phone);
    res.json({ message: "Login successful", token, user });
  } catch (err) {
    if (err.message.includes("not found")) return res.status(404).json({ error: err.message });
    next(err);
  }
};