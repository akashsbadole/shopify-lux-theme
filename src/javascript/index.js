// Luxe Theme JavaScript

document.addEventListener('DOMContentLoaded', () => {
  console.log('Luxe Theme Loaded');

  initMobileMenu();
  initQuickView();
  initCartDrawer();
  initQuantitySelectors();
});

// ============================================
// MOBILE MENU
// ============================================
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

// ============================================
// QUICK VIEW
// ============================================
function initQuickView() {
  const quickViewBtns = document.querySelectorAll('.quick-view-btn');

  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const handle = btn.dataset.productHandle;
      openQuickView(handle);
    });
  });

  // Modal close handlers
  const modal = document.getElementById('QuickViewModal');
  const overlay = document.getElementById('QuickViewOverlay');
  const closeBtn = document.getElementById('QuickViewClose');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeQuickView());
  }

  if (overlay) {
    overlay.addEventListener('click', () => closeQuickView());
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeQuickView();
    }
  });
}

async function openQuickView(productHandle) {
  if (!productHandle) return;

  const modal = document.getElementById('QuickViewModal');
  const overlay = document.getElementById('QuickViewOverlay');
  const body = document.getElementById('QuickViewBody');

  if (!modal || !overlay || !body) return;

  // Show loading state
  body.innerHTML = `
    <div class="qv-modal__loading" id="QuickViewLoading">
      <div class="qv-spinner">
        <div class="qv-spinner__ring"></div>
      </div>
      <p>Loading product...</p>
    </div>
  `;

  // Open modal immediately (show loading)
  modal.classList.add('open');
  overlay.classList.add('open');
  document.body.classList.add('quick-view-open');

  try {
    // Fetch product section via Shopify Section Rendering API
    const response = await fetch(
      window.Shopify.routes.root + '?section_id=quick-view&product_handle=' + encodeURIComponent(productHandle)
    );

    if (!response.ok) throw new Error('Failed to load product');

    const html = await response.text();

    // Parse returned HTML to extract .qv-product content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const qvProduct = doc.querySelector('.qv-product');

    if (qvProduct) {
      body.innerHTML = '';
      body.appendChild(qvProduct.cloneNode(true));

      // Initialize variant selection and option buttons
      initQuickViewOptions();

      // Bind Add to Cart
      const atcBtn = document.getElementById('QVAddToCart');
      if (atcBtn) {
         atcBtn.onclick = () => {
           const variantId = atcBtn.dataset.variantId;
           const qty = parseInt(document.getElementById('QVQty')?.value || '1');
           if (window.LuxeCart && variantId) {
             window.LuxeCart.addItem(variantId, qty).then(() => {
               window.LuxeCart.fetchCart().then(() => {
                 window.LuxeCart.showToast('Product added to cart!');
                 closeQuickView();
               });
             });
           }
         };
      }

      // Bind Wishlist
      const wishlistBtn = document.getElementById('QVWishlist');
      if (wishlistBtn) {
        wishlistBtn.onclick = () => {
          const productId = wishlistBtn.dataset.productId;
          // TODO: implement wishlist
          console.log('Add to wishlist:', productId);
        };
      }

      // Quantity controls
      const qtyInput = document.getElementById('QVQty');
      const minusBtn = body.querySelector('[data-action="decrease"]');
      const plusBtn = body.querySelector('[data-action="increase"]');

      if (minusBtn && qtyInput) {
        minusBtn.onclick = () => {
          const val = parseInt(qtyInput.value) || 1;
          if (val > 1) qtyInput.value = val - 1;
        };
      }
      if (plusBtn && qtyInput) {
        plusBtn.onclick = () => {
          const val = parseInt(qtyInput.value) || 1;
          qtyInput.value = val + 1;
        };
      }

      // Dispatch event
      document.dispatchEvent(new CustomEvent('quickViewOpened', {
        detail: { productHandle, productId: qvProduct.dataset.productId }
      }));
    } else {
      body.innerHTML = '<p>Product not found.</p>';
    }
  } catch (err) {
    console.error('Quick view error:', err);
    body.innerHTML = '<p>Failed to load product.</p>';
  }
}

function closeQuickView() {
  const modal = document.getElementById('QuickViewModal');
  const overlay = document.getElementById('QuickViewOverlay');

  if (modal) modal.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.body.classList.remove('quick-view-open');

  document.dispatchEvent(new CustomEvent('quickViewClosed'));
}

// Initialize option selection (radio-like behavior)
function initQuickViewOptions() {
  const optionButtons = document.querySelectorAll('#QuickViewBody .option__btn');
  optionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const optionIndex = btn.dataset.optionIndex;
      const siblings = document.querySelectorAll(`#QuickViewBody .option__btn[data-option-index="${optionIndex}"]`);
      siblings.forEach(sib => sib.classList.remove('active'));
      btn.classList.add('active');

      // Could also change variant if you implement variant mapping; placeholder for now
    });
  });
}

