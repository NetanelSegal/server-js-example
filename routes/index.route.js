import { Router } from "express";
import userRoute from "./user.route.js";
import authRoute from "./auth.route.js";
import productsRoute from "./products.route.js";
import categoriesRoute from "./categories.route.js";
import Logger from "../utils/Logger.js";
import { validateToken } from "../middlewares/tokenValidation.js";

const router = Router();

router.use("/", (req, res, next) => {
  Logger.info(`${req.method} ${req.url}`);
  next();
});

router.get("/health", validateToken, (req, res) => {
  res.json({
    message: "ok",
  });
});

router.use("/users", userRoute);
router.use("/auth", authRoute);
router.use("/products", productsRoute);
router.use("/categories", categoriesRoute);

export default router;
