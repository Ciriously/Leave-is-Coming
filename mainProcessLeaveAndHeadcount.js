/**
 * Main function to fetch leave details for a given LID and calculate the engineer percentage
 * for the 'From' date.
 * @param {string} lid - The Leave ID to fetch details for.
 */
function mainProcessLeaveAndHeadcount(lid) {
  Logger.log(`Starting main process for LID: ${lid}`);

  // Step 1: Fetch leave details for the given LID
  let leaveDetails = fetchLeaveDetailsByLID(lid);
  if (!leaveDetails) {
    Logger.log(`No leave details found for LID: ${lid}`);
    return;
  }

  Logger.log(`Raw 'From Date' from sheet: ${leaveDetails.From}`);
  Logger.log(`Raw 'To Date' from sheet: ${leaveDetails.To}`);

  // Step 2: Parse dates using the improved parseDate function
  let fromDate = parseDate(leaveDetails.From);
  let toDate = parseDate(leaveDetails.To);

  // Step 3: Handle invalid dates
  if (!fromDate) {
    Logger.log(
      `Invalid 'From' date: ${leaveDetails.From}. Setting date to 'N/A'.`
    );
  }
  if (!toDate) {
    Logger.log(`Invalid 'To' date: ${leaveDetails.To}. Setting date to 'N/A'.`);
  }

  // Step 4: Format valid dates or set to "N/A"
  let fromDateStr = fromDate
    ? Utilities.formatDate(fromDate, Session.getScriptTimeZone(), "dd/MM/yyyy")
    : "N/A";
  let toDateStr = toDate
    ? Utilities.formatDate(toDate, Session.getScriptTimeZone(), "dd/MM/yyyy")
    : "N/A";

  // Step 5: Fetch headcount for the 'From' date
  let maxEngineers = 22; // Example value
  let totalHeadcount = fromDate
    ? getHeadcountForDay(fromDate)
    : "No data found for the given date";

  if (!totalHeadcount) {
    totalHeadcount = "No data found for the given date";
  }

  // Step 6: Calculate engineer percentage
  let engineerPercentage = isNaN(totalHeadcount)
    ? "N/A"
    : `${calculateEngineerPercentage(totalHeadcount, maxEngineers)}%`;

  // Step 7: Format and log the result
  let result = {
    LID: lid,
    Name: leaveDetails.Name,
    From: fromDateStr,
    FromDayType: leaveDetails.FromType,
    To: toDateStr,
    ToDayType: leaveDetails.ToType,
    TotalHeadcount: totalHeadcount,
    EngineerPercentage: engineerPercentage,
  };

  Logger.log("Leave and Headcount Details:");
  Logger.log(JSON.stringify(result, null, 2));

  return result;
}

/**
 * Test function to run the main process with a sample LID.
 */
function testMainProcessLeaveAndHeadcount() {
  let testLID = "LID-1739000713";
  let result = mainProcessLeaveAndHeadcount(testLID);
  Logger.log("Final result for processing:");
  Logger.log(JSON.stringify(result, null, 2));
}
