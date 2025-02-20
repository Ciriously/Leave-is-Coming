/**
 * Parses a date string into a Date object.
 * @param {string} dateStr - The date string to parse (assumed format: dd/MM/yyyy).
 * @returns {Date|null} - A valid Date object or null if parsing fails.
 */
function parseDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return null;

  var parts = dateStr.split("/"); // Assuming format: dd/MM/yyyy
  if (parts.length !== 3) return null;

  var day = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10) - 1; // Month is zero-indexed
  var year = parseInt(parts[2], 10);

  var parsedDate = new Date(year, month, day);

  // Check for validity of the date
  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month ||
    parsedDate.getDate() !== day
  ) {
    return null; // Invalid date
  }

  return parsedDate;
}

function testParseDate() {
  Logger.log(parseDate("31/01/2025")); // Should log a valid date
  Logger.log(parseDate("29/02/2024")); // Leap year, should be valid
  Logger.log(parseDate("29/02/2023")); // Non-leap year, should return null
  Logger.log(parseDate("32/01/2025")); // Invalid date, should return null
  Logger.log(parseDate("")); // Empty string, should return null
  Logger.log(parseDate(null)); // Null input, should return null
}
