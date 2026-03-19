---
name: processing-lead-csvs
description: Process Google Maps CSV/XLSX exports to extract qualified business leads. Filter for businesses without websites that have phone numbers with WhatsApp.
---

# Processing Lead CSVs

## Input Format
Google Maps scraper exports with columns: name, phone, rating, reviews, main_category, categories, address, link, query, featured_image

## Filtering Rules
1. Must have phone number (non-empty)
2. Must NOT have website (empty website field)
3. Rating >= 3.5 preferred
4. Reviews >= 10 preferred
5. Not temporarily closed

## Output
For each qualified lead, extract:
- business_name: Clean name
- business_slug: kebab-case for folder/URL
- phone: Formatted +91 number
- category: Main business category
- address: Full address
- city: Extracted from address
- rating: Star rating
- reviews: Review count

## WhatsApp Check
Phone numbers need WhatsApp verification. The check-whatsapp.js script validates numbers.

## Processing Command
```bash
node scripts/process-csv.js leads/input.xlsx
```
Outputs: leads/qualified-leads.json
