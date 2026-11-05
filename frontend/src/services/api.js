// SkillArena AI Frontend API Service & Seamless Resilient Adapter

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Realistic fallback data for zero-downtime offline demonstrations
export const FALLBACK_USER = {
  id: 1,
  name: "Anisha Rai",
  email: "anisha.rai@campus.edu",
  rollNumber: "CS2026-042",
  department: "Computer Science & Engineering",
  graduationYear: 2026,
  role: "STUDENT",
  targetRole: "Full-Stack Software Engineer",
  currentReadinessScore: 78.5,
  campusPercentile: 84.2,
  placementProbability: 88.0
};

export const FALLBACK_ASSESSMENTS = [
  {
    id: 1,
    title: "Full-Stack Java & Cloud Readiness Sprint",
    domain: "Software Engineering & Cloud",
    description: "Evaluates core Java design patterns, Spring Boot REST architecture, SQL query performance, and containerization.",
    difficulty: "INTERMEDIATE",
    durationMinutes: 15,
    totalMarks: 40,
    passingPercentage: 60.0,
    questionCount: 4,
    questions: [
      {
        id: 1,
        questionText: "In Spring Boot, which annotation is recommended for injecting configuration properties mapped from application.yml with type safety?",
        codeSnippet: null,
        subSkill: "Spring Boot Architecture",
        points: 10,
        options: [
          { id: 101, optionText: "@Value(\"${property.name}\")" },
          { id: 102, optionText: "@ConfigurationProperties(prefix = \"app\")" },
          { id: 103, optionText: "@PropertySource(\"classpath:app.properties\")" },
          { id: 104, optionText: "@Autowired Environment env" }
        ],
        correctOptionId: 102
      },
      {
        id: 2,
        questionText: "How does JWT (JSON Web Token) guarantee token integrity between the client and Spring Boot backend?",
        codeSnippet: null,
        subSkill: "Security & JWT",
        points: 10,
        options: [
          { id: 201, optionText: "By encrypting the entire token body with asymmetric keys only" },
          { id: 202, optionText: "By appending a cryptographic signature computed over header + payload using HMAC-SHA256 or RSA" },
          { id: 203, optionText: "By storing the session ID in a server-side Redis cache" },
          { id: 204, optionText: "By base64-encoding the username and password in the Authorization header" }
        ],
        correctOptionId: 202
      },
      {
        id: 3,
        questionText: "What is the most effective database index strategy for a query filtering by (campus_id, graduation_year) and sorting by readiness_score DESC?",
        codeSnippet: "SELECT * FROM users WHERE campus_id = ? AND graduation_year = ? ORDER BY readiness_score DESC;",
        subSkill: "MySQL Query Optimization",
        points: 10,
        options: [
          { id: 301, optionText: "Three independent single-column indexes on each field" },
          { id: 302, optionText: "Composite index on (campus_id, graduation_year, readiness_score DESC)" },
          { id: 303, optionText: "Index on readiness_score only" },
          { id: 304, optionText: "Clustered primary key indexing only" }
        ],
        correctOptionId: 302
      },
      {
        id: 4,
        questionText: "In a multi-stage Dockerfile for a Spring Boot and React application, why is multi-staging critical?",
        codeSnippet: null,
        subSkill: "DevOps & Containerization",
        points: 10,
        options: [
          { id: 401, optionText: "It allows executing build steps faster inside the JVM directly" },
          { id: 402, optionText: "It keeps heavy build tooling (JDK, npm cache) out of the final slim runtime container" },
          { id: 403, optionText: "It automatically provisions Kubernetes clusters" },
          { id: 404, optionText: "It bypasses the need for environment variables in staging" }
        ],
        correctOptionId: 402
      }
    ]
  },
  {
    id: 2,
    title: "DSA & Algorithmic Problem Solving Benchmark",
    domain: "Core Computer Science",
    description: "Evaluates graph algorithms, topological sorting, dynamic programming patterns, and amortized complexity.",
    difficulty: "ADVANCED",
    durationMinutes: 20,
    totalMarks: 30,
    passingPercentage: 70.0,
    questionCount: 3,
    questions: [
      {
        id: 201,
        questionText: "Which algorithmic strategy is optimal for detecting cycles in a directed graph within O(V + E) time?",
        codeSnippet: null,
        subSkill: "Graph Theory",
        points: 10,
        options: [
          { id: 211, optionText: "Depth-First Search (DFS) with 3-color state tracking (Unvisited, Visiting, Visited)" },
          { id: 212, optionText: "Dijkstra's shortest path algorithm" },
          { id: 213, optionText: "Prim's Minimum Spanning Tree" },
          { id: 214, optionText: "Binary search on graph vertex set" }
        ],
        correctOptionId: 211
      },
      {
        id: 202,
        questionText: "In dynamic programming, what distinguishes the Longest Common Subsequence (LCS) recurrence from Longest Common Substring?",
        codeSnippet: null,
        subSkill: "Dynamic Programming",
        points: 10,
        options: [
          { id: 221, optionText: "LCS does not require elements to occupy contiguous indices" },
          { id: 222, optionText: "LCS is always solved in O(N) linear time" },
          { id: 223, optionText: "Substring does not require matching characters" },
          { id: 224, optionText: "They have identical recurrence transitions" }
        ],
        correctOptionId: 221
      },
      {
        id: 203,
        questionText: "What is the worst-case time complexity of QuickSelect for finding the k-th smallest element with standard Lomuto partitioning?",
        codeSnippet: null,
        subSkill: "Algorithm Complexity",
        points: 10,
        options: [
          { id: 231, optionText: "O(N^2) worst case, O(N) average case" },
          { id: 232, optionText: "O(N log N) always" },
          { id: 233, optionText: "O(1) constant time" },
          { id: 234, optionText: "O(log N)" }
        ],
        correctOptionId: 231
      }
    ]
  }
];

