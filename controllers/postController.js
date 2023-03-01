const asyncHandler = require("express-async-handler");
const Post = require("../models/post");
const Tag = require("../models/tag");
const SubCategory = require("../models/subCategory");
const Category = require("../models/category");
const { ObjectId } = require("mongodb");
const post = require("../models/post");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: -1 };
  const posts = await Post.find(query)
    .sort(sort)
    .populate("subCategory")
    .populate("tags");
  // .populate({
  //   path: "tags",
  //   populate: [
  //     {
  //       path: "tag",
  //       model: "Tag",
  //     },
  //   ],
  // });

  res.status(200).json(posts);
});

const getByPath = asyncHandler(async (req, res) => {
  const sort = { createdAt: -1 };
  // const prevPath = req.body.path.slice(0, 3);
  // const path = req.body.path.substring(req.body.path.lastIndexOf("/") + 1);
  const prev = req.body.prev;
  const parentPath = req.body.parentPath;
  const childPath = req.body.childPath;
  const path = req.body.path;

  if (prev) {
    if (prev == "c") {
      let posts = await Post.find({ active: 1 })
        .sort(sort)
        .populate({
          path: "subCategory",
          populate: [
            {
              path: "category",
              model: "Category",
            },
          ],
        })
        .populate({
          path: "tags",
          populate: [
            {
              path: "tag",
              model: "Tag",
            },
          ],
        });
      posts = posts.filter(
        (post) => post.subCategory.category.path == parentPath
      );

      const category = await Category.findOne({ path: parentPath });
      res.status(200).json({ posts: posts, category: category });
    }

    if (prev == "s") {
      let posts = await Post.find({ active: 1 })
        .sort(sort)
        .populate({
          path: "subCategory",
          populate: [
            {
              path: "category",
              model: "Category",
            },
          ],
        })
        .populate({
          path: "tags",
          populate: [
            {
              path: "tag",
              model: "Tag",
            },
          ],
        });
      posts = posts.filter((post) => post.subCategory.path == childPath);
      const subCategory = await SubCategory.findOne({
        path: childPath,
      }).populate("category");
      res.status(200).json({ posts: posts, subCategory: subCategory });
    }
  }

  if (!prev) {
    const posts = await Post.find({
      $and: [{ path: path }, { active: 1 }],
    })
      .sort(sort)
      .populate({
        path: "subCategory",
        populate: [
          {
            path: "category",
            model: "Category",
          },
        ],
      })
      .populate({
        path: "tags",
        populate: [
          {
            path: "tag",
            model: "Tag",
          },
        ],
      });
    res.status(200).json({ posts: posts });
  }
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: -1 };

  const query = req.body.searchData
    ? {
        $and: [
          { title: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  const posts = await Post.find(query)
    .sort(sort)
    .populate({
      path: "subCategory",
      populate: [
        {
          path: "category",
          model: "Category",
        },
      ],
    })
    .populate({
      path: "tags",
      populate: [
        {
          path: "tag",
          model: "Tag",
        },
      ],
    });

  const tags = await Tag.find({ active: 1 }).sort(sort);

  res.status(200).json({ posts: posts, tags: tags });
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const post = await Post.findOne(query)
    .populate("subCategory")
    .populate({
      path: "tags",
      populate: [
        {
          path: "tag",
          model: "Tag",
        },
      ],
    });

  res.status(200).json(post);
});

const create = asyncHandler(async (req, res) => {
  const post = new Post({
    author: req.body.author,
    subCategory: req.body.subCategory,
    title: req.body.title,
    metaTitle: req.body.metaTitle || "",
    path: req.body.path,
    overview: req.body.overview || "",
    summary: req.body.summary || "",
    thumbnail: req.body.thumbnail,
    content: req.body.content,
  });

  // Check if Post exists
  const postExists = await Post.findOne({ path: req.body.path, active: 1 });

  if (postExists) {
    res.status(400);
    throw new Error("Path already exists");
  }

  const savedData = await post.save();
  res.status(200).json(
    await Post.findById(savedData._id)
      .populate("subCategory")
      .populate({
        path: "tags",
        populate: [
          {
            path: "tag",
            model: "Tag",
          },
        ],
      })
  );
});

const update = asyncHandler(async (req, res) => {
  const post = await Post.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  post.author = req.body.author;
  post.subCategory = req.body.subCategory;
  post.title = req.body.title;
  post.metaTitle = req.body.metaTitle;
  post.path = req.body.path;
  post.overview = req.body.overview;
  post.summary = req.body.summary;
  post.thumbnail = req.body.thumbnail;
  post.content = req.body.content;

  if (post.path != req.body.path) {
    // Check if Post exists
    const postExists = await Post.findOne({ path: req.body.path, active: 1 });

    if (postExists) {
      res.status(400);
      throw new Error("Path already exists");
    }
  }
  const savedData = await post.save();
  res.status(200).json(
    await Post.findById(savedData._id)
      .populate("subCategory")
      .populate({
        path: "tags",
        populate: [
          {
            path: "tag",
            model: "Tag",
          },
        ],
      })
  );
});

const remove = asyncHandler(async (req, res) => {
  const post = await Post.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  })
    .populate("subCategory")
    .populate({
      path: "tags",
      populate: [
        {
          path: "tag",
          model: "Tag",
        },
      ],
    });

  post.active = -1;
  const savedData = await post.save();

  res.status(200).json(savedData);
});

module.exports = {
  get,
  search,
  getByPath,
  getById,
  create,
  update,
  remove,
};
