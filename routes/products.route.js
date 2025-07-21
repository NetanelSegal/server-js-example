import { Router } from "express";
import Product from "../models/product.model.js";
import { validateToken, validateAdmin } from "../middlewares/tokenValidation.js";

const router = Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const { name = "", category = "", min = 0, max = Infinity } = req.query;

    const items = await Product.find({
      name: new RegExp(name, "i"),
      categoryCode: new RegExp(category, "i"),
      price: { $gte: min, $lte: max },
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all products
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Product.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new product
router.post("/", validateToken, validateAdmin, async (req, res) => {
  try {
    const { name, image, categoryCode, price, count } = req.body;
    const item = new Product({ name, image, categoryCode, price, count });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update a product by id
router.put("/:id", validateToken, validateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const item = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!item) return res.status(404).json({ error: "Product not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a product by id
router.delete("/:id", validateToken, validateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
