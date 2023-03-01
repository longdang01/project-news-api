const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  get,
  search,
  getById,
  create,
  update,
  remove,
} = require("../controllers/tagController");

router.post("/search", search);
router.route("/").get(get).post(protect, create);
router.route("/:id").get(getById).put(protect, update).delete(protect, remove);

module.exports = router;
