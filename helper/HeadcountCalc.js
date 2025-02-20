/**
 * Calculates the percentage of engineers working on a given day after adjusting for one leave.
 * @param {number} totalHeadcount - The total headcount for the day.
 * @param {number} maxEngineers - The maximum possible number of engineers working.
 * @return {number} The percentage of engineers working, rounded to 2 decimal places.
 */
function calculateEngineerPercentage(totalHeadcount, maxEngineers) {
  if (maxEngineers <= 0) {
    Logger.log("Error: Maximum count of engineers must be greater than zero.");
    return 0;
  }
  if (totalHeadcount < 0) {
    Logger.log("Error: Headcount cannot be negative.");
    return 0;
  }

  // Adjust headcount by subtracting 1 to reflect leave
  let adjustedHeadcount = totalHeadcount - 1;

  // Ensure headcount doesn't go below zero
  adjustedHeadcount = Math.max(0, adjustedHeadcount);

  let percentage = (adjustedHeadcount / maxEngineers) * 100;
  return parseFloat(percentage.toFixed(2)); // Ensure rounding to 2 decimal places
}

/**
 * Fetches the headcount for a given date and calculates the engineer percentage.
 * @param {Date} date - The date for which to fetch the headcount.
 * @param {number} maxEngineers - The maximum possible number of engineers working.
 * @return {string} The engineer percentage for the given date.
 */
function getHeadcountAndCalculatePercentage(date, maxEngineers) {
  if (!date || isNaN(date.getTime())) {
    Logger.log("Invalid date provided.");
    return "Invalid date";
  }

  let headcount = getHeadcountForDay(date); // Ensure getHeadcountForDay is defined
  if (headcount === "No data found for the given date") {
    Logger.log(
      `No data found for the date: ${Utilities.formatDate(
        date,
        Session.getScriptTimeZone(),
        "MM/dd/yyyy"
      )}`
    );
    return headcount;
  }

  let percentage = calculateEngineerPercentage(headcount, maxEngineers);
  Logger.log(
    `Engineer Percentage for ${Utilities.formatDate(
      date,
      Session.getScriptTimeZone(),
      "MM/dd/yyyy"
    )} with max engineers ${maxEngineers}: ${percentage}%`
  );
  return `${percentage}%`;
}

/**
 * Test function to cover different scenarios for headcount percentage calculation.
 */
function testGetHeadcountAndCalculatePercentage() {
  let maxEngineers = 22;

  // Test Case 1: Valid date with data
  let testDate1 = new Date("02/02/2025");
  let result1 = getHeadcountAndCalculatePercentage(testDate1, maxEngineers);
  Logger.log(`Test Case 1 - Result for ${testDate1}: ${result1}`);

  // Test Case 2: Valid date but no data
  let testDate2 = new Date("02/10/2025");
  let result2 = getHeadcountAndCalculatePercentage(testDate2, maxEngineers);
  Logger.log(`Test Case 2 - Result for ${testDate2}: ${result2}`);

  // Test Case 3: Invalid maximum engineers (zero or negative)
  let invalidMaxEngineers = 0;
  let result3 = calculateEngineerPercentage(17, invalidMaxEngineers);
  Logger.log(`Test Case 3 - Result with invalid max engineers: ${result3}%`);

  // Test Case 4: Edge case with headcount 0
  let result4 = calculateEngineerPercentage(0, maxEngineers);
  Logger.log(`Test Case 4 - Result with headcount 0: ${result4}%`);

  // Test Case 5: Edge case with headcount equal to max engineers
  let result5 = calculateEngineerPercentage(maxEngineers, maxEngineers);
  Logger.log(`Test Case 5 - Result with max headcount: ${result5}%`);
}
