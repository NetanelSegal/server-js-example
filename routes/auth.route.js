import bcrypt from "bcrypt";
import { Router } from "express";
import UserModel from "../models/user.model.js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    user.password = "********";
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ name, email, password: hashedPassword });
    await user.save();
    user.password = "********";
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(422).json({
        message: err.message,
      });
    }

    res.status(400).json(err);
  }
});

export default router;
