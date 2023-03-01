const asyncHandler = require("express-async-handler");
const multer = require("multer");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const memoryStorage = multer.memoryStorage();

const upload = multer({
  storage: memoryStorage,
});

const uploadToCloudinary = asyncHandler(async (fileString, format) => {
  try {
    const { uploader } = cloudinary;

    const res = await cloudinary.v2.uploader.upload(
      `data:image/${format};base64,${fileString}`,
      {
        folder: "zeus",
        use_filename: true,
      }
    );

    return res;
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  upload,
  uploadToCloudinary,
};
