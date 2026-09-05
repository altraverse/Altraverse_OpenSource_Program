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
 * Helper to determine difficulty and point value from title and labels.
 */
const parseDifficultyAndPoints = (title, labels) => {
  // 1. Try to parse points from the title suffix (e.g. "- 10", "- 20", "- 30", "- 40", "- 50")
  const match = String(title || "").match(/-\s*(\d+)\s*$/);
  if (match) {
    const pts = parseInt(match[1]);
    if ([10, 20, 30, 40, 50].includes(pts)) {
      let difficulty = "Medium";
      if (pts <= 20) difficulty = "Easy";
      else if (pts >= 40) difficulty = "Hard";
      return { difficulty, points: pts };
    }
  }

  // 2. Fall back to label-based parsing on 10/30/50 scale
  const labelNames = (labels || []).map((l) => l.name.toLowerCase());
  
  if (labelNames.some((l) => l.includes("easy") || l.includes("good first issue") || l.includes("beginner"))) {
    return { difficulty: "Easy", points: 10 };
  }
  if (labelNames.some((l) => l.includes("hard") || l.includes("advanced") || l.includes("complex"))) {
    return { difficulty: "Hard", points: 50 };
  }
  
  // Default to Medium / 30
  return { difficulty: "Medium", points: 30 };
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
        const { difficulty, points } = parseDifficultyAndPoints(issue.title, issue.labels);
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

/**
 * Fetch contributors for a repository.
 */
const fetchRepoContributors = async (owner, repo) => {
  try {
    const rawContributors = await githubRequest(`/repos/${owner}/${repo}/contributors?per_page=30`);
    if (!Array.isArray(rawContributors)) return [];

    return rawContributors
      .filter((c) => c.type !== "Bot" && !c.login?.includes("[bot]"))
      .map((c) => ({
        username: c.login,
        name: c.login,
        avatar: c.avatar_url || `https://github.com/${c.login}.png`,
        avatar_url: c.avatar_url,
        contributions: c.contributions || 0,
        profileUrl: c.html_url || `https://github.com/${c.login}`,
        type: c.type || "User",
      }));
  } catch (error) {
    console.warn(`Error fetching repo contributors for ${owner}/${repo}:`, error.message);
    return [];
  }
};

/**
 * Fetch recently merged or closed pull requests for a repository.
 */
const fetchRepoPullRequests = async (owner, repo) => {
  try {
    const rawPrs = await githubRequest(`/repos/${owner}/${repo}/pulls?state=closed&per_page=15`);
    if (!Array.isArray(rawPrs)) return [];

    return rawPrs.map((pr) => {
      const isMerged = !!pr.merged_at;
      return {
        id: `#${pr.number}`,
        number: pr.number,
        title: pr.title,
        author: pr.user ? pr.user.login : "contributor",
        authorAvatar: pr.user ? pr.user.avatar_url : "",
        authorUrl: pr.user ? pr.user.html_url : "",
        date: formatRelativeDate(pr.merged_at || pr.closed_at || pr.created_at),
        status: isMerged ? "Merged" : "Closed",
        points: isMerged ? 100 : 0,
        link: pr.html_url,
      };
    });
  } catch (error) {
    console.warn(`Error fetching repo pull requests for ${owner}/${repo}:`, error.message);
    return [];
  }
};

module.exports = {
  fetchRepoDetails,
  fetchRepoIssues,
  fetchRepoContributors,
  fetchRepoPullRequests,
};

