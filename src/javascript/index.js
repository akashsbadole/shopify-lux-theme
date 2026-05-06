// Luxe Theme JavaScript

/**
 * Luxe Theme JavaScript Core
 *
 * This file handles the primary interactive components of the Luxe Shopify Theme.
 */

document.addEventListener('DOMContentLoaded', () => {
  try {
    initMobileMenu();
    initQuickView();
    initCartDrawer();
    initQuantitySelectors();
    initMarketingFeatures();
  } catch (error) {
    console.error('Luxe Theme: Initialization failed', error);
  }
});

/**
 * Mobile Navigation Menu
 * Handles toggle of hamburger menu and overlay
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }
}

/**
 * Quick View Modal
 * Fetches product data and opens the quick view modal
 */
function initQuickView() {
  const quickViewBtns = document.querySelectorAll('.quick-view-btn');

  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = btn.dataset.productId;
      openQuickView(productId);
    });
  });
}

function openQuickView(productId) {
  console.log('Opening quick view for product:', productId);
}

/**
 * Cart Drawer Toggle
 * Handles opening and closing of the AJAX cart drawer
 */
function initCartDrawer() {
  const cartToggle = document.querySelector('.cart-toggle');
  const cartDrawer = document.querySelector('.cart-drawer');

  if (cartToggle && cartDrawer) {
    cartToggle.addEventListener('click', (e) => {
      e.preventDefault();
      cartDrawer.classList.toggle('active');
    });

    const closeBtn = cartDrawer.querySelector('.close-cart');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        cartDrawer.classList.remove('active');
      });
    }
  }
}

/**
 * Quantity Selectors
 * Handles increment/decrement of product quantity inputs
 */
function initQuantitySelectors() {
  const quantityBtns = document.querySelectorAll('.quantity-btn');

  quantityBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const input = btn.parentElement.querySelector('.quantity-input');
      let value = parseInt(input.value);

      if (btn.classList.contains('plus')) {
        value++;
      } else if (btn.classList.contains('minus') && value > 1) {
        value--;
      }

      input.value = value;
    });
  });
}

// Newsletter Form Handler
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    console.log('Newsletter signup:', email);
  });
}

// Size Guide Modal
const sizeGuideLinks = document.querySelectorAll('.size-guide-link');
const sizeGuideModal = document.querySelector('.size-guide-modal');

if (sizeGuideLinks.length && sizeGuideModal) {
  sizeGuideLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      sizeGuideModal.classList.add('active');
    });
  });

  const closeBtn = sizeGuideModal.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    sizeGuideModal.classList.remove('active');
  });
}

/**
 * Marketing & Conversion Features
 */
function initMarketingFeatures() {
  trackRecentlyViewed();
  renderRecentlyViewed();
  initCartUpsell();
  initStickyAtc();
}

/**
 * Sticky Add to Cart
 * Appears when main ATC button scrolls out of view
 */
function initStickyAtc() {
  window.addEventListener('scroll', () => {
    const stickyAtc = document.getElementById('StickyATC');
    const mainAtc = document.getElementById('AddToCartBtn');
    const currentScroll = window.pageYOffset;

    if (mainAtc) {
      const mainAtcRect = mainAtc.getBoundingClientRect();
      if (mainAtcRect.bottom < 0 && currentScroll > 300) {
        stickyAtc?.classList.add('active');
        stickyAtc?.setAttribute('aria-hidden', 'false');
      } else {
        stickyAtc?.classList.remove('active');
        stickyAtc?.setAttribute('aria-hidden', 'true');
      }
    }
  });
}

/**
 * Recently Viewed Logic
 */
function trackRecentlyViewed() {
  const product = window.__luxe_track_product__;
  if (!product) return;

  let recentlyViewed = JSON.parse(localStorage.getItem('luxe_recently_viewed') || '[]');
  recentlyViewed = recentlyViewed.filter(p => p.id !== product.id);
  recentlyViewed.unshift(product);
  recentlyViewed = recentlyViewed.slice(0, 10);
  localStorage.setItem('luxe_recently_viewed', JSON.stringify(recentlyViewed));
}

function renderRecentlyViewed() {
  const container = document.getElementById('RecentlyViewedTrack');
  const section = document.getElementById('RecentlyViewed');
  if (!container || !section) return;

  const products = JSON.parse(localStorage.getItem('luxe_recently_viewed') || '[]');
  const currentId = section.dataset.productId;
  const filteredProducts = products.filter(p => p.id != currentId).slice(0, section.dataset.limit || 6);

  if (filteredProducts.length > 0) {
    section.style.display = 'block';
    container.innerHTML = filteredProducts.map(p => `
      <div class="product-card product-card--mini">
        <a href="${p.url}" class="product-card__link">
          <img src="${p.image}" alt="${p.title}" class="product-card__img" loading="lazy">
          <div class="product-card__info">
            <h4 class="product-card__title">${p.title}</h4>
            <p class="product-card__price">$${(p.price / 100).toFixed(2)}</p>
          </div>
        </a>
      </div>
    `).join('');
  }
}

/**
 * AJAX Cart Upsell
 */
function initCartUpsell() {
  const cartUpsellContainer = document.getElementById('CartUpsellItems');
  const cartUpsellSection = document.getElementById('CartUpsell');
  if (!cartUpsellContainer || !cartUpsellSection) return;

  fetch(window.Shopify.routes.root + 'recommendations/products.json?product_id=' + (window.__luxe_track_product__?.id || '') + '&limit=3')
    .then(res => res.json())
    .then(data => {
      if (data.products && data.products.length > 0) {
        cartUpsellSection.style.display = 'block';
        cartUpsellContainer.innerHTML = data.products.map(p => `
          <div class="cart-upsell-item">
            <img src="${p.featured_image}" alt="${p.title}" class="cart-upsell-item__img" loading="lazy">
            <div class="cart-upsell-item__info">
              <h4 class="cart-upsell-item__title">${p.title}</h4>
              <p class="cart-upsell-item__price">$${(p.price / 100).toFixed(2)}</p>
            </div>
            <button class="cart-upsell-item__btn" onclick="window.LuxeCart.addItem(${p.variants[0].id}, 1).then(() => window.LuxeCart.fetchCart().then(doc => { document.getElementById('CartDrawerBody').innerHTML = doc.getElementById('CartAjaxContent').innerHTML; }))">Add</button>
          </div>
        `).join('');
      }
    })
    .catch(() => {
      cartUpsellSection.style.display = 'none';
    });
}