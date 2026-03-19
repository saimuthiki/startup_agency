---
name: deploying-to-cloudflare
description: Deploy static sites to Cloudflare Pages via GitHub integration or Wrangler direct deploy.
---

# Deploying to Cloudflare Pages

## Prerequisites
- GitHub CLI (gh) authenticated
- Cloudflare Wrangler CLI authenticated

## Option A: Wrangler Direct Deploy (Fastest)
```bash
cd clients/{business-slug}/
npm run build
npx wrangler pages deploy dist/ --project-name={business-slug}
```
Result: {business-slug}.pages.dev

## Option B: GitHub + Auto-Deploy (Better for maintenance)
```bash
cd clients/{business-slug}/
git init && git add . && git commit -m "Website for {business-name}"
gh repo create {business-slug}-website --public --source=. --push
```
Then connect in Cloudflare Dashboard → Pages → Connect to Git

## Custom Domain (After Client Pays)
Point client's domain DNS to Cloudflare nameservers. SSL auto-provisions.

## URL Format
- Free: {slug}.pages.dev
- Custom: www.businessname.com
