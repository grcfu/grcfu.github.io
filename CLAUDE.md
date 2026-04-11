# Grace Fu — Personal Portfolio Website

## Project Overview
Personal portfolio site for Grace Fu, sophomore at WashU studying CS & Business (BuCS),
recruiting for SWE roles. Deployed at grcfu.github.io.

## Aesthetic & Vibe
- Editorial/magazine meets tech portfolio — organic, textural, not flat/clinical
- Ocean & sand palette with dark sections for contrast
- Color palette: warm sand #EBE6DE, silver lake blue #648EC0, pewter #849DBB, sage teal #8BACA3, royal brown #513A32, dark ocean #1B3A4B
- Fonts: Playfair Display (display), Dancing Script (accents), DM Sans (body)
- Sharp corners (border-radius: 0), subtle film grain overlay, no rounded "AI" look

## File Structure
- `index.html` — all HTML structure
- `styles.css` — all styles, no inline styles
- `script.js` — all JS, no onclick attributes
- `gracefuheadshot.jpeg` — headshot photo

## Key Sections
1. Hero — giant typographic name + headshot overlay + parallax
2. About — bio + glassmorphism stat cards
3. Experience — alternating timeline cards, accordion on mobile
4. Projects — filterable card grid + live GitHub API section
5. Skills — grouped pill clusters
6. Recognition — award cards with shimmer hover
7. Contact — gradient section, no form

## APIs Used
- GitHub REST API: https://api.github.com/users/grcfu/repos
  - Fetched in script.js with async/await + try/catch
  - Displays in "Also on GitHub" subsection of Projects
  - Graceful fallback if fetch fails

## Interactivity (all in script.js, no onclick in HTML)
- Sticky frosted glass navbar on scroll
- Custom cursor follower
- IntersectionObserver scroll animations
- Project filter bar (All / ML/AI / Web / iOS / Startup)
- Experience accordion on mobile
- Hero parallax on scroll
- Back to top button

## Assignment Requirements (Web Dev Final Project)
- Must use separate CSS and JS files (no inline styles)
- Must have at least one external API (GitHub API)
- Must have real JS interactivity (not just CSS hover)
- Valid semantic HTML5
- Mobile responsive
- No forms, no login, no email collection
- Graded on: Originality, Visual Design, Interactivity, API Usage

## Deployment
- GitHub Pages at grcfu.github.io
- Test live URL after every push
