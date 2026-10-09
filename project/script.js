/**
 * NEXBECK — AUSTRALIAN TRADE & ELECTRICAL WEB DESIGN AGENCY
 * Shared JavaScript for: Home, Services, About, Contact
 * Pure Vanilla JavaScript — Zero Framework Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Subtle electrical ambient cleanup (canvas disabled in favor of CSS radial glow)
  initAmbientCanvas();

  // 2. Scroll-triggered reveal animations with auto-observing engine
  initScrollAnimations();

  // 3. Smooth native anchor scrolling
  initSmoothAnchorScrolling();

  // 4. Header scroll styling & multi-page active nav
  initHeaderAndNav();

  // 5. Mobile navigation drawer
  initMobileDrawer();

  // 6. Live Project Showcase Toggle (Desktop | Mobile Frame)
  initProjectShowcaseToggle();
  initLaptopIframeScaling();
  initPhoneIframeScaling();

  // 7. Interactive Job Payback / ROI Calculator with Live Volume Slider & Count-Up
  initPaybackCalculator();

  // 8. Interactive Suburb Turf Coverage & Demand Simulator
  initSuburbTurfSimulator();

  // 9. Interactive Package Scope & Inclusions Estimator (Services page)
  initScopeEstimator();

  // 10. FAQ Accordions (Homepage, Services, About, Contact)
  initFaqAccordions();

  // 11. Contact form handling with Live Progress & Trade Presets
  initContactFormHandler();

  // 12. Sticky mobile bar and back-to-top button
  initBackToTopAndMobileBar();
});

/* ==========================================================================
   1. AMBIENT BACKGROUND CLEANUP
   Canvas animation removed to eliminate CPU/GPU overhead.
   Retains ultra-lightweight, composited CSS .ambient-radial-glow.
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    canvas.remove();
  }
}

/* ==========================================================================
   2. SMOOTH NATIVE ANCHOR SCROLLING
   Accounts for fixed header offset + mobile sticky bar and updates URL history.
   ========================================================================== */
function initSmoothAnchorScrolling() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const hash = anchor.getAttribute('href');
    if (!hash || hash === '#' || hash.length < 2) return;

    const targetEl = document.querySelector(hash);
    if (!targetEl) return;

    e.preventDefault();

    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 76;
    const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = Math.max(0, elementPosition - headerHeight - 16);

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    if (window.history && window.history.pushState) {
      window.history.pushState(null, null, hash);
    }

    targetEl.setAttribute('tabindex', '-1');
    targetEl.focus({ preventScroll: true });
  });

  // Deep-link anchor on initial page load
  if (window.location.hash) {
    setTimeout(() => {
      try {
        const target = document.querySelector(window.location.hash);
        if (target) {
          const header = document.querySelector('.site-header');
          const headerHeight = header ? header.offsetHeight : 76;
          const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: Math.max(0, elementPosition - headerHeight - 16),
            behavior: 'smooth'
          });
        }
      } catch (err) {
        // Safe fallback for invalid hash
      }
    }, 120);
  }
}

/* ==========================================================================
   2. SCROLL REVEAL ANIMATIONS (IntersectionObserver for all major sections)
   Fades in and glides content upward as user scrolls through the page
   ========================================================================== */
function initScrollAnimations() {
  const majorSectionSelectors = [
    '#showcase',
    '#comparison',
    '#roi-calculator',
    '#why-a-website',
    '#how-it-works',
    '#turf-simulator',
    '#faq',
    '#final-cta',
    '.final-cta-section',
    '#services',
    '#pricing',
    '#inclusions',
    '#hosting',
    '#mission',
    '#why-trades',
    '#our-principles',
    '#our-commitment',
    '#contact-main',
    '.contact-faq-section',
    '.qsp-global-strip'
  ];

  // Apply reveal class to all major sections
  majorSectionSelectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      if (!el.classList.contains('reveal-on-scroll')) {
        el.classList.add('reveal-on-scroll');
      }
    });
  });

  // Also ensure every main section on the page (excluding heroes with page-load entrance) has reveal-on-scroll
  document.querySelectorAll('main > section:not(#home-hero):not(.page-hero-section)').forEach((sec) => {
    if (!sec.classList.contains('reveal-on-scroll')) {
      sec.classList.add('reveal-on-scroll');
    }
  });

  // Inner components and content blocks that benefit from distinct reveals
  const innerSelectors = [
    '.section-header',
    '.comp-asymmetric-split',
    '.calc-open-container',
    '.editorial-pillars-grid > *',
    '.editorial-value-split',
    '.process-timeline-flow',
    '.faq-editorial-item',
    '.faq-item',
    '.final-cta-open',
    '.pricing-card',
    '.pricing-clean-card',
    '.feature-matrix-table',
    '.about-mission-open',
    '.about-diff-row',
    '.tradie-standard-card',
    '.turf-simulator-container',
    '.service-editorial-col',
    '.scope-estimator-wrap',
    '.deliverable-manifest-item',
    '.contact-card-box',
    '.contact-sidebar-card'
  ];

  innerSelectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      if (!el.classList.contains('reveal-on-scroll') && !el.classList.contains('reveal-stagger')) {
        el.classList.add('reveal-on-scroll');
      }
    });
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-on-scroll, .reveal-stagger').forEach((el) => {
      el.classList.add('is-visible');
    });
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.08
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
        setTimeout(() => {
          entry.target.style.willChange = 'auto';
        }, 800);
      }
    });
  }, observerOptions);

  const targets = document.querySelectorAll('.reveal-on-scroll, .reveal-stagger');
  const vh = window.innerHeight || document.documentElement.clientHeight;

  // Immediately display only elements already well within upper viewport on load
  targets.forEach((target) => {
    const rect = target.getBoundingClientRect();
    if (rect.top < vh * 0.65 && rect.bottom > 80) {
      target.classList.add('is-visible');
      target.style.willChange = 'auto';
    } else {
      observer.observe(target);
    }
  });
}

