# Supabase setup

The application uses public client settings in src/lib/supabase.ts, overridable by VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY. The publishable key is intended for frontend use. No service role or database password belongs in the application. Public defaults also allow the existing GitHub build to work without adding secrets.

## Dashboard steps

1. Open SQL Editor > New query. Paste supabase/setup.sql and run it. This creates the catalog, admin membership table and protected save function.
2. Run supabase/seed.sql in a second query to copy the existing demo catalog. Running it again preserves the existing catalog.
3. Open Authentication > Users > Add user > Create new user. Enter your chosen admin email and password; mark the email confirmed when offered. Keep the password private.
4. Open supabase/grant-admin.sql, replace YOUR_ADMIN_EMAIL with that email, then run it. Confirm the user's UUID appears in admin_users in Table Editor. Only dashboard administrators can grant membership; application users cannot grant themselves access.
5. Under Authentication settings, disable new public user signups if this project is admin-only. Enable email/password login. Under URL Configuration set Site URL to https://apotekauna.ba and add http://localhost:5173 for development if required.
6. Run pnpm dev and open /admin. Check incorrect credentials are rejected, an ordinary account cannot access admin, and your approved admin can sign in and out.
7. Edit a product; refresh the public product page and confirm the new value. Save attempts from a stale admin tab should be rejected rather than overwrite another admin's edits.
8. Push to main once database setup and local checks are complete. GitHub automatically builds and deploys.

## Behavior

Catalog reads are public. Authenticated sessions can read only their own admin membership. Catalog writes occur only through a database function that verifies membership and the current catalog version. Direct client writes to either table are denied. Seed content uses the supplied demonstration products and contact data.

The storefront falls back to the original public/catalog.json during initial setup or database outages; it may show that older demonstration catalog then. Admin never falls back to editable demo storage. Public pages load current data on navigation from admin or refresh; live subscription updates are not enabled.

Products, categories and articles share the existing catalog JSON structure. Inbox, image upload, payments and order processing remain unimplemented. The database setup has not been applied automatically; SQL permissions must be validated against your project after running it.
