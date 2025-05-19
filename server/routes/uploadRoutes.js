// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Upload resume
router.post(
  "/resume",
  protect,
  upload.single("resume"),
  uploadController.uploadResume
);

module.exports = router;
