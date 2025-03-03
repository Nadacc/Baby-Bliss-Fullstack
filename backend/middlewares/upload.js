const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "product_images", // Folder in Cloudinary
    allowedFormats: ["jpg", "png", "jpeg","webp"],
  },
});

const upload = multer({ storage });

module.exports = upload;
