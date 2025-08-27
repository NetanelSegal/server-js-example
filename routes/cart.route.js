import { Router } from "express";
import { validateToken } from "../middlewares/tokenValidation.js";
import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

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

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    console.log(product);

    if (product.count < quantity) {
      console.log("Not enough stock");
      return res.status(400).json({ message: "Not enough stock" });
    }

    if (item) {
      const updatedData = await CartModel.findOneAndUpdate(
        { userId: req.user.id, "items.productId": productId },
        { $inc: { "items.$.quantity": quantity } },
        { new: true }
      ).populate("items.productId");
      return res.status(200).json(updatedData);
    }

    cart.items.push({ productId, quantity });
    await cart.save();

    res.json(await cart.populate("items.productId"));
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
});

router.put("/item/:id", validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const updatedData = await CartModel.findOneAndUpdate(
      { userId: req.user.id, "items.productId": id },
      { $set: { "items.$.quantity": quantity } },
      { new: true }
    );

    res.json(await updatedData.populate("items.productId"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update cart" });
  }
});

router.delete("/item/:id", validateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedData = await CartModel.findOneAndUpdate(
      { userId: req.user.id, "items.productId": id },
      { $pull: { items: { productId: id } } },
      { new: true }
    );

    res.json(await updatedData.populate("items.productId"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete cart" });
  }
});

router.put("/clear", validateToken, async (req, res) => {
  try {
    const updatedData = await CartModel.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { items: [] } },
      { new: true }
    );

    res.json(updatedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete cart" });
  }
});

export default router;
