# Harsh Kumar — Splash Portfolio

Bold splash-style portfolio. Next.js 15 + Tailwind + Framer Motion + TypeScript.

Inspired by the agency/splash portfolio aesthetic — massive display type, scroll-driven animations, big hero with avatar.

## What's in here

- **Hero** — Massive HARSH KUMAR name, avatar slot, intro tag
- **Marquee** — Infinite scrolling skill strip
- **About** — With stat counters (live SaaS, projects, internships, certs)
- **Projects** — 3 detailed cards (Monexi featured), live + GitHub links
- **Experience** — Internships + skill matrix
- **Contact** — Big CTA, social cards
- **Footer** — Resume download, quick links

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Or push to GitHub → vercel.com/new → import repo → Deploy.

## Add your avatar

Replace `public/avatar.png` with your 3D avatar (Midjourney/DALL-E generated).

Recommended:
- Square or 4:5 aspect ratio
- Transparent background (PNG)
- ~1000x1200px

If no avatar — the page shows a "HK" outline placeholder.

## Customize

- **Project content** → `components/Projects.tsx` (PROJECTS array)
- **About text** → `components/About.tsx`
- **Skills** → `components/Experience.tsx` (SKILLS array)
- **Contact links** → `components/Contact.tsx`
- **Resume PDF** → drop file at `public/resume.pdf`

## Tech

- Next.js 15 (App Router)
- React 19
- Tailwind 3
- Framer Motion (scroll animations)
- Lucide icons
- Anton + Inter fonts (Google Fonts)
- No CMS — content in code (one-developer friendly)

## Important

After cloning, NEVER edit files inside `node_modules`. If something looks wrong:

```bash
rm -rf node_modules .next
npm install
npm run dev
```
