const mongoose = require("mongoose");

const postTagSchema = mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
    tag: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Tag",
    },
    active: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PostTag", postTagSchema);
