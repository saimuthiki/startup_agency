---
name: generating-gemini-images
description: Generate high-quality business images using Google Gemini API for hero sections, galleries, and product photos.
---

# Generating Images with Gemini API

## Setup
GEMINI_API_KEY must be set as environment variable.

## Prompt Templates Per Category
- **Restaurant**: "Professional food photography, modern Indian restaurant interior, warm lighting, elegant ambiance"
- **Tile Shop**: "Modern tile showroom with ceramic tiles displayed, bright LED lighting, professional space"
- **Salon**: "Luxurious beauty salon interior, styling mirrors, warm lighting, elegant decor"
- **Hardware**: "Well-organized hardware store, tools displayed, bright commercial lighting"
- **Default**: "Modern Indian business storefront, professional, welcoming entrance"

## Usage
```bash
py scripts/generate-images.py {category} {output_dir}
```
- 500 free images/day on Gemini API
- Generate 4-8 per business = 60-125 sites/day

## Fallback
If no GEMINI_API_KEY, use Unsplash URLs:
`https://source.unsplash.com/featured/?{category},business`
