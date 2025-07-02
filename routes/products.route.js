import { Router } from "express";
import products from "../data/judaica_items.json" with { type:'json' };

const router = Router();

router.get("/", (req, res) => {
  res.json(products);
});

export default router;
