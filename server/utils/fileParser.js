// utils/fileParser.js
const fs = require("fs").promises;
const path = require("path");
const pdf = require("pdf-parse");
const textract = require("textract");
const logger = require("../config/logger");

/**
 * Extract text from uploaded files based on their file type
 * @param {string} filePath - Path to the uploaded file
 * @returns {Promise<string>} - Extracted text from the file
 */
exports.extractTextFromFile = async (filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase();

    // Handle PDF files
    if (ext === ".pdf") {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);
      return data.text;
    }

    // Handle other file types using textract
    return new Promise((resolve, reject) => {
      textract.fromFileWithPath(
        filePath,
        {
          preserveLineBreaks: true,
        },
        (error, text) => {
          if (error) {
            logger.error(`Error extracting text from ${filePath}:`, error);
            reject(error);
          } else {
            resolve(text);
          }
        }
      );
    });
  } catch (error) {
    logger.error(`Failed to extract text from ${filePath}:`, error);
    throw error;
  }
};

/**
 * Clean extracted text by removing excessive whitespace and normalizing line breaks
 * @param {string} text - Raw extracted text
 * @returns {string} - Cleaned text
 */
exports.cleanExtractedText = (text) => {
  if (!text) return "";

  return text
    .replace(/\r\n/g, "\n") // Normalize line breaks
    .replace(/\n{3,}/g, "\n\n") // Replace excessive line breaks
    .replace(/\s{2,}/g, " ") // Replace excessive spaces
    .trim();
};

/**
 * Validate if the extracted text is meaningful
 * @param {string} text - Extracted text
 * @returns {boolean} - Whether the text is valid and meaningful
 */
exports.validateExtractedText = (text) => {
  if (!text || text.trim().length < 50) {
    return false;
  }

  // Check if text contains common resume keywords (optional)
  const resumeKeywords = [
    "experience",
    "education",
    "skills",
    "work",
    "employment",
  ];
  const lowerText = text.toLowerCase();

  return resumeKeywords.some((keyword) => lowerText.includes(keyword));
};
