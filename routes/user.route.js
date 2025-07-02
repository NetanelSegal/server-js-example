import { Router } from "express";

const arr = [];

const router = Router();

router.post("/test", (req, res) => {
  arr.push(req.body);
  res.json({
    arr,
  });
});

export default router;
