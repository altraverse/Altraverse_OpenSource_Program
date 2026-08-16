const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { sendUserRoleStatusEmail } = require('./email.utils');

async function run() {
  console.log("Starting test email sends to parkhiom50@gmail.com...");
  
  // 1. Contributor Approval
  console.log("Sending Contributor Welcome Email...");
  const res1 = await sendUserRoleStatusEmail("parkhiom50@gmail.com", "Om Parkhi", "contributor", "approved");
  console.log(`Contributor Email Status: ${res1 ? 'SUCCESS' : 'FAILED'}`);

  // 2. Ambassador Approval
  console.log("Sending Ambassador Welcome Email...");
  const res2 = await sendUserRoleStatusEmail("parkhiom50@gmail.com", "Om Parkhi", "ambassador", "approved", "AMB-OM-777");
  console.log(`Ambassador Email Status: ${res2 ? 'SUCCESS' : 'FAILED'}`);

  // 3. Project Admin Approval
  console.log("Sending Project Admin Welcome Email...");
  const res3 = await sendUserRoleStatusEmail("parkhiom50@gmail.com", "Om Parkhi", "project-admin", "approved");
  console.log(`Project Admin Email Status: ${res3 ? 'SUCCESS' : 'FAILED'}`);

  console.log("Test email sends completed.");
  process.exit(0);
}

run().catch(err => {
  console.error("Error running test emails script:", err);
  process.exit(1);
});
