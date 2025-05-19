// controllers/uploadController.js
const path = require("path");
const fs = require("fs").promises;
const logger = require("../config/logger");
const fileParser = require("../utils/fileParser");

/**
 * @desc    Upload resume
 * @route   POST /api/uploads/resume
 * @access  Private
 */
exports.uploadResume = async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload a resume file",
      });
    }

    // Get file info
    const fileInfo = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: `/uploads/${req.file.filename}`,
    };

    // Extract text from the resume
    let resumeText;
    try {
      resumeText = await fileParser.extractTextFromFile(req.file.path);
    } catch (error) {
      logger.error("Error extracting text from resume:", error);
      // Still return success but with warning about text extraction
      return res.status(200).json({
        success: true,
        data: {
          ...fileInfo,
          textExtracted: false,
          warning:
            "Could not extract text from file. Some features may be limited.",
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...fileInfo,
        textExtracted: true,
        resumeText,
      },
    });
  } catch (error) {
    // If error occurs, clean up the uploaded file
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        logger.error("Error deleting file after upload error:", unlinkError);
      }
    }
    next(error);
  }
};
