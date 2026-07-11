const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const isVercel = process.env.VERCEL || process.env.NOW_BUILD || process.env.VERCEL_ENV;
const DATA_DIR = isVercel 
  ? "/tmp" 
  : path.join(__dirname, "..", "..", "data");
const FILE_PATH = path.join(DATA_DIR, "mentor_applications.xlsx");
const ROLE_FILE_PATH = path.join(DATA_DIR, "role_applications.xlsx");

/**
 * Appends mentor application data to an Excel sheet.
 * Creates the sheet if it doesn't exist.
 * @param {Object} applicationData - Form data from submission
 */
const appendMentorApplication = (applicationData) => {
  try {
    // Ensure the data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const newRow = {
      Timestamp: new Date().toLocaleString(),
      Role: "Mentor",
      Name: applicationData.name,
      Email: applicationData.email,
      Status: "Pending",
      GitHub: applicationData.github,
      Repository: applicationData.repository,
      "Tech Stack": applicationData.techStack,
      Motivation: applicationData.motivation,
    };

    let workbook;
    let worksheet;
    let dataList = [];

    if (fs.existsSync(FILE_PATH)) {
      // Read existing file
      workbook = xlsx.readFile(FILE_PATH);
      const sheetName = workbook.SheetNames[0];
      worksheet = workbook.Sheets[sheetName];
      // Convert current sheet to JSON list
      dataList = xlsx.utils.sheet_to_json(worksheet);
    } else {
      // Create new workbook
      workbook = xlsx.utils.book_new();
    }

    // Push the new row
    dataList.push(newRow);

    // Create a new sheet with all data rows
    const newWorksheet = xlsx.utils.json_to_sheet(dataList);

    // Set column widths for readability
    const cols = [
      { wch: 22 }, // Timestamp
      { wch: 10 }, // Role
      { wch: 20 }, // Name
      { wch: 25 }, // Email
      { wch: 12 }, // Status
      { wch: 20 }, // GitHub
      { wch: 35 }, // Repository
      { wch: 30 }, // Tech Stack
      { wch: 50 }, // Motivation
    ];
    newWorksheet["!cols"] = cols;

    // Append/replace sheet in workbook
    if (workbook.SheetNames.includes("Mentors")) {
      workbook.Sheets["Mentors"] = newWorksheet;
    } else {
      xlsx.utils.book_append_sheet(workbook, newWorksheet, "Mentors");
    }

    // Write back to file system
    xlsx.writeFile(workbook, FILE_PATH);
    console.log(`[Excel Util] Successfully logged application from ${applicationData.email} to ${FILE_PATH}`);
    return true;
  } catch (error) {
    console.error("[Excel Util Error] Failed to write application to Excel:", error);
    return false;
  }
};

/**
 * Appends general role application data to sheet-segmented Excel sheets.
 * @param {string} roleId 
 * @param {Object} applicationData 
 */
