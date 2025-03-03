const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    name:{type:String,required:true},
    email: { type: String, required: true,unique:true},
    password: { type: String, required: true },
    username: { type: String, required: true ,unique:true},
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isBlock: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps:true
  }
);

const User = mongoose.model("User", userModel);

module.exports = User;
