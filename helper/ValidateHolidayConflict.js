/**
 * Validates if the given leave date conflicts with any holiday or returns the day of the week if not.
 * @param {string} leaveDate - The leave date to validate (in "dd/MM/yyyy" format).
 * @returns {Object} - An object containing "type" (holiday type or day of the week) and "day" (day of the week).
 */
function validateHolidayConflict(leaveDate) {
  Logger.log("Validating leave date: " + leaveDate);

  var holidayDetails = fetchHolidays(); // Fetch all holidays

  if (!holidayDetails || holidayDetails.length === 0) {
    Logger.log("No holiday details found.");
  }

  var parsedLeaveDate = parseDate(leaveDate); // Convert to Date object
  if (isNaN(parsedLeaveDate)) {
    Logger.log("Failed to parse leave date: " + leaveDate);
    return { type: "Invalid date", day: "Invalid date" };
  }

  // Check for holiday conflict
  for (var i = 0; i < holidayDetails.length; i++) {
    var holiday = holidayDetails[i];
    var holidayDate = holiday.date;

    if (isNaN(holidayDate)) {
      Logger.log("Failed to parse holiday date: " + holiday.date);
      continue;
    }

    if (parsedLeaveDate.getTime() === holidayDate.getTime()) {
      Logger.log(
        "Conflict found: Leave date " +
          leaveDate +
          " matches holiday " +
          holiday.name +
          " (" +
          holiday.type +
          ")"
      );
      var dayOfWeek = getDayOfWeek(parsedLeaveDate);
      return { type: holiday.type, day: dayOfWeek }; // Return "Fixed" or "Optional" and the day of the week
    }
  }

  // No holiday conflict: Return the day of the week
  var dayOfWeek = getDayOfWeek(parsedLeaveDate);
  Logger.log("No holiday conflict. Leave date falls on: " + dayOfWeek);
  return { type: dayOfWeek, day: dayOfWeek };
}

/**
 * Returns the day of the week for a given date.
 * @param {Date} date - The date object.
 * @returns {string} - The day of the week (e.g., "Monday").
 */
function getDayOfWeek(date) {
  var daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[date.getDay()];
}

/**
 * Test function for validateHolidayConflict.
 */
function testValidateHolidayConflict() {
  var testDate1 = "15/02/2025"; // Replace with a date that falls on a holiday
  var testDate2 = "16/02/2025"; // Replace with a date that does not fall on a holiday

  var result1 = validateHolidayConflict(testDate1);
  Logger.log(
    "Testing leave date " +
      testDate1 +
      ": Type = " +
      result1.type +
      ", Day = " +
      result1.day
  );

  var result2 = validateHolidayConflict(testDate2);
  Logger.log(
    "Testing leave date " +
      testDate2 +
      ": Type = " +
      result2.type +
      ", Day = " +
      result2.day
  );
}
