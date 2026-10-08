# Admin design foundation

Imported only Admin.tsx and the catalog types from Desktop/admin-panel-export.tar.gz. The existing storefront, catalog, fonts, theme and dependencies are preserved.

Routes: /admin and /admin/produkti (products), /admin/kategorije (categories), /admin/clanci (articles), /admin/posta (inbox).

Includes responsive sidebar, search by name/brand/SKU/barcode, category/image/status/review filters, sorting, product pagination, selection, edit/add dialogs, delete confirmations, category and article cards, image previews and an empty inbox. Links back to the storefront use the same domain.

The design is now connected to Supabase email/password authentication and approved admin membership. Catalog edits save through a protected database function and are read by the storefront. The previous demo localStorage catalog is no longer used. Inbox and uploads are not connected.

Apply the SQL and account setup in docs/SUPABASE.md, then follow docs/PRODUCT-IMPORT.md for the products table and import. Storage uploads and inbox integration remain future work.
