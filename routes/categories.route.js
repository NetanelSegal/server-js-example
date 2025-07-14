import { Router } from "express";
import Category from "../models/category.model.js";

const router = Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new category
router.post("/", async (req, res) => {
  try {
    const { name, categoryCode } = req.body;
    const category = new Category({ name, categoryCode });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update a category by categoryCode
router.put("/:categoryCode", async (req, res) => {
  try {
    const { categoryCode } = req.params;
    const update = req.body;
    const category = await Category.findOneAndUpdate(
      { categoryCode },
      update,
      { new: true }
    );
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a category by categoryCode
router.delete("/:categoryCode", async (req, res) => {
  try {
    const { categoryCode } = req.params;
    const result = await Category.findOneAndDelete({ categoryCode });
    if (!result) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
