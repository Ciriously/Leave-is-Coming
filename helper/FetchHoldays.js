/**
 * Fetches all holidays from the "Holiday_list" sheet and returns them as an array of objects.
 * Each object contains the holiday name, date, and type.
 * @returns {Array} - An array of holiday objects containing holiday name, date, and type.
 */
function fetchHolidays() {
  var sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Holiday_list");
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues(); // Assuming columns A, B, C are Holiday Name, Date, and Type respectively
  var holidayDetails = data.map(function (row) {
    var holidayName = row[0]; // Column A: Holiday Name
    var holidayDate = row[1]; // Column B: Holiday Date
    var holidayType = row[2]; // Column C: Holiday Type

    if (holidayDate instanceof Date) {
      holidayDate = Utilities.formatDate(
        holidayDate,
        Session.getScriptTimeZone(),
        "dd/MM/yyyy"
      );
    }

    return {
      name: holidayName,
      date: parseDate(holidayDate), // Convert string to date object
      type: holidayType,
    };
  });

  Logger.log("Fetched holiday details: " + holidayDetails);
  return holidayDetails;
}

function testFetchHolidays() {
  Logger.log("Testing fetchHolidays function...");
  var holidays = fetchHolidays();

  if (holidays.length === 0) {
    Logger.log("No holidays fetched. Please check the 'Holiday_list' sheet.");
    return;
  }

  Logger.log("Fetched holidays:");
  holidays.forEach(function (holiday, index) {
    Logger.log(
      `Holiday ${index + 1}: Name = ${holiday.name}, Date = ${
        holiday.date
      }, Type = ${holiday.type}`
    );
  });
}
