import mongoose from "mongoose";

mongoose
  .connect("mongodb://localhost:27017/judaica-store")
  .then(() => {
    console.log("mongo connected");
  })
  .catch((err) => {
    console.log(err);
  });
