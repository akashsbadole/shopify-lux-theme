# Luxe Shopify Theme

A premium Shopify theme with modern design, featuring product customization, quick view, mega menu, and conversion-optimized components.

## Features

- **Product Page**: Quick view, size guide, urgency indicators, stock notification
- **Cart**: Sticky add-to-cart, cart drawer, quantity controls
- **Navigation**: Mega menu, mobile hamburger menu
- **Collections**: Filter sidebar, quick add, product grid
- **Customer**: Login, register, account pages
- **Trust Elements**: Trust bar, promo banners, flash sale timer

## Prerequisites

- Node.js 18+
- Shopify CLI (`npm install -g @shopify/cli`)
- Shopify Partner account or store access

## Quick Start

1. Follow the detailed [Deployment Guide](./DEPLOYMENT-GUIDE.md) to connect to Shopify
2. Update `config.yml` with your store credentials
3. Run `npm run push` to upload the theme

## Installation

```bash
npm install
```

## Configuration

Edit `config.yml` with your store details:

```yaml
development:
  store: your-store.myshopify.com
  password: your-shopify-access-token
  theme_id: your-theme-id
```

Get your access token from Shopify Admin > Settings > Apps and sales channels > Develop apps.

## Development

```bash
npm run dev
```

Watches for file changes and syncs to your development theme.

## Deployment

```bash
npm run push     # Upload to Shopify
npm run deploy   # Deploy theme
npm run pull     # Pull from Shopify
```

## Project Structure

```
luxe-theme/
├── assets/           # Compiled CSS & JS
├── config/           # Shopify settings
├── layout/           # theme.liquid
├── locales/          # Translation files
├── sections/         # Theme sections
├── snippets/         # Reusable code snippets
├── templates/        # Page templates
├── src/              # Source files (dev)
│   ├── javascript/
│   └── styles/
├── config.yml        # Shopify CLI config
├── package.json      # Dependencies
└── webpack.config.js # Build config
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build assets |
| `npm run watch` | Watch for changes |
| `npm run push` | Push theme to Shopify |
| `npm run pull` | Pull theme from Shopify |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT