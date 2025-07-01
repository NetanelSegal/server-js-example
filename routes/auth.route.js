import { Router } from "express";

const router = new Router();

router.get("/test", (req, res) => {
  res.json({
    message: "auth ok",
  });
});

export default router;
