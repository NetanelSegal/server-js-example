import { Router } from "express";
import userRoute from "./user.route.js";
import authRoute from "./auth.route.js";

const router = new Router();

router.get("/health", (req, res) => {
  res.json({
    message: "ok",
  });
});

router.use("/users", userRoute);
router.use("/auth", authRoute);

export default router;
