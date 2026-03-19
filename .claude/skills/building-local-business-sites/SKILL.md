---
name: building-local-business-sites
description: Build production-ready websites for local Indian businesses using data from Google Maps CSV exports. Handles restaurants, shops, salons, clinics, and other SMBs.
---

# Building Local Business Websites

## When to Use
Activate when processing CSV leads or building a website for any local business.

## Site Architecture
Every local business site follows this structure:
1. **Hero Section**: Business name as H1, tagline based on category, hero image, CTA "Call Now" or "Visit Us"
2. **About Section**: 2-3 paragraphs generated from category context
3. **Services/Products Section**: Grid of 4-8 services based on category
   - Restaurant → Menu highlights
   - Salon → Services list (haircut, facial, bridal)
   - Hardware → Product categories (tiles, sanitaryware, paint)
   - Clinic → Treatments and specializations
4. **Gallery Section**: 4-8 images in responsive grid
5. **Google Maps Embed**: iframe using business address/coordinates
6. **Testimonials**: 3 realistic reviews based on rating and category
7. **Contact Section**: Phone (click-to-call), WhatsApp (click-to-chat), Address, Hours (9AM-9PM default)
8. **Footer**: Business name, address, "Powered by [Agency Name]"

## Design Rules Per Category
- **Restaurant**: Warm colors (amber, burgundy, cream), food photography, cursive accent font
- **Salon/Spa**: Soft pastels (blush, lavender, gold), elegant typography
- **Hardware/Tiles**: Bold industrial (slate, orange, navy), geometric layouts
- **Medical/Clinic**: Clean whites and blues/greens, professional, trust-building
- **General Retail**: Vibrant, colorful, product-focused grid layouts

## WhatsApp Integration
Add floating WhatsApp button (bottom-right):
```html
<a href="https://wa.me/91{phone}?text=Hi%20{business_name}%2C%20I%20visited%20your%20website"
   class="whatsapp-float" target="_blank">
  <!-- WhatsApp SVG icon -->
</a>
```

## SEO Checklist
- Title: "{Business Name} — {Category} in {City} | Call {Phone}"
- Meta description: compelling 155-char summary
- og:title, og:description, og:image
- JSON-LD LocalBusiness structured data
- Alt text on all images
- Semantic HTML (header, main, nav, section, footer)

## Tech Stack
- Astro + Tailwind CSS v3
- TypeScript
- Google Fonts (DM Sans, Plus Jakarta Sans, Outfit, Sora — NEVER Inter/Roboto/Arial)
- Mobile-first, target <2s FCP
