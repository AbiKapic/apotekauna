# Curated sections and articles

U Akciji and Popularno are separate from product categories. Open /admin/akcija and /admin/popularno to edit titles, visibility, product selection, ordering and sale percentages. The first five products appear on the homepage; dedicated pages paginate the full selection. Draft products stay hidden. Existing catalogs without collection metadata retain existing sale prices and use up to five existing discounted products. The bundled demo contains four products in each section.

Before deploying, rerun supabase/products.sql in the Supabase SQL editor to update save_admin_content so it persists collections metadata. This preserves products, catalog content and admin users. Deploy the frontend together with that database change. No remote database changes were performed locally.

Manage articles at /admin/clanci. The homepage and /clanci paginate articles six at a time. Existing /savjeti links remain supported.
