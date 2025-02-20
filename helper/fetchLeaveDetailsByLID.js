function fetchLeaveDetailsByLID(lid) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var leaveSheet = spreadsheet.getSheetByName("Leaves_request");
  var leaveDataRange = leaveSheet.getDataRange().getValues();

  var leaveDetails = null;

  // Find the row with the matching LID
  for (var i = 1; i < leaveDataRange.length; i++) {
    // Skip header row
    if (leaveDataRange[i][0] === lid) {
      // Assuming LID is in column A
      var fromDate = leaveDataRange[i][4]; // 'From Date' in column E
      var toDate = leaveDataRange[i][5]; // 'To Date' in column F

      // Additional logging for debugging
      Logger.log("Raw 'From Date' from sheet: " + leaveDataRange[i][4]);
      Logger.log("Raw 'To Date' from sheet: " + leaveDataRange[i][5]);

      // Convert to Date objects if not already in Date format
      fromDate = fromDate instanceof Date ? fromDate : parseDate(fromDate);
      toDate = toDate instanceof Date ? toDate : parseDate(toDate);

      Logger.log("Parsed 'From Date': " + fromDate);
      Logger.log("Parsed 'To Date': " + toDate);

      // Check for parsing errors
      if (!fromDate || isNaN(fromDate.getTime())) {
        Logger.log("Invalid 'From Date' format for LID: " + lid);
        return null;
      }

      if (!toDate || isNaN(toDate.getTime())) {
        Logger.log("Invalid 'To Date' format for LID: " + lid);
        return null;
      }

      // Validate holiday conflicts for the dates
      var fromType = validateHolidayConflict(
        Utilities.formatDate(
          fromDate,
          Session.getScriptTimeZone(),
          "dd/MM/yyyy"
        )
      );
      var toType = validateHolidayConflict(
        Utilities.formatDate(toDate, Session.getScriptTimeZone(), "dd/MM/yyyy")
      );

      Logger.log(
        "Holiday validation result for 'From' date: " + JSON.stringify(fromType)
      );
      Logger.log(
        "Holiday validation result for 'To' date: " + JSON.stringify(toType)
      );

      leaveDetails = {
        Name: leaveDataRange[i][2], // Name in column C
        From: Utilities.formatDate(
          fromDate,
          Session.getScriptTimeZone(),
          "dd/MM/yyyy"
        ),
        FromType: fromType,
        To: Utilities.formatDate(
          toDate,
          Session.getScriptTimeZone(),
          "dd/MM/yyyy"
        ),
        ToType: toType,
      };
      break;
    }
  }

  // Log and return results
  if (leaveDetails) {
    Logger.log(`Leave details for LID ${lid}:`);
    Logger.log("Name: " + leaveDetails.Name);
    Logger.log(
      "From: " +
        leaveDetails.From +
        " (Type: " +
        JSON.stringify(leaveDetails.FromType) +
        ")"
    );
    Logger.log(
      "To: " +
        leaveDetails.To +
        " (Type: " +
        JSON.stringify(leaveDetails.ToType) +
        ")"
    );
    return leaveDetails;
  } else {
    Logger.log(`No leave found for LID: ${lid}`);
    return null;
  }
}

// Test function
function testFetchLeaveDetailsAndValidate() {
  var testLID = "LID-1739000713"; // Replace with a valid LID from your sheet
  Logger.log(
    "Testing fetchLeaveDetailsByLID and holiday validation for LID: " + testLID
  );
  var result = fetchLeaveDetailsByLID(testLID);
  if (result) {
    Logger.log("Test result: " + JSON.stringify(result));
  } else {
    Logger.log("No details found for the given LID.");
  }
}