/* ==========================================================================
   2. HEADER SCROLL & MULTI-PAGE NAVIGATION
   ========================================================================== */
function initHeaderAndNav() {
  const header = document.getElementById('main-header');
  const progressBar = document.getElementById('header-scroll-progress');

  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (progressBar) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    }
  }, { passive: true });

  const path = window.location.pathname;
  let pageName = path.substring(path.lastIndexOf('/') + 1);
  if (!pageName || pageName === '/' || pageName === 'index.html') {
    pageName = 'index.html';
  }

  // Desktop links
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');
  desktopLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === 'index.html' && (href === 'index.html' || href === './' || href === ''))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Mobile links
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === 'index.html' && (href === 'index.html' || href === './' || href === ''))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   3. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const menuIcon = document.getElementById('mobile-menu-icon');

  if (!menuBtn || !drawer) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = drawer.classList.toggle('open');
    if (menuIcon) {
      menuIcon.textContent = isOpen ? 'close' : 'menu';
    }
  });

  const links = drawer.querySelectorAll('a');
  links.forEach((a) => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      if (menuIcon) menuIcon.textContent = 'menu';
    });
  });

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !menuBtn.contains(e.target)) {
      drawer.classList.remove('open');
      if (menuIcon) menuIcon.textContent = 'menu';
    }
  });
}

/* ==========================================================================
   4. LIVE PROJECT SHOWCASE TOGGLE (LAPTOP VS PHONE FRAME)
   ========================================================================== */
function initProjectShowcaseToggle() {
  const toggleBtns = document.querySelectorAll('.showcase-toggle-btn');
  const laptopView = document.getElementById('showcase-laptop-view');
  const phoneView = document.getElementById('showcase-phone-view');

  if (!toggleBtns.length || !laptopView || !phoneView) return;

  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      toggleBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.getAttribute('data-showcase-view');

      const outgoing = view === 'mobile' ? laptopView : phoneView;
      const incoming = view === 'mobile' ? phoneView : laptopView;

      outgoing.style.opacity = '0';
      outgoing.style.transition = 'opacity 0.15s ease';

      setTimeout(() => {
        outgoing.style.display = 'none';
        outgoing.style.opacity = '';
        incoming.style.display = 'flex';
        incoming.style.opacity = '0';
        incoming.style.transition = 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
        requestAnimationFrame(() => {
          incoming.style.opacity = '1';
        });
      }, 150);
    });
  });
}

/* ==========================================================================
   SCALED DESKTOP VIEWPORT FOR LAPTOP MOCKUP (1080px Layout)
   Maintains a crisp 1080px desktop layout width inside the iframe and
   dynamically computes the scale factor to fit the mockup display cleanly.
   Ensures natural vertical scrolling inside the mockup.
   ========================================================================== */
function initLaptopIframeScaling() {
  const displays = document.querySelectorAll('.laptop-screen-display');
  if (!displays.length) return;

  function updateScales() {
    displays.forEach((display) => {
      const width = display.clientWidth;
      if (width > 0) {
        const scale = width / 1080;
        display.style.setProperty('--laptop-scale', scale.toString());
      }
    });
  }

  // Initial calculation
  updateScales();

  // ResizeObserver for fluid responsive changes
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => {
      updateScales();
    });
    displays.forEach((display) => ro.observe(display));
  }

  window.addEventListener('resize', updateScales);

  // Recalculate when view toggle buttons (Desktop | Mobile) are clicked
  const toggleBtns = document.querySelectorAll('.showcase-toggle-btn');
  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      setTimeout(updateScales, 40);
    });
  });
}