export const FALLBACK_AI_DIAGNOSIS = {
  target_role: "Full-Stack Software Engineer",
  overall_readiness: 81.2,
  campus_percentile: 84.6,
  placement_probability_pct: 88.5,
  strengths: ["Data Structures & Algorithms", "Relational Databases & SQL Optimization", "AI/ML Foundations"],
  critical_gaps: ["Cloud & DevOps (Docker/CI-CD)", "Java & Spring Boot Ecosystem"],
  domain_breakdown: [
    { domain: "Data Structures & Algorithms", current_score: 82.0, benchmark_target: 80.0, gap: -2.0, urgency: "LOW", proficiency_level: "Mastery" },
    { domain: "Relational Databases & SQL Optimization", current_score: 84.0, benchmark_target: 80.0, gap: -4.0, urgency: "LOW", proficiency_level: "Mastery" },
    { domain: "Frontend Architecture & React.js", current_score: 72.0, benchmark_target: 75.0, gap: 3.0, urgency: "MODERATE", proficiency_level: "Competent" },
    { domain: "Java & Spring Boot Ecosystem", current_score: 66.0, benchmark_target: 85.0, gap: 19.0, urgency: "MODERATE", proficiency_level: "Developing" },
    { domain: "Cloud & DevOps (Docker/CI-CD)", current_score: 48.0, benchmark_target: 70.0, gap: 22.0, urgency: "CRITICAL", proficiency_level: "Developing" },
    { domain: "AI/ML & Python Foundations", current_score: 65.0, benchmark_target: 50.0, gap: -15.0, urgency: "LOW", proficiency_level: "Competent" }
  ],
  personalized_roadmap: [
    {
      week: 1,
      target_domain: "Cloud & DevOps (Docker/CI-CD)",
      skill_gap_deficit: "-22.0 pts",
      milestone_title: "Week 1: Multi-stage Docker Builds & Container Orchestration",
      focus_objectives: [
        "Containerize React SPA with Nginx Alpine runtime",
        "Build multi-stage Spring Boot JRE container image",
        "Deploy multi-container environment via Docker Compose"
      ],
      project_deliverable: "Working Docker Compose stack with healthcheck hooks",
      estimated_hours: 8,
      status: "NEXT_UP"
    },
    {
      week: 2,
      target_domain: "Java & Spring Boot Ecosystem",
      skill_gap_deficit: "-19.0 pts",
      milestone_title: "Week 2: Spring Security 6 & Stateless JWT Filter Chains",
      focus_objectives: [
        "Implement OncePerRequestFilter for Bearer token validation",
        "Configure Method Security (@PreAuthorize) for campus roles",
        "Write unit tests with @WebMvcTest & MockMvc"
      ],
      project_deliverable: "Role-Based Access Control module with JWT token revocation",
      estimated_hours: 8,
      status: "UPCOMING"
    },
    {
      week: 3,
      target_domain: "Frontend Architecture & React.js",
      skill_gap_deficit: "-3.0 pts",
      milestone_title: "Week 3: React Custom Hooks & Real-time State Synchronization",
      focus_objectives: [
        "Design custom useAssessment hook for timed test runs",
        "Implement optimistic UI updates for answer submissions",
        "Integrate responsive Tailwind CSS design tokens"
      ],
      project_deliverable: "Interactive Assessment Runner with auto-save & timer countdown",
      estimated_hours: 6,
      status: "UPCOMING"
    },
    {
      week: 4,
      target_domain: "DSA & Algorithmic Problem Solving",
      skill_gap_deficit: "-2.0 pts",
      milestone_title: "Week 4: Mock Technical Interviews & Placement Code Sprints",
      focus_objectives: [
        "Timed 45-minute live campus mock technical round",
        "Topological sort & dynamic programming optimization patterns",
        "System design review: Monolith to Cloud-Native microservices"
      ],
      project_deliverable: "Top percentile score in campus placement benchmark challenge",
      estimated_hours: 6,
      status: "UPCOMING"
    }
  ]
};

