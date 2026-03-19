---
name: generating-outreach-links
description: Generate personalized WhatsApp outreach links for cold messaging local businesses. Creates wa.me links with pre-filled messages showing sample URL and pricing. Use when user says "generate outreach links", "send messages", "next batch", or "outreach for {city/category}".
---

# Generating WhatsApp Outreach Links

## When to Activate
- User says "generate outreach links" or "generate links"
- User says "next batch" or "more links"
- User says "outreach for {city}" or "outreach for {category}"
- User says "send messages to {number} businesses"

## How It Works

### Command
```bash
cd D:/claude_code_mastery_real/startup_agency
node scripts/generate-outreach-links.js {count} {offset}
```

### Parameters
- `count` — Number of links to generate (default: 10)
- `offset` — Start from lead number N (default: 0, i.e. top leads first)

### Filtering by City or Category
If user asks for a specific city or category, use the filtered version:
```bash
node scripts/generate-outreach-links.js {count} {offset} {city_or_category}
```

### What It Does
1. Reads leads/qualified-leads.json (4,936 leads sorted by reviews descending)
2. For each lead, generates a wa.me link with personalized message containing:
   - Business name and their Google rating/reviews
   - Sample demo URL: https://nandi-food-plaza.pages.dev
   - Price quote: ₹5,000 introductory offer
   - "Reply YES" call-to-action
3. Saves tracking data to reports/outreach-tracker.csv
4. Shows clickable links in terminal

### Output Format
Each link shown as:
```
1. Business Name
   📍 city | Category | ⭐ rating | 📝 reviews
   📞 phone
   🔗 https://wa.me/91XXXXXXXXXX?text=...
```

### Tracker CSV Columns
name, phone, city, category, rating, reviews, whatsapp_link, status

Status values: pending → sent → replied → interested → paid → delivered

## Message Strategy
- Shows sample URL (nandi-food-plaza.pages.dev) — NOT a free custom site
- Quotes ₹5,000 introductory price
- Asks them to reply "YES" for more details
- Includes "Reply STOP" for opt-out
- Personalized with their business name, category, rating, review count, city

## After Sending
User manually:
1. Clicks each wa.me link → WhatsApp opens with message → hit Send
2. Tracks responses in reports/outreach-tracker.csv
3. When business replies YES → user tells Claude "Build website for {name}"
4. Claude builds + deploys (see building-local-business-sites skill)

## Batch Strategy
- Day 1-7: Send 10/day (top leads by reviews)
- Day 8-14: Send 15/day
- Day 15+: Send 20-30/day
- Always during business hours: 10AM-7PM IST
- Mix categories: don't send all restaurants in one day
