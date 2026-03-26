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

## Sales Pipeline (FOLLOW THIS EXACTLY)

### Phase 1: Cold Outreach (wa.me links — manual, no extension needed)
- Generate links: `node scripts/generate-outreach-links.js 10`
- Each link opens WhatsApp with personalized message pre-filled
- Message shows the SAMPLE URL (nandi-food-plaza.pages.dev) as a demo
- Quotes a price (₹5,000 intro / ₹8,000 standard)
- Does NOT give away a free custom site — only the shared demo
- Send 10-15 messages per day manually via wa.me links
- Track responses in reports/outreach-tracker.csv

### Phase 2: Response Handling (manual — you do this)
- When a business replies "YES" or shows interest:
  1. Send them more details about the service
  2. Negotiate price (₹5,000-₹12,000 based on scope)
  3. Collect 50% advance via UPI/GPay
  4. Tell Claude Code: "Build website for {business name}"

### Phase 3: Build & Deliver (Claude Code does this — AUTOMATED)
When you say "Build website for {business name}":
1. Claude reads the lead data from qualified-leads.json
2. Builds a premium interactive website in clients/{slug}/
3. Git commits + pushes to GitHub
4. Deploys to Cloudflare Pages
5. Reports the live URL: https://{slug}.pages.dev
6. You share the URL with the client for approval

### Phase 4: Revisions & Handover (semi-automated)
- Client asks for changes → You tell Claude → Claude edits + redeploys
- Once approved → Set up custom domain if client has one
- Collect remaining 50% payment
- Offer ₹1,500/month maintenance plan

### Pricing (Market Standard for AP/India)
| Package | Price | What's Included |
|---------|-------|----------------|
| Starter (intro offer) | ₹5,000 | Single page website + Cloudflare hosting + WhatsApp button |
| Standard | ₹8,000 | Multi-section website + SEO + Google Maps + Gallery |
| Premium | ₹12,000 | Everything + AI images + Custom domain setup + 3 months maintenance |
| Maintenance | ₹1,500/month | Hosting + updates + minor changes |

### Sample Demo URL (shared with ALL cold outreach)
https://nandi-food-plaza.pages.dev

### Anti-Ban Rules for WhatsApp
1. Use separate SIM (₹100), not primary
2. Warm up 1-2 weeks first
3. Start 10-15/day → scale to 30-50/day by week 3
4. Personalize EVERY message with business name + rating
5. Send during business hours only (10AM-7PM IST)

### WhatsApp outreach is NOT automatable by Claude Code
Use wa.me links manually. Claude Code only builds websites + deploys.

## Gemini API Key
Stored in .env file. Key: AIzaSyAm-GNWN845cuqhn-ZIy2PqranMFP

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
