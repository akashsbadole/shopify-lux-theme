# Shopify Theme Deployment Guide

This guide walks you through connecting the Luxe Theme to your Shopify store.

================================================================================
STEP 1: INSTALL SHOPIFY CLI
================================================================================

If you don't have Shopify CLI installed, run:

    npm install -g @shopify/cli

Or on Mac/Linux:

    brew install shopify-cli

Verify installation:

    shopify version

================================================================================
STEP 2: GET ADMIN API ACCESS TOKEN
================================================================================

1. Go to your Shopify Admin:
   https://YOUR-STORE.myshopify.com/admin

2. Click Settings (bottom left)

3. Click "Apps and sales channels"

4. Click "Develop apps" (top right)

5. Click "Create an app"

6. App name: Luxe Theme
   Click "Create app"

7. Click "Configure Admin API scopes"

8. Select these scopes:
   ✓ theme (read and write)
   ✓ theme_templates (read and write)
   ✓ products (read)
   ✓ collections (read)
   ✓ inventory (read and write)
   ✓ orders (read)

9. Click "Save"

10. Click "Install app"

11. Click "Install" to confirm

12. COPY THE ACCESS TOKEN (shown once, can't view again!)
    - It looks like: shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    - Save this somewhere safe!

================================================================================
STEP 3: GET YOUR THEME ID
================================================================================

1. In Shopify Admin, go to "Online Store" → "Themes"

2. Find your current theme

3. Click "Actions" → "Duplicate" (recommended as backup)

4. To find theme ID:
   - Click "Actions" → "Edit code"
   - Look at the URL in your browser
   - The theme ID is the number at the end:
     https://YOUR-STORE.myshopify.com/admin/themes/123456789/edit
   - Theme ID: 123456789

================================================================================
STEP 4: UPDATE CONFIG FILE
================================================================================

Open config.yml in your theme folder and replace with your details:

development:
  store: YOUR-STORE.myshopify.com
  password: shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  theme_id: "123456789"
  ignore_files:
    - "*.json"
    - "*.lock"

production:
  store: YOUR-STORE.myshopify.com
  password: shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  theme_id: "123456789"
  ignore_files:
    - "*.json"
    - "*.lock"

IMPORTANT: Replace:
- YOUR-STORE         → your store name (e.g., myshop)
- shpat_xxx         → your access token from Step 2
- 123456789         → your theme ID from Step 3

Example:
development:
  store: coolstore.myshopify.com
  password: shpat_7a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
  theme_id: "876543210"

================================================================================
STEP 5: PUSH THEME TO SHOPIFY
================================================================================

Navigate to your theme folder in terminal:

    cd C:\Users\akash\Downloads\shopify-luxe-theme\luxe-theme

Then run:

    npm run push

Or use Shopify CLI directly:

    shopify theme push

This will upload all theme files to your Shopify store.

================================================================================
STEP 6: PREVIEW AND ACTIVATE THEME
================================================================================

After pushing:

1. Go to Shopify Admin → Online Store → Themes

2. You should see "Luxe Theme" in your themes

3. Click "Actions" → "Preview" to test

4. To make it live:
   Click "Actions" → "Set as default"

================================================================================
COMMON COMMANDS
================================================================================

    npm run dev          - Watch for changes and auto-sync
    npm run push         - Upload theme to Shopify
    npm run pull         - Download theme from Shopify
    npm run deploy       - Deploy to production
    shopify theme watch  - Watch mode (auto-upload changes)

================================================================================
TROUBLESHOOTING
================================================================================

ERROR: "Store not found"
→ Check your store name in config.yml (remove .myshopify.com)

ERROR: "Access token invalid"
→ Generate a new token from Apps → Develop apps → Luxe Theme

ERROR: "Theme not found"
→ Check your theme_id in config.yml (must be a number, not the name)

ERROR: "Permission denied"
→ Make sure you selected all required scopes when creating the app

================================================================================
NEXT STEPS AFTER DEPLOYMENT
================================================================================

1. Test on mobile devices
2. Add your products
3. Configure navigation menu
4. Set up policies (refund, privacy, terms)
5. Configure payment gateways
6. Add your logo and images
7. Test checkout process

================================================================================
SUPPORT
================================================================================

If you need help:
- Shopify Docs: https://shopify.dev/docs/themes
- Shopify Community: https://community.shopify.com