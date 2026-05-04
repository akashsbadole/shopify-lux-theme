// Luxe Theme JavaScript

document.addEventListener('DOMContentLoaded', () => {
  console.log('Luxe Theme Loaded');

  initMobileMenu();
  initQuickView();
  initCartDrawer();
  initQuantitySelectors();
});

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

// Sticky Add to Cart
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