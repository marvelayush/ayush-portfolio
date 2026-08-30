# 🌌 Ayush Narayan — Portfolio

> A 3D interactive developer portfolio built with Next.js 15, React Three Fiber, and Framer Motion.

**[🔗 Live Site](https://your-domain.vercel.app)** · **[📄 Résumé](https://your-domain.vercel.app/resume.pdf)**

---

## ✨ Overview

A deep near-black interface with a single electric accent, one display font and one mono font, and a WebGL layer that responds to cursor and scroll. Every motion is eased — nothing linear.

The site degrades gracefully: on mobile, coarse-pointer devices, or without WebGL, the 3D canvas never mounts and the DOM hero takes over. Fully usable with zero WebGL.

---

## 🛠 Stack

| Layer | Technology |
| --- | --- |
| **Framework** | Next.js 15.5 (App Router, RSC) · React 19 |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS with CSS-variable design tokens |
| **3D** | React Three Fiber 9 · drei 10 · postprocessing 3 · three 0.182 |
| **Motion** | Framer Motion 11 · Lenis 1.3 (smooth scroll) |
| **Fonts** | Space Grotesk + JetBrains Mono, self-hosted via `next/font` |
| **SEO** | Dynamic OG image + favicon via `next/og` · `robots.ts` · `sitemap.ts` · JSON-LD `Person` |

No application backend. Contact is a `mailto:` link; GitHub data is fetched at request time from the public REST API in a server component.

---

## 🚀 Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (type-check + lint)
npm run start    # serve the build
npm run lint
```

---

## 🎨 The 3D Layer

Located in `components/three/`.

| Component | Role |
| --- | --- |
| **`CanvasLayer`** | Gates the canvas — renders only with WebGL support, a fine pointer, and no `prefers-reduced-motion`. Mounts after `load` + `requestIdleCallback` so the ~0.5 MB three/R3F bundle never blocks first paint. |
| **`HeroCanvas`** | Dynamically imported with `ssr: false`. `PerformanceMonitor` scales DPR to load and drops post-processing on sustained decline. |
| **`Scene`** | Composes the camera rig, icosahedron, and particle field. No lights — materials are self-lit. |
| **`DistortedIcosahedron`** | Displaced by 3D simplex noise in the vertex shader; fresnel-rim shading with additive blending in the fragment shader. Damped-lerp cursor response, drifts and shrinks on scroll. |
| **`ParticleField`** | 700 points with a canvas-generated soft sprite and damped pointer parallax. |
| **`CameraRig`** | Six-keyframe camera path — one position per section — with smootherstep on scroll progress and per-frame damped lerp. |
| **`Effects`** | Bloom only. Desktop-gated, dropped entirely on performance decline. |

---

## 🖼 The Portrait

`components/photo/PortraitFigure.tsx` — `next/image` with `priority`, correct `sizes`, and an automatic blur placeholder.

- **Duotone at rest** → full colour on a 600 ms hover transition
- **900 ms mount entrance** — opacity, scale, and drift on a custom cubic-bezier
- **Scroll parallax + fade** via `useScroll` / `useTransform`
- **Spring-damped cursor tilt** (≤ 6° per axis) with an accent glow that lerps behind it
- **11 s GPU-composited breathing pulse**

Reduced motion and mobile paths strip the tilt, parallax, and breathing while keeping the visual treatment intact.

---

## 📦 Content

All content lives in `data/` — edit there, never in JSX.

| File | Contents |
| --- | --- |
| `projects.ts` | Typed `Project[]` following `problem → approach → stack → outcome` |
| `skills.ts` | Four groups: Languages · Backend & Data · AI & ML · Cloud & DevOps |
| `research.ts` | Research & writing entries |
| `site.ts` | Identity, links, photo dimensions, `SITE_URL`, `GITHUB_USER` |

---

## 🔗 GitHub Integration

Server component with `revalidate: 3600`, no token required.

- **Profile** — avatar, bio, followers, repo count
- **Repositories** — top 6 by stars, with language colour dots
- **Contribution heatmap** — rendered as a single inline-SVG data URI (one DOM node, one paint)

Every fetch returns a discriminated `Result<T>` covering rate-limit, network, and not-found cases. Failures degrade section by section — never a broken state.

---

## ♿ Accessibility & Performance

- Semantic landmarks, a single `<h1>`, ordered headings, working skip link
- Keyboard-navigable project modal — focus trapped on open, `Esc` closes, focus returns to the triggering card
- Visible `:focus-visible` outlines throughout; canvas is `aria-hidden`
- `prefers-reduced-motion` disables smooth scroll, reveals, and all transforms
- Mobile-first and responsive with no horizontal page scroll
- **axe-core: 0 violations**

### Lighthouse

| Category | 🖥 Desktop | 📱 Mobile |
| --- | --- | --- |
| Performance | 73 | **94** |
| Accessibility | **100** | **100** |
| Best Practices | **100** | **100** |
| SEO | **100** | **100** |

**Desktop metrics** — FCP 0.7 s · LCP 1.3 s · CLS 0.003 · TBT 510 ms
**Measured runtime** — ~144 fps sustained through the hero and scroll camera on a 144 Hz display

Desktop Performance is bounded by the WebGL scene: even deferred to idle, the three/R3F bundle's parse and shader compile land inside Lighthouse's blocking-time window. Both targets — 60 fps desktop and LCP under 2.5 s — are met, and the no-WebGL mobile path scores 94.

---

## ☁️ Deployment

Hosted on **Vercel**.

1. Push to a Git repository and import into Vercel — the framework is auto-detected
2. Set the canonical origin:
   ```
   NEXT_PUBLIC_SITE_URL = https://your-domain.vercel.app
   ```
3. Deploy. The OG image and favicon render on the edge.

---

## 📫 Contact

**Ayush Narayan** — B.E. Information Science & Engineering, BMSCE (Class of 2027)

[GitHub](https://github.com/marvelayush) · [LinkedIn](https://linkedin.com/in/ayush-narayan-bmsce2004) · [Instagram](https://www.instagram.com/aayush._.n) · [Email](mailto:ayushnarayan.is23@bmsce.ac.in)

---

<sub>Curious by nature. Builder at heart. Always learning.</sub>
