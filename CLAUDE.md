# Grace Fu — Personal Portfolio Website

## Project Overview
Personal portfolio site for Grace Fu, sophomore at WashU studying CS & Business (BuCS),
recruiting for SWE roles. Deployed at grcfu.github.io.

## Aesthetic & Vibe
- Editorial/scrapbook meets tech portfolio — organic, textural, not flat/clinical
- Cream & blush palette with hand-pinned rotation, washi tape, and doodle accents
- Color palette: cream #EEEBE7, blush pink #F4C9D6, espresso #3E2723; sage #A8B89A for the vine
- Fonts: Playfair Display (display), DM Sans (body); Caveat / Dancing Script for handwriting accents
- Sharp corners (border-radius: 0), subtle film grain overlay, no rounded "AI" look

## File Structure
- `index.html` — all HTML structure
- `styles.css` — all styles, no inline styles
- `script.js` — all JS, no onclick attributes
- Image assets: `hero-banner.png` (hero), `rebag.png` (skills backpack),
  `f1/f2/f3.png` (decorative flowers), `GRACEenvelope.png` (contact),
  `gracefuheadshot.jpeg`. Several unused legacy assets remain in the repo.

## Key Sections
1. Hero — full-width banner image with a timed cinematic entrance (paint blobs → banner → Spotify widget → washi/doodles → scroll hint); working Spotify embed toggle
2. About — greeting + identity block + three taped index cards; scroll-driven flower rotation
3. Experience — botanical vine timeline: an SVG vine that grows on scroll, blooming a unique flower + sliding in a card at each trigger. Left vine + right vine on wide screens; stacked fallback on mobile; reduced-motion fallback
4. Projects — filterable postcard-style card grid + live GitHub contributions heatmap
5. Skills — clickable backpack that unzips (curved SVG zipper + 3D flap fold) to float skill blobs into four labeled quadrants; magnetic hover + tooltips
6. Recognition — staggered editorial award reel + spinning flowers
7. Contact — envelope image, no form

## APIs Used
- GitHub contributions API: https://github-contributions-api.jogruber.de/v4/grcfu?y=last
  - Fetched in script.js with async/await + try/catch
  - Rendered as a contributions heatmap in the Projects section (last ~183 days)
  - Graceful fallback message linking to github.com/grcfu if fetch fails

## Interactivity (all in script.js, no onclick in HTML)
- Sticky frosted glass navbar on scroll + mobile hamburger toggle
- Ink-trail cursor follower (hover-capable devices only)
- IntersectionObserver scroll animations (about, projects, recognition, contact)
- Project filter bar (All / Web / iOS / Startup)
- Scroll-driven vine growth + flower bloom in Experience
- Clickable unzip animation on the Skills backpack
- Back to top button + smooth-scroll anchor links

## Assignment Requirements (Web Dev Final Project)
- Must use separate CSS and JS files (no inline styles)
- Must have at least one external API (GitHub contributions API)
- Must have real JS interactivity (not just CSS hover)
- Valid semantic HTML5
- Mobile responsive
- No forms, no login, no email collection
- Graded on: Originality, Visual Design, Interactivity, API Usage

## Local Development
- Static site, no build step. Serve from the project root:
  `python3 -m http.server 8000` → http://127.0.0.1:8000
- A running server is needed (not file://) so the GitHub contributions fetch works.

## Deployment
- GitHub Pages at grcfu.github.io
- Test live URL after every push
