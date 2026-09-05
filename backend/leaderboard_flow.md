Viewed test_webhook_pr_merge.js:1-19

Here is the step-by-step manual testing guide to walk through the entire real end-to-end flow:

---

### Step 1: Start your Local Server and Tunnel (ngrok)
Since GitHub needs to send webhooks to your local machine, you must expose your local port `5000` to the internet.
1. Run your backend server: 
   ```bash
   npm run dev
   ```
2. Start your ngrok tunnel in a separate terminal:
   ```bash
   ngrok http 5000
   ```
3. Update the `PUBLIC_BACKEND_URL` in your backend `.env` file to match the active ngrok forwarder URL (e.g., `PUBLIC_BACKEND_URL=https://dandelion-gigantic-challenge.ngrok-free.dev`).

---

### Step 2: Register a Contributor and a Project Admin
1. Open the signup page (`http://localhost:5173/register`).
2. **Create a Contributor Account**:
   - Register a user and log in.
   - Go to `/profile` (or the role application page) and apply for the **Contributor** role.
   - Link your GitHub account and specify your **exact GitHub Username** (e.g., `your-github-username`).
3. **Create a Project Admin Account**:
   - Register a separate user account.
   - Apply for the **Project Admin** role.
4. **Approve Roles (as Admin)**:
   - Log in with an Admin account.
   - Go to the **Admin Dashboard** (`http://localhost:5173/admin`).
   - Approve both the Contributor and Project Admin pending applications.

---

### Step 3: Register a Project & Set up Webhooks on GitHub
1. Log in as the **Admin** on the frontend.
2. Go to the Admin Dashboard and click **Create Project**.
3. Fill in the repository details:
   - **GitHub Repository URL**: Use a real repository you own or have admin access to (e.g., `https://github.com/your-username/test-repo`).
   - **Project Admin**: Select the Project Admin user you approved in Step 2.
4. Once created, copy the generated Webhook details:
   - **Payload URL**: `https://<your-ngrok-url>.ngrok-free.dev/api/webhooks/github`
   - **Secret**: The unique generated webhook token.
5. Go to your real repository on GitHub:
   - Go to **Settings** $\rightarrow$ **Webhooks** $\rightarrow$ **Add Webhook**.
   - **Payload URL**: Paste the URL from step 4.
   - **Content type**: Choose `application/json`.
   - **Secret**: Paste the webhook secret.
   - **Which events**: Select **Let me select individual events** $\rightarrow$ Check **Issues** and **Pull requests**.
   - Click **Add webhook**.

---

### Step 4: Create a Point-Based Issue on GitHub
1. In your GitHub repository, go to **Issues** and click **New Issue**.
2. Set the Title to include a point suffix: E.g., `Fix navbar alignment - 20` or `Setup database index - 50`.
3. Submit the issue.
4. Open the ASOC platform frontend, navigate to **Projects**, select your project, and check the issues tab. 
   - **Verification**: You should see the new issue synced dynamically with **20** (or **50**) points and the correct difficulty badge (**Easy** for 20, **Hard** for 50).

---

### Step 5: Solve the Issue (PR Submission)
1. As the **Contributor** (using the GitHub account `your-github-username` connected to your ASOC profile):
   - Fork or clone the repository.
   - Make a change on a branch.
   - Push and open a **Pull Request** targeting the main repository.
   - In the PR description, write a closing keyword targeting the issue: E.g., `closes #1` (replace `#1` with your actual issue number).
   - Submit the Pull Request.

---

### Step 6: Merge the PR & Award Points
1. As the **Project Admin** or repository owner:
   - Go to GitHub, review the Pull Request, and click **Merge pull request**.
2. When the PR is merged, GitHub fires a `pull_request` merged webhook to your backend.
3. Check your backend terminal logs:
   - You should see:
     ```text
     [Webhook] Processing merged PR #... by your-github-username
     [Webhook] Detected linked issue numbers: 1
     [Webhook] Awarded 20 points to user ... (your-github-username). New balance: 20
     ```

---

### Step 7: Verify on the Leaderboard
1. Log in to the ASOC platform as the **Contributor**.
2. Click the new **Community** tab in the navbar.
3. **Verify**:
   - The welcome banner should display **20 pts** and **1 Issue Solved**.
   - Your name, avatar, and points will now be listed on the **Cohort Leaderboard** panel!