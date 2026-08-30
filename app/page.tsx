import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import CanvasLayer from "@/components/three/CanvasLayer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Skills from "@/components/sections/Skills";
import Research from "@/components/sections/Research";
import Contact from "@/components/sections/Contact";
import { SITE_URL, site } from "@/data/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: SITE_URL,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: site.education.school,
  },
  knowsAbout: ["LLM", "RAG", "FastAPI", "Distributed Systems", "Computer Networks"],
  sameAs: [site.links.github, site.links.linkedin],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CanvasLayer />
      <Nav />
      <main id="main" className="relative z-10">
        <div className="mx-auto w-full max-w-content px-6 sm:px-8">
          <Hero />
          <About />
          <Work />
          <Skills />
          <Research />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
