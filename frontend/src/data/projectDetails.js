export const projectDetails = {
  1: {
    id: 1,
    title: "Gardener Ecosystem",
    tag: "Automation",
    color: "violet",
    points: 150,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
    description: "Contribute to building robust environment automation layers, resource scheduling tools, and distributed task runner engines.",
    stars: 142,
    forks: 38,
    date: "4 Issues open",
    detailedStats: {
      contributors: 28,
      openIssues: 4,
      prsMerged: 64,
      totalCommits: 312,
      linesOfCode: "18.4K",
      techStack: ["React", "TypeScript", "Node.js", "Docker", "Kubernetes"]
    },
    issues: [
      {
        id: "GD-104",
        title: "Support webhook dispatch notifications for scheduled runs",
        difficulty: "Medium",
        points: 80,
        status: "Open",
        date: "2 days ago",
        link: "https://github.com/gardener/ecosystem/issues/104"
      },
      {
        id: "GD-109",
        title: "Build resource scheduling algorithms for CPU/GPU allocation",
        difficulty: "Hard",
        points: 150,
        status: "Open",
        date: "4 days ago",
        link: "https://github.com/gardener/ecosystem/issues/109"
      },
      {
        id: "GD-112",
        title: "Refactor task runner state machine logic in core worker service",
        difficulty: "Hard",
        points: 120,
        status: "Open",
        date: "1 week ago",
        link: "https://github.com/gardener/ecosystem/issues/112"
      },
      {
        id: "GD-97",
        title: "Fix memory leak on task cancellation events in distributed runner",
        difficulty: "Medium",
        points: 100,
        status: "Open",
        date: "2 weeks ago",
        link: "https://github.com/gardener/ecosystem/issues/97"
      }
    ],
    contributors: [
      {
        name: "Aryan Sharma",
        username: "aryansharma",
        points: 450,
        prCount: 8,
        role: "Maintainer",
        avatarColor: "#8b5cf6"
      },
      {
        name: "Priya Mehta",
        username: "priyamehta",
        points: 350,
        prCount: 6,
        role: "Core Contributor",
        avatarColor: "#ec4899"
      },
      {
        name: "Kabir Dev",
        username: "kabirdev",
        points: 250,
        prCount: 4,
        role: "Contributor",
        avatarColor: "#3b82f6"
      },
      {
        name: "Sneha Patel",
        username: "snehapatel",
        points: 150,
        prCount: 2,
        role: "New Joiner",
        avatarColor: "#10b981"
      }
    ],
    prs: [
      {
        id: "#92",
        title: "feat: add multi-cluster configuration parsing support",
        author: "priyamehta",
        date: "Yesterday",
        status: "Merged",
        points: 120
      },
      {
        id: "#89",
        title: "fix: resolved websocket connection drop exceptions under load",
        author: "aryansharma",
        date: "3 days ago",
        status: "Merged",
        points: 80
      },
      {
        id: "#85",
        title: "docs: update API setup guidelines for local runs and Docker Compose",
        author: "kabirdev",
        date: "1 week ago",
        status: "Merged",
        points: 40
      },
      {
        id: "#80",
        title: "refactor: simplify logging middleware for cleaner stream logs",
        author: "snehapatel",
        date: "2 weeks ago",
        status: "Merged",
        points: 60
      }
    ]
  },
  2: {
    id: 2,
    title: "TARS Core Web",
    tag: "Fullstack",
    color: "cyan",
    points: 200,
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop",
    description: "Optimize high-performance web components, real-time sync systems, and custom shader layouts across developer toolkits.",
    stars: 89,
    forks: 12,
    date: "7 Issues open",
    detailedStats: {
      contributors: 15,
      openIssues: 7,
      prsMerged: 38,
      totalCommits: 184,
      linesOfCode: "12.1K",
      techStack: ["Next.js", "React", "Rust", "WebAssembly", "GLSL"]
    },
    issues: [
      {
        id: "TARS-241",
        title: "Implement offline cache state management using Service Workers",
        difficulty: "Hard",
        points: 200,
        status: "Open",
        date: "1 day ago",
        link: "https://github.com/tars-core/web/issues/241"
      },
      {
        id: "TARS-245",
        title: "Migrate custom glsl shaders to WebGPU standard specs",
        difficulty: "Hard",
        points: 250,
        status: "Open",
        date: "3 days ago",
        link: "https://github.com/tars-core/web/issues/245"
      },
      {
        id: "TARS-250",
        title: "Optimise real-time document sync debouncing algorithms",
        difficulty: "Medium",
        points: 120,
        status: "Open",
        date: "5 days ago",
        link: "https://github.com/tars-core/web/issues/250"
      },
      {
        id: "TARS-256",
        title: "Add dark mode variants for user profile settings page",
        difficulty: "Easy",
        points: 60,
        status: "Open",
        date: "1 week ago",
        link: "https://github.com/tars-core/web/issues/256"
      }
    ],
    contributors: [
      {
        name: "Rohan Das",
        username: "rohandas",
        points: 400,
        prCount: 5,
        role: "Maintainer",
        avatarColor: "#06b6d4"
      },
      {
        name: "Vikram Sen",
        username: "vikramsen",
        points: 300,
        prCount: 4,
        role: "Core Contributor",
        avatarColor: "#84cc16"
      },
      {
        name: "Meera Nair",
        username: "meeranair",
        points: 200,
        prCount: 3,
        role: "Contributor",
        avatarColor: "#eab308"
      }
    ],
    prs: [
      {
        id: "#228",
        title: "feat: WebAssembly bridge for shader layout matrix math",
        author: "rohandas",
        date: "4 days ago",
        status: "Merged",
        points: 200
      },
      {
        id: "#220",
        title: "perf: optimize render loops using passive scroll listeners",
        author: "vikramsen",
        date: "1 week ago",
        status: "Merged",
        points: 100
      },
      {
        id: "#215",
        title: "fix: solve rendering race condition on screen resize",
        author: "meeranair",
        date: "2 weeks ago",
        status: "Merged",
        points: 80
      }
    ]
  },
  3: {
    id: 3,
    title: "Shadcn Dark Extensions",
    tag: "UI / UX",
    color: "emerald",
    points: 100,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop",
    description: "Expand a highly accessible design package geared explicitly towards deep-space backgrounds and complex data tables.",
    stars: 310,
    forks: 54,
    date: "2 Issues open",
    detailedStats: {
      contributors: 42,
      openIssues: 2,
      prsMerged: 112,
      totalCommits: 489,
      linesOfCode: "7.8K",
      techStack: ["React", "Tailwind CSS", "Radix UI", "Framer Motion"]
    },
    issues: [
      {
        id: "SDE-412",
        title: "Create a fluid grid canvas component for dark theme landing pages",
        difficulty: "Medium",
        points: 100,
        status: "Open",
        date: "2 days ago",
        link: "https://github.com/shadcn-dark/extensions/issues/412"
      },
      {
        id: "SDE-418",
        title: "Fix accessibility screen-reader ARIA tags on complex tables page",
        difficulty: "Easy",
        points: 80,
        status: "Open",
        date: "4 days ago",
        link: "https://github.com/shadcn-dark/extensions/issues/418"
      }
    ],
    contributors: [
      {
        name: "Neha Roy",
        username: "neharoy",
        points: 500,
        prCount: 12,
        role: "Maintainer",
        avatarColor: "#10b981"
      },
      {
        name: "Abhishek G",
        username: "abhishek_g",
        points: 380,
        prCount: 7,
        role: "Core Contributor",
        avatarColor: "#ec4899"
      },
      {
        name: "Rishi Verma",
        username: "rishiverma",
        points: 210,
        prCount: 4,
        role: "Contributor",
        avatarColor: "#f97316"
      }
    ],
    prs: [
      {
        id: "#108",
        title: "feat: add glowing border input and textarea variants",
        author: "neharoy",
        date: "Yesterday",
        status: "Merged",
        points: 100
      },
      {
        id: "#104",
        title: "style: customize scrollbar styling for glassy layout components",
        author: "abhishek_g",
        date: "5 days ago",
        status: "Merged",
        points: 50
      },
      {
        id: "#99",
        title: "fix: dynamic tooltip repositioning under responsive container screens",
        author: "rishiverma",
        date: "1 week ago",
        status: "Merged",
        points: 70
      }
    ]
  }
};
