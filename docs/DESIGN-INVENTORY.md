# Preserved Herba designs

The entire Desktop/herba source was copied into Apoteka, including both React design implementations. The active application is `src/app/App.tsx`; the earlier standalone design remains in `src/components/Apothecary.tsx` as a reference.

## Active pages and interactions

- `/`: home page, hero, featured products, categories and advice.
- `/kategorije`: category overview.
- `/kategorije/:categoryId`: category product listing.
- `/proizvodi`: product listing with search and filters.
- `/proizvodi/:id`: product details and add to cart.
- `/savjeti` and `/savjeti/:id`: advice listing and article.
- `/kontakt`: contact page.
- Unmatched routes: not-found page.
- Shared header, navigation, responsive menu, footer and cart drawer.
- Cart quantities persist in localStorage.
- Catalog loading and error states.

## Design assets

- `src/index.css`: global styling and focus states.
- `src/styles/theme.css`: colors and typography tokens.
- `src/styles/fonts.css`: DM Sans font import.
- `public/catalog.json`: demonstration products, categories, article, hero image and contact data.
- Lucide icons and inline SVG icons in the preserved reference design.

Photographs are remote Unsplash URLs and fonts are loaded from Google Fonts. No local image files or Figma files were supplied in the original folder. Network access is needed for those external visuals.

## Remaining product work

This is a frontend starter. Checkout, payment, order submission, authentication, inventory and a backend are not implemented. Contact details and product content are examples. Real product photography and approved content need to be supplied before release. SPA hosting must serve index.html for application routes.
