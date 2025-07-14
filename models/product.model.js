import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  categoryCode: { type: String, required: true },
  price: { type: Number },
  count: { type: Number },
});

const Product = mongoose.model("products", productSchema);
export default Product;
