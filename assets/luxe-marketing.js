/**
 * Luxe Theme - Marketing & Conversion Features
 * Supplementary JS for Recently Viewed and Cart Upsells
 */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    initRecentlyViewedTracker();
    renderRecentlyViewedSection();
    initCartUpsell();
  });

  // Track product view for Recently Viewed
  function initRecentlyViewedTracker() {
    const product = window.__luxe_track_product__;
    if (!product) return;

    let recentlyViewed = JSON.parse(localStorage.getItem('luxe_recently_viewed') || '[]');
    recentlyViewed = recentlyViewed.filter(p => p.id !== product.id);
    recentlyViewed.unshift(product);
    recentlyViewed = recentlyViewed.slice(0, 10);
    localStorage.setItem('luxe_recently_viewed', JSON.stringify(recentlyViewed));
  }

  // Render the Recently Viewed section
  function renderRecentlyViewedSection() {
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

  // Cart Drawer Upsells
  function initCartUpsell() {
    const cartUpsellContainer = document.getElementById('CartUpsellItems');
    const cartUpsellSection = document.getElementById('CartUpsell');
    if (!cartUpsellContainer || !cartUpsellSection) return;

    // Use current product or fallback for recommendations
    const productId = window.__luxe_track_product__?.id || '';

    fetch(window.Shopify.routes.root + 'recommendations/products.json?product_id=' + productId + '&limit=3')
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

})();
