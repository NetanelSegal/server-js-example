import { Router } from "express";
import Stripe from "stripe";
import { STRIPE_KEY, STRIPE_METHOD_CONFIG } from "../env.config.js";

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
      payment_method_configuration: STRIPE_METHOD_CONFIG,
      line_items,
      mode: "payment",
      success_url: "http://localhost:5173",
      cancel_url: "http://localhost:5173/products",
    });

    res.json(session.url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
