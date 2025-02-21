function runCompareLeave() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lid = sheet.getRange("A2").getValue(); // Assuming LID is entered in cell A2

  if (!lid) {
    SpreadsheetApp.getUi().alert(
      "Please enter an LID in cell A2 before running the function."
    );
    return;
  }

  Logger.log(`Fetching leave data for LID: ${lid}`);
  var leaveData = mainProcessLeaveAndHeadcount(lid);

  if (!leaveData) {
    SpreadsheetApp.getUi().alert(`No leave data found for LID: ${lid}`);
    return;
  }

  var result = compareLeaveWithThreshold(leaveData);

  // Output results to sheet
  sheet.getRange("B2").setValue(result.Recommendation); // Output recommendation to B2
  sheet.getRange("C2").setValue(result["Reason for Recommendation"]); // Output reason to C2

  SpreadsheetApp.getUi().alert(
    `Recommendation: ${result.Recommendation}\nReason: ${result["Reason for Recommendation"]}`
  );
}
