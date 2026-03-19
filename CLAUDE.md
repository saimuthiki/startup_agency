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

## Deployment Workflow (ALWAYS FOLLOW THIS)

After ANY change to a client website, ALWAYS do these 3 steps automatically:

### Step 1: Save changes to GitHub
```bash
cd D:/claude_code_mastery_real/startup_agency/clients/{business-slug}
git add -A
git commit -m "Update: {description of changes}"
git push origin master
```

### Step 2: Deploy to Cloudflare Pages
```bash
npx wrangler pages deploy . --project-name={business-slug}
```

### Step 3: Confirm the live URL
Report: "Updated and deployed to https://{business-slug}.pages.dev"

### For NEW clients (first-time setup):
```bash
# 1. Create Cloudflare project
npx wrangler pages project create {business-slug}

# 2. Deploy
npx wrangler pages deploy clients/{business-slug}/ --project-name={business-slug}

# 3. Create GitHub repo
cd clients/{business-slug}/
git init && git add . && git commit -m "Website for {business-name}"
gh repo create {business-slug}-website --public --source=. --push

# 4. Report the live URL
```

### Active Client Deployments
| Client | Slug | Cloudflare URL | GitHub Repo |
|--------|------|---------------|-------------|
| Nandi Food Plaza | nandi-food-plaza | https://nandi-food-plaza.pages.dev | https://github.com/saimuthiki/nandi-food-plaza-website |

## WhatsApp Outreach

### Tool: WA Sender (SheetWA) Chrome Extension
- Free Chrome extension: https://sheetwa.com
- Works with WhatsApp Web (no API needed)
- Sends from Google Sheets

### Message Template (use with WA Sender)
```
🙏 Namaste {name} ji,

I noticed your business has excellent {rating}★ reviews on Google Maps — impressive!

I build professional websites for businesses like yours. I've already created a sample:

🌐 https://{slug}.pages.dev

A website helps customers:
✅ Find your address and call directly
✅ See your services with photos
✅ Contact you on WhatsApp with one tap
✅ Find you on Google Search

Special offer: ₹5,000 one-time (no monthly charges for first year).

Would you like to see a personalized version for {name}?
Reply "YES" and I'll build it! 🙌

Reply STOP to opt out.
```

### Anti-Ban Rules
1. Use separate SIM (₹100), not primary
2. Warm up 1-2 weeks first
3. Start 10-15/day → scale to 30-50/day by week 3
4. 30-60 second random delays between messages
5. Personalize EVERY message with business name + rating
6. Send during business hours only (10AM-7PM IST)

### WhatsApp outreach is NOT automatable by Claude Code
Use WA Sender Chrome extension manually. Claude Code builds websites + deploys.

## Gemini API Key
Stored in .env file. Key: AIzaSyAm-GNWN845cuqhn-ZIy2PqranMFPMIujQ

## Project Structure
- leads/ — CSV files of business leads (qualified-leads.json has 4,936 leads)
- clients/ — Generated websites per client (each folder = one client)
- templates/ — Reference designs by category
- scripts/ — Automation scripts (CSV processing, image generation, deployment)
- assets/ — Shared assets (icons, fonts)
- reports/ — Build reports and outreach tracking
- .claude/skills/ — 1,196 skill knowledge files
- .claude/agents/ — 380 agent definitions
- .claude/mcps/ — 42 MCP server configs
- .claude/hooks/ — 24 hook configs