/* ==========================================================================
   SCALED MOBILE VIEWPORT FOR IPHONE MOCKUP (390px Standard Layout)
   Maintains authentic 390px iPhone layout width inside the iframe and
   dynamically computes the scale factor to fit the phone display cleanly.
   Ensures natural vertical scrolling and crisp rendering.
   ========================================================================== */
function initPhoneIframeScaling() {
  const displays = document.querySelectorAll('.iphone-display-window');
  if (!displays.length) return;

  function updateScales() {
    displays.forEach((display) => {
      const width = display.clientWidth;
      if (width > 0) {
        const scale = width / 390;
        display.style.setProperty('--phone-scale', scale.toString());
      }
    });
  }

  // Initial calculation
  updateScales();

  // ResizeObserver for fluid responsive changes
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => {
      updateScales();
    });
    displays.forEach((display) => ro.observe(display));
  }

  window.addEventListener('resize', updateScales);

  // Recalculate when view toggle buttons are clicked
  const toggleBtns = document.querySelectorAll('.showcase-toggle-btn');
  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      setTimeout(updateScales, 40);
    });
  });
}

/* ==========================================================================
   ANIMATED NUMBER COUNTER ENGINE
   Smooth numerical count-up easing with frame cancellation
   ========================================================================== */
function animateNumber(element, startVal, endVal, prefix = '', suffix = '', duration = 380) {
  if (!element) return;

  // Cancel any running animation on this element to prevent competing loops
  if (element._animId) {
    cancelAnimationFrame(element._animId);
    element._animId = null;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || duration <= 0 || startVal === endVal) {
    element.textContent = `${prefix}${endVal.toLocaleString('en-AU')}${suffix}`;
    return;
  }

  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.round(startVal + (endVal - startVal) * easeProgress);

    element.textContent = `${prefix}${currentVal.toLocaleString('en-AU')}${suffix}`;

    if (progress < 1) {
      element._animId = requestAnimationFrame(step);
    } else {
      element.textContent = `${prefix}${endVal.toLocaleString('en-AU')}${suffix}`;
      element._animId = null;
    }
  }

  element._animId = requestAnimationFrame(step);
}

/* ==========================================================================
   5. INTERACTIVE JOB PAYBACK / ROI CALCULATOR & VOLUME SLIDER
   Demonstrates how 1 booked electrical job pays for the entire website
   ========================================================================== */
function initPaybackCalculator() {
  const calcButtons = document.querySelectorAll('.calc-job-btn');
  const jobTitleEl = document.getElementById('calc-selected-job-title');
  const packageComparisonEl = document.getElementById('calc-selected-comparison');
  const paybackJobsEl = document.getElementById('calc-payback-jobs-count');

  // Interactive Volume Slider elements
  const volumeSlider = document.getElementById('calc-volume-slider');
  const volumeCountBadge = document.getElementById('calc-volume-count');
  const annualRevenueEl = document.getElementById('calc-annual-revenue');
  const hipagesWasteEl = document.getElementById('calc-hipages-waste');
  const netSavingsEl = document.getElementById('calc-net-savings');

  if (!calcButtons.length || !jobTitleEl) return;

  const jobData = {
    switchboard: {
      name: 'Main Switchboard Upgrade & Safety Verification',
      priceRange: '$1,200 – $3,500',
      avgTicket: 2350,
      netProfit: 1550,
      payback: '1 Job',
      note: 'One switchboard upgrade alone covers your Essential or Professional package outright, with real profit left over on day one.'
    },
    emergency: {
      name: 'Smoke Alarm & Safety Compliance Upgrade',
      priceRange: '$500 – $2,000',
      avgTicket: 1250,
      netProfit: 800,
      payback: '1 or 2 Jobs',
      note: 'Compliance jobs come back every lease cycle. Two bookings and your website is paid off for good — then it just keeps earning.'
    },
    rcd: {
      name: 'House Rewire (Partial to Full)',
      priceRange: '$4,000 – $12,000',
      avgTicket: 8000,
      netProfit: 5000,
      payback: '1 Job',
      note: 'A single house rewire covers your entire digital investment with significant profit left over.'
    },
    downlights: {
      name: '3KW - 5KW Solar Installation',
      priceRange: '$1,000 – $2,000',
      avgTicket: 1500,
      netProfit: 950,
      payback: '1 Job',
      note: 'A single solar setup covers your entire digital investment.'
    },
    gpo: {
      name: 'EV Charger Installation',
      priceRange: '$1,000 – $3,500',
      avgTicket: 2250,
      netProfit: 1400,
      payback: '1 Job',
      note: 'EV demand keeps climbing. One install can cover your entire site, with most of the job margin still in your pocket.'
    }
  };

  let currentJobKey = 'switchboard';
  let previousRevenue = 0;
  let previousWaste = 0;
  let previousNetSavings = 0;

  function updateCalculatorView(isLiveDrag = false) {
    const data = jobData[currentJobKey] || jobData.switchboard;
    const monthlyJobs = volumeSlider ? parseInt(volumeSlider.value, 10) : 3;

    if (jobTitleEl) jobTitleEl.textContent = data.name;
    if (packageComparisonEl) packageComparisonEl.textContent = data.note;
    if (paybackJobsEl) paybackJobsEl.textContent = data.payback;

    // Volume Slider Calculations
    if (volumeCountBadge) {
      volumeCountBadge.textContent = `${monthlyJobs} ${monthlyJobs === 1 ? 'Job' : 'Jobs'} / Month`;
    }

    const calculatedAnnualRevenue = monthlyJobs * data.avgTicket * 12;
    const calculatedLeadWaste = Math.round(monthlyJobs * 2.2 * 65 * 12);
    const calculatedNetSavings = calculatedAnnualRevenue - 1000;

    const animDuration = isLiveDrag ? 120 : 380;

    if (annualRevenueEl) {
      animateNumber(annualRevenueEl, previousRevenue, calculatedAnnualRevenue, '$', ' AUD/yr', animDuration);
      previousRevenue = calculatedAnnualRevenue;
    }

    if (hipagesWasteEl) {
      animateNumber(hipagesWasteEl, previousWaste, calculatedLeadWaste, '$', ' AUD/yr Saved', animDuration);
      previousWaste = calculatedLeadWaste;
    }

    if (netSavingsEl) {
      animateNumber(netSavingsEl, previousNetSavings, calculatedNetSavings, '+$', ' Net Gain', animDuration);
      previousNetSavings = calculatedNetSavings;
    }
  }

  // Job selection button handlers
  calcButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      calcButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentJobKey = btn.getAttribute('data-job') || 'switchboard';
      updateCalculatorView(false);
    });
  });

  // Slider change handler with responsive drag easing
  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      updateCalculatorView(true);
    });
    volumeSlider.addEventListener('change', () => {
      updateCalculatorView(false);
    });
  }

  // Initialize initial state
  updateCalculatorView(false);
}

