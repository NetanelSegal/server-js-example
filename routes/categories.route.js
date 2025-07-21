import { Router } from "express";
import Category from "../models/category.model.js";
import {
  validateToken,
  validateAdmin,
} from "../middlewares/tokenValidation.js";

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
router.post("/", validateToken, validateAdmin, async (req, res) => {
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
router.put("/:categoryCode", validateToken, validateAdmin, async (req, res) => {
  try {
    const { categoryCode } = req.params;
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ error: "Name is required to update category." });
    }
    const category = await Category.findOneAndUpdate(
      { categoryCode },
      { name },
      { new: true }
    );
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a category by categoryCode
router.delete(
  "/:categoryCode",
  validateToken,
  validateAdmin,
  async (req, res) => {
    return res
      .status(403)
      .json({ error: "Deleting categories is not allowed." });
  }
);

export default router;
