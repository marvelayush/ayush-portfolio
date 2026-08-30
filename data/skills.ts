export type SkillGroup = {
  label: string;
  note?: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["C++", "Python", "Java", "JavaScript (ES6)", "Kotlin"],
  },
  {
    label: "Backend & Data",
    items: [
      "FastAPI",
      "Node.js",
      "Express",
      "REST APIs",
      "WebSockets",
      "MySQL",
      "MongoDB",
      "Firestore",
      "Schema Design",
    ],
  },
  {
    label: "AI & ML",
    items: [
      "LLMs",
      "RAG",
      "NLP",
      "scikit-learn",
      "PyTorch",
      "NumPy",
      "Pandas",
      "TF-IDF",
      "Matplotlib",
    ],
  },
  {
    label: "Cloud & DevOps",
    note: "Includes hands-on Google Cloud Skills Boost work.",
    items: [
      "Google Cloud",
      "Kubernetes (GKE)",
      "Terraform",
      "Load Balancing",
      "Docker",
      "CI/CD",
      "Git",
      "Cloud Infrastructure",
    ],
  },
  {
    label: "Systems, Networking & Core CS",
    items: [
      "Linux / UNIX",
      "Shell Scripting",
      "TCP/IP",
      "HTTP / HTTPS",
      "Computer Networks",
      "Data Structures & Algorithms",
      "OOP",
      "Operating Systems",
      "DBMS",
      "Distributed Systems",
    ],
  },
];