/* ==========================================================================
   6. INTERACTIVE PACKAGE SCOPE ESTIMATOR (Services Page)
   ========================================================================== */
function initScopeEstimator() {
  const estimatorContainer = document.getElementById('scope-estimator');
  if (!estimatorContainer) return;

  const pkgRadios = estimatorContainer.querySelectorAll('input[name="estimator-pkg"]');
  const addonCheckboxes = estimatorContainer.querySelectorAll('.estimator-addon-check');
  const totalCostEl = document.getElementById('estimator-total-cost');
  const deliveryTimeEl = document.getElementById('estimator-delivery-time');
  const breakevenJobsEl = document.getElementById('estimator-breakeven-jobs');
  const selectBtn = document.getElementById('estimator-select-btn');

  let previousScopePrice = 1250;

  function calculateScope() {
    let basePrice = 1250;
    let selectedPkgKey = 'professional';
    let deliveryDays = '7 to 14 Days';

    pkgRadios.forEach((radio) => {
      if (radio.checked) {
        selectedPkgKey = radio.value;
        if (selectedPkgKey === 'essential' || selectedPkgKey === 'starter') {
          basePrice = 950;
          deliveryDays = 'Within 7 Days';
        } else if (selectedPkgKey === 'premium') {
          basePrice = 1900;
          deliveryDays = '14 to 18 Days';
        } else if (selectedPkgKey === 'custom') {
          basePrice = 2500;
          deliveryDays = 'Custom Scope';
        }
      }
    });

    // Check add-on state visually
    addonCheckboxes.forEach((checkbox) => {
      const parentLabel = checkbox.closest('.estimator-toggle-item');
      if (parentLabel) {
        if (checkbox.checked) {
          parentLabel.classList.add('checked');
        } else {
          parentLabel.classList.remove('checked');
        }
      }
    });

    if (totalCostEl) {
      animateNumber(totalCostEl, previousScopePrice, basePrice, '$', ' AUD', 260);
      previousScopePrice = basePrice;
    }
    if (deliveryTimeEl) {
      deliveryTimeEl.textContent = deliveryDays;
    }
    if (breakevenJobsEl) {
      breakevenJobsEl.textContent = '1 Booked Job (100% Breakeven)';
    }
    if (selectBtn) {
      selectBtn.setAttribute('href', `contact.html?package=${selectedPkgKey}`);
    }
  }

  pkgRadios.forEach((r) => r.addEventListener('change', calculateScope));
  addonCheckboxes.forEach((c) => c.addEventListener('change', calculateScope));

  calculateScope();
}

