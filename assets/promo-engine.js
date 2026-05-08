/**
 * LUXE PROMO ENGINE
 * Handles BOGO, volume discounts, free gifts, and price-based promotions
 */

(function() {
  'use strict';

  const CONFIG = { STORAGE_KEY: 'luxe_promo_state' };

  class PromoEngine {
    constructor() {
      this.cart = null;
      this.promotions = [];
      this.activePromo = null;
      this.progress = { percentage: 0, remaining: 0, goalMet: false, type: 'none' };
      this.listeners = {};
      this.giftOptions = [];
      this.autoAdding = false;

      this.scanCart = this.scanCart.bind(this);
      this.calculate = this.calculate.bind(this);
      this.claimGift = this.claimGift.bind(this);
      this.init();
    }

    init() {
      this.loadState();

      // Listen for cart updates (event signals cart HTML changed)
      document.addEventListener('cart:updated', () => {
        if (window.LuxeCart) {
          window.LuxeCart.getCart().then(cart => {
            this.scanCart(cart);
          }).catch(err => {
            console.warn('PromoEngine: Could not fetch cart JSON', err);
          });
        }
      });

      // Initial scan
      if (window.LuxeCart) {
        window.LuxeCart.getCart().then(cart => this.scanCart(cart)).catch(() => this.parseLiquidCart());
      } else {
        this.parseLiquidCart();
      }
    }

    loadState() {
      try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (saved) this.giftOptions = JSON.parse(saved).giftOptions || [];
      } catch (e) {}
    }
    saveState() {
      try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({ giftOptions: this.giftOptions, lastUpdate: Date.now() })); } catch (e) {}
    }

    parseLiquidCart() {
      const el = document.getElementById('CartData');
      if (el) try { this.scanCart(JSON.parse(el.dataset.cart)); } catch (e) {}
    }

    scanCart(cartData) {
      this.cart = cartData || this.cart;
      if (!this.cart) return;
      this.loadPromotionDefinitions();
      this.calculate();
      this.emit('promo:update', { promo: this.activePromo, progress: this.progress, giftOptions: this.giftOptions });
      this.syncCartAttributes();
    }

    loadPromotionDefinitions() {
      this.promotions = [];
      this.collectProductPromotions();

      // Global free_gift from theme settings
      if (window.LuxeThemeSettings && window.LuxeThemeSettings.promo_gift_min_amount && window.LuxeThemeSettings.promo_gift_min_amount > 0 && window.LuxeThemeSettings.promo_gift_product_handle) {
        this.promotions.push({
          type: 'free_gift',
          min_amount: window.LuxeThemeSettings.promo_gift_min_amount,
          get_product_id: window.LuxeThemeSettings.promo_gift_product_handle,
          gift_product_ids: [window.LuxeThemeSettings.promo_gift_product_handle],
          enabled: true,
          id: 'global-free-gift'
        });
      }
    }

    collectProductPromotions() {
      if (window.__LUXE_PROMO_METAFIELDS__) {
        this.promotions = window.__LUXE_PROMO_METAFIELDS__.filter(p => p.enabled !== false);
        const seen = new Set();
        this.promotions = this.promotions.filter(p => {
          const key = p.product_id + '_' + p.type;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }
    }

    calculate() {
      if (!this.cart || this.cart.items.length === 0) {
        this.activePromo = null;
        this.progress = { percentage: 0, remaining: 0, goalMet: false, type: 'none' };
        return;
      }

      const eligible = this.findEligiblePromotions();
      this.activePromo = this.selectBestPromotion(eligible);
      this.progress = this.computeProgress(this.activePromo);

      if (this.activePromo) {
        if (this.activePromo.type === 'bogo' && this.progress.goalMet) {
          if (window.LuxeThemeSettings.promo_bogo_auto_add) {
            this.autoAddBOGOFreeItems();
          } else {
            this.loadGiftOptions();
          }
        } else if (this.activePromo.type === 'free_gift' && this.progress.goalMet) {
          this.loadGiftOptions();
        }
      }
    }

    findEligiblePromotions() {
      return this.promotions.filter(promo => {
        switch (promo.type) {
          case 'bogo': return this.checkBOGO(promo);
          case 'volume_discount': return this.checkVolumeDiscount(promo);
          case 'free_gift': return this.checkFreeGift(promo);
          case 'price_based': return this.checkPriceBased(promo);
          case 'bundle': return this.checkBundle(promo);
          default: return false;
        }
      });
    }

    // ─── CHECKERS ───
    checkBOGO(promo) {
      const buyPid = promo.product_id;
      const getPid = promo.get_product_id;
      const buyQty = promo.buy_qty || 1;
      const getQty = promo.get_qty || 1;

      let paidQty = 0;
      let freeClaimed = 0;
      this.cart.items.forEach(item => {
        if (item.product_id === buyPid && !(item.properties && item.properties._free_gift === 'true')) {
          paidQty += item.quantity;
        }
        if (item.product_id === getPid && item.properties && item.properties._free_gift === 'true') {
          freeClaimed += item.quantity;
        }
      });
      const qualifiedSets = Math.floor(paidQty / buyQty);
      const freeQualified = qualifiedSets * getQty;
      return freeQualified > freeClaimed;
    }

    checkVolumeDiscount(promo) {
      const item = this.cart.items.find(i => i.product_id === promo.product_id);
      if (!item) return false;
      return item.quantity >= (promo.min_qty || 3);
    }

    checkFreeGift(promo) {
      if (!promo.min_amount) return false;
      let subtotal = 0;
      this.cart.items.forEach(item => {
        if (item.properties && item.properties._free_gift) return;
        subtotal += item.final_line_price;
      });
      const hasGift = this.cart.items.some(i => i.product_id === promo.get_product_id && i.properties && i.properties._free_gift);
      return subtotal >= promo.min_amount && !hasGift;
    }

    checkPriceBased(promo) {
      if (this.cart.items.length < (promo.min_qty || 3)) return false;
      const applied = this.cart.attributes && this.cart.attributes.promo_type === 'price_based';
      return !applied;
    }

    checkBundle(promo) {
      const ids = promo.bundle_product_ids || [];
      return ids.every(pid => this.cart.items.some(item => item.product_id === pid));
    }

    // ─── PROGRESS ───
    computeProgress(promo) {
      if (!promo) return { percentage: 0, remaining: 0, goalMet: false, type: 'none' };

      let subtotal = 0, itemCount = 0;
      this.cart.items.forEach(item => {
        if (item.properties && item.properties._free_gift) return;
        subtotal += item.final_line_price;
        itemCount += item.quantity;
      });

      let percentage = 0, remaining = 0, goalMet = false;

      switch (promo.type) {
        case 'free_gift':
          const threshold = promo.min_amount || 0;
          remaining = Math.max(0, threshold - subtotal);
          goalMet = remaining <= 0;
          percentage = subtotal >= threshold ? 100 : Math.round((subtotal / threshold) * 100);
          break;
        case 'bogo':
          const buyPid = promo.product_id;
          let paidQty = 0;
          this.cart.items.forEach(item => {
            if (item.product_id === buyPid && !(item.properties && item.properties._free_gift === 'true')) paidQty += item.quantity;
          });
          const buyQty = promo.buy_qty || 1;
          const qtyMod = paidQty % buyQty;
          remaining = qtyMod === 0 ? 0 : buyQty - qtyMod;
          goalMet = paidQty >= buyQty;
          percentage = Math.round((paidQty / buyQty) * 100);
          break;
        case 'volume_discount':
          const volItem = this.cart.items.find(i => i.product_id === promo.product_id);
          const qty = volItem ? volItem.quantity : 0;
          const minQty = promo.min_qty || 3;
          remaining = Math.max(0, minQty - qty);
          goalMet = qty >= minQty;
          percentage = Math.round((qty / minQty) * 100);
          break;
        case 'price_based':
          const needQty = promo.min_qty || 3;
          remaining = Math.max(0, needQty - itemCount);
          goalMet = itemCount >= needQty;
          percentage = Math.round((itemCount / needQty) * 100);
          break;
        case 'bundle':
          const total = promo.bundle_product_ids.length;
          const have = promo.bundle_product_ids.filter(pid => this.cart.items.some(it => it.product_id === pid)).length;
          remaining = total - have;
          goalMet = remaining === 0;
          percentage = Math.round((have / total) * 100);
          break;
      }

      return { percentage, remaining, goalMet, type: promo.type, subtotal, itemCount };
    }

    // ─── GIFT & BOGO HANDLING ───
    loadGiftOptions() {
      if (!this.activePromo) return;
      const promo = this.activePromo;
      const types = ['free_gift', 'bogo'];
      if (!types.includes(promo.type)) return;

      let ids = [];
      if (promo.gift_product_ids && promo.gift_product_ids.length) {
        ids = promo.gift_product_ids;
      } else if (promo.get_product_id) {
        ids = [promo.get_product_id];
      }
      if (!ids.length) return;

      const promises = ids.map(handle => this.fetchProductByHandle(handle).then(p => p ? {
        product_id: p.id,
        product_handle: p.handle,
        title: p.title,
        featured_image: p.images && p.images[0],
        price: p.price,
        variants: p.variants || []
      } : null));

      Promise.all(promises).then(results => {
        this.giftOptions = results.filter(p => p && p.variants && p.variants.length);
        this.saveState();
        // Emit update so UI can act (e.g., open modal)
        this.emit('promo:update', {
          promo: this.activePromo,
          progress: this.progress,
          giftOptions: this.giftOptions
        });
      }).catch(err => {
        console.error('Failed to load gift options', err);
      });
    }

    claimGift(variantId, quantity = 1) {
      if (!this.activePromo) return Promise.reject('No active promotion');
      const gift = this.giftOptions.find(g => g.variants.some(v => v.id === variantId));
      if (!gift) return Promise.reject('Invalid variant');

      return window.LuxeCart.addItem(variantId, quantity, {
        _free_gift: 'true',
        _promo_type: this.activePromo.type,
        _promo_id: this.activePromo.id || ''
      }).then(() => {
        this.emit('promo:gift_claimed', { gift });
      });
    }

    autoAddBOGOFreeItems() {
      if (this.autoAdding || !this.activePromo || this.activePromo.type !== 'bogo') return;
      const promo = this.activePromo;
      const buyPid = promo.product_id;
      const getPid = promo.get_product_id;
      const buyQty = promo.buy_qty || 1;
      const getQty = promo.get_qty || 1;

      let paidQty = 0, freeClaimed = 0;
      this.cart.items.forEach(item => {
        if (item.product_id === buyPid && !(item.properties && item.properties._free_gift === 'true')) paidQty += item.quantity;
        if (item.product_id === getPid && item.properties && item.properties._free_gift === 'true') freeClaimed += item.quantity;
      });
      const qualifiedSets = Math.floor(paidQty / buyQty);
      const freeQualified = qualifiedSets * getQty;
      const freeToAdd = freeQualified - freeClaimed;
      if (freeToAdd <= 0) return;

      this.autoAdding = true;
      this.fetchProductVariantId(getPid).then(vid => {
        if (!vid) throw new Error('No variant for ' + getPid);
        return window.LuxeCart.addItem(vid, freeToAdd, { _free_gift: 'true', _promo_type: 'bogo', _promo_id: promo.id || '' });
      }).then(() => { this.autoAdding = false; })
        .catch(err => { console.error(err); this.autoAdding = false; });
    }

    fetchProductByHandle(handle) {
      return fetch('/products/' + handle + '.js')
        .then(r => r.ok ? r.json() : Promise.reject('Not found'))
        .catch(err => { console.error('Fetch product error', handle, err); return null; });
    }

    fetchProductVariantId(handle) {
      return this.fetchProductByHandle(handle).then(p => (p && p.variants && p.variants[0] ? p.variants[0].id : null));
    }

    // ─── CART ATTRIBUTES ───
    syncCartAttributes() {
      if (!this.cart || !window.LuxeCart) return;
      const attrs = {
        promo_type: this.activePromo ? this.activePromo.type : '',
        promo_id: this.activePromo ? (this.activePromo.id || '') : '',
        promo_progress: Math.round(this.progress.percentage)
      };
      window.LuxeCart.updateAttributes(attrs);
    }

    // ─── EVENTS ───
    on(ev, cb) { (this.listeners[ev] = this.listeners[ev] || []).push(cb); }
    off(ev, cb) { if (this.listeners[ev]) this.listeners[ev] = this.listeners[ev].filter(c => c !== cb); }
    emit(ev, data) { (this.listeners[ev] || []).forEach(cb => cb(data)); }

    // ─── API ───
    getActivePromotion() { return this.activePromo; }
    getProgress() { return this.progress; }
    getGiftOptions() { return this.giftOptions; }
    isGoalMet() { return this.progress.goalMet; }
    getFormattedMessage(tpl, ctx = {}) { return tpl ? tpl.replace(/\{(\w+)\}/g, (m, k) => ctx[k] !== undefined ? ctx[k] : m) : ''; }
  }

  // ═══════════════════════════════════════════════════════════════
  // INITIALIZE
  // ═══════════════════════════════════════════════════════════════

  let promoEngine;
  document.addEventListener('DOMContentLoaded', () => {
    promoEngine = new PromoEngine();
    window.LuxePromo = promoEngine;
    setTimeout(() => {
      const el = document.getElementById('PromoProgressBar');
      if (el) el.style.display = 'block';
    }, 500);
  });
  window.PromoEngine = PromoEngine;

})();
