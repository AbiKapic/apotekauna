# Apache / cPanel deployment

This frontend can be hosted as static files. Supabase is not required for this initial deployment; the app uses catalog.json and stores its cart in the browser.

## Build

Run `pnpm install --frozen-lockfile`, then `pnpm check`.

Upload the contents of dist to the domain's document root, not the dist folder itself. The domain must be served from its root URL; a subfolder installation needs a separate Vite base and router configuration.

## cPanel

1. Open Domains and check the document root assigned to your domain. The main domain commonly uses public_html; additional domains can have different roots.
2. Back up any existing website before replacing its files.
3. Open File Manager at that document root. Enable Show Hidden Files in Settings.
4. Upload and extract the deployment ZIP there. index.html, catalog.json, .htaccess and assets must sit directly inside the document root.
5. If an old index.php exists, preserve a backup and ensure it does not override the new index.html. Merge existing .htaccess rules deliberately rather than overwriting unrelated settings.
6. Confirm the domain's DNS points to the hosting account, using the exact values supplied by your hosting provider. Preserve email DNS records.
7. Enable/check the domain's SSL certificate in SSL/TLS Status. Once HTTPS works, enable Force HTTPS Redirect in Domains if available.

## Verify

- Open the home page over HTTPS.
- Open and refresh /proizvodi, /kategorije and /kontakt directly.
- Confirm catalog.json loads and images display.
- Add a product to the cart and refresh; its quantity should persist.
- Test the navigation on mobile.

The .htaccess file requires Apache-compatible rewrite support. If direct page URLs return 404, confirm that hidden file was uploaded and ask the host whether mod_rewrite and .htaccess overrides are enabled.

## Updating

The workflow in `.github/workflows/deploy.yml` builds pushes to main and pull requests. It deploys only main, after checks pass, through encrypted FTPS. Manual runs are available from the Actions tab. Deployment becomes operational after the connection secrets are configured and the first run succeeds.

## Automatic deployment setup

Confirm the hosting account supports explicit FTPS on port 21. If only SSH/SFTP is available, change the deployment job to use that connection method before enabling it.

Create a dedicated FTP account in cPanel, scoped to `/home/apotekau/public_html`. Use a strong password and copy the exact username and server from Configure FTP Client. Do not use the main cPanel password.

In GitHub, open Settings > Secrets and variables > Actions > New repository secret, and add:

- `FTP_SERVER`: exact FTPS hostname from the hosting provider (no https:// prefix).
- `FTP_USERNAME`: exact dedicated FTP username.
- `FTP_PASSWORD`: dedicated account password.
- `FTP_SERVER_DIR`: `/` when the account is restricted to public_html. Otherwise use the path shown relative to the FTP account's login root, ending with `/`. Do not guess the absolute server path.

After adding these secrets, push the workflow to main or run it from Actions > Build and deploy website > Run workflow. Check that both build and deploy are green, then refresh https://apotekauna.ba/proizvodi.

Strict certificate verification is enabled. If TLS validation fails, use the correct certificate hostname from the provider rather than disabling verification.

The deployment action manages files from its own sync state and does not clear the entire document root. Existing unrelated files are preserved. Files are uploaded in place, so deployment is not atomic; avoid cancelling an active upload. The source export is generated before the build to keep the existing download link working.

Contact details and catalog content are currently demonstrations. Payments and order submission are not connected.
