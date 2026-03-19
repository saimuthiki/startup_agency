# Website Agency — Project Instructions

## Who I Am
I run a web design agency in Andhra Pradesh, India. I build professional websites for local businesses (restaurants, shops, salons, clinics, etc.) that don't currently have websites. I find these businesses via Google Maps.

## What This Project Does
This is my website factory. I provide a CSV of business leads, and Claude builds complete, production-ready websites for each business, then deploys them to Cloudflare Pages via GitHub.

## Tech Stack (Always Use This)
- Framework: Astro with Tailwind CSS
- Language: TypeScript
- Styling: Tailwind CSS v3 with custom design tokens
- Images: Google Gemini API for AI-generated images + Unsplash/Pexels for stock
- Hosting: Cloudflare Pages (free tier, unlimited bandwidth)
- Version Control: GitHub (separate repo per client OR monorepo with folders)

## Design Standards
- Mobile-first responsive design (70%+ of Indian users are on mobile)
- Fast loading: target <2 second First Contentful Paint
- Color palette: extract from business category (warm for restaurants, clean for medical, earthy for hardware, etc.)
- Typography: use Google Fonts — prefer DM Sans, Plus Jakarta Sans, Outfit, Sora (NEVER use Inter, Roboto, or Arial)
- Include: Hero section, About, Services/Menu, Photo Gallery, Google Maps embed (iframe), Contact form, WhatsApp click-to-chat button, Footer
- Add WhatsApp floating button (green) linking to business WhatsApp number
- Add a "Built by [Your Agency Name]" footer credit with link

## CSV Processing Rules
When I provide a CSV file:
1. Read each row as a separate business
2. For each business, create a folder in /clients/{business-slug}/
3. Generate the full Astro site with real content from the CSV
4. Use the business name, category, address, and phone from CSV data
5. Generate appropriate AI images using Gemini API if GEMINI_API_KEY is set
6. Otherwise use Unsplash/Pexels placeholder images related to the category
7. After building, initialize git and push to GitHub
8. Trigger Cloudflare Pages deployment
9. Report back the live URL

## Important Rules
- NEVER use placeholder text like "Lorem ipsum" — write real, compelling copy based on the business category and name
- ALWAYS include the actual phone number and address from the CSV
- ALWAYS make the site production-ready (no TODOs, no broken links)
- ALWAYS add SEO meta tags (title, description, og:image)
- ALWAYS add structured data (LocalBusiness schema.org JSON-LD)
- Write content in English, but consider adding Telugu option later
- Each website should look UNIQUE — vary colors, layouts, fonts per client

## Project Structure
- leads/ — CSV files of business leads
- clients/ — Generated websites per client
- templates/ — Reference designs by category
- scripts/ — Automation scripts (CSV processing, image generation, deployment)
- assets/ — Shared assets (icons, fonts)
- reports/ — Build reports and outreach tracking
- .claude/skills/ — Skill knowledge files
- .claude/agents/ — Agent definitions
