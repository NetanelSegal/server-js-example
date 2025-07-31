import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema(
  {
    productId: {
      unique: true,
      type: Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    quantity: Number,
  },
  {
    _id: false,
  }
);

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  items: [cartItemSchema],
});

const CartModel = mongoose.model("carts", cartSchema);
export default CartModel;
