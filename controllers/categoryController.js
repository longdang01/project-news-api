const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const SubCategory = require("../models/subCategory");
const { ObjectId } = require("mongodb");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: 1 };
  const categories = await Category.find(query)
    .sort(sort)
    .populate("subCategories");

  res.status(200).json(categories);
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: 1 };

  const query = req.body.searchData
    ? {
        $and: [
          { categoryName: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  const categories = await Category.find(query)
    .sort(sort)
    .populate("subCategories");

  res.status(200).json(categories);
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const category = await Category.findOne(query).populate("subCategories");

  res.status(200).json(category);
});

const create = asyncHandler(async (req, res) => {
  const category = new Category({
    categoryName: req.body.categoryName,
    picture: req.body.picture || "",
    path: req.body.path,
    description: req.body.description || "",
  });

  // Check if Category exists
  const categoryExists = await Category.findOne({
    path: req.body.path,
    active: 1,
  });

  if (categoryExists) {
    res.status(400);
    throw new Error("Path already exists");
  }

  const savedData = await category.save();
  res
    .status(200)
    .json(await Category.findById(savedData._id).populate("subCategories"));
});

const update = asyncHandler(async (req, res) => {
  const category = await Category.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  category.categoryName = req.body.categoryName;
  category.picture = req.body.picture;
  category.path = req.body.path;
  category.description = req.body.description;

  if (category.path != req.body.path) {
    // Check if Category exists
    const categoryExists = await Category.findOne({
      path: req.body.path,
      active: 1,
    });

    if (categoryExists) {
      res.status(400);
      throw new Error("Path already exists");
    }
  }

  const savedData = await category.save();
  res
    .status(200)
    .json(await Category.findById(savedData._id).populate("subCategories"));
});

const remove = asyncHandler(async (req, res) => {
  const category = await Category.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  }).populate("subCategories");

  category.active = -1;
  const savedData = await category.save();

  // subCategory

  // await SubCategory.updateMany({ category: req.params.id }, { category: null });
  await SubCategory.updateMany({ category: req.params.id }, { active: -1 });
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
