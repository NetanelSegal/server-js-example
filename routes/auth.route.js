import { Router } from "express";
import UserModel from "../models/user.model.js";

const router = Router();

router.post("/login", (req, res) => {
  res.json({});
});

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  const user = new UserModel({ name, email, password });
  user
    .save()
    .then(() => {
      res.json(user);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

export default router;