/* ==========================================================================
   5. FAQ ACCORDION SYSTEM (Unified behaviour across Home, Services, About, Contact)
   ========================================================================== */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item, .faq-editorial-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger, .faq-editorial-trigger');
    const panel = item.querySelector('.faq-panel, .faq-editorial-panel');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isActive = item.classList.contains('active');

      // Close all other open FAQs across the page so only one remains open at a time
      const allActive = document.querySelectorAll('.faq-item.active, .faq-editorial-item.active');
      allActive.forEach((sibling) => {
        if (sibling !== item) {
          sibling.classList.remove('active');
          const sibTrigger = sibling.querySelector('.faq-trigger, .faq-editorial-trigger');
          if (sibTrigger) sibTrigger.setAttribute('aria-expanded', 'false');
          const sibPanel = sibling.querySelector('.faq-panel, .faq-editorial-panel');
          if (sibPanel) {
            sibPanel.style.maxHeight = '0px';
          }
        }
      });

      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = (panel.scrollHeight + 32) + 'px';
      }
    });
  });

  // Category filter tabs if present (e.g. Services page)
  const filterBtns = document.querySelectorAll('.faq-filter-btn');
  const faqGroups = document.querySelectorAll('.faq-group-wrapper');

  if (filterBtns.length && faqGroups.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.getAttribute('data-category');
        faqGroups.forEach((group) => {
          if (cat === 'all' || group.getAttribute('data-group') === cat) {
            group.style.display = 'block';
          } else {
            group.style.display = 'none';
          }
        });
      });
    });
  }
}

/* ==========================================================================
   9. CONTACT FORM HANDLER (WITH DYNAMIC WEBSITE URL & RIGOROUS VALIDATION)
   ========================================================================== */
