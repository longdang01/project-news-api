const categoryRoute = require("./categoryRoute");
const subCategoryRoute = require("./subCategoryRoute");
const postRoute = require("./postRoute");
const tagRoute = require("./tagRoute");
const postTagRoute = require("./postTagRoute");
const slideRoute = require("./slideRoute");
const userRoute = require("./userRoute");
const uploadRoute = require("./uploadRoute");

const useRoutes = (app) => {
  app.use("/api/categories", categoryRoute);
  app.use("/api/subCategories", subCategoryRoute);
  app.use("/api/posts", postRoute);
  app.use("/api/tags", tagRoute);
  app.use("/api/postTags", postTagRoute);
  app.use("/api/slides", slideRoute);
  app.use("/api/users", userRoute);

  app.use("/api/upload", uploadRoute);
};

module.exports = useRoutes;