// ============================================
// COMPARE
// ============================================
window.LuxeCompare = (function() {
  const STORAGE_KEY = 'luxe_compare_list';
  let compareItems = [];

  // Load from localStorage
  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) compareItems = JSON.parse(saved);
    } catch (e) {
      compareItems = [];
    }
  }

   // Save to localStorage
   function save() {
     try {
       localStorage.setItem(STORAGE_KEY, JSON.stringify(compareItems));
     } catch (e) {
       // Silently ignore storage errors
     }
   }

  // Update badge count
  function updateBadge() {
    const badge = document.getElementById('CompareBadge');
    if (badge) {
      badge.textContent = compareItems.length;
      badge.style.display = compareItems.length > 0 ? 'inline' : 'none';
    }
  }

  // Render drawer content
  function renderDrawer() {
    const container = document.getElementById('CompareProducts');
    const emptyMsg = document.getElementById('CompareEmpty');
    const footer = document.getElementById('CompareFooter');

    if (!container) return;

    if (compareItems.length === 0) {
      container.innerHTML = '';
      if (emptyMsg) emptyMsg.style.display = 'block';
      if (footer) footer.hidden = true;
    } else {
      if (emptyMsg) emptyMsg.style.display = 'none';
      if (footer) footer.hidden = false;

      container.innerHTML = compareItems.map(item => `
        <div class="compare-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.title}" class="compare-item__img">
          <div class="compare-item__info">
            <a href="${item.url}" class="compare-item__title">${item.title}</a>
            <div class="compare-item__price">${item.price}</div>
          </div>
          <button class="compare-item__remove" onclick="window.LuxeCompare.remove(${item.id})" aria-label="Remove from compare">×</button>
        </div>
      `).join('');
    }

    updateBadge();
  }

  // Open drawer
  function openDrawer() {
    const drawer = document.getElementById('CompareDrawer');
    const overlay = document.getElementById('CompareOverlay');
    if (drawer && overlay) {
      renderDrawer();
      drawer.classList.add('active');
      overlay.classList.add('active');
    }
  }

  // Close drawer
  function closeDrawer() {
    const drawer = document.getElementById('CompareDrawer');
    const overlay = document.getElementById('CompareOverlay');
    if (drawer && overlay) {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
    }
  }

  // Initialize event listeners
  function initListeners() {
    // Compare toggle in header
    const toggleBtn = document.getElementById('CompareToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (document.getElementById('CompareDrawer').classList.contains('active')) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
    }

    // Close drawer button
    const closeBtn = document.getElementById('CompareDrawerClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeDrawer);
    }

    // Overlay click closes drawer
    const overlay = document.getElementById('CompareOverlay');
    if (overlay) {
      overlay.addEventListener('click', closeDrawer);
    }

    // Clear all button
    const clearBtn = document.getElementById('CompareClear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        compareItems = [];
        save();
        renderDrawer();
      });
    }

    // View Full Comparison button (placeholder)
    const viewBtn = document.getElementById('CompareViewBtn');
    if (viewBtn) {
      viewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Could link to a dedicated compare page; for now show placeholder
        if (window.LuxeCart) {
          window.LuxeCart.showToast('Compare page coming soon!');
        }
      });
    }

    // Delegated event for compare buttons on product cards
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('.product-card__compare-btn');
      if (btn) {
        e.preventDefault();
        const id = parseInt(btn.dataset.compareId);
        const title = btn.dataset.productTitle || '';
        const price = btn.dataset.productPrice || '';
        const image = btn.dataset.productImage || '';
        const url = btn.dataset.productUrl || '';
        toggle(id, { id, title, price, image, url });
      }
    });
  }

  // Public API
  function get() {
    return [...compareItems];
  }

  function has(id) {
    return compareItems.some(item => item.id === id);
  }

  function add(id, title, price, image, url) {
    if (!has(id)) {
      compareItems.push({ id, title, price, image, url });
      save();
      renderDrawer();
      dispatchUpdate();
    }
  }

  function remove(id) {
    compareItems = compareItems.filter(item => item.id !== id);
    save();
    renderDrawer();
    dispatchUpdate();
  }

  function clear() {
    compareItems = [];
    save();
    renderDrawer();
    dispatchUpdate();
  }

  function toggle(id, data) {
    if (has(id)) {
      remove(id);
    } else {
      add(id, data.title, data.price, data.image, data.url);
    }
  }

  function dispatchUpdate() {
    document.dispatchEvent(new CustomEvent('compareUpdated', {
      detail: { items: get(), count: compareItems.length }
    }));
  }

  // Init
  load();
  initListeners();
  updateBadge();

  // Expose public API
  return {
    get,
    has,
    add,
    remove,
    clear,
    toggle
  };
})();

// ============================================
// CART DRAWER
// ============================================
function initCartDrawer() {
  const cartToggle = document.querySelector('#CartDrawerToggle, .cart-toggle');
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

// ============================================
// QUANTITY SELECTORS
// ============================================
function initQuantitySelectors() {
  const quantityBtns = document.querySelectorAll('.quantity-btn');

  quantityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
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

  // Cart page quantity controls
  initCartQuantitySelectors();
}

function initCartQuantitySelectors() {
  const cartQtyBtns = document.querySelectorAll('.cart-item__qty-btn');

  cartQtyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const input = btn.parentElement.querySelector('.cart-item__qty-input');
      if (!input) return;

      let value = parseInt(input.value) || 1;

      if (btn.getAttribute('data-action') === 'increase') {
        value++;
      } else if (btn.getAttribute('data-action') === 'decrease' && value > 0) {
        value--;
      }

      input.value = value;

      // Auto-submit cart form if on cart page
      const cartForm = document.querySelector('.cart-form');
      if (cartForm) {
        cartForm.requestSubmit();
      }
    });
  });
}

// ============================================
// NEWSLETTER FORM
// ============================================
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    console.log('Newsletter signup:', email);
  });
}

// ============================================
// SIZE GUIDE MODAL
// ============================================
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
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sizeGuideModal.classList.remove('active');
    });
  }
}

// ============================================
// STICKY ADD TO CART
// ============================================
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const stickyAtc = document.querySelector('.sticky-atc');
  const currentScroll = window.pageYOffset;

  if (currentScroll > 300) {
    stickyAtc?.classList.add('visible');
  } else {
    stickyAtc?.classList.remove('visible');
  }

  lastScroll = currentScroll;
});
