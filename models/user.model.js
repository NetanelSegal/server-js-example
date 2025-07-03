import mongoose from "mongoose";

const UserModel = mongoose.model("users", {
  name: String,
  email: String,
  password: String,
});

export default UserModel;
