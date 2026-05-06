/**
 * LUXE Theme JavaScript
 * Blue & Purple · Conversion-First · Online Store 2.0
 */

(function() {
  'use strict';

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Luxe Theme Loaded');

    // Initialize all modules
    initMobileNav();
    initCartDrawer();
    initQuickView();
    initQuantityButtons();
    initNewsletterForm();
    initSizeGuide();
    initStickyATC();
    initCollectionFilters();
    initProductOptions();
    initRecentlyViewed();
    initWishlist();
    initWishlistButtons();
    initCompareDrawer();
    initScrollToTop();
    initPredictiveSearch();
  });

  // ─── MOBILE NAVIGATION ───
  function initMobileNav() {
    var menuToggle = document.getElementById('MobileMenuToggle');
    var mobileMenu = document.getElementById('MobileMenuDrawer');
    var menuClose = document.getElementById('MobileMenuClose');
    var menuOverlay = document.getElementById('MobileMenuOverlay');
    
    function openMobileMenu() {
      if (mobileMenu) {
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.classList.add('mobile-menu-open');
      }
    }
    
    function closeMobileMenu() {
      if (mobileMenu) {
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('mobile-menu-open');
      }
    }
    
    if (menuToggle) {
      menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        if (mobileMenu && mobileMenu.getAttribute('aria-hidden') === 'true') {
          openMobileMenu();
        } else {
          closeMobileMenu();
        }
      });
    }
    
    if (menuClose) {
      menuClose.addEventListener('click', closeMobileMenu);
    }
    
    if (menuOverlay) {
      menuOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Close on escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu && mobileMenu.getAttribute('aria-hidden') === 'false') {
        closeMobileMenu();
      }
    });
  }

  // ─── CART DRAWER WITH AJAX ───
  function initCartDrawer() {
    var cartToggle = document.getElementById('CartDrawerToggle');
    var cartDrawer = document.getElementById('CartDrawer');
    var cartOverlay = document.getElementById('CartOverlay');
    var cartClose = document.getElementById('CartDrawerClose');

    // Ensure loading state is hidden on initialization
    var loading = document.getElementById('CartLoading');
    if (loading) {
      loading.style.display = 'none';
    }

    // Open/close cart
    if (cartToggle && cartDrawer) {
      cartToggle.addEventListener('click', function(e) {
        e.preventDefault();
        if (window.LuxeCart) {
          // Ensure loading state is hidden when opening cart
          var loading = document.getElementById('CartLoading');
          if (loading) {
            loading.style.display = 'none';
          }
          window.LuxeCart.toggle();
        }
      });
    }

    // Close on overlay click
    if (cartOverlay) {
      cartOverlay.addEventListener('click', function() {
        if (window.LuxeCart) window.LuxeCart.close();
      });
    }

    // Close button
    if (cartClose) {
      cartClose.addEventListener('click', function() {
        if (window.LuxeCart) window.LuxeCart.close();
      });
    }

    // Close on escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && cartDrawer && cartDrawer.style.display === 'flex') {
        if (window.LuxeCart) window.LuxeCart.close();
      }
    });

    // Quantity buttons with AJAX
    initCartQuantityButtons();

    // Remove buttons with AJAX
    initCartRemoveButtons();

    // Listen for cart updates from other components
    window.addEventListener('cart:updated', function(e) {
      updateCartCount(e.detail.itemCount);
    });
  }

  function initCartQuantityButtons() {
    var qtyBtns = document.querySelectorAll('.cart-item__qty-btn');
    
    qtyBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        var line = parseInt(this.dataset.line);
        var action = this.dataset.action;
        var qtyEl = document.querySelector('.cart-item__qty-val[data-line="' + line + '"]');
        var currentQty = parseInt(qtyEl ? qtyEl.textContent : 1);
        var newQty = action === 'increase' ? currentQty + 1 : Math.max(1, currentQty - 1);

        if (window.LuxeCart) {
          // Show loading
          setLoading(true);
          
          window.LuxeCart.updateQuantity(line, newQty)
            .then(function(cart) {
              return window.LuxeCart.fetchCart();
            })
            .then(function(doc) {
              updateCartContent(doc);
              setLoading(false);
              window.LuxeCart.showToast(newQty > currentQty ? 'Added to cart' : 'Updated quantity');
            })
            .catch(function(err) {
              console.error('Cart update error:', err);
              setLoading(false);
              window.LuxeCart.showToast('Error updating cart', 'error');
            });
        }
      });
    });
  }

  function initCartRemoveButtons() {
    var removeBtns = document.querySelectorAll('.cart-item__remove');
    
    removeBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        var line = parseInt(this.dataset.line);
        
        if (window.LuxeCart) {
          setLoading(true);
          
          window.LuxeCart.removeItem(line)
            .then(function(cart) {
              return window.LuxeCart.fetchCart();
            })
            .then(function(doc) {
              updateCartContent(doc);
              setLoading(false);
              window.LuxeCart.showToast('Item removed');
            })
            .catch(function(err) {
              console.error('Cart remove error:', err);
              setLoading(false);
              window.LuxeCart.showToast('Error removing item', 'error');
            });
        }
      });
    });
  }

  function updateCartContent(doc) {
    var drawerBody = document.getElementById('CartDrawerBody');
    var cartAjax = doc.getElementById('CartAjaxContent');
    
    if (drawerBody && cartAjax) {
      // Replace cart items
      var itemsList = cartAjax.querySelector('#CartItemsList');
      var footer = cartAjax.querySelector('.cart-drawer__footer');
      var empty = cartAjax.querySelector('#CartEmpty');
      
      // Clear and update body
      drawerBody.innerHTML = '';
      
      if (itemsList) {
        drawerBody.appendChild(itemsList);
      }
      
      if (footer) {
        drawerBody.appendChild(footer);
      }
      
      if (empty) {
        drawerBody.appendChild(empty);
      }

      // Re-initialize quantity buttons
      initCartQuantityButtons();
      initCartRemoveButtons();
      
      // Update cart count in header
      var itemCount = doc.querySelector('#CartItemCount');
      if (itemCount) {
        var headerCount = document.querySelector('.cart-toggle .cart-count');
        if (headerCount) headerCount.textContent = itemCount.textContent;
      }
    }
  }

  function updateCartCount(count) {
    var headerCount = document.querySelector('.cart-toggle .cart-count');
    var drawerCount = document.getElementById('CartItemCount');
    
    if (headerCount) headerCount.textContent = '(' + count + ')';
    if (drawerCount) drawerCount.textContent = '(' + count + ')';
  }

  function setLoading(isLoading) {
    var loading = document.getElementById('CartLoading');
    if (loading) {
      loading.style.display = isLoading ? 'flex' : 'none';
    }
  }

  // ─── QUICK VIEW MODAL ───
  function initQuickView() {
    var quickViewBtns = document.querySelectorAll('.quick-view-btn');
    
    quickViewBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        var productId = this.dataset.productId;
        openQuickView(productId);
      });
    });

    // Close quick view
    var qvClose = document.getElementById('QuickViewClose');
    var qvOverlay = document.getElementById('QuickViewOverlay');
    
    if (qvClose) {
      qvClose.addEventListener('click', closeQuickView);
    }
    if (qvOverlay) {
      qvOverlay.addEventListener('click', closeQuickView);
    }
  }

  function openQuickView(productId) {
    var modal = document.getElementById('QuickViewModal');
    var body = document.getElementById('QuickViewBody');
    var overlay = document.getElementById('QuickViewOverlay');
    
    if (!modal || !body || !overlay) return;

    // Show loading
    modal.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('quick-view-open');

    // Fetch product via AJAX
    var url = '/products/' + productId + '?view=quick-view';
    
    fetch(url)
      .then(function(response) { return response.text(); })
      .then(function(html) {
        body.innerHTML = html;
        initQuickViewOptions();
      })
      .catch(function(err) {
        console.error('Quick view error:', err);
        body.innerHTML = '<p>Error loading product. Please try again.</p>';
      });
  }

  function closeQuickView() {
    var modal = document.getElementById('QuickViewModal');
    var overlay = document.getElementById('QuickViewOverlay');
    
    if (modal) modal.setAttribute('aria-hidden', 'true');
    if (overlay) overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('quick-view-open');
  }

  function initQuickViewOptions() {
    // Quick view variant selector
    var qvOptions = document.querySelectorAll('#QuickViewBody [data-option-index]');
    
    qvOptions.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = this.dataset.optionIndex;
        var val = this.dataset.value;
        
        // Update active state
        var siblings = document.querySelectorAll('#QuickViewBody [data-option-index="' + idx + '"]');
        siblings.forEach(function(s) { s.classList.remove('active'); });
        this.classList.add('active');
        
        // Update selected option display
        var label = document.querySelector('#QVOptions .option-selected');
        if (label) label.textContent = val;
      });
    });
  }

  // ─── QUANTITY BUTTONS ───
  function initQuantityButtons() {
    var qtyBtns = document.querySelectorAll('.quantity-btn, .main-product__qty-btn');
    
    qtyBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        var input = this.parentElement.querySelector('input[type="number"], .quantity-input, .main-product__qty-input');
        if (!input) return;
        
        var current = parseInt(input.value) || 1;
        var isPlus = this.classList.contains('plus') || this.dataset.action === 'increase';
        var newVal = isPlus ? current + 1 : Math.max(1, current - 1);
        
        input.value = newVal;
        
        // Trigger custom event
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  }

  // ─── NEWSLETTER FORM ───
  function initNewsletterForm() {
    var form = document.querySelector('.newsletter-form');
    
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var email = form.querySelector('input[type="email"]').value;
        var formData = new FormData();
        formData.append('email', email);
        formData.append('form_type', 'customer');
        
        fetch(window.Shopify.routes.root + 'contact', {
          method: 'POST',
          body: formData,
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
        .then(function(response) {
          if (response.ok) {
            form.innerHTML = '<p class="newsletter-success">Thanks for subscribing!</p>';
          }
        });
      });
    }
  }

  // ─── SIZE GUIDE MODAL ───
  function initSizeGuide() {
    var sizeGuideBtns = document.querySelectorAll('[data-size-guide]');
    var modal = document.getElementById('SizeGuideModal');
    var overlay = document.getElementById('SizeGuideOverlay');
    var close = document.getElementById('SizeGuideClose');

    sizeGuideBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        if (modal) {
          modal.setAttribute('aria-hidden', 'false');
          modal.classList.add('active');
        }
        if (overlay) overlay.setAttribute('aria-hidden', 'false');
      });
    });

    function closeSizeGuide() {
      if (modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.classList.remove('active');
      }
      if (overlay) overlay.setAttribute('aria-hidden', 'true');
    }

    if (close) close.addEventListener('click', closeSizeGuide);
    if (overlay) overlay.addEventListener('click', closeSizeGuide);

    // Unit toggle (cm/inch)
    var unitBtns = document.querySelectorAll('.sg-unit-btn');
    unitBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        unitBtns.forEach(function(b) { b.classList.remove('sg-unit-btn--active'); });
        this.classList.add('sg-unit-btn--active');
        
        var unit = this.dataset.unit;
        var cells = document.querySelectorAll('.sg-table td[data-' + unit + ']');
        cells.forEach(function(cell) {
          cell.textContent = cell.dataset[unit];
        });
      });
    });

    // Tab switching
    var tabs = document.querySelectorAll('.sg-tab');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var tabName = this.dataset.tab;
        
        tabs.forEach(function(t) { 
          t.classList.remove('sg-tab--active'); 
          t.setAttribute('aria-selected', 'false');
        });
        this.classList.add('sg-tab--active');
        this.setAttribute('aria-selected', 'true');
        
        document.querySelectorAll('.sg-table-wrap').forEach(function(wrap) {
          wrap.hidden = wrap.dataset.table !== tabName;
        });
      });
    });
  }

  // ─── STICKY ADD TO CART ───
  function initStickyATC() {
    var stickyATC = document.getElementById('StickyATC');
    var mainATCBtn = document.getElementById('AddToCartBtn');
    
    if (!stickyATC || !mainATCBtn) return;

    function handleScroll() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var btnRect = mainATCBtn.getBoundingClientRect();
      
      if (btnRect.top < 0) {
        stickyATC.classList.add('visible');
        stickyATC.setAttribute('aria-hidden', 'false');
      } else {
        stickyATC.classList.remove('visible');
        stickyATC.setAttribute('aria-hidden', 'true');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Sticky ATC button click
    var stickyBtn = document.getElementById('StickyATCBtn');
    if (stickyBtn) {
      stickyBtn.addEventListener('click', function() {
        var variantId = this.dataset.variantId;
        var qty = document.getElementById('ProductQty') ? document.getElementById('ProductQty').value : 1;
        
        if (window.LuxeCart) {
          window.LuxeCart.addItem(variantId, parseInt(qty))
            .then(function() {
              window.LuxeCart.open();
              window.LuxeCart.showToast('Added to cart!');
            });
        }
      });
    }

    // Sticky variant select
    var stickySelect = document.getElementById('StickyVariantSelect');
    if (stickySelect) {
      stickySelect.addEventListener('change', function() {
        var variantId = this.value;
        stickyBtn.dataset.variantId = variantId;
        
        // Update price
        var variants = window.__luxe_variants__ || [];
        var variant = variants.find(function(v) { return v.id == variantId; });
        if (variant) {
          var priceEl = document.getElementById('StickyATCPrice');
          if (priceEl) {
            priceEl.innerHTML = '<span>' + (variant.price / 100).toFixed(2) + '</span>';
          }
        }
      });
    }
  }

  // ─── COLLECTION FILTERS ───
  function initCollectionFilters() {
    var filterToggle = document.getElementById('FilterToggle');
    var filterPanel = document.getElementById('FilterPanel');
    
    if (filterToggle && filterPanel) {
      filterToggle.addEventListener('click', function() {
        var expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
        filterPanel.hidden = expanded;
      });
    }
  }

  // ─── PRODUCT OPTIONS (VARIANT SWITCHING) ───
  function initProductOptions() {
    // Already handled in main-product.liquid inline script
    // This is for any additional product option functionality
  }

  // ─── RECENTLY VIEWED PRODUCTS ───
  function initRecentlyViewed() {
    var section = document.getElementById('RecentlyViewed');
    if (!section) return;

    var track = document.getElementById('RecentlyViewedTrack');
    var limit = parseInt(section.dataset.limit) || 6;
    
    // Get from localStorage
    var viewed = JSON.parse(localStorage.getItem('luxe_recently_viewed') || '[]');
    
    if (viewed.length === 0) {
      // Check if current product should be tracked
      if (window.__luxe_track_product__) {
        viewed = [window.__luxe_track_product__];
        localStorage.setItem('luxe_recently_viewed', JSON.stringify(viewed));
      }
    }

    // Add current product to viewed
    if (window.__luxe_track_product__) {
      var currentId = window.__luxe_track_product__.id;
      viewed = viewed.filter(function(p) { return p.id !== currentId; });
      viewed.unshift(window.__luxe_track_product__);
      viewed = viewed.slice(0, limit);
      localStorage.setItem('luxe_recently_viewed', JSON.stringify(viewed));
    }

    // Render viewed products
    if (viewed.length > 0 && track) {
      section.style.display = 'block';
      
      viewed.forEach(function(product) {
        var card = document.createElement('div');
        card.className = 'recently-viewed__item';
        card.innerHTML = `
          <a href="${product.url}" class="recently-viewed__link">
            ${product.image ? '<img src="' + product.image + '" alt="' + product.title + '" class="recently-viewed__img">' : ''}
            <span class="recently-viewed__title">${product.title}</span>
            <span class="recently-viewed__price">${(product.price / 100).toFixed(2)}</span>
          </a>
        `;
        track.appendChild(card);
      });
    }
  }

  // ─── COMPARE ───
  function initCompareDrawer() {
    var compareToggle = document.getElementById('CompareToggle');
    var compareDrawer = document.getElementById('CompareDrawer');
    var compareOverlay = document.getElementById('CompareOverlay');
    var compareClose = document.getElementById('CompareDrawerClose');
    
    function openCompareDrawer() {
      if (compareDrawer) {
        compareDrawer.setAttribute('aria-hidden', 'false');
        compareDrawer.classList.add('active');
        document.body.classList.add('compare-open');
      }
      if (compareOverlay) compareOverlay.setAttribute('aria-hidden', 'false');
    }
    
    function closeCompareDrawer() {
      if (compareDrawer) {
        compareDrawer.setAttribute('aria-hidden', 'true');
        compareDrawer.classList.remove('active');
        document.body.classList.remove('compare-open');
      }
      if (compareOverlay) compareOverlay.setAttribute('aria-hidden', 'true');
    }
    
    if (compareToggle) {
      compareToggle.addEventListener('click', function(e) {
        e.preventDefault();
        if (compareDrawer && compareDrawer.getAttribute('aria-hidden') === 'true') {
          openCompareDrawer();
        } else {
          closeCompareDrawer();
        }
      });
    }
    
    if (compareClose) {
      compareClose.addEventListener('click', closeCompareDrawer);
    }
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && compareDrawer && compareDrawer.getAttribute('aria-hidden') === 'false') {
        closeCompareDrawer();
      }
    });
    
    updateCompareCount();
  }
  
  function updateCompareCount() {
    var list = JSON.parse(localStorage.getItem('luxe_compare') || '[]');
    var badge = document.getElementById('CompareBadge');
    if (badge) {
      badge.textContent = list.length;
      badge.style.display = list.length > 0 ? 'flex' : 'none';
    }
  }

  // ─── SCROLL TO TOP ───
  function initScrollToTop() {
    var scrollBtn = document.getElementById('ScrollToTopFloating');
    if (!scrollBtn) {
      scrollBtn = document.getElementById('ScrollToTop');
    }
    if (!scrollBtn) return;
    
    scrollBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        scrollBtn.style.display = 'flex';
      } else {
        scrollBtn.style.display = 'none';
      }
    });
    
    scrollBtn.style.display = 'none';
  }

  // ─── WISHLIST ───
  function initWishlist() {
    updateWishlistCount();
    
    // Wishlist drawer toggle
    var wishlistToggle = document.getElementById('WishlistToggle');
    var wishlistDrawer = document.getElementById('WishlistDrawer');
    var wishlistOverlay = document.getElementById('WishlistOverlay');
    var wishlistClose = document.getElementById('WishlistDrawerClose');
    
    function openWishlistDrawer() {
      if (wishlistDrawer) {
        wishlistDrawer.setAttribute('aria-hidden', 'false');
        wishlistDrawer.classList.add('active');
        document.body.classList.add('wishlist-open');
      }
      if (wishlistOverlay) wishlistOverlay.setAttribute('aria-hidden', 'false');
      renderWishlistDrawer();
    }
    
    function closeWishlistDrawer() {
      if (wishlistDrawer) {
        wishlistDrawer.setAttribute('aria-hidden', 'true');
        wishlistDrawer.classList.remove('active');
        document.body.classList.remove('wishlist-open');
      }
      if (wishlistOverlay) wishlistOverlay.setAttribute('aria-hidden', 'true');
    }
    
    if (wishlistToggle) {
      wishlistToggle.addEventListener('click', function(e) {
        e.preventDefault();
        if (wishlistDrawer && wishlistDrawer.getAttribute('aria-hidden') === 'true') {
          openWishlistDrawer();
        } else {
          closeWishlistDrawer();
        }
      });
    }
    
    if (wishlistClose) {
      wishlistClose.addEventListener('click', closeWishlistDrawer);
    }
    
    if (wishlistOverlay) {
      wishlistOverlay.addEventListener('click', closeWishlistDrawer);
    }
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && wishlistDrawer && wishlistDrawer.getAttribute('aria-hidden') === 'false') {
        closeWishlistDrawer();
      }
    });
  }

  function initWishlistButtons() {
    document.addEventListener('click', function(e) {
      var wishlistBtn = e.target.closest('[data-action="wishlist"]');
      if (!wishlistBtn) return;

      e.preventDefault();
      var productId = wishlistBtn.dataset.productId;
      toggleWishlist(productId, wishlistBtn);
    });
  }

  function toggleWishlist(productId, btn) {
    var wishlist = JSON.parse(localStorage.getItem('luxe_wishlist') || '[]');
    var idx = wishlist.indexOf(productId);

    if (idx > -1) {
      wishlist.splice(idx, 1);
      if (btn) btn.classList.remove('active');
      if (window.LuxeCart) window.LuxeCart.showToast('Removed from wishlist');
    } else {
      wishlist.push(productId);
      if (btn) btn.classList.add('active');
      if (window.LuxeCart) window.LuxeCart.showToast('Added to wishlist');
    }

    localStorage.setItem('luxe_wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
  }

  function updateWishlistCount() {
    var wishlist = JSON.parse(localStorage.getItem('luxe_wishlist') || '[]');
    var btns = document.querySelectorAll('[data-wishlist-count]');
    btns.forEach(function(b) {
      b.textContent = wishlist.length;
      b.style.display = wishlist.length > 0 ? 'flex' : 'none';
    });
  }

  function isInWishlist(productId) {
    var wishlist = JSON.parse(localStorage.getItem('luxe_wishlist') || '[]');
    return wishlist.indexOf(productId) > -1;
  }

  function renderWishlistDrawer() {
    var container = document.getElementById('WishlistProducts');
    var empty = document.getElementById('WishlistEmpty');
    if (!container) return;

    var wishlist = JSON.parse(localStorage.getItem('luxe_wishlist') || '[]');
    if (wishlist.length === 0) {
      container.style.display = 'none';
      if (empty) empty.style.display = 'flex';
      return;
    }

    if (empty) empty.style.display = 'none';
    container.style.display = 'flex';

    // Fetch products and render
    fetch('/products.js?limit=10&ids=' + wishlist.join(','))
      .then(function(res) { return res.json(); })
      .then(function(products) {
        if (products.length === 0) {
          container.innerHTML = '';
          if (empty) empty.style.display = 'flex';
          return;
        }
        var html = '';
        products.forEach(function(p) {
          html += '<div class="wishlist-item">' +
            '<a href="' + p.url + '"><img src="' + p.featured_image + '" alt="' + p.title + '" class="wishlist-item__img"></a>' +
            '<div class="wishlist-item__info">' +
              '<a href="' + p.url + '" class="wishlist-item__title">' + p.title + '</a>' +
              '<span class="wishlist-item__price">' + (p.price / 100).toFixed(2) + '</span>' +
              '<button class="wishlist-item__remove" onclick="removeFromWishlistDrawer(' + p.id + ')">Remove</button>' +
            '</div>' +
          '</div>';
        });
        container.innerHTML = html;
      })
      .catch(function() {
        container.innerHTML = '<p>Error loading wishlist.</p>';
      });
  }

  window.removeFromWishlistDrawer = function(productId) {
    toggleWishlist(productId);
    renderWishlistDrawer();
  };

  // ─── ADD TO CART (GLOBAL) ───
  // Add to cart from any "Add to Cart" button
  document.addEventListener('click', function(e) {
    var atcBtn = e.target.closest('[data-add-to-cart], #AddToCartBtn, .product-card__atc');
    
    if (!atcBtn) return;
    
    e.preventDefault();
    
    var variantId = atcBtn.dataset.variantId || document.getElementById('ProductVariantId')?.value;
    var quantity = 1;
    
    // Get quantity from nearby input
    var qtyInput = atcBtn.closest('form')?.querySelector('[name="quantity"]') || document.getElementById('ProductQty');
    if (qtyInput) quantity = parseInt(qtyInput.value) || 1;
    
    if (!variantId) {
      console.error('No variant ID found');
      return;
    }

    if (window.LuxeCart) {
      window.LuxeCart.addItem(variantId, quantity)
        .then(function(item) {
          window.LuxeCart.open();
          window.LuxeCart.showToast('Added to cart!');
          
          // Update mini cart count
          return window.LuxeCart.getCart();
        })
        .then(function(cart) {
          updateCartCount(cart.item_count);
        })
        .catch(function(err) {
          console.error('Add to cart error:', err);
          window.LuxeCart.showToast('Error adding to cart', 'error');
        });
    }
  });

  // ─── PREDICTIVE SEARCH ───
  var searchTimeout;
  
  function initPredictiveSearch() {
    var searchInput = document.getElementById('HeaderSearchInput');
    var searchResults = document.getElementById('PredictiveSearchResults');
    var mobileSearchInput = document.getElementById('MobileSearchInput');
    
    function handleSearch(input) {
      clearTimeout(searchTimeout);
      var query = input.value.trim();
      
      if (query.length < 2) {
        searchResults.hidden = true;
        return;
      }
      
      searchTimeout = setTimeout(function() {
        fetch('/search/suggest.json?q=' + encodeURIComponent(query) + '&resources[type]=products&resources[limit]=6')
          .then(function(res) { return res.json(); })
          .then(function(data) {
            renderSearchResults(data.resources.results.products, searchResults, query);
          })
          .catch(function() {
            searchResults.hidden = true;
          });
      }, 300);
    }
    
    if (searchInput) {
      searchInput.addEventListener('input', function() { handleSearch(this); });
      searchInput.addEventListener('focus', function() { handleSearch(this); });
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.site-header__search')) {
          searchResults.hidden = true;
        }
      });
    }
    
    if (mobileSearchInput) {
      mobileSearchInput.addEventListener('input', function() { handleSearch(this); });
    }
  }
  
  function renderSearchResults(products, container, query) {
    if (!products || products.length === 0) {
      container.hidden = true;
      return;
    }
    
    var html = '<div class="predictive-search__inner">';
    html += '<ul class="predictive-search__list" role="listbox">';
    
    products.forEach(function(product) {
      var price = (product.price / 100).toFixed(2);
      html += '<li class="predictive-search__item">' +
        '<a href="' + product.url + '" class="predictive-search__link" role="option">' +
          '<img src="' + product.featured_image + '" alt="" class="predictive-search__img">' +
          '<div class="predictive-search__info">' +
            '<span class="predictive-search__title">' + product.title + '</span>' +
            '<span class="predictive-search__price">' + price + '</span>' +
          '</div>' +
        '</a>' +
      '</li>';
    });
    
    html += '</ul>';
    html += '<a href="/search?q=' + encodeURIComponent(query) + '" class="predictive-search__view-all">View all results</a>';
    html += '</div>';
    
    container.innerHTML = html;
    container.hidden = false;
  }

})();