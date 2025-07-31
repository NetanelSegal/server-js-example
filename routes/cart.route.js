import { Router } from "express";
import { validateToken } from "../middlewares/tokenValidation.js";
import CartModel from "../models/cart.model.js";

const router = Router();

router.get("/", validateToken, async (req, res) => {
  try {
    const cart = await CartModel.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get cart" });
  }
});

router.post("/", validateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await CartModel.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (item) {
      return res.status(400).json({ message: "Product already in cart" });
    }

    cart.items.push({ productId, quantity });
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
});

router.put("/:id", validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const updatedData = await CartModel.findOneAndUpdate(
      { userId: req.user.id, "items.productId": id },
      { $set: { "items.$.quantity": quantity } },
      { new: true }
    );

    res.json(updatedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update cart" });
  }
});

router.delete("/:id", validateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedData = await CartModel.findOneAndUpdate(
      { userId: req.user.id, "items.productId": id },
      { $pull: { items: { productId: id } } },
      { new: true }
    );

    res.json(updatedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete cart" });
  }
});

export default router;
