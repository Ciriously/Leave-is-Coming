/**
 * Compares the `FromDayType` and `EngineerPercentage` with thresholds from "rec_db"
 * and returns a recommendation and reason.
 * @param {Object} leaveData - The response from `mainProcessLeaveAndHeadcount`.
 * @return {Object} An object containing `Recommendation` and `Reason for Recommendation`.
 */
function compareLeaveWithThreshold(leaveData) {
  var thresholdMap = fetchThresholdData(); // Get thresholds from rec_db
  Logger.log("Threshold data fetched: " + JSON.stringify(thresholdMap)); // Log threshold map

  var dayType = leaveData?.FromDayType?.type; // Safely extract the FromDayType type
  var engineerPercentage = parseFloat(
    leaveData?.EngineerPercentage?.replace("%", "")
  ); // Convert EngineerPercentage to a number

  Logger.log(
    `Comparing for Day Type: ${dayType}, Engineer Percentage: ${engineerPercentage}%`
  );

  if (!dayType) {
    Logger.log("Missing day type in leave data");
    return {
      Recommendation: "Rejected",
      "Reason for Recommendation": "Missing day type in leave data",
    };
  }

  if (isNaN(engineerPercentage)) {
    Logger.log("Invalid or missing Engineer Percentage");
    return {
      Recommendation: "Rejected",
      "Reason for Recommendation": "Invalid or missing Engineer Percentage",
    };
  }

  if (dayType in thresholdMap) {
    var minThreshold = parseFloat(thresholdMap[dayType]); // Ensure numeric comparison
    if (isNaN(minThreshold)) {
      Logger.log(`Invalid threshold for ${dayType}`);
      return {
        Recommendation: "Rejected",
        "Reason for Recommendation": `Invalid threshold for ${dayType}`,
      };
    }

    Logger.log(
      `Threshold for ${dayType}: ${minThreshold}%. Engineer Percentage: ${engineerPercentage}%`
    );

    if (engineerPercentage >= minThreshold) {
      Logger.log("Condition met: Enough people in shift");
      return {
        Recommendation: "Accepted",
        "Reason for Recommendation": "Enough people in shift",
      };
    } else {
      Logger.log("Condition not met: Not enough people in shift");
      return {
        Recommendation: "Rejected",
        "Reason for Recommendation": `Not enough people in shift. Minimum required: ${minThreshold}%, but only ${engineerPercentage}% available.`,
      };
    }
  } else {
    Logger.log(`No threshold found for ${dayType}`);
    return {
      Recommendation: "Rejected",
      "Reason for Recommendation": `No threshold found for ${dayType}.`,
    };
  }
}

/**
 * Fetches the staff threshold data from the "rec_db" subsheet.
 * @return {Object} A mapping of day type to minimum percentage threshold.
 */
function fetchThresholdData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("rec_db");
  var data = sheet.getRange("B2:E").getValues(); // Assumes data starts from row 2
  var thresholdMap = {};

  data.forEach((row) => {
    var type = row[0]; // Column B: "Type"
    var threshold = row[3]; // Column E: "Min staff req % threshold"

    if (type && !isNaN(parseFloat(threshold))) {
      thresholdMap[type] = parseFloat(threshold); // Store numeric threshold
    }
  });

  return thresholdMap;
}

function testCompareLeaveWithThreshold() {
  let testLID = "LID-1739000713"; // Sample LID
  let leaveData = mainProcessLeaveAndHeadcount(testLID); // Fetch dynamic leave data

  if (!leaveData) {
    Logger.log(`No leave data found for LID: ${testLID}`);
    return;
  }

  // Call the comparison function
  let result = compareLeaveWithThreshold(leaveData);

  // Log the final recommendation and reason
  Logger.log("Final Recommendation:");
  Logger.log(JSON.stringify(result, null, 2));
}
