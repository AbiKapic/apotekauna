# Admin design foundation

Imported only Admin.tsx and the catalog types from Desktop/admin-panel-export.tar.gz. The existing storefront, catalog, fonts, theme and dependencies are preserved.

Routes: /admin and /admin/produkti (products), /admin/kategorije (categories), /admin/clanci (articles), /admin/posta (inbox).

Includes responsive sidebar, search, category filter, sorting, product pagination, selection, edit/add dialogs, delete confirmations, category and article cards, image previews and an empty inbox. Links back to the storefront use the same domain.

This is an unauthenticated design preview. It reads the existing demo catalog and saves edits only under the separate apoteka-admin-design-v1 localStorage key. It cannot write to a remote API or change the public catalog. Inbox and uploads are not connected. Clear that storage key to reset demo edits.

Before enabling real administration, implement Supabase Auth, admin authorization and row-level security, shared catalog persistence, storage uploads and inbox integration. No credentials or Supabase configuration are required for the design preview.
