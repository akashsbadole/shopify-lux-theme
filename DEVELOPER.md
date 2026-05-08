# LUXE Theme - Complete Developer Guide

## Table of Contents
1. [File Structure](#file-structure)
2. [Theme Architecture](#theme-architecture)
3. [CSS Variables](#css-variables)
4. [JavaScript API](#javascript-api)
5. [Data Objects Reference](#data-objects-reference)
6. [Adding Custom Features](#adding-custom-features)
7. [Snippet Reference](#snippet-reference)
8. [Section Schema](#section-schema)
9. [Template Customization](#template-customization)
10. [App Integration](#app-integration)
11. [Performance Optimization](#performance-optimization)
12. [SEO & Meta Tags](#seo--meta-tags)
13. [Accessibility](#accessibility)
14. [Troubleshooting](#troubleshooting)
15. [Changelog](#changelog)

---

## File Structure

```
luxe-theme/
├── config/
│   ├── settings_schema.json     # Theme settings configuration
│   └── settings_data.json       # Saved theme settings
├── layout/
│   └── theme.liquid              # Main layout, head, body
├── snippets/                     # Reusable code snippets
│   ├── cart-drawer.liquid        # Ajax cart drawer
│   ├── cart-items.liquid         # Cart items rendering
│   ├── cookie_consent.liquid     # GDPR cookie banner
│   ├── localization.liquid       # Currency selector
│   ├── mega-menu.liquid          # Navigation mega menu
│   ├── pincode-checker.liquid    # India delivery checker
│   ├── product-card.liquid       # Product card component
│   ├── product-compare.liquid   # Product comparison
│   ├── quick-view.liquid         # Quick view modal
│   ├── wishlist-drawer.liquid    # Wishlist drawer
│   ├── notify-me.liquid          # Back-in-stock notification
│   ├── cod-badge.liquid          # Cash on Delivery badge
│   ├── emi-calculator.liquid     # EMI calculator
│   ├── loyalty-display.liquid    # Loyalty points display
│   ├── chat-buttons.liquid       # WhatsApp/Telegram chat
│   ├── size-guide.liquid         # Size guide modal
│   └── icon-*.liquid             # SVG icon snippets
├── sections/                     # Theme sections
│   ├── main-product.liquid       # Product page template
│   ├── main-collection.liquid    # Collection page template
│   ├── main-cart.liquid          # Cart page template
│   ├── header.liquid             # Header/navigation
│   ├── footer.liquid             # Footer
│   ├── hero-slider.liquid        # Homepage hero slider
│   ├── hero-grid.liquid          # Hero grid layout
│   ├── featured-collection.liquid # Featured products
│   ├── product-carousel.liquid   # Product carousel
│   ├── bundle-fbt.liquid         # Frequently bought together
│   ├── flash-sale-timer.liquid   # Countdown timer
│   ├── product-reviews-section.liquid # Reviews section
│   ├── recently-viewed.liquid    # Recently viewed products
│   ├── trust-bar.liquid          # Trust badges bar
│   ├── promo-banner.liquid       # Promo banner
│   ├── promo-banners.liquid      # Multiple promo banners
│   ├── newsletter-popup.liquid   # Newsletter popup
│   ├── testimonial.liquid        # Testimonial section
│   ├── blog-section.liquid       # Blog/News section
│   ├── image-with-text.liquid    # Image with text
│   ├── custom-code.liquid       # Custom code section
│   └── cart-upsell.liquid        # Cart cross-sell section
├── templates/                    # Page templates
│   ├── product.json              # Product page
│   ├── product.pre-order.json    # Pre-order template
│   ├── collection.json           # Collection page
│   ├── index.json                # Homepage
│   ├── blog.json                 # Blog page
│   ├── article.json              # Blog article
│   ├── page.json                 # Generic page
│   ├── search.json               # Search results
│   ├── 404.json                  # 404 page
│   ├── customers/                # Customer templates
│   │   ├── login.json
│   │   ├── register.json
│   │   └── account.json
├── blocks/                       # Section blocks (optional)
├── assets/
│   ├── luxe-theme.js             # Main JavaScript
│   ├── luxe-theme.css            # Main stylesheet
│   ├── google-fonts.css          # Font imports
│   └── theme.scss                # Source SCSS (if using)
├── config.yml                    # Theme configuration
└── README.md                     # Theme overview
```

---

## Theme Architecture

### Layout Flow
```
theme.liquid
├── <head>
│   ├── Meta tags (SEO)
│   ├── CSS (critical inline + theme.css)
│   ├── Schema structured data
│   └── Favicon
├── <body>
│   ├── Skip to content link
│   ├── Announcement bar (if enabled)
│   ├── Header (section)
│   ├── Main content (template-specific)
│   ├── Cart drawer (snippet)
│   ├── Wishlist drawer (snippet)
│   ├── Compare drawer (snippet)
│   ├── Quick view modal (snippet)
│   ├── Pincode checker (floating)
│   ├── Floating chat buttons
│   ├── Cookie consent banner
│   ├── Toast notifications
│   └── Footer (section)
```

### Data Flow
1. **Settings** → Theme Settings → All sections access via `settings.setting_id`
2. **Products** → Collection loop → Product card snippet
3. **Cart** → Liquid object → Cart drawer snippet
4. **Customer** → Shopify object → Account links

---

## CSS Variables

### All Available Variables

```css
/* ============================================
   CORE COLOR VARIABLES
   Set via Theme Settings > Colors
   ============================================ */

:root {
  /* Page & Text */
  --color-bg: {{ settings.color_background }};        /* #F7FAFC - Page background */
  --color-text: {{ settings.color_text }};            /* #0E1D34 - Primary text */
  --color-navy: {{ settings.color_brand_blue }};       /* #003B73 - Brand navy */
  --color-purple: {{ settings.color_accent_purple }};  /* #8A2BE2 - CTA buttons */
  --color-muted: {{ settings.color_muted }};           /* #5a6a80 - Secondary text */
  --color-border: {{ settings.color_border }};         /* #D8E1EC - Border color */
  
  /* Semantic Colors */
  --color-white: #ffffff;
  --color-black: #000000;
  --color-sale: #e74c3c;            /* Sale/red price */
  --color-success: #27ae60;         /* Success green */
  --color-warning: #f39c12;         /* Warning yellow */
  --color-error: #e74c3c;           /* Error red */
  --color-info: #3498db;           /* Info blue */
  
  /* Brand Specific */
  --color-pink: #e91e63;            /* Wishlist heart */
  --color-brand: {{ settings.color_brand_blue }};
  
  /* ============================================
   TYPOGRAPHY VARIABLES
   ============================================ */
  --font-family-base: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-heading: 'DM Sans', sans-serif;
  --font-size-base: {{ settings.font_size_base }}px;  /* Default: 15px */
  --font-size-sm: 12px;
  --font-size-xs: 10px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  --font-size-3xl: 40px;
  
  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* ============================================
   SPACING VARIABLES
   ============================================ */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  
  /* ============================================
   LAYOUT VARIABLES
   ============================================ */
  --container-width: 1400px;
  --container-width-sm: 1000px;
  --container-width-xs: 750px;
  --page-padding: 20px;
  
  /* ============================================
   BORDER & RADIUS
   ============================================ */
  --radius: 8px;
  --radius-sm: 4px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  --border-width: 1px;
  
  /* ============================================
   SHADOWS
   ============================================ */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
  --shadow-xl: 0 16px 48px rgba(0,0,0,0.15);
  
  /* ============================================
   TRANSITIONS
   ============================================ */
  --transition: 0.3s ease;
  --transition-fast: 0.15s ease;
  --transition-slow: 0.5s ease;
  
  /* ============================================
   Z-INDEX LAYERS
   ============================================ */
  --z-base: 1;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 300;
  --z-toast: 400;
  --z-tooltip: 500;
}
```

### CSS Custom Property Examples

```css
/* Button with CSS variables */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-purple);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  transition: var(--transition);
  cursor: pointer;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Card styling */
.card {
  background: var(--color-white);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--spacing-lg);
}

/* Override specific color */
.christmas-theme {
  --color-purple: #c41e3a;
  --color-brand: #c41e3a;
}
```

---

## JavaScript API

### Global Objects

```javascript
// ============================================
// LUXE CART - Cart Management
// ============================================

window.LuxeCart = {
  // Show toast notification
  showToast: function(message, duration = 3000) { },
  
  // Update cart drawer contents
  updateCart: function() { },
  
  // Open cart drawer
  openCart: function() { },
  
  // Close cart drawer
  closeCart: function() { },
  
  // Get current cart object
  getCart: function() { }
};

// Usage examples:
LuxeCart.showToast('Product added to cart!');
LuxeCart.updateCart();
LuxeCart.openCart();


// ============================================
// LUXE WISHLIST - Wishlist Management  
// ============================================

window.LuxeWishlist = {
  // Get all wishlist items
  get: function() { },
  
  // Check if product in wishlist
  has: function(productId) { },
  
  // Add to wishlist
  add: function(productId) { },
  
  // Remove from wishlist
  remove: function(productId) { },
  
  // Toggle wishlist
  toggle: function(productId) { },
  
  // Get wishlist count
  getCount: function() { }
};

// Usage examples:
var wishlist = LuxeWishlist.get();
var isInWishlist = LuxeWishlist.has(123456789);
LuxeWishlist.add(123456789);


// ============================================
// LUXE COMPARE - Product Comparison
// ============================================

window.LuxeCompare = {
  // Get compare list
  get: function() { },
  
  // Check if product in compare
  has: function(productId) { },
  
  // Add to compare
  add: function(productId, title, price, image, url) { },
  
  // Remove from compare
  remove: function(productId) { }
};

// Global functions (attached to window)
window.addToCompare(id, title, price, image, url);
window.removeFromCompare(id);
```

### Event Listeners

```javascript
// ============================================
// CUSTOM EVENTS
// ============================================

// Cart updated (after adding/removing items)
document.addEventListener('cartUpdated', function(event) {
  var cart = event.detail?.cart;
  var itemCount = cart?.item_count;
  console.log('Cart updated, items:', itemCount);
});

// Product added to cart
document.addEventListener('productAddedToCart', function(event) {
  var variantId = event.detail?.variantId;
  var quantity = event.detail?.quantity;
  console.log('Added:', variantId, 'Qty:', quantity);
});

// Wishlist updated
document.addEventListener('wishlistUpdated', function(event) {
  var items = event.detail?.items;
  console.log('Wishlist updated:', items);
});

// Quick view opened
document.addEventListener('quickViewOpened', function(event) {
  var productHandle = event.detail?.productHandle;
  console.log('Quick view opened for:', productHandle);
});

// Quick view closed
document.addEventListener('quickViewClosed', function(event) {
  console.log('Quick view closed');
});
```

### AJAX Cart Functions

```javascript
// ============================================
// ADD TO CART
// ============================================

// Simple variant add
fetch('/cart/add.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    items: [{
      id: VARIANT_ID,
      quantity: 1
    }]
  })
})
.then(response => response.json())
.then(data => {
  LuxeCart.updateCart();
  LuxeCart.showToast('Product added to cart!');
})
.catch(error => console.error('Error:', error));


// ============================================
// ADD MULTIPLE ITEMS
// ============================================

fetch('/cart/add.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    items: [
      { id: VARIANT_ID_1, quantity: 1 },
      { id: VARIANT_ID_2, quantity: 2 }
    ]
  })
})
.then(response => response.json())
.then(data => {
  LuxeCart.updateCart();
  LuxeCart.showToast('Items added to cart!');
});


// ============================================
// UPDATE CART ITEM
// ============================================

// Update quantity
fetch('/cart/change.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    line: LINE_NUMBER,
    quantity: NEW_QUANTITY
  })
})
.then(response => response.json())
.then(data => {
  LuxeCart.updateCart();
});


// ============================================
// REMOVE CART ITEM
// ============================================

fetch('/cart/change.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    line: LINE_NUMBER,
    quantity: 0
  })
})
.then(response => response.json())
.then(data => {
  LuxeCart.updateCart();
});
```

### Utility Functions

```javascript
// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format money (if using Shopify.formatMoney in JS)
if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
  var formatted = Shopify.formatMoney(1000, '{{ shop.money_format }}');
  console.log(formatted); // $10.00
}

// Debounce function
function debounce(func, wait) {
  var timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Throttle function  
function throttle(func, limit) {
  var inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Get URL parameters
function getUrlParam(name) {
  var params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Set URL parameter without reload
function setUrlParam(key, value) {
  var url = new URL(window.location);
  url.searchParams.set(key, value);
  window.history.pushState({}, '', url);
}
```

---

## Data Objects Reference

### Product Object

```liquid
{% for product in collection.products %}
  {{ product.id }}                    {# Product ID #}
  {{ product.title }}                 {# Product title #}
  {{ product.handle }}               {# URL handle #}
  {{ product.description }}          {# HTML description #}
  {{ product.description | strip_html }}  {# Plain text #}
  {{ product.vendor }}               {# Vendor name #}
  {{ product.type }}                 {# Product type #}
  {{ product.tags | join: ', ' }}   {# Tags as string #}
  {{ product.price }}                {# Price in cents #}
  {{ product.price | money }}        {# Formatted price #}
  {{ product.compare_at_price }}     {# Compare at price #}
  {{ product.featured_image }}        {# Featured image #}
  {{ product.images | size }}        {# Number of images #}
  {{ product.variants | size }}      {# Number of variants #}
  {{ product.available }}            {# Boolean #}
  {{ product.options | size }}        {# Number of options #}
  
  {# Options with values #}
  {% for option in product.options_with_values %}
    {{ option.name }}                 {# e.g., "Color" #}
    {{ option.values }}              {# Array: ["Red", "Blue"] #}
  {% endfor %}
  
  {# Variants loop #}
  {% for variant in product.variants %}
    {{ variant.id }}                  {# Variant ID #}
    {{ variant.title }}              {# e.g., "Red / Large" #}
    {{ variant.price }}              {# Price in cents #}
    {{ variant.compare_at_price }}   {# Compare at price #}
    {{ variant.available }}          {# Boolean #}
    {{ variant.inventory_quantity }}  {# Inventory count #}
    {{ variant.sku }}               {# SKU #}
    {{ variant.weight }}            {# Weight #}
    {{ variant.weight_unit }}        {# kg, g, lb, oz #}
    {{ variant.image }}              {# Variant image #}
  {% endfor %}
{% endfor %}
```

### Collection Object

```liquid
{{ collection.title }}              {# Collection title #}
{{ collection.description }}         {# Description #}
{{ collection.handle }}             {# URL handle #}
{{ collection.products | size }}    {# Product count #}
{{ collection.all_products_count }} {# Total products #}
{{ collection.url }}                {# Collection URL #}
{{ collection.image }}              {# Collection image #}

{# Paginated products #}
{% paginate collection.products by 24 %}
  {% for product in collection.products %}
    {{ product.title }}
  {% endfor %}
  {{ paginate | default_pagination }}
{% endpaginate %}
```

### Cart Object

```liquid
{{ cart.item_count }}               {# Total items #}
{{ cart.items_count }}              {# Total line items #}
{{ cart.total_price }}              {# Total in cents #}
{{ cart.total_price | money }}      {# Formatted total #}
{{ cart.subtotal_price }}           {# Subtotal in cents #}
{{ cart.total_discounts }}          {# Discount amount #}
{{ cart.all_prices_are_zero }}      {# Boolean #}
{{ cart.cart_level_discount_amounts }}  {# Array of discounts #}

{# Loop cart items #}
{% for item in cart.items %}
  {{ item.id }}                     {# Line item ID #}
  {{ item.product_id }}            {# Product ID #}
  {{ item.variant_id }}            {# Variant ID #}
  {{ item.title }}                 {# e.g., "Blue / Large" #}
  {{ item.product.title }}         {# Product title #}
  {{ item.variant.title }}          {# Variant title #}
  {{ item.quantity }}              {# Quantity #}
  {{ item.price }}                 {# Line price in cents #}
  {{ item.original_line_price }}  {# Original line price #}
  {{ item.line_level_discount_allocations }}  {# Discounts #}
  {{ item.image }}                 {# Product image #}
  {{ item.url }}                   {# Product URL #}
  {{ item.product.url }}          {# Product URL #}
  {{ item.properties }}           {# Custom properties #}
{% endfor %}
```

### Customer Object (if logged in)

```liquid
{{ customer.id }}
{{ customer.first_name }}
{{ customer.last_name }}
{{ customer.name }}
{{ customer.email }}
{{ customer.phone }}
{{ customer.accepts_marketing }}
{{ customer.created_at }}
{{ customer.tags | join: ', ' }}
{{ customer.orders_count }}
{{ customer.total_spent }}
{{ customer.default_address }}
{{ customer.addresses }}
```

---

## Adding Custom Features

### 1. Custom Section with All Setting Types

```liquid
{%- comment -%}
  My Custom Section
  Comprehensive example with all setting types
{%- endcomment -%}

<div class="my-custom-section" style="padding: {{ section.settings.padding }}px;">
  {%- if section.settings.show_heading -%}
    <h2 class="section-heading">{{ section.settings.heading }}</h2>
  {%- endif -%}
  
  {%- if section.settings.description != blank -%}
    <div class="section-description">{{ section.settings.description }}</div>
  {%- endif -%}
  
  {%- case section.settings.layout -%}
    {%- when 'grid' -%}
      <div class="products-grid">
        {%- for product in section.settings.collection.products limit: section.settings.limit -%}
          {%- render 'product-card', product: product -%}
        {%- endfor -%}
      </div>
    {%- when 'slider' -%}
      <div class="products-slider">
        {%- for product in section.settings.collection.products limit: section.settings.limit -%}
          {%- render 'product-card', product: product -%}
        {%- endfor -%}
      </div>
  {%- endcase -%}
</div>

<style>
.my-custom-section {
  background: {{ section.settings.bg_color }};
}
.section-heading {
  font-size: {{ section.settings.heading_size }}px;
  color: {{ section.settings.heading_color }};
}
</style>

{% schema %}
{
  "name": "My Custom Section",
  "class": "section-custom",
  "settings": [
    {
      "type": "header",
      "content": "Content Settings"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Featured Products"
    },
    {
      "type": "checkbox",
      "id": "show_heading",
      "label": "Show heading",
      "default": true
    },
    {
      "type": "range",
      "id": "heading_size",
      "label": "Heading size",
      "min": 20,
      "max": 60,
      "step": 2,
      "unit": "px",
      "default": 32
    },
    {
      "type": "color",
      "id": "heading_color",
      "label": "Heading color",
      "default": "#0E1D34"
    },
    {
      "type": "color",
      "id": "bg_color",
      "label": "Background color",
      "default": "#ffffff"
    },
    {
      "type": "textarea",
      "id": "description",
      "label": "Description"
    },
    {
      "type": "range",
      "id": "padding",
      "label": "Padding",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "default": 40
    },
    {
      "type": "header",
      "content": "Product Settings"
    },
    {
      "type": "collection",
      "id": "collection",
      "label": "Select Collection"
    },
    {
      "type": "range",
      "id": "limit",
      "label": "Products to show",
      "min": 4,
      "max": 24,
      "step": 2,
      "default": 8
    },
    {
      "type": "select",
      "id": "layout",
      "label": "Layout",
      "options": [
        {"value": "grid", "label": "Grid"},
        {"value": "slider", "label": "Slider"}
      ],
      "default": "grid"
    },
    {
      "type": "header",
      "content": "Advanced"
    },
    {
      "type": "link_list",
      "id": "menu",
      "label": "Navigation menu"
    },
    {
      "type": "image_picker",
      "id": "image",
      "label": "Background image"
    },
    {
      "type": "video",
      "id": "video",
      "label": "Background video"
    },
    {
      "type": "article",
      "id": "article",
      "label": "Select article"
    },
    {
      "type": "blog",
      "id": "blog",
      "label": "Select blog"
    },
    {
      "type": "product",
      "id": "product",
      "label": "Select product"
    },
    {
      "type": "page",
      "id": "page",
      "label": "Select page"
    }
  ],
  "presets": [
    {
      "name": "My Custom Section"
    }
  ]
}
{% endschema %}
```

### 2. Custom Snippet with Parameters

```liquid
{%- comment -%}
  Custom badge snippet
  Usage: {% render 'custom-badge', text: 'New', type: 'primary' %}
         {% render 'custom-badge', text: 'Sale', type: 'sale' %}
{%- endcomment -%}

<span class="badge badge--{{ type | default: 'primary' }}">
  {{ text }}
</span>

<style>
.badge {
  display: inline-block;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 4px;
}
.badge--primary { background: #003B73; color: #fff; }
.badge--sale { background: #e74c3c; color: #fff; }
.badge--new { background: #27ae60; color: #fff; }
.badge--soldout { background: #666; color: #fff; }
</style>
```

### 3. Override Template Section

```liquid
{%- comment -%}
  Custom product template
  Usage: Create templates/product.custom.json
{%- endcomment -%}

{
  "sections": {
    "main_product": {
      "type": "main-product",
      "settings": {
        "show_vendor": true,
        "show_rating": true,
        "enable_zoom": true,
        "show_share": true,
        "show_custom_badge": true
      }
    },
    "custom_feature": {
      "type": "custom-section",
      "settings": {}
    }
  },
  "order": ["main_product", "custom_feature"]
}
```

### 4. Add Custom Metafields to Product

```liquid
{%- comment -%}
  Access custom metafields
  Usage: {{ product.metafields.namespace.key }}
{%- endcomment -%}

{# Example: Custom features #}
{{ product.metafields.custom.features }}
{{ product.metafields.custom.warranty }}
{{ product.metafields.custom.care_instructions }}

{# Example: Star rating #}
{{ product.metafields.reviews.rating.value }}
{{ product.metafields.reviews.rating_count.value }}

{# Example: Age verification #}
{{ product.metafields.age.verification_required }}
```

---

## Snippet Reference

### Core Snippets

| Snippet | Purpose | Key Variables |
|---------|---------|---------------|
| `cart-drawer.liquid` | Slide-out cart | `cart` object |
| `cart-items.liquid` | Cart line items | `cart` object |
| `cookie_consent.liquid` | GDPR banner | `settings.*` |
| `localization.liquid` | Currency selector | `localization` object |
| `mega-menu.liquid` | Navigation mega menu | `link`, `blocks` |
| `pincode-checker.liquid` | Delivery checker | `settings.*` |
| `product-card.liquid` | Product card component | `product` |
| `product-compare.liquid` | Compare drawer | `settings.*` |
| `quick-view.liquid` | Quick view modal | `product` |
| `wishlist-drawer.liquid` | Wishlist drawer | `settings.*` |

### Feature Snippets

| Snippet | Purpose |
|---------|---------|
| `notify-me.liquid` | Back in stock notification |
| `cod-badge.liquid` | Cash on Delivery badge |
| `emi-calculator.liquid` | EMI calculator for India |
| `loyalty-display.liquid` | Loyalty points display |
| `chat-buttons.liquid` | WhatsApp/Telegram chat |
| `size-guide.liquid` | Size guide modal |
| `urgency-indicators.liquid` | Low stock badges |

### Icon Snippets

```liquid
{%- render 'icon-cart' -%}
{%- render 'icon-heart' -%}
{%- render 'icon-search' -%}
{%- render 'icon-account' -%}
{%- render 'icon-x' -%}
{%- render 'icon-menu' -%}
{%- render 'icon-chevron-right' -%}
{%- render 'icon-chevron-down' -%}
{%- render 'icon-arrow-right' -%}
{%- render 'icon-arrow-left' -%}
{%- render 'icon-trash' -%}
{%- render 'icon-eye' -%}
```

---

## Section Schema

### Complete Schema Reference

```json
{
  "name": "Section Name",
  "class": "section-class-name",
  "tag": "section",
  "max_blocks": 12,
  "settings": [
    // TEXT INPUT
    {
      "type": "text",
      "id": "heading",
      "label": "Heading Text",
      "default": "Default value",
      "info": "Help text shown below",
      "placeholder": "Placeholder text"
    },
    
    // TEXTAREA
    {
      "type": "textarea",
      "id": "description",
      "label": "Description",
      "default": "Default text",
      "placeholder": "Enter description..."
    },
    
    // NUMBER
    {
      "type": "number",
      "id": "quantity",
      "label": "Quantity",
      "default": 1,
      "min": 1,
      "max": 100
    },
    
    // RANGE SLIDER
    {
      "type": "range",
      "id": "limit",
      "label": "Products to show",
      "min": 4,
      "max": 24,
      "step": 2,
      "default": 8,
      "unit": "px"
    },
    
    // CHECKBOX
    {
      "type": "checkbox",
      "id": "show_title",
      "label": "Show title",
      "default": true,
      "info": "Toggle title visibility"
    },
    
    // SELECT DROPDOWN
    {
      "type": "select",
      "id": "layout",
      "label": "Layout Style",
      "options": [
        {"value": "grid", "label": "Grid"},
        {"value": "list", "label": "List"},
        {"value": "carousel", "label": "Carousel"}
      ],
      "default": "grid"
    },
    
    // RADIO BUTTONS
    {
      "type": "radio",
      "id": "alignment",
      "label": "Text alignment",
      "options": [
        {"value": "left", "label": "Left"},
        {"value": "center", "label": "Center"},
        {"value": "right", "label": "Right"}
      ],
      "default": "left"
    },
    
    // COLOR PICKER (Theme Settings only)
    {
      "type": "color",
      "id": "bg_color",
      "label": "Background color",
      "default": "#ffffff"
    },
    
    // IMAGE PICKER
    {
      "type": "image_picker",
      "id": "image",
      "label": "Background image"
    },
    
    // COLLECTION PICKER
    {
      "type": "collection",
      "id": "collection",
      "label": "Select collection"
    },
    
    // PRODUCT PICKER
    {
      "type": "product",
      "id": "product",
      "label": "Select product"
    },
    
    // BLOG PICKER
    {
      "type": "blog",
      "id": "blog",
      "label": "Select blog"
    },
    
    // ARTICLE PICKER
    {
      "type": "article",
      "id": "article",
      "label": "Select article"
    },
    
    // PAGE PICKER
    {
      "type": "page",
      "id": "page",
      "label": "Select page"
    },
    
    // LINK LIST (MENU) PICKER
    {
      "type": "link_list",
      "id": "menu",
      "label": "Navigation menu"
    },
    
    // URL INPUT
    {
      "type": "url",
      "id": "link",
      "label": "Button link"
    },
    
    // VIDEO (URL)
    {
      "type": "video",
      "id": "video",
      "label": "Background video"
    },
    
    // HEADER (Group separator - no settings)
    {
      "type": "header",
      "content": "Section Header"
    },
    
    // PARAGRAPH (Help text - no settings)
    {
      "type": "paragraph",
      "content": "Help text or description displayed as info."
    }
  ],
  "blocks": [
    {
      "type": "slide",
      "name": "Slide",
      "settings": [
        {
          "type": "image_picker",
          "id": "image",
          "label": "Slide image"
        },
        {
          "type": "text",
          "id": "heading",
          "label": "Heading"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Section Name",
      "blocks": []
    }
  ]
}
```

---

## Template Customization

### Creating Custom Product Template

```json
// templates/product.custom.json
{
  "sections": {
    "main": {
      "type": "main-product",
      "settings": {
        "show_vendor": true,
        "show_rating": true,
        "gallery_layout": "stacked",
        "enable_zoom": true
      }
    },
    "upsells": {
      "type": "featured-collection",
      "settings": {
        "title": "Complete the Look"
      }
    },
    "recommendations": {
      "type": "product-recommendations",
      "settings": {
        "products_to_show": 8
      }
    }
  },
  "order": ["main", "upsells", "recommendations"]
}
```

### Collection Template

```json
// templates/collection.custom.json
{
  "sections": {
    "hero": {
      "type": "image-with-text",
      "settings": {}
    },
    "main": {
      "type": "main-collection",
      "settings": {
        "products_per_row": 4,
        "products_per_page": 24,
        "show_filters": true,
        "show_sort": true
      }
    }
  },
  "order": ["hero", "main"]
}
```

---


## App Integration

### Judge.me Reviews

1. Install Judge.me from Shopify App Store
2. Widget automatically appears on product pages
3. Use shortcodes in descriptions for custom placement

### Loox Reviews

1. Install Loox app
2. Add App ID in Theme Settings → Reviews Apps → Loox Settings
3. Widget appears automatically

### Yotpo Reviews

1. Install Yotpo app
2. Add App Key in Theme Settings → Reviews Apps → Yotpo Settings

### Klaviyo Email

1. Install Klaviyo app
2. Add Klaviyo tracking code via Custom Code section
3. Add signup form via Newsletter section

### Other Common Integrations

```liquid
{% comment %} Recharge Subscriptions - Add to product form {% endcomment %}
{%- if product.metafields.subscriptions.subscription_id -%}
  {% render 'subscription-product' %}
{%- endif -%}

{% comment %} Smile.io Rewards - Points on cart {% endcomment %}
{%- if settings.smile_app_enabled -%}
  {% render 'smile-points-balance' %}
{%- endif -%}

{% comment %} Back in Stock - Notify form {% endcomment %}
{%- render 'notify-me', product: product, variant: current_variant -%}
```

---

## Performance Optimization

### Image Optimization

```liquid
{# Lazy loading #}
{{ product.featured_image | image_url: width: 400 | image_tag: loading: 'lazy' }}

{# Responsive images with srcset #}
{{ product.featured_image | image_url: width: 400 | image_tag: 
  srcset: 
    product.featured_image | image_url: width: 400 | append: ' 400w,' | 
    product.featured_image | image_url: width: 600 | append: ' 600w,' |
    product.featured_image | image_url: width: 800 | append: ' 800w'
}}

{# Explicit width/height to prevent layout shift #}
{{ product.featured_image | image_url: width: 400 | image_tag: 
  width: 400, 
  height: 400,
  loading: 'lazy',
  decoding: 'async'
}}
```

### Liquid Optimization

```liquid
{# Assign once, use multiple times #}
{%- assign products = collection.products -%}
{%- assign limit = section.settings.limit -%}

{%- for product in products limit: limit -%}
  {{ product.title }}
{%- endfor -%}

{# Use [limit: X] instead of slicing in loop #}

{# Cache expensive operations #}
{%- capture cache_key -%}products_{{ collection.id }}_{{ current_page }}{%- endcapture -%}
```

### JavaScript Optimization

```javascript
// Defer non-critical JS
<script src="{{ 'optional.js' | asset_url }}" defer></script>

// Use requestAnimationFrame for animations
function animate() {
  requestAnimationFrame(animate);
}

// Debounce scroll/resize handlers
window.addEventListener('scroll', debounce(function() {
  // Scroll handler
}, 100));
```

---

## SEO & Meta Tags

### Structured Data (JSON-LD)

```liquid
{%- comment -%} Product Schema {%- endcomment -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": {{ product.title | json }},
  "description": {{ product.description | strip_html | json }},
  "image": [
    {{ product.featured_image | image_url: width: 1024 | prepend: 'https:' | json }}
  ],
  "brand": {
    "@type": "Brand",
    "name": {{ product.vendor | json }}
  },
  "offers": {
    "@type": "Offer",
    "url": {{ shop.url | append: product.url | json }},
    "priceCurrency": {{ cart.currency.iso_code | json }},
    "price": {{ product.price | money_without_currency | json }},
    "availability": {{ product.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' | json }}
  }
}
</script>
```

### Meta Tags

```liquid
<meta name="description" content="{{ page_description | escape }}">
<meta property="og:title" content="{{ page_title | escape }}">
<meta property="og:description" content="{{ page_description | escape }}">
<meta property="og:image" content="{{ product.featured_image | image_url: width: 1200 | prepend: 'https:' }}">
```

---

## Accessibility

### ARIA Attributes

```liquid
{# Navigation #}
<nav aria-label="Primary navigation">
  <ul role="list">
    <li><a href="/" aria-current="page">Home</a></li>
  </ul>
</nav>

{# Buttons #}
<button aria-label="Close menu">
<button aria-expanded="false" aria-controls="menu">Menu</button>

{# Forms #}
<label for="email">Email</label>
<input id="email" type="email" required aria-required="true">

{# Live regions #}
<div role="status" aria-live="polite">Product added to cart</div>
<div role="alert" aria-live="assertive">Error message</div>
```

### Skip Links

```liquid
<a href="#MainContent" class="skip-to-content">
  Skip to content
</a>

<main id="MainContent" tabindex="-1">
  {{ content_for_layout }}
</main>
```

---

## Troubleshooting

### Common Issues & Solutions

**1. Cart not updating**
- Check if `luxe-theme.js` loads correctly
- Verify no JavaScript errors in console
- Ensure cart object exists

**2. Styles not applying**
- Clear theme cache in Shopify admin
- Check CSS specificity
- Verify CSS variables defined

**3. Lazy images not loading**
- Ensure `loading: 'lazy'` attribute present
- Check browser console for errors

**4. Sections not appearing**
- Verify schema has `presets` defined
- Check section file exists in `/sections/`
- Ensure valid JSON in schema

**5. Liquid rendering errors**
- Check for missing variables
- Verify filter syntax
- Use `| json` for debugging

**6. Mobile menu not working**
- Check JavaScript loads on mobile
- Verify menu link list selected in settings

---

## Changelog

### Version 1.0.0 (May 2026)
- Initial release
- Shopify 2.0 compatible
- All sections and features implemented
- Performance optimized
- Developer documentation complete