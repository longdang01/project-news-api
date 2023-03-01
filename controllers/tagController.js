const asyncHandler = require("express-async-handler");
const Tag = require("../models/tag");
const Post = require("../models/post");
const PostTag = require("../models/post_tag");
const { ObjectId } = require("mongodb");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: -1 };
  const tags = await Tag.find(query).sort(sort);

  res.status(200).json(tags);
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: -1 };

  const query = req.body.searchData
    ? {
        $and: [
          { tagName: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  const tags = await Tag.find(query).sort(sort);

  res.status(200).json(tags);
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const tag = await Tag.findOne(query);

  res.status(200).json(tag);
});

const create = asyncHandler(async (req, res) => {
  const tag = new Tag({
    tagName: req.body.tagName,
    path: req.body.path,
    description: req.body.description || "",
  });

  // Check if Tag exists
  const tagExists = await Tag.findOne({ path: req.body.path, active: 1 });

  if (tagExists) {
    res.status(400);
    throw new Error("Path already exists");
  }

  const savedData = await tag.save();
  res.status(200).json(await Tag.findById(savedData._id));
});

const update = asyncHandler(async (req, res) => {
  const tag = await Tag.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  tag.tagName = req.body.tagName;
  tag.path = req.body.path;
  tag.description = req.body.description;

  if (tag.path != req.body.path) {
    // Check if Tag exists
    const tagExists = await Tag.findOne({ path: req.body.path, active: 1 });

    if (tagExists) {
      res.status(400);
      throw new Error("Path already exists");
    }
  }

  const savedData = await tag.save();
  res.status(200).json(await Tag.findById(savedData._id));
});

const remove = asyncHandler(async (req, res) => {
  const tag = await Tag.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  tag.active = -1;
  const savedData = await tag.save();

  await PostTag.updateMany({ tag: req.params.id }, { active: -1 });

  const postTagsToPull = await PostTag.find({ tag: req.params.id });
  // const postTagsToPull = postTags.map((item) => item._id);
  // console.log(postTagsToPull);
  await Post.updateMany({}, { $pull: { tags: { $in: postTagsToPull } } });
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
