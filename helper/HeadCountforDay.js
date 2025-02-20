function getHeadcountForDay(date) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Roster");
  var data = sheet.getDataRange().getValues(); // Get all data in the Roster sheet
  var formattedDate = Utilities.formatDate(
    date,
    Session.getScriptTimeZone(),
    "MM/dd/yyyy"
  );

  Logger.log("Formatted Date for search: " + formattedDate); // Log the formatted date

  // Loop through columns F to AJ (indexes 5 to 35) to match the date in row 2
  for (var col = 5; col <= 35; col++) {
    // Columns F (index 5) to AJ (index 35)
    var dateInColumn = sheet.getRange(2, col + 1).getValue(); // Get the actual date value from the cell

    // Ensure the date is valid before formatting
    if (isValidDate(dateInColumn)) {
      // Check date validity using the helper function
      var formattedColumnDate = Utilities.formatDate(
        new Date(dateInColumn),
        Session.getScriptTimeZone(),
        "MM/dd/yyyy"
      );
      Logger.log("Checking date in Column: " + formattedColumnDate); // Log the formatted date in column

      // Match the date in row 2
      if (formattedColumnDate === formattedDate) {
        var headcount = sheet.getRange(31, col + 1).getValue(); // Fetch headcount from row 31
        if (!isNaN(headcount) && headcount !== "") {
          Logger.log("Headcount found for " + formattedDate + ": " + headcount); // Log the headcount
          return headcount;
        } else {
          Logger.log("Invalid headcount value for " + formattedDate);
          return "Invalid headcount value";
        }
      }
    } else {
      Logger.log("Invalid date or non-date value found in column " + (col + 1));
    }
  }

  // If no matching date is found
  Logger.log("No data found for the given date: " + formattedDate);
  return "No data found for the given date";
}

// Helper function to check if a value is a valid date
function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime()); // Ensure it is a valid date object
}

// Test function
function testGetHeadcountForDay() {
  var testDates = [
    {
      date: new Date("February 2, 2025"),
      expected: "Headcount value for 02/02/2025",
    },
    {
      date: new Date("February 3, 2025"),
      expected: "Headcount value for 02/03/2025",
    },
    {
      date: new Date("February 27, 2025"),
      expected: "No data found for the given date",
    },
    {
      date: new Date("February 5, 2025"),
      expected: "Headcount value for 02/05/2025",
    },
  ];

  testDates.forEach(function (test) {
    Logger.log("Testing getHeadcountForDay for date: " + test.date);
    var result = getHeadcountForDay(test.date);
    Logger.log("Headcount for " + test.date + ": " + result); // Log the result
  });
}
