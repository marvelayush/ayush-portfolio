export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ayush-narayan.vercel.app";

export const GITHUB_USER = "marvelayush";

export const site = {
  name: "Ayush Narayan",
  role: "Software Engineer",
  short:
    "Software Engineer — backend & applied AI and full-stack development. B.E. Information Science & Engineering @ BMSCE, Class of 2027.",
  /** Hero tagline, one middle-dot-joined segment per entry (kept unbreakable on mobile). */
  tagline: [
    "Software Engineer",
    "Backend & Applied AI",
    "Full-Stack Development",
  ],
  /** Hero credential line, same treatment. */
  credential: [
    "B.E. Information Science & Engineering @ BMSCE",
    "Class of 2027",
  ],
  location: "Bengaluru, India",
  education: {
    degree: "BE, Information Science & Engineering",
    school: "B.M.S. College of Engineering",
    span: "2023 – 2027",
    cgpa: "8.5 / 10",
  },
  email: "ayushnarayan870@gmail.com",
  links: {
    github: "https://github.com/marvelayush",
    linkedin: "https://www.linkedin.com/in/ayush-narayan-bmsce2004",
    instagram: "https://www.instagram.com/aayush._.n",
    resume: "/resume.pdf",
  },
  photo: {
    src: "/ayush_photo.jpg",
    width: 581,
    height: 1280,
    alt: "Ayush Narayan",
  },
} as const;

export type Site = typeof site;