function initContactFormHandler() {
  const form = document.getElementById('trade-quote-form');
  const packageSelect = document.getElementById('package-select');
  const websiteGroup = document.getElementById('website-url-group');
  const websiteInput = document.getElementById('client-website');
  const nameInput = document.getElementById('client-name');
  const bizInput = document.getElementById('business-name');
  const emailInput = document.getElementById('client-email');
  const phoneInput = document.getElementById('client-phone');
  const projectNotesField = document.getElementById('project-notes');
  const submitBtn = document.getElementById('quote-submit-btn');
  const successCard = document.getElementById('quote-success-card');
  const resetBtn = document.getElementById('reset-quote-btn');
  const progressFill = document.getElementById('form-progress-fill');
  const progressPercentText = document.getElementById('form-progress-percent');

  // Pre-select package from URL parameter (?package=essential, professional, premium, redesign, audit, custom)
  if (packageSelect) {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedPkg = urlParams.get('package');
    if (selectedPkg) {
      if (selectedPkg === 'starter' || selectedPkg === 'essential') {
        packageSelect.value = 'essential';
      } else if (selectedPkg === 'full' || selectedPkg === 'professional') {
        packageSelect.value = 'professional';
      } else if (selectedPkg === 'premium') {
        packageSelect.value = 'premium';
      } else if (selectedPkg === 'redesign') {
        packageSelect.value = 'redesign';
      } else if (selectedPkg === 'audit') {
        packageSelect.value = 'audit';
      } else if (selectedPkg === 'general' || selectedPkg === 'general_inquiry' || selectedPkg === 'general-inquiry' || selectedPkg === 'inquiry') {
        packageSelect.value = 'general';
      } else if (selectedPkg === 'custom') {
        packageSelect.value = 'custom';
      }
    }
  }

  // --- Dynamic Website URL Field Toggle & Compulsory Requirement ---
  function syncWebsiteUrlRequirement() {
    if (!packageSelect || !websiteGroup || !websiteInput) return;
    const selectedVal = packageSelect.value;
    const isWebsiteRequired = (selectedVal === 'redesign' || selectedVal === 'audit');

    if (isWebsiteRequired) {
      websiteGroup.style.display = 'block';
      websiteInput.required = true;
      websiteInput.setAttribute('aria-required', 'true');
    } else {
      websiteGroup.style.display = 'none';
      websiteInput.required = false;
      websiteInput.removeAttribute('aria-required');
      clearFieldError(websiteInput, document.getElementById('client-website-error'));
      websiteInput.setCustomValidity('');
    }
    updateFormProgress();
  }

  // --- Validation Helpers ---
  function setFieldError(inputEl, errorEl, message) {
    if (inputEl) {
      inputEl.classList.remove('has-error');
      void inputEl.offsetWidth; // Force CSS reflow to re-trigger field-shake animation
      inputEl.classList.add('has-error');
    }
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }

  function clearFieldError(inputEl, errorEl) {
    if (inputEl) inputEl.classList.remove('has-error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  function validateName(showError = false) {
    const errorEl = document.getElementById('client-name-error');
    if (!nameInput) return true;
    const val = nameInput.value.trim();
    if (!val) {
      if (showError) setFieldError(nameInput, errorEl, 'Please enter your name.');
      nameInput.setCustomValidity('Please enter your name.');
      return false;
    }
    if (val.length < 2) {
      if (showError) setFieldError(nameInput, errorEl, 'Name must be at least 2 characters.');
      nameInput.setCustomValidity('Name must be at least 2 characters.');
      return false;
    }
    clearFieldError(nameInput, errorEl);
    nameInput.setCustomValidity('');
    return true;
  }

  function validateBusiness(showError = false) {
    const errorEl = document.getElementById('business-name-error');
    if (!bizInput) return true;
    const val = bizInput.value.trim();
    if (!val) {
      if (showError) setFieldError(bizInput, errorEl, 'Please enter your business or trader name.');
      bizInput.setCustomValidity('Please enter your business name.');
      return false;
    }
    clearFieldError(bizInput, errorEl);
    bizInput.setCustomValidity('');
    return true;
  }

  function validateEmail(showError = false) {
    const errorEl = document.getElementById('client-email-error');
    if (!emailInput) return true;
    const val = emailInput.value.trim();

    if (!val) {
      if (showError) setFieldError(emailInput, errorEl, 'Email address is required.');
      emailInput.setCustomValidity('Please enter your email address.');
      return false;
    }

    // Precise RFC-compliant email structure pattern
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(val)) {
      if (showError) setFieldError(emailInput, errorEl, 'Invalid email format');
      emailInput.setCustomValidity('Invalid email format');
      return false;
    }

    clearFieldError(emailInput, errorEl);
    emailInput.setCustomValidity('');
    return true;
  }

  function validatePhone(showError = false) {
    const errorEl = document.getElementById('client-phone-error');
    if (!phoneInput) return true;
    const val = phoneInput.value.trim();
    if (!val) {
      if (showError) setFieldError(phoneInput, errorEl, 'Mobile phone number is required.');
      phoneInput.setCustomValidity('Please enter your phone number.');
      return false;
    }

    // Strip spaces, dashes, parentheses to test digits length
    const digitsOnly = val.replace(/[^0-9]/g, '');
    if (digitsOnly.length < 8 || digitsOnly.length > 15) {
      if (showError) setFieldError(phoneInput, errorEl, 'Please enter a valid phone number (e.g. 0400 123 456).');
      phoneInput.setCustomValidity('Please enter a valid phone number.');
      return false;
    }

    clearFieldError(phoneInput, errorEl);
    phoneInput.setCustomValidity('');
    return true;
  }

  function validateWebsite(showError = false) {
    const errorEl = document.getElementById('client-website-error');
    if (!websiteInput || !websiteGroup || websiteGroup.style.display === 'none') {
      if (websiteInput) {
        clearFieldError(websiteInput, errorEl);
        websiteInput.setCustomValidity('');
      }
      return true;
    }

    const val = websiteInput.value.trim();
    if (!val) {
      if (showError) setFieldError(websiteInput, errorEl, 'Current website URL is compulsory for website redesign or audit.');
      websiteInput.setCustomValidity('Please enter your current website URL.');
      return false;
    }

    // Supports: https://example.com, http://www.example.com.au, example.com.au, www.example.com
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/.*)?$/i;
    if (!urlPattern.test(val)) {
      if (showError) setFieldError(websiteInput, errorEl, 'Please enter a valid website URL (e.g. yoursite.com.au or https://yoursite.com.au).');
      websiteInput.setCustomValidity('Please enter a valid website URL.');
      return false;
    }

    clearFieldError(websiteInput, errorEl);
    websiteInput.setCustomValidity('');
    return true;
  }

  // Set custom validity message for native browser dialogs
  if (emailInput) {
    emailInput.addEventListener('invalid', () => {
      if (emailInput.validity.valueMissing) {
        emailInput.setCustomValidity('Please enter your email address.');
      } else {
        emailInput.setCustomValidity('Invalid email format');
      }
    });

    emailInput.addEventListener('input', () => {
      emailInput.setCustomValidity('');
      if (emailInput.classList.contains('has-error')) {
        validateEmail(true);
      }
    });

    emailInput.addEventListener('blur', () => {
      if (emailInput.value.trim().length > 0) {
        validateEmail(true);
      }
    });
  }

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.classList.contains('has-error')) validateName(true);
    });
    nameInput.addEventListener('blur', () => {
      if (nameInput.value.trim().length > 0) validateName(true);
    });
  }

  if (bizInput) {
    bizInput.addEventListener('input', () => {
      if (bizInput.classList.contains('has-error')) validateBusiness(true);
    });
    bizInput.addEventListener('blur', () => {
      if (bizInput.value.trim().length > 0) validateBusiness(true);
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      if (phoneInput.classList.contains('has-error')) validatePhone(true);
    });
    phoneInput.addEventListener('blur', () => {
      if (phoneInput.value.trim().length > 0) validatePhone(true);
    });
  }

  if (websiteInput) {
    websiteInput.addEventListener('input', () => {
      if (websiteInput.classList.contains('has-error')) validateWebsite(true);
    });
    websiteInput.addEventListener('blur', () => {
      if (websiteInput.value.trim().length > 0) validateWebsite(true);
    });
  }

  if (packageSelect) {
    packageSelect.addEventListener('change', () => {
      syncWebsiteUrlRequirement();
    });
  }

  // Live Form Progress Bar Calculation
  function updateFormProgress() {
    if (!form || !progressFill) return;
    const requiredInputs = form.querySelectorAll('input[required], select[required]');
    let filledCount = 0;
    let activeRequiredCount = 0;

    requiredInputs.forEach((input) => {
      const parentGroup = input.closest('.form-group-wrap');
      if (parentGroup && parentGroup.style.display === 'none') return;

      activeRequiredCount++;
      if (input.value && input.value.trim().length > 0) {
        filledCount++;
      }
    });

    // Optional field bonus
    if (projectNotesField && projectNotesField.value.trim().length > 0) {
      filledCount += 0.5;
    }

    const totalFields = activeRequiredCount + 0.5;
    const percentage = Math.min(100, Math.round((filledCount / totalFields) * 100));

    progressFill.style.width = `${Math.max(15, percentage)}%`;
    if (progressPercentText) {
      progressPercentText.textContent = `${percentage}% Complete`;
    }
  }

  if (form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach((input) => {
      input.addEventListener('input', updateFormProgress);
      input.addEventListener('change', updateFormProgress);
    });
  }

  // Initial synchronization for package selection and progress
  syncWebsiteUrlRequirement();
  updateFormProgress();

  if (!form) return;

  // Form Submission with Strict Validation
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateName(true);
    const isBizValid = validateBusiness(true);
    const isEmailValid = validateEmail(true);
    const isPhoneValid = validatePhone(true);
    const isWebsiteValid = validateWebsite(true);

    if (!isNameValid || !isBizValid || !isEmailValid || !isPhoneValid || !isWebsiteValid) {
      // Focus first erroneous input
      const firstError = form.querySelector('.form-field-input.has-error, .form-field-select.has-error');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span>
        <span>Sending Request...</span>
      `;
    }

    setTimeout(() => {
      form.style.display = 'none';
      const formIntro = document.getElementById('quote-form-intro');
      if (formIntro) formIntro.style.display = 'none';
      if (successCard) {
        successCard.style.display = 'flex';
        successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 700);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      const formIntro = document.getElementById('quote-form-intro');
      if (formIntro) formIntro.style.display = 'block';
      if (successCard) successCard.style.display = 'none';

      // Clear any validation errors
      form.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
      form.querySelectorAll('.field-error-msg').forEach(el => {
        el.textContent = '';
        el.classList.remove('visible');
      });

      syncWebsiteUrlRequirement();
      updateFormProgress();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Submit Form</span>
          <span class="material-symbols-outlined">arrow_forward</span>
        `;
      }
    });
  }
}