const appendRoleApplication = (roleId, applicationData) => {
  try {
    // Ensure the data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const sheetNamesMap = {
      "contributor": "Contributors",
      "ambassador": "Ambassadors",
      "project-admin": "Project Admins",
      "sponsor": "Sponsors",
    };
    const sheetName = sheetNamesMap[roleId] || "Applications";

    const rolesMap = {
      "contributor": "Contributor",
      "ambassador": "Ambassador",
      "project-admin": "Project Admin",
      "sponsor": "Sponsor",
    };

    const baseRow = {
      Timestamp: new Date().toLocaleString(),
      Role: rolesMap[roleId] || "Participant",
      Name: applicationData.name,
      Email: applicationData.email,
      Status: "Pending",
    };

    let newRow = { ...baseRow };

    if (roleId === "contributor") {
      newRow["GitHub"] = applicationData.github;
      newRow["Tech Stack"] = applicationData.techStack;
    } else if (roleId === "ambassador") {
      newRow["GitHub"] = applicationData.github;
      newRow["College"] = applicationData.college;
      newRow["Year"] = applicationData.year;
      newRow["Motivation"] = applicationData.motivation;
    } else if (roleId === "project-admin") {
      newRow["GitHub"] = applicationData.github;
      newRow["Project Name"] = applicationData.projectName;
      newRow["Repository URL"] = applicationData.repoUrl;
      newRow["Motivation"] = applicationData.motivation;
    } else if (roleId === "sponsor") {
      newRow["Company"] = applicationData.company;
      newRow["Sponsorship Tier"] = applicationData.tier;
      newRow["Message / Suggestions"] = applicationData.message;
    }

    let workbook;
    let dataList = [];

    if (fs.existsSync(ROLE_FILE_PATH)) {
      workbook = xlsx.readFile(ROLE_FILE_PATH);
      if (workbook.SheetNames.includes(sheetName)) {
        const worksheet = workbook.Sheets[sheetName];
        dataList = xlsx.utils.sheet_to_json(worksheet);
      }
    } else {
      workbook = xlsx.utils.book_new();
    }

    dataList.push(newRow);
    const newWorksheet = xlsx.utils.json_to_sheet(dataList);

    // Apply auto column widths for this role worksheet
    const maxKeys = Object.keys(newRow);
    const cols = maxKeys.map((key) => {
      const lengths = dataList.map((row) => String(row[key] || "").length);
      const maxLen = Math.max(key.length, ...lengths, 10);
      return { wch: Math.min(maxLen + 3, 50) };
    });
    newWorksheet["!cols"] = cols;

    if (workbook.SheetNames.includes(sheetName)) {
      workbook.Sheets[sheetName] = newWorksheet;
    } else {
      xlsx.utils.book_append_sheet(workbook, newWorksheet, sheetName);
    }

    xlsx.writeFile(workbook, ROLE_FILE_PATH);
    console.log(`[Excel Util] Logged ${roleId} application from ${applicationData.email} to sheet "${sheetName}"`);
    return true;
  } catch (error) {
    console.error("[Excel Util Error] Failed to write role application to Excel:", error);
    return false;
  }
};

/**
 * Updates application status in Excel spreadsheet.
 * @param {string} roleId 
 * @param {string} email 
 * @param {string} status - Approved or Rejected
 */
const updateExcelApplicationStatus = (roleId, email, status) => {
  try {
    const isMentor = roleId === "mentor";
    const filePath = isMentor ? FILE_PATH : ROLE_FILE_PATH;

    if (!fs.existsSync(filePath)) {
      console.warn(`[Excel Update Warning] File not found: ${filePath}`);
      return false;
    }

    const sheetName = isMentor 
      ? "Mentors"
      : {
          "contributor": "Contributors",
          "ambassador": "Ambassadors",
          "project-admin": "Project Admins",
          "sponsor": "Sponsors",
        }[roleId] || "Applications";

    const workbook = xlsx.readFile(filePath);

    if (!workbook.SheetNames.includes(sheetName)) {
      console.warn(`[Excel Update Warning] Sheet not found: ${sheetName}`);
      return false;
    }

    const worksheet = workbook.Sheets[sheetName];
    const dataList = xlsx.utils.sheet_to_json(worksheet);

    // Find the row by email and update status
    let updated = false;
    for (let row of dataList) {
      if (row.Email && String(row.Email).toLowerCase() === String(email).toLowerCase()) {
        row.Status = status;
        updated = true;
        break;
      }
    }

    if (!updated) {
      console.warn(`[Excel Update Warning] Applicant email not found in sheet: ${email}`);
      return false;
    }

    // Convert back to worksheet and save
    const newWorksheet = xlsx.utils.json_to_sheet(dataList);

    // Apply auto column widths
    if (dataList.length > 0) {
      const keys = Object.keys(dataList[0]);
      const cols = keys.map((key) => {
        const lengths = dataList.map((row) => String(row[key] || "").length);
        const maxLen = Math.max(key.length, ...lengths, 10);
        return { wch: Math.min(maxLen + 3, 50) };
      });
      newWorksheet["!cols"] = cols;
    }

    workbook.Sheets[sheetName] = newWorksheet;
    xlsx.writeFile(workbook, filePath);
    console.log(`[Excel Util] Updated status to "${status}" for ${email} in sheet "${sheetName}"`);
    return true;
  } catch (error) {
    console.error("[Excel Util Error] Failed to update application status in Excel:", error);
    return false;
  }
};

module.exports = {
  appendMentorApplication,
  appendRoleApplication,
  updateExcelApplicationStatus,
};
