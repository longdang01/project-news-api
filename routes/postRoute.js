const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  get,
  search,
  getByPath,
  getById,
  create,
  update,
  remove,
} = require("../controllers/postController");

router.post("/search", search);
router.post("/getByPath", getByPath);
router.route("/").get(get).post(protect, create);
router.route("/:id").get(getById).put(protect, update).delete(protect, remove);

module.exports = router;
