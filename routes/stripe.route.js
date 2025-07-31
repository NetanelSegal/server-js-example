import { Router } from "express";
import Stripe from "stripe";
import { STRIPE_KEY, STRIPE_METHOD_CONFIG } from "../env.config.js";
import Product from "../models/product.model.js";
import Invoice from "../models/invoice.model.js";

const router = Router();
const stripe = new Stripe(STRIPE_KEY);

router.post("/create-checkout-session", async (req, res) => {
  const { items } = req.body;

  try {
    const line_items = items.map((item) => {
      return {
        price_data: {
          currency: "ils",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
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
  const { userId, items } = req.body;
  try {
    const updateProductsPromises = items.map(({ productId, quantity }) => {
      return Product.findByIdAndUpdate(
        productId,
        { $inc: { count: -quantity } },
        { new: true }
      );
    });

    await Promise.all(updateProductsPromises);

    const total = items.reduce(
      (sum, { price, quantity }) => sum + price * quantity,
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
    console.log((await invoice.populate("userId")).populate("items.productId"));

    res.status(201).json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
