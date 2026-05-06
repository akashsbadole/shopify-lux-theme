/**
 * LUXE Currency Converter Module
 * Uses ExchangeRate-API with localStorage caching (24hr TTL)
 * Shows converted prices in tooltips on hover (desktop only)
 */

(function() {
  'use strict';

  class CurrencyConverter {
    constructor() {
      this.apiKey = '';
      this.baseCurrency = 'USD'; // API fetch base
      this.rates = {};
      this.cacheKey = 'luxe_currency_rates';
      this.isEnabled = false;
      this.sourceCurrency = 'USD'; // Currency prices are displayed in (Shopify localization)
      this.selectedCurrency = 'USD'; // Target currency for tooltip
      this.lastFetch = 0;
      this.tooltip = null;
      this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    init(settings) {
      this.apiKey = settings.apiKey || '';
      this.baseCurrency = settings.baseCurrency || 'USD';
      this.sourceCurrency = settings.pageCurrency || 'USD';
      this.selectedCurrency = settings.selectedCurrency || this.sourceCurrency;
      this.isEnabled = settings.enabled && this.apiKey !== '';

      if (!this.isEnabled) {
        console.log('[CurrencyConverter] Disabled or no API key provided');
        return;
      }

      this.createTooltip();
      this.loadCachedRates();
      this.setupEventDelegation();
      this.ensureRates();
    }

    createTooltip() {
      this.tooltip = document.createElement('div');
      this.tooltip.className = 'currency-tooltip';
      this.tooltip.setAttribute('role', 'tooltip');
      this.tooltip.setAttribute('aria-hidden', 'true');
      document.body.appendChild(this.tooltip);
    }

    loadCachedRates() {
      try {
        const cached = localStorage.getItem(this.cacheKey);
        if (cached) {
          const data = JSON.parse(cached);
          if (data.timestamp && (Date.now() - data.timestamp) < 24 * 60 * 60 * 1000) {
            this.rates = data.rates || {};
            this.lastFetch = data.timestamp;
            console.log('[CurrencyConverter] Loaded cached rates for', data.base || 'unknown base');
          }
        }
      } catch (e) {
        console.warn('[CurrencyConverter] Failed to load cache:', e);
      }
    }

    async ensureRates() {
      const now = Date.now();
      const cacheExpired = now - this.lastFetch > (24 * 60 * 60 * 1000);
      if (Object.keys(this.rates).length === 0 || cacheExpired) {
        await this.fetchRates();
      } else {
        console.log('[CurrencyConverter] Using cached rates (age:', Math.floor((now - this.lastFetch)/3600000), 'hours)');
      }
    }

    async fetchRates() {
      if (!this.apiKey) return;

      try {
        const url = `https://v6.exchangerate-api.com/v6/${this.apiKey}/latest/${this.baseCurrency}`;
        const response = await fetch(url, { method: 'GET' });
        const data = await response.json();

        if (data.result === 'success' && data.conversion_rates) {
          this.rates = data.conversion_rates;
          this.lastFetch = Date.now();
          this.saveToCache();
          console.log('[CurrencyConverter] Fetched fresh rates (base:', data.base_code, ')');
        } else {
          throw new Error('API error: ' + (data['error-type'] || 'Unknown'));
        }
      } catch (error) {
        console.error('[CurrencyConverter] Fetch failed:', error);
        this.tryShopifyFallback();
      }
    }

    tryShopifyFallback() {
      try {
        const currencyOptions = document.querySelectorAll('#CurrencySelector option');
        if (currencyOptions.length > 0) {
          console.warn('[CurrencyConverter] API unavailable — tooltips disabled until rates load');
          this.rates = {}; // ensure no tooltips
        }
      } catch (e) {
        console.error('[CurrencyConverter] Fallback check failed:', e);
      }
    }

    saveToCache() {
      try {
        const data = {
          rates: this.rates,
          base: this.baseCurrency,
          timestamp: this.lastFetch
        };
        localStorage.setItem(this.cacheKey, JSON.stringify(data));
      } catch (e) {
        console.warn('[CurrencyConverter] Failed to save cache:', e);
      }
    }

    setupEventDelegation() {
      if (this.isTouch) {
        console.log('[CurrencyConverter] Touch device — tooltips disabled');
        return;
      }
      document.body.addEventListener('mouseenter', (e) => this.handleMouseEnter(e), true);
      document.body.addEventListener('mouseleave', (e) => this.handleMouseLeave(e), true);
      window.addEventListener('scroll', () => this.hideTooltip(), { passive: true });
    }

    handleMouseEnter(e) {
      // Match any element whose class contains 'price' OR common total/ subtotal classes
      var target = e.target.closest('[class*="price"], .cart__total, .subtotal, .total');
      if (!target || !this.isEnabled) return;

      const targetCurrency = this.getSelectedCurrency();
      if (!targetCurrency || targetCurrency === this.sourceCurrency) return;

      if (Object.keys(this.rates).length === 0) return;

      const priceValue = this.extractPrice(target);
      if (priceValue === null || priceValue <= 0) return;

      const converted = this.convert(priceValue, targetCurrency);
      if (converted === null) return;

      this.showTooltip(target, converted, targetCurrency);
    }

    handleMouseLeave(e) {
      var target = e.target.closest('[class*="price"], .cart__total, .subtotal, .total');
      if (target) {
        this.hideTooltip();
      }
    }

    getSelectedCurrency() {
      const selector = document.getElementById('CurrencySelector');
      return selector ? selector.value : this.selectedCurrency;
    }

    extractPrice(element) {
      let text = element.textContent || element.innerText || '';
      text = text.trim();
      if (!text || /free/i.test(text)) return 0;

      const match = text.match(/\d[\d,]*\.?\d*/);
      if (!match) return null;
      const numeric = parseFloat(match[0].replace(/,/g, ''));
      return isNaN(numeric) ? null : numeric;
    }

    convert(amount, toCurrency) {
      if (!this.rates[toCurrency]) {
        console.warn('[CurrencyConverter] No rate for target', toCurrency);
        return null;
      }
      if (!this.rates[this.sourceCurrency]) {
        console.warn('[CurrencyConverter] No rate for source', this.sourceCurrency);
        return null;
      }
      if (this.sourceCurrency === toCurrency) return amount;

      const rateTo = this.rates[toCurrency];
      const rateFrom = this.rates[this.sourceCurrency];
      return amount * (rateTo / rateFrom);
    }

    showTooltip(targetElement, convertedAmount, currencyCode) {
      if (!this.tooltip) return;

      const formatted = this.formatCurrency(convertedAmount, currencyCode);
      this.tooltip.textContent = `≈ ${formatted}`;

      const rect = targetElement.getBoundingClientRect();
      const tooltipRect = this.tooltip.getBoundingClientRect();

      let top = rect.top - tooltipRect.height - 8;
      let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

      // Keep within viewport
      if (top < 10) top = rect.bottom + 8;
      if (left < 10) left = 10;
      if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
      }

      this.tooltip.style.top = `${top}px`;
      this.tooltip.style.left = `${left}px`;
      this.tooltip.classList.add('visible');
      this.tooltip.setAttribute('aria-hidden', 'false');
    }

    hideTooltip() {
      if (this.tooltip) {
        this.tooltip.classList.remove('visible');
        this.tooltip.setAttribute('aria-hidden', 'true');
      }
    }

    formatCurrency(amount, currencyCode) {
      try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currencyCode,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }).format(amount);
      } catch (e) {
        const display = amount.toFixed(2);
        return `${currencyCode} ${display}`;
      }
    }

    observeDynamicContent() {
      const observer = new MutationObserver(() => {
        // Not needed due to event delegation; reserved for future use
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    destroy() {
      this.hideTooltip();
      if (this.tooltip && this.tooltip.parentNode) {
        this.tooltip.parentNode.removeChild(this.tooltip);
        this.tooltip = null;
      }
      this.isEnabled = false;
    }
  }

  // Export
  window.LuxeCurrencyConverter = CurrencyConverter;

})();