export const FALLBACK_CAMPUS_ANALYTICS = {
  campusName: "National Institute of Technology & Engineering",
  totalStudents: 395,
  averageReadinessScore: 75.8,
  placementReadinessRate: 83.2,
  departments: [
    { departmentName: "Computer Science & Engineering", studentCount: 180, averageScore: 78.4, topStrength: "DSA & System Design" },
    { departmentName: "Information Technology & AI", studentCount: 120, averageScore: 76.1, topStrength: "Python, AI & Data Engineering" },
    { departmentName: "Electronics & Communication", studentCount: 95, averageScore: 69.8, topStrength: "Core Java & Database Design" }
  ],
  topPerformers: [
    { userId: 1, name: "Anisha Rai", department: "Computer Science & Engineering", readinessScore: 92.4, percentile: 98.6, targetRole: "Full-Stack Software Engineer" },
    { userId: 2, name: "Ananya Iyer", department: "Information Technology & AI", readinessScore: 89.8, percentile: 96.2, targetRole: "AI/ML & Data Engineer" },
    { userId: 3, name: "Rohan Verma", department: "Computer Science & Engineering", readinessScore: 87.5, percentile: 94.0, targetRole: "Cloud & DevOps Engineer" },
    { userId: 4, name: "Meera Patel", department: "Information Technology & AI", readinessScore: 86.1, percentile: 92.3, targetRole: "Full-Stack Software Engineer" }
  ]
};

// Safe API helpers
export async function fetchAssessments() {
  try {
    const res = await fetch(`${API_BASE_URL}/assessments`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    // console.info("Using local assessment fixtures:", err.message);
  }
  return FALLBACK_ASSESSMENTS;
}

export async function fetchAIDiagnosis(userId = 1, targetRole = "Full-Stack Software Engineer") {
  // 1. Try directly calling Python AI Microservice (port 8000)
  try {
    const aiRes = await fetch(`http://localhost:8000/api/ai/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, targetRole, target_role: targetRole }),
      signal: AbortSignal.timeout(2000)
    });
    if (aiRes.ok) {
      return await aiRes.json();
    }
  } catch (err) {
    // try backend proxy next
  }

  // 2. Try Spring Boot backend proxy (port 8080)
  try {
    const res = await fetch(`${API_BASE_URL}/ai/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, targetRole }),
      signal: AbortSignal.timeout(2000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // fallback to realistic dataset
  }
  return FALLBACK_AI_DIAGNOSIS;
}

export async function fetchCampusAnalytics() {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics/campus-summary`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // fallback
  }
  return FALLBACK_CAMPUS_ANALYTICS;
}

