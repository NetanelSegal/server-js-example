import { Router } from "express";
import categories from "../data/judaica_categories.json" with { type:'json' };

const router = Router();

router.get("/", (req, res) => {
  res.json(categories);
});

export default router;