/* ==========================================================================
   7. BACK TO TOP & STICKY MOBILE ACTION BAR
   ========================================================================== */
function initBackToTopAndMobileBar() {
  const bttBtn = document.getElementById('back-to-top-btn');
  const mobileBar = document.getElementById('mobile-action-bar');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (bttBtn) {
      if (scrollY > 400) {
        bttBtn.classList.add('visible');
      } else {
        bttBtn.classList.remove('visible');
      }
    }

    if (mobileBar) {
      if (scrollY > 300) {
        mobileBar.classList.add('visible');
      } else {
        mobileBar.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (bttBtn) {
    bttBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   11. INTERACTIVE SUBURB TURF & KEYWORD VISIBILITY SIMULATOR
   ========================================================================== */
function initSuburbTurfSimulator() {
  const container = document.getElementById('suburb-turf-simulator');
  if (!container) return;

  const tabs = container.querySelectorAll('.turf-region-btn');
  const regionNameEl = document.getElementById('turf-region-name');
  const suburbsListEl = document.getElementById('turf-suburbs-list');
  const searchVolumeEl = document.getElementById('turf-monthly-searches');
  const avgValueEl = document.getElementById('turf-avg-job-value');
  const annualOpportunityEl = document.getElementById('turf-annual-opportunity');
  const previewSnippetTitle = document.getElementById('turf-snippet-title');
  const customInput = document.getElementById('turf-custom-suburb-input');
  const customBtn = document.getElementById('turf-custom-suburb-btn');
  const customFeedback = document.getElementById('turf-custom-feedback');

  const regionData = {
    sydney: {
      name: 'Sydney Metro & Eastern Suburbs Radius',
      suburbs: ['Marrickville', 'Bondi', 'Newtown', 'Surry Hills', 'Coogee', 'Balmain', 'Paddington', 'Leichhardt', 'Randwick', 'Alexandria', 'Double Bay', 'Rose Bay', 'Rozelle', 'Annandale'],
      searches: 3850,
      avgTicket: 1350,
      annualOpp: 46200,
      sampleSnippet: 'Apex Electrical Sydney • 24/7 Emergency Electrician Inner West & Bondi'
    },
    melbourne: {
      name: 'Melbourne Bayside & Inner East Territory',
      suburbs: ['Richmond', 'Brighton', 'St Kilda', 'Hawthorn', 'Brunswick', 'Fitzroy', 'South Yarra', 'Camberwell', 'Prahran', 'Port Melbourne', 'Collingwood', 'Elsternwick', 'Footscray'],
      searches: 3400,
      avgTicket: 1280,
      annualOpp: 40960,
      sampleSnippet: 'Apex Electrical Melbourne • REC Licensed Electrician Bayside & Inner East'
    },
    brisbane: {
      name: 'Brisbane Metro & Gold Coast Corridor',
      suburbs: ['New Farm', 'Fortitude Valley', 'Paddington (QLD)', 'Bulimba', 'West End', 'Chermside', 'Indooroopilly', 'Carindale', 'Surfers Paradise', 'Southport', 'Robina', 'Burleigh Heads'],
      searches: 2950,
      avgTicket: 1200,
      annualOpp: 35400,
      sampleSnippet: 'Apex Electrical QLD • Fast Switchboard Upgrades & EV Chargers Brisbane'
    },
    perth: {
      name: 'Perth Metro & Coastal Corridor',
      suburbs: ['Cottesloe', 'Fremantle', 'Subiaco', 'Scarborough', 'Joondalup', 'Mount Lawley', 'Claremont', 'South Perth', 'Victoria Park', 'Applecross', 'Nedlands'],
      searches: 2300,
      avgTicket: 1250,
      annualOpp: 28750,
      sampleSnippet: 'Apex Electrical WA • EC Licensed Contractors Perth Metro & Fremantle'
    },
    adelaide: {
      name: 'Adelaide Metro & Hills Territory',
      suburbs: ['Norwood', 'Glenelg', 'Unley', 'Prospect', 'Burnside', 'North Adelaide', 'Brighton (SA)', 'Stirling', 'Mawson Lakes', 'Henley Beach', 'Hyde Park'],
      searches: 1850,
      avgTicket: 1150,
      annualOpp: 22200,
      sampleSnippet: 'Apex Electrical SA • Emergency Electrician Adelaide Metro & Coastal'
    }
  };

  let previousSearches = 0;
  let previousOpp = 0;

  function renderRegion(key) {
    const data = regionData[key] || regionData.sydney;

    if (regionNameEl) regionNameEl.textContent = data.name;
    if (previewSnippetTitle) previewSnippetTitle.textContent = data.sampleSnippet;

    if (suburbsListEl) {
      suburbsListEl.innerHTML = data.suburbs.map(sub => `
        <span class="turf-suburb-tag">
          <span class="material-symbols-outlined" style="font-size: 13px; color: var(--color-accent);">location_on</span>
          <span>${sub}</span>
        </span>
      `).join('');
    }

    if (searchVolumeEl) {
      animateNumber(searchVolumeEl, previousSearches, data.searches, '', ' /mo', 400);
      previousSearches = data.searches;
    }

    if (avgValueEl) {
      avgValueEl.textContent = `$${data.avgTicket.toLocaleString('en-AU')} AUD`;
    }

    if (annualOpportunityEl) {
      animateNumber(annualOpportunityEl, previousOpp, data.annualOpp, '+$', ' AUD/yr', 450);
      previousOpp = data.annualOpp;
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const reg = tab.getAttribute('data-region') || 'sydney';
      renderRegion(reg);
    });
  });

  // Custom Suburb Search Handler
  if (customBtn && customInput) {
    const handleCustomSuburb = () => {
      const query = customInput.value.trim();
      if (!query) return;

      if (customFeedback) {
        customFeedback.style.display = 'block';
        customFeedback.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px; color: var(--color-accent); font-weight: 700;">
            <span class="material-symbols-outlined" style="font-size: 16px; animation: spin 1s infinite;">sync</span>
            <span>Calculating 15km Local Schema Turf for "${query}"...</span>
          </div>
        `;
        setTimeout(() => {
          customFeedback.innerHTML = `
            <div style="padding: 12px 14px; background: rgba(52, 211, 153, 0.08); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: var(--radius-sm); color: #34d399; font-size: 0.8125rem;">
              <strong>✓ Ready for Launch:</strong> We configure Google Schema.org <code>areaServed</code> tags for <strong>${query}</strong> + surrounding adjacent suburbs so when local homeowners search, your phone rings directly without directory lead auction fees.
            </div>
          `;
        }, 500);
      }
    };

    customBtn.addEventListener('click', handleCustomSuburb);
    customInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCustomSuburb();
      }
    });
  }

  // Initialize Sydney by default
  renderRegion('sydney');
}
