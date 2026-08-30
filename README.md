# Ayush Narayan — Portfolio

3D interactive developer portfolio. Next.js 15 (App Router) · TypeScript ·
Tailwind · React Three Fiber · Framer Motion · Lenis. Deep near-black theme,
one electric-violet accent, one display font + one mono font. Every motion
eased; nothing linear.

## Stack

- **Next.js 15.5** (App Router, RSC) · **React 19**
- **TypeScript** (strict)
- **Tailwind CSS** with CSS-variable design tokens
- **@react-three/fiber 9 + drei 10 + postprocessing 3** · **three 0.182**
- **Framer Motion 11** for scroll-reveal, the portrait, and the project modal
- **Lenis 1.3** for smooth scroll (deferred; off under `prefers-reduced-motion`)
- Fonts via `next/font` (Space Grotesk + JetBrains Mono, self-hosted)
- Dynamic OG image + favicon via `next/og`
- `robots.ts` + `sitemap.ts` + JSON-LD `Person`

No application backend. Contact is a `mailto:` link. GitHub data is fetched
at request time from the public REST API in a server component.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (type-check + lint)
npm run start    # serve the build
npm run lint
```

> `next dev` and `next build` share the `.next` directory — don't run them
> against the same folder concurrently or the dev chunk graph corrupts.
> Delete `.next` if you switch between them.

## The 3D layer (`components/three/`)

| File | Role |
| --- | --- |
| `CanvasLayer` | Gates the canvas: renders only when WebGL is supported **and** not mobile / coarse-pointer **and** not `prefers-reduced-motion`. Mounts after `load` + `requestIdleCallback` so the ~0.5 MB three/R3F bundle never blocks first paint or hydration. Fixed `inset-0 z-0`, `pointer-events-none`, `aria-hidden`. |
| `HeroCanvas` | `next/dynamic` `ssr:false`. `<PerformanceMonitor>` scales DPR to load and drops post-processing on a sustained decline. DPR starts at 0.9. |
| `Scene` | Composes the rig, icosahedron, and particle field. No lights — materials are self-lit. |
| `DistortedIcosahedron` + `shaders.ts` | Icosahedron displaced by 3D simplex noise in the **vertex** shader; tight fresnel-rim shading + additive blending in the **fragment** shader so it reads as a glowing wire-form edge, not a solid blob. Damped-lerp cursor response. Drifts up-left and shrinks on scroll. |
| `ParticleField` | 700 points, canvas-generated soft round sprite, damped pointer parallax. |
| `CameraRig` | Fixed 6-keyframe camera path (one position per section), smootherstep on scroll progress, per-frame damped lerp, small pointer parallax. |
| `Effects` | Bloom only (chromatic aberration was pulled — it fringed the sprites and cost more than it gave). Desktop-only via the canvas gate; dropped entirely on `PerformanceMonitor` decline. |

Mobile / reduced-motion / no-WebGL: the canvas never mounts and the DOM hero
(`components/photo/PortraitFigure`) drops its tilt, parallax, and breathing.
The site is fully usable with zero WebGL.

## The portrait (`components/photo/PortraitFigure.tsx`)

`next/image` with `priority`, correct `sizes`, and an automatic blur
placeholder (static import). It dissolves into the page — no rectangle,
circle, border, or shadow — via two offset CSS radial-gradient masks that
intersect into a soft, asymmetric (non-oval) silhouette, offset upward so the
fade only touches sky + shoulders, never the face.

- Duotone (desaturate + violet tint) at rest → full colour on 600 ms hover.
- 900 ms mount entrance: `opacity 0 → 1`, `scale 0.96 → 1`, 12 px drift, on a
  custom `cubic-bezier`.
- Scroll parallax + fade via `useScroll` / `useTransform` (drifts slower than
  the page, fades past the hero).
- Spring-damped cursor tilt (≤ 6° / axis) + an accent glow that lerps behind
  it. Never 1:1.
- 11 s GPU-composited "breathing" scale pulse.
- `prefers-reduced-motion`: static, fully faded in, no tilt / parallax /
  breathing. Mobile: keeps the mask + fade, drops tilt / parallax.

> An SVG `feTurbulence` / `feDisplacementMap` edge was tried for an organic
> outline but Chrome hardens a displaced alpha edge and re-rasterises it every
> frame — a real performance sink. The offset-gradient mask is the shipped
> approach.

## Content — `data/`

- `projects.ts` — typed `Project[]` (`problem → approach → stack → outcome`).
  Edit here, not in JSX.
- `skills.ts` — the four groups (Languages / Backend & Data / AI & ML /
  Cloud & DevOps, incl. Google Cloud Skills Boost work).
- `research.ts` — Research & Writing list.
- `site.ts` — identity, links, photo dimensions, `SITE_URL`, `GITHUB_USER`.
- Résumé PDF is served from `public/resume.pdf`.

## GitHub section (`components/sections/GitHub.tsx` + `lib/github.ts`)

Server component, `revalidate: 3600`, no token:

- `/users/marvelayush` → avatar, bio, followers, repo count.
- `/users/marvelayush/repos?sort=updated` → top 6 by stars, with the primary
  language's GitHub colour dot and star count.
- Contribution heatmap via `github-contributions-api.jogruber.de`, rendered as
  a single inline-SVG data-URI image (one DOM node, one paint).
- Every fetch returns a discriminated `Result<T>` (`rate-limit` / `network` /
  `not-found`). Profile failure hides the whole section; repo failure shows a
  message; contribution failure hides just the heatmap. Never a broken state.

## Accessibility & performance

- Semantic landmarks, one `<h1>`, ordered headings, a working skip link.
- Keyboard-navigable project modal: focus moves in on open, is trapped, `Esc`
  closes, focus returns to the card that opened it.
- Visible `:focus-visible` outlines throughout; `aria-labelledby` on every
  section; the canvas is `aria-hidden`.
- `prefers-reduced-motion` disables smooth scroll, reveals, and all transforms.
- Mobile-first, responsive, no horizontal page scroll; wide content (the
  heatmap) scrolls inside its own `overflow-x-auto` container.
- axe-core: **0 violations**.

### Lighthouse (production build, `--preset=desktop` / emulated mobile)

| Category | Desktop | Mobile |
| --- | --- | --- |
| Performance | 73 | 94 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

Key metrics — desktop: FCP 0.7 s · **LCP 1.3 s** · CLS 0.003 · TBT 510 ms.
Measured runtime: **~144 fps** sustained on the hero and through the scroll
camera on a 144 Hz display.

Desktop Performance is bounded by the WebGL scene: even deferred to idle, the
three / R3F bundle's parse + shader compile lands in Lighthouse's blocking-time
window. The brief's explicit targets — 60 fps desktop and LCP < 2.5 s — are
both met, and the no-WebGL mobile path scores 94.

## Deploy (Vercel)

1. Push to a Git repo and import in Vercel (framework auto-detected).
2. Set the canonical origin:

   ```
   NEXT_PUBLIC_SITE_URL = https://your-domain.vercel.app
   ```

3. Deploy. The OG image and favicon render on the edge.
