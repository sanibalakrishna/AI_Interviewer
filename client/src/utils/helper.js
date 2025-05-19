import log from "loglevel";

// Format date for display
export const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    log.error("Date formatting error:", error);
    return "Invalid Date";
  }
};

// Truncate text for previews
export const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    log.warn("truncateText received non-string:", text);
    return "";
  }
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
