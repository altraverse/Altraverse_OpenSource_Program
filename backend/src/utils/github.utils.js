const https = require("https");

/**
 * Make an authenticated or unauthenticated GET request to the GitHub API.
 */
const githubRequest = (path) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path: path,
      method: "GET",
      headers: {
        "User-Agent": "Altraverse-Open-Source-Platform",
      },
    };

    if (process.env.GITHUB_TOKEN) {
      options.headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(new Error("Failed to parse GitHub response"));
          }
        } else {
          try {
            const errResponse = JSON.parse(data);
            reject(new Error(errResponse.message || `GitHub HTTP Error ${res.statusCode}`));
          } catch {
            reject(new Error(`GitHub HTTP Error ${res.statusCode}`));
          }
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
};

/**
 * Fetch basic repository statistics (Stars, Forks).
 */
const fetchRepoDetails = async (owner, repo) => {
  try {
    const data = await githubRequest(`/repos/${owner}/${repo}`);
    return {
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      description: data.description || "",
    };
  } catch (error) {
    console.error(`Error fetching repo details for ${owner}/${repo}:`, error.message);
    throw error;
  }
};

/**
 * Helper to determine difficulty and point value from labels.
 */
const parseDifficultyAndPoints = (labels) => {
  const labelNames = labels.map((l) => l.name.toLowerCase());
  
  if (labelNames.some((l) => l.includes("easy") || l.includes("good first issue") || l.includes("beginner"))) {
    return { difficulty: "Easy", points: 50 };
  }
  if (labelNames.some((l) => l.includes("hard") || l.includes("advanced") || l.includes("complex"))) {
    return { difficulty: "Hard", points: 150 };
  }
  
  // Default to Medium
  return { difficulty: "Medium", points: 100 };
};

/**
 * Helper to format date into readable text.
 */
const formatRelativeDate = (dateString) => {
  const createdDate = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - createdDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 1) return "Today";
  if (diffDays === 2) return "Yesterday";
  if (diffDays <= 7) return `${diffDays} days ago`;
  if (diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  const months = Math.floor(diffDays / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
};

/**
 * Fetch open issues for a repository (filtering out Pull Requests).
 */
const fetchRepoIssues = async (owner, repo) => {
  try {
    // GitHub API returns PRs in the issues endpoint. We filter them out below.
    const rawIssues = await githubRequest(`/repos/${owner}/${repo}/issues?state=open&per_page=50`);
    
    if (!Array.isArray(rawIssues)) return [];

    return rawIssues
      .filter((issue) => !issue.pull_request) // Filter out PRs
      .map((issue) => {
        const { difficulty, points } = parseDifficultyAndPoints(issue.labels);
        return {
          githubIssueId: issue.id,
          number: issue.number,
          title: issue.title,
          body: issue.body || "",
          difficulty,
          points,
          status: "Open",
          date: formatRelativeDate(issue.created_at),
          link: issue.html_url,
        };
      });
  } catch (error) {
    console.error(`Error fetching repo issues for ${owner}/${repo}:`, error.message);
    throw error;
  }
};

module.exports = {
  fetchRepoDetails,
  fetchRepoIssues,
};
