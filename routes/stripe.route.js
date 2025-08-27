import { Router } from "express";
import Stripe from "stripe";
import { STRIPE_KEY, STRIPE_METHOD_CONFIG } from "../env.config.js";
import Product from "../models/product.model.js";
import Invoice from "../models/invoice.model.js";
import CartModel from "../models/cart.model.js";

const router = Router();
const stripe = new Stripe(STRIPE_KEY);

router.post("/create-checkout-session", async (req, res) => {
  const { items } = req.body;

  try {
    const line_items = items.map((item) => {
      return {
        price_data: {
          currency: "ils",
          product_data: { name: item.productId.name },
          unit_amount: Math.round(item.productId.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: "http://localhost:5173/payment-success",
      cancel_url: "http://localhost:5173/payment-cancel",
      payment_method_configuration: STRIPE_METHOD_CONFIG,
    });

    res.json(session.url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/success", async (req, res) => {
  const { userId, cart } = req.body;
  try {
    const { items, _id: cartId } = cart;
    const updateProductsPromises = items.map(({ productId, quantity }) => {
      return Product.findByIdAndUpdate(
        productId,
        { $inc: { count: -quantity } },
        { new: true }
      );
    });

    await Promise.all(updateProductsPromises);

    const total = items.reduce(
      (sum, { productId, quantity }) => sum + productId.price * quantity,
      0
    );

    const invoice = new Invoice({
      userId,
      items: items.map(({ productId, quantity }) => ({
        productId,
        quantity,
      })),
      total,
    });

    await invoice.save();

    const updatedCart = await CartModel.findByIdAndUpdate(cartId, {
      items: [],
    }).populate("items.productId");

    res.status(201).json({ invoice, cart: updatedCart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
