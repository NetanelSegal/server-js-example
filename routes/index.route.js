import { Router } from "express";
import userRoute from "./user.route.js";
import authRoute from "./auth.route.js";
import productsRoute from "./products.route.js";
import categoriesRoute from "./categories.route.js";
import Logger from "../utils/Logger.js";
import stripeRoute from "./stripe.route.js";
import cartRoute from "./cart.route.js";

const router = Router();

router.use("/", (req, res, next) => {
  Logger.info(`${req.method} ${req.url}`);
  next();
});

router.get("/health", (req, res) => {
  res.json({
    message: "ok",
  });
});

router.use("/users", userRoute);
router.use("/auth", authRoute);
router.use("/products", productsRoute);
router.use("/categories", categoriesRoute);
router.use("/stripe", stripeRoute);
router.use("/cart", cartRoute);

export default router;
