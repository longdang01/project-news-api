const asyncHandler = require("express-async-handler");
const PostTag = require("../models/post_tag");
const Post = require("../models/post");
const { ObjectId } = require("mongodb");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: -1 };
  const postTags = await PostTag.find(query).sort(sort);

  res.status(200).json(postTags);
});

const search = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: -1 };
  const postTags = await PostTag.find(query).sort(sort);

  res.status(200).json(postTags);
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const postTag = await PostTag.findOne(query);

  res.status(200).json(postTag);
});

const create = asyncHandler(async (req, res) => {
  const postTag = new PostTag({
    post: req.body.post,
    tag: req.body.tag,
  });

  const savedData = await postTag.save();

  // push item to subCategories in post schema
  const post = await Post.findById(req.body.post).populate("tags");

  const tag = post.tags.find((tag) => tag.tag == req.body.tag);

  if (!tag) {
    await post.updateOne({
      $push: { tags: { $each: [savedData._id], $position: 0 } },
    });

    res.status(200).json(await PostTag.findById(savedData._id).populate("tag"));
  }

  if (tag) {
    res.status(400).json({ message: "Đã tồn tại" });
  }
});

const update = asyncHandler(async (req, res) => {
  const postTag = await PostTag.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  postTag.post = req.body.post;
  postTag.tag = req.body.tag;

  const savedData = await postTag.save();
  res.status(200).json(await PostTag.findById(savedData._id));
});

const remove = asyncHandler(async (req, res) => {
  const postTag = await PostTag.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  postTag.active = -1;
  const savedData = await postTag.save();

  await Post.updateMany(
    { tags: req.params.id },
    { $pull: { tags: req.params.id } }
  );

  res.status(200).json(savedData);
});

module.exports = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};
