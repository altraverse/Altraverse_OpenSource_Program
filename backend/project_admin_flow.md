# 📖 Team Integration Guide: Project Admin & GitHub Webhook Sync (Production)

This guide explains the workflow for approving a Project Admin, registering their repository, and connecting it to our production platform using GitHub Webhooks for real-time issues, stars, and forks sync.

---

## 🛠️ Step 1: Approving the Project Admin
1. The developer applies for the **Project Admin** track on the production website (`https://assoc-weld.vercel.app`).
2. The Platform Admin logs into the Admin account (e.g. `parkhiom50@gmail.com`).
3. Navigate to the **Admin Dashboard** &rarr; select the **Applications** tab.
4. Locate the developer's pending application and click **Approve**. 
   * *This upgrades their role in the database to `project-admin`.*

---

## 📝 Step 2: Registering the Project in the Admin Panel
Once a Project Admin is approved, their project can be registered on the platform:
1. Navigate to the **Admin Dashboard** &rarr; switch to the **Projects Sync** tab &rarr; click **Add Project**.
2. **Select the Project Admin** from the dropdown menu.
   * *The system will automatically auto-populate the Project Title, GitHub Repository URL, Tech Stack, and Description fields using the data from their approved application.*
3. Verify or edit the details (e.g., set the Points multiplier, UI color scheme: Violet, Emerald, or Cyan).
4. Click **Register Project**.
5. The backend will perform an initial sync of all open issues, forks, and stars, and display a popup containing:
   * **Payload URL**: `https://backend-ruddy-five-44.vercel.app/api/webhooks/github`
   * **Webhook Secret**: A secure signature validation key generated specifically for that project.
6. **Copy these details** to share with the Project Admin (or configured in their GitHub repository).

---

## 🔗 Step 3: Setting Up the GitHub Webhook (Instructions for the Project Admin)
The Project Admin must configure their repository to send updates to our platform:
1. Open the repository on GitHub and click on **Settings** (top navigation bar).
2. Select **Webhooks** in the left sidebar, then click **Add webhook**.
3. Fill out the form as follows:
   * **Payload URL**: `https://backend-ruddy-five-44.vercel.app/api/webhooks/github`
   * **Content type**: Select **`application/json`**.
   * **Secret**: Paste the Webhook Secret key copied from the Admin Panel.
   * **SSL verification**: Keep **`Enable SSL verification`** checked.
   * **Trigger events**: Select **`Let me select individual events`** and check **only** the following three:
     * `[x]` **Issues**
     * `[x]` **Forks**
     * `[x]` **Watches** (this represents repository Stars)
   * **Active**: Keep checked.
4. Click **Add webhook**.

---

## 🚀 Step 4: Verification & Real-time Sync
Once the webhook is added, GitHub and our server are connected. Here is how to test the real-time sync:

1. **Verify Connection**: GitHub will send a test ping. A green checkmark next to the webhook in GitHub Settings indicates a successful connection.
2. **Triggering Events**: 
   * **Issues**: When the Project Admin opens, edits, closes, or deletes an issue on GitHub, GitHub automatically posts the details to our backend.
   * **Stars/Forks**: When someone stars or forks the repo on GitHub, a watch/fork payload triggers.
3. **Live UI Updates**: 
   * The backend validates the payload signature using the project's secret key.
   * MongoDB updates the counts and issues list in real-time.
   * Any user visiting the project details page on the website will immediately see the updated stars, forks, and new issues listed with reward points.