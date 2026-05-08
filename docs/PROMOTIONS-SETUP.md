# Promotions Setup Guide

Luxe Theme includes a powerful promotion engine for BOGO, volume discounts, free gifts, and more. This guide walks through configuration.

---

## Overview

Promotions are defined via **product metafields** or **theme settings**. The engine scans your cart and automatically applies the best eligible promotion (only one active at a time).

### Supported Promotion Types

| Type | Description | Metafields Used |
|------|-------------|-----------------|
| BOGO / Buy X Get Y | Buy N of product A, get M of product B free | `promo_type = bogo`, `promo_buy_qty`, `promo_get_qty`, `promo_get_product` |
| Volume Discount | Buy N+ items of same product, get X% off each | `promo_type = volume_discount`, `promo_min_qty`, `promo_discount_value`, `promo_discount_type` |
| Free Gift with Purchase | Spend minimum amount, unlock a free product | Theme setting: `Free gift minimum spend` + `Default free gift product`, or product metafield `promo_type = free_git`, `promo_min_amount`, `promo_get_product` |
| Price-Based (Cheapest Free) | Buy N items, cheapest one becomes free | `promo_type = price_based`, `promo_min_qty`, `promo_apply_to` |
| Bundle Deal | Buy a set of products for a fixed price | `promo_type = bundle`, `promo_bundle_product_ids`, `promo_bundle_price` |

---

## Step 1: Create Metafield Definitions

In Shopify Admin, go to **Settings > Metafields > Products** and create the following metafields (namespace: `luxe`):

| Metafield | Type | Description |
|-----------|------|-------------|
| `promo_type` | Single line text | One of: `bogo`, `volume_discount`, `free_gift`, `price_based`, `bundle` |
| `promo_buy_qty` | Integer | For BOGO: quantity that must be purchased |
| `promo_get_qty` | Integer | For BOGO: quantity of free item(s) |
| `promo_get_product` | Single line text (product handle) | For BOGO/free_gift: handle of free product, e.g. `my-free-tote` |
| `promo_min_amount` | Integer (cents) | For free_gift: cart subtotal threshold (store in cents, e.g. 10000 = $100) |
| `promo_gift_product_ids` | JSON array of handles | Optional: give customer a choice among multiple free gifts |
| `promo_min_qty` | Integer | Minimum quantity for volume/price-based promos |
| `promo_discount_type` | Single line text | `percentage` or `fixed_amount` |
| `promo_discount_value` | Number (percentage or amount) | Discount value |
| `promo_apply_to` | Single line text | For price_based: `cheapest` or `costliest` |
| `promo_bundle_product_ids` | JSON array of handles | Products required for bundle |
| `promo_bundle_price` | Integer (cents) | Fixed bundle total price |

> **Tip:** You can set these in bulk via Shopify's CSV import or use an app like "Metafields Guru".

---

## Step 2: Configure Theme Settings

In **Online Store > Themes > Customize > Theme Settings > Promotions**, configure global defaults:

- **Enable promotions** – master toggle
- **Default promotion priority** – which promotion type wins when multiple eligible
- **Show promotional badges** – display BOGO/volume badges on product cards
- **Show progress bar** – enable/disable in cart
- **Free gift threshold message** – custom messaging template
- **Free gift minimum spend** – global fallback if no product-specific metafield
- **Default free gift product** – product handle for global free gift
- **BOGO auto-add** – automatically add free items to cart (if disabled, user must claim manually)
- **Volume pricing table** – show table on product pages
- **Popup triggers** – exit intent, scroll depth, etc.

---

## Step 3: Assign Promotions to Products

### Example 1: Buy 2 Get 1 Free (BOGO)

Product metafields (namespace `luxe`):

| Metafield | Value |
|-----------|-------|
| `promo_type` | `bogo` |
| `promo_buy_qty` | `2` |
| `promo_get_qty` | `1` |
| `promo_get_product` | `free-tote-bag` (handle of free product) |

### Example 2: Bulk Discount – 15% off 3+

| Metafield | Value |
|-----------|-------|
| `promo_type` | `volume_discount` |
| `promo_min_qty` | `3` |
| `promo_discount_type` | `percentage` |
| `promo_discount_value` | `15` |

### Example 3: Free Gift with $100 Spend

Set via **Theme Settings** → **Free gift minimum spend** = `10000` (cents i.e. $100) and **Default free gift product** = `free-gift-product`.

Or per-product:

| Metafield | Value |
|-----------|-------|
| `promo_type` | `free_gift` |
| `promo_min_amount` | `10000` |
| `promo_get_product` | `free-tote-bag` |

### Example 4: Cheapest Item Free (Buy 3, cheapest free)

| Metafield | Value |
|-----------|-------|
| `promo_type` | `price_based` |
| `promo_min_qty` | `3` |
| `promo_apply_to` | `cheapest` |

---

## Step 4: Create Supporting Shopify Resources

### Discount Codes (for automatic application)

Although the promotion engine handles eligibility and messaging, the actual price reduction is applied via Shopify discount codes. Create these codes in **Discounts** section (they can be automatic discounts):

| Promotion Type | Suggested Code | Type | Value |
|----------------|---------------|------|-------|
| BOGO | `BOGO-FREE` | Automatic discount | 100% off specific product (set product to the free product) |
| Volume | `VOLUME-15` | Automatic discount | 15% off |
| Free Gift | `FREE-GIFT` | Automatic discount | 100% off specific product |
| Cheapest | `CHEAPEST` | Automatic discount | 100% off cheapest item |
| Bundle | `BUNDLE` | Fixed amount off bundle total |

> The promo engine maps types to codes via `DISCOUNT_CODES` in `promo-engine.js`. Edit if you use different codes.

### Gift Products

If your free gift is a specific product, ensure it's published in your store (can be hidden from navigation). It should have a price >0 (so 100% off makes sense). You may want to create a dedicated collection for gifts.

---

## Step 5: Testing

1. Add products with promotion metafields to cart.
2. Progress bar should appear in cart drawer & cart page.
3. When threshold met, for free gifts/BOGO a selector modal opens (if auto-add disabled) or free item auto-adds (if enabled).
4. Verify the discount code automatically applies at checkout (may need to test the exact flow).
5. Remove items and ensure promotion rescinds.

**Important:** On Basic/Standard plans, price adjustments are visual only; final discount applied at checkout via Shopify discount codes. Ensure the correct code is configured (matches promotion type).

---

## Theme Customization

### Styling

Promo components have CSS in `assets/luxe-theme.css`. Customize colors via theme settings (badge colors are fixed gradients but can be overridden).

### Badge Text

`promo_bogo_label` setting controls BOGO badge text (default "Buy {buy_qty} Get {get_qty} Free"). Use placeholders `{buy_qty}` and `{get_qty}`.

### Progress Bar Message

`promo_gift_threshold_message` allows dynamic placeholders `{remaining}` and `{gift_name}`.

### Popup

Add the **Promo Popup** section to any page (homepage, collection) to display exit-intent offers.

---

## Troubleshooting

**Promotions not appearing?**
- Ensure metafield namespace is `luxe` and keys exactly match those listed.
- Verify `promo_enabled` is ON.
- Confirm product has `promo_type` set correctly.
- Check browser console for errors (PromoEngine logs).

**Free gift modal not opening?**
- Make sure the free gift product is published and has variants.
- Global free gift settings require both min_amount and product handle set.
- On non-cart pages, `window.LuxePromo` may not be defined yet; it initializes on DOMContentLoaded.

**Discount not applied at checkout?**
- Verify Shopify discount code exists and is active.
- Code must be automatic (not require code entry) if you want auto-apply via engine; otherwise user must enter manually.

**Duplicate modals?**
- Only one instance of `promo-gift-selector` should be rendered; included automatically in cart drawer.

---

## Next Steps

- Add multiple choice free gifts per promotion by setting `promo_gift_product_ids` metafield.
- Stack multiple promotions? Currently only one active at a time; adjust priority in settings.
- Want more advanced rules (e.g., specific collections)? That requires custom metafield definitions and engine extension.

Need help? Contact theme support or refer to developer guide for extending `PromoEngine`.
