const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SubCategory",
    },
    title: {
      type: String,
      required: true,
    },
    metaTitle: {
      type: String,
    },
    path: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
    },
    summary: {
      type: String,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    published: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    claps: {
      type: Number,
      required: true,
      default: 0,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostTag",
      },
    ],
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

module.exports = mongoose.model("Post", postSchema);
