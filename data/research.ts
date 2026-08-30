export type ResearchItem = {
  title: string;
  venue: string;
  note: string;
  tag: string;
  href?: string;
  /** External link to a certificate / proof (opens in a new tab). */
  certificateUrl?: string;
};

export const research: ResearchItem[] = [
  {
    title:
      "Real-Time Congestion Detection and Mitigation Using Lightweight Probes and Dual SVM Classification",
    venue: "Paper presented · ICNEXT-2026, Next-Gen Engineering & Technology Conference",
    note: "Probe-based RTT monitoring with an RBF-SVM classifier and a latency-trend early-warning predictor, plus a closed-loop mitigation mechanism.",
    tag: "Networking",
    href: "#projects",
    certificateUrl:
      "https://drive.google.com/file/d/1OaK6O16Osb0_pTaZbnM9n4p1rk2jcTpG/view?usp=drivesdk",
  },
  {
    title: "AI-Powered Academic ERP Assistant",
    venue: "VTU-funded research · FRPS-2025 · with Modelicon Infotech LLP · ongoing",
    note: "An LLM assistant grounded in structured ERP records through a RAG pipeline, with secure API integration and modular backend services.",
    tag: "Applied AI",
    href: "#projects",
  },
];
