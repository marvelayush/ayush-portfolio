import type { StaticImageData } from "next/image";
import mouseControllerShot from "@/public/projects/mouse-controller.png";
import indiaExplorerShot from "@/public/projects/india-explorer.png";
import congestionShot from "@/public/projects/congestion-detection.jpg";

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  id: string;
  title: string;
  tagline: string;
  role: string;
  year: string;
  stack: string[];
  problem: string;
  approach: string;
  outcome: string;
  links?: ProjectLink[];
  /** Card background screenshot (statically imported for a blur placeholder). */
  image?: StaticImageData;
  /** Public GitHub repository, when one exists. */
  repoUrl?: string;
  /** Placement hint for the 3D card layout added in phase 3. */
  depth: number;
};

export const projects: Project[] = [
  {
    id: "erp-assistant",
    title: "AI-Powered ERP Assistant",
    tagline:
      "A conversational layer over enterprise ERP data that answers from records instead of guessing.",
    role: "Backend · VTU-funded research (FRPS-2025) with Modelicon Infotech LLP",
    year: "2025 – present",
    stack: ["LLM", "RAG", "Python", "FastAPI", "REST APIs", "Vector Search"],
    problem:
      "ERP systems hold the answers people need, but the data is locked behind rigid forms and reports. Point a plain LLM at it and it will confidently invent records that were never there.",
    approach:
      "A secure API bridge between an LLM assistant and the ERP, with a RAG pipeline that grounds every response in retrieved, structured ERP records. Modular backend services handle query parsing, authentication, and request routing so the model only ever answers from what it was actually given.",
    outcome:
      "A working assistant that answers from real ERP data with markedly fewer fabricated responses. Integration, testing, and scalability planning for campus-wide deployment are ongoing. Funded under FRPS-2025.",
    depth: 0,
  },
  {
    id: "mouse-controller",
    title: "Mouse Controller",
    tagline: "Your phone becomes the mouse — orientation streamed to your PC in real time.",
    role: "Full-stack · solo",
    year: "2024",
    stack: [
      "Kotlin",
      "Android Sensors",
      "Python",
      "FastAPI",
      "WebSockets (WSS)",
      "PyAutoGUI",
      "Next.js",
    ],
    problem:
      "Controlling a machine from across the room — for a demo or a talk — usually means carrying hardware you do not have on you.",
    approach:
      "The Android client reads rotation-vector sensors in Kotlin and converts them to DeviceOrientation alpha / beta / gamma angles, with configurable 10–100 Hz sampling, sensitivity control, and one-tap calibration. A FastAPI + secure WebSocket backend turns motion packets into host mouse movement and clicks via PyAutoGUI, secured with self-signed TLS for the local network. A Next.js dashboard handles QR pairing, live telemetry, and ping / pong latency.",
    outcome:
      "An end-to-end wireless mouse with sub-perceptible latency on a local network, plus a deployed responsive control dashboard.",
    image: mouseControllerShot,
    repoUrl: "https://github.com/marvelayush/Mouse_controller",
    depth: 1,
  },
  {
    id: "trustvoice",
    title: "TrustVoice",
    tagline: "A voice assistant designed around the needs of elderly healthcare users.",
    role: "Team capstone",
    year: "2025",
    stack: ["Python", "Speech-to-Text", "LLM", "Text-to-Speech"],
    problem:
      "Most healthcare interfaces assume a screen and steady hands. For older patients that assumption is the barrier to routine self-care.",
    approach:
      "A voice-first loop — spoken queries in, spoken answers out — with pacing and phrasing tuned for clarity and patience, built for hands-free, eyes-free use as the team capstone.",
    outcome: "Demonstrated as a working voice prototype at the capstone review.",
    depth: 2,
  },
  {
    id: "memory-vault",
    title: "Memory Vault",
    tagline: "Digital legacy storage — the records you want to outlast you.",
    role: "Full-stack",
    year: "2024",
    stack: ["Node.js", "Express", "MongoDB", "JWT", "REST APIs"],
    problem:
      "Personal digital records meant for family — documents, messages, media — have no dependable place to live and be handed on.",
    approach:
      "A REST backend on Node and Express with MongoDB for structured vault storage, and JWT-based authentication so each vault stays private to its owner.",
    outcome: "An authenticated CRUD API for storing and organising legacy items.",
    depth: 3,
  },
  {
    id: "india-explorer",
    title: "India Explorer",
    tagline: "A travel platform for planning trips across India.",
    role: "Backend · solo",
    year: "2024",
    stack: ["FastAPI", "MongoDB", "Python", "REST APIs"],
    problem:
      "Planning travel across India means stitching together scattered sources for destinations, routes, and logistics.",
    approach:
      "A FastAPI service backed by MongoDB that exposes destination and itinerary data through a clean REST API for the front-end to consume.",
    outcome: "A backend API serving structured destination and itinerary data to the client.",
    image: indiaExplorerShot,
    repoUrl: "https://github.com/marvelayush/india-explorer",
    depth: 4,
  },
  {
    id: "congestion-detection",
    title: "Real-Time Congestion Detection & Mitigation",
    tagline: "Catching network congestion early with lightweight probes and a dual-SVM classifier.",
    role: "Networking research · presented at ICNEXT-2026",
    year: "2025",
    stack: ["Python", "scikit-learn", "ICMP / UDP / TCP", "iPerf3"],
    problem:
      "Heavyweight monitoring is exactly what you do not want to add to a network that is already congested.",
    approach:
      "Probe network paths with ICMP, UDP, and TCP with protocol fallback, collect RTT, and derive moving-average and statistical features — mean, standard deviation, latency elevation. An RBF-kernel SVM classifies normal versus congested; a latency-trend predictor flags congestion early. A closed loop then adjusts probe frequency and traffic rate to the network state, with throughput measured via iPerf3.",
    outcome:
      "A dual-SVM classifier with early-warning trend detection and a working closed-loop mitigation mechanism, presented as a paper at ICNEXT-2026.",
    image: congestionShot,
    repoUrl: "https://github.com/marvelayush/Congestion-detection-",
    depth: 5,
  },
];
