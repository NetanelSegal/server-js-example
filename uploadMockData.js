import fs from "fs/promises";
import path from "path";
import Category from "./models/category.model.js";
import Product from "./models/product.model.js";

const dataDir = path.resolve("./data");

export async function uploadMockData() {
  try {
    // Read categories
    const categoriesPath = path.join(dataDir, "judaica_categories.json");
    const itemsPath = path.join(dataDir, "judaica_items.json");
    const categoriesRaw = await fs.readFile(categoriesPath, "utf-8");
    const itemsRaw = await fs.readFile(itemsPath, "utf-8");
    let categories = JSON.parse(categoriesRaw);
    let items = JSON.parse(itemsRaw);

    // Remove 'id' property and ensure categoryCode is lowercase
    categories = categories.map(({ id, ...rest }) => ({
      ...rest,
    }));
    items = items.map(({ id, ...rest }) => ({
      ...rest,
    }));

    // Overwrite collections
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Category.insertMany(categories);
    await Product.insertMany(items);

    console.log("Mock data uploaded to MongoDB.");
  } catch (err) {
    console.error("Error uploading mock data:", err);
  }
}
