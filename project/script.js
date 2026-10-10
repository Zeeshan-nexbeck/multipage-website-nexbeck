/**
 * NEXBECK — AUSTRALIAN TRADE & ELECTRICAL WEB DESIGN AGENCY
 * Shared JavaScript for: Home, Services, About, Contact
 * Pure Vanilla JavaScript — Zero Framework Dependencies
 */

function initApp() {
  // 1. Smooth native anchor scrolling
  initSmoothAnchorScrolling();

  // 2. Scroll-triggered reveal animations with auto-observing engine
  initScrollAnimations();

  // 3. Header scroll styling & multi-page active nav
  initHeaderAndNav();

  // 4. Horizontal scroll progress indicator bar under navbar
  initScrollProgressBar();

  // 5. Mobile navigation drawer
  initMobileDrawer();

  // 6. Live Project Showcase Toggle (Desktop | Mobile Frame)
  initProjectShowcaseToggle();
  initLaptopIframeScaling();
  initPhoneIframeScaling();

  // 7. Interactive Job Payback / ROI Calculator
  initPaybackCalculator();

  // 8. FAQ Accordions (Homepage, Services, About, Contact)
  initFaqAccordions();

  // 9. Contact form handling
  initContactFormHandler();

  // 10. Sticky mobile bar and back-to-top button
  initBackToTopAndMobileBar();

  // 11. Mobile pricing cards carousel & active card tracker
  initPricingMobileSlider();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/* ==========================================================================
   1. SMOOTH NATIVE ANCHOR SCROLLING
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
    '.service-editorial-col',
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

  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
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
   2b. HORIZONTAL SCROLL READING PROGRESS BAR
   Expands dynamically from left to right as the user scrolls down
   ========================================================================== */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  let ticking = false;

  function update() {
    const windowY = (window.pageYOffset !== undefined) ? window.pageYOffset : (window.scrollY || 0);
    const docElemY = (document.documentElement && document.documentElement.scrollTop) ? document.documentElement.scrollTop : 0;
    const bodyY = (document.body && document.body.scrollTop) ? document.body.scrollTop : 0;
    const scrollElY = (document.scrollingElement && document.scrollingElement.scrollTop) ? document.scrollingElement.scrollTop : 0;

    let scrollTop = Math.max(windowY, docElemY, bodyY, scrollElY);

    const docHeight = Math.max(
      document.documentElement ? document.documentElement.scrollHeight : 0,
      document.body ? document.body.scrollHeight : 0,
      document.documentElement ? document.documentElement.offsetHeight : 0,
      document.body ? document.body.offsetHeight : 0
    );

    const viewHeight = window.innerHeight || (document.documentElement ? document.documentElement.clientHeight : 0) || (document.body ? document.body.clientHeight : 0) || 0;

    let maxScroll = docHeight - viewHeight;

    // Fallback: If an inner wrapper is scrolling (e.g. iframe container)
    if (maxScroll <= 0 || scrollTop === 0) {
      const candidates = [
        document.querySelector('main'),
        document.querySelector('.site-wrapper')
      ];
      for (const el of candidates) {
        if (el && el.scrollTop > 0) {
          scrollTop = el.scrollTop;
          maxScroll = el.scrollHeight - el.clientHeight;
          break;
        }
      }
    }

    let pct = 0;
    if (maxScroll > 0) {
      pct = Math.min(Math.max((scrollTop / maxScroll) * 100, 0), 100);
    }

    progressBar.style.width = `${pct}%`;
    progressBar.setAttribute('aria-valuenow', Math.round(pct).toString());
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(() => {
          try {
            update();
          } finally {
            ticking = false;
          }
        });
      } else {
        try {
          update();
        } finally {
          ticking = false;
        }
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('scroll', onScroll, { passive: true });
  if (document.body) {
    document.body.addEventListener('scroll', onScroll, { passive: true });
  }
  window.addEventListener('resize', onScroll, { passive: true });

  // Initial and delayed updates (ensures custom webfonts/images layout settle)
  update();
  setTimeout(update, 100);
  setTimeout(update, 400);
  window.addEventListener('load', update);
}

/* ==========================================================================
   3. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const menuIcon = document.getElementById('mobile-menu-icon');
  const header = document.getElementById('main-header');

  if (!menuBtn || !drawer) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = drawer.classList.toggle('open');
    if (header) {
      header.classList.toggle('drawer-open', isOpen);
    }
    if (menuIcon) {
      menuIcon.textContent = isOpen ? 'close' : 'menu';
    }
  });

  const links = drawer.querySelectorAll('a');
  links.forEach((a) => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      if (header) {
        header.classList.remove('drawer-open');
      }
      if (menuIcon) menuIcon.textContent = 'menu';
    });
  });

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !menuBtn.contains(e.target)) {
      drawer.classList.remove('open');
      if (header) {
        header.classList.remove('drawer-open');
      }
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
      setTimeout(updateScales, 180);
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
      setTimeout(updateScales, 180);
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

  if (!calcButtons.length || !jobTitleEl) return;

  const jobData = {
    switchboard: {
      name: 'Main Switchboard Upgrade & Safety Verification',
      shortName: 'Switchboard Upgrade',
      priceRange: '$1,200 – $3,500',
      avgTicket: 2350,
      netProfit: 1550,
      payback: '1 Job',
      note: 'One switchboard upgrade alone covers your Essential or Professional package outright, with real profit left over on day one.'
    },
    emergency: {
      name: 'Smoke Alarm & Safety Compliance Upgrade',
      shortName: 'Smoke Alarm & Safety Compliance',
      priceRange: '$500 – $2,000',
      avgTicket: 1250,
      netProfit: 800,
      payback: '1 or 2 Jobs',
      note: 'Compliance jobs come back every lease cycle. Two bookings and your website is paid off for good — then it just keeps earning.'
    },
    rcd: {
      name: 'House Rewire (Partial to Full)',
      shortName: 'House Rewire (Partial to Full)',
      priceRange: '$4,000 – $12,000',
      avgTicket: 8000,
      netProfit: 5000,
      payback: '1 Job',
      note: 'A single house rewire covers your entire digital investment with significant profit left over.'
    },
    downlights: {
      name: '3KW - 5KW Solar Installation',
      shortName: '3KW - 5KW Solar Installation',
      priceRange: '$1,000 – $2,000',
      avgTicket: 1500,
      netProfit: 950,
      payback: '1 Job',
      note: 'A single solar setup covers your entire digital investment.'
    },
    gpo: {
      name: 'EV Charger Installation',
      shortName: 'EV Charger Installation',
      priceRange: '$1,000 – $3,500',
      avgTicket: 2250,
      netProfit: 1400,
      payback: '1 Job',
      note: 'EV demand keeps climbing. One install can cover your entire site, with most of the job margin still in your pocket.'
    }
  };

  let currentJobKey = 'switchboard';

  // Mobile Dropdown Elements
  const dropdownContainer = document.getElementById('calc-mobile-dropdown');
  const dropdownTrigger = document.getElementById('calc-dropdown-trigger');
  const dropdownItems = document.querySelectorAll('.calc-dropdown-item');
  const dropdownSelectedName = document.getElementById('calc-dropdown-selected-name');
  const dropdownSelectedPrice = document.getElementById('calc-dropdown-selected-price');
  const nativeSelect = document.getElementById('calc-mobile-select-native');

  function selectJob(jobKey) {
    if (!jobData[jobKey]) return;
    currentJobKey = jobKey;

    // Sync desktop button states
    calcButtons.forEach((btn) => {
      const isMatch = btn.getAttribute('data-job') === jobKey;
      btn.classList.toggle('active', isMatch);
    });

    // Sync mobile dropdown items
    dropdownItems.forEach((item) => {
      const isMatch = item.getAttribute('data-job') === jobKey;
      item.classList.toggle('active', isMatch);
      item.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    // Update mobile dropdown display trigger
    const d = jobData[jobKey];
    if (dropdownSelectedName) {
      dropdownSelectedName.textContent = d.shortName || d.name;
    }
    if (dropdownSelectedPrice) {
      dropdownSelectedPrice.textContent = `Typical Ticket: ${d.priceRange}`;
    }

    // Sync native select value
    if (nativeSelect && nativeSelect.value !== jobKey) {
      nativeSelect.value = jobKey;
    }

    updateCalculatorView();
  }

  function updateCalculatorView() {
    const data = jobData[currentJobKey] || jobData.switchboard;

    if (jobTitleEl) jobTitleEl.textContent = data.name;
    if (packageComparisonEl) packageComparisonEl.textContent = data.note;
    if (paybackJobsEl) paybackJobsEl.textContent = data.payback;
  }

  // Job selection button handlers (Desktop / Tablet)
  calcButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const jobKey = btn.getAttribute('data-job') || 'switchboard';
      selectJob(jobKey);
    });
  });

  // Mobile Custom Dropdown Handlers
  if (dropdownTrigger && dropdownContainer) {
    dropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdownContainer.classList.toggle('open');
      dropdownTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    dropdownItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const jobKey = item.getAttribute('data-job');
        if (jobKey) {
          selectJob(jobKey);
        }
        dropdownContainer.classList.remove('open');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdownContainer.contains(e.target)) {
        dropdownContainer.classList.remove('open');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close dropdown on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdownContainer.classList.contains('open')) {
        dropdownContainer.classList.remove('open');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
        dropdownTrigger.focus();
      }
    });
  }

  // Native select change handler for mobile accessibility
  if (nativeSelect) {
    nativeSelect.addEventListener('change', (e) => {
      selectJob(e.target.value);
    });
  }

  // Initialize initial state with default switchboard
  selectJob('switchboard');
}

/* ==========================================================================
   6. FAQ ACCORDION SYSTEM (Unified behaviour across Home, Services, About, Contact)
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

  // Recalculate heights of any currently open FAQ panels on screen resize or device orientation change
  window.addEventListener('resize', () => {
    document.querySelectorAll('.faq-item.active, .faq-editorial-item.active').forEach((activeItem) => {
      const panel = activeItem.querySelector('.faq-panel, .faq-editorial-panel');
      if (panel && panel.style.maxHeight && panel.style.maxHeight !== '0px') {
        panel.style.maxHeight = (panel.scrollHeight + 32) + 'px';
      }
    });
  });
}

/* ==========================================================================
   7. CONTACT FORM HANDLER (WITH DYNAMIC WEBSITE URL & RIGOROUS VALIDATION)
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

  // Initial synchronization for package selection
  syncWebsiteUrlRequirement();

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
   9. PRICING MOBILE SLIDER & INFINITE LOOP TRACKER (Services page)
   - Professional package card centered initially
   - Single-card change per swipe (e.g. 3/5 -> 4/5)
   - Smooth cubic-bezier spring-like animation
   - Previous and next card peeks visible on screen
   - Seamless infinite loop: 5/5 swipe right -> 1/5, and 1/5 swipe left -> 5/5
   ========================================================================== */
function initPricingMobileSlider() {
  const pricingGrid = document.getElementById('pricing-clean-grid') || document.querySelector('.pricing-clean-grid');
  const counterPill = document.getElementById('pricing-mobile-counter-pill');
  if (!pricingGrid) return;

  const allCards = Array.from(pricingGrid.querySelectorAll('.pricing-clean-card'));
  if (!allCards.length) return;

  // Indices with 2-clone buffer:
  // 0: Clone 4, 1: Clone 5,
  // 2: Card 1 (Essential), 3: Card 2 (Professional - Featured), 4: Card 3 (Premium),
  // 5: Card 4 (Redesign), 6: Card 5 (Custom Fit),
  // 7: Clone 1, 8: Clone 2
  let currentIndex = 3; // Start on Card 2 (Professional package)
  let isDragging = false;
  let isHorizontalDrag = null;
  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let startTranslateX = 0;
  let currentTranslateX = 0;
  let isAnimating = false;
  let animationSafetyTimer = null;
  let hasMoved = false;

  function isCarouselActive() {
    return window.innerWidth <= 767 || window.getComputedStyle(pricingGrid).display === 'flex';
  }

  function getCardPosition(index) {
    const card = allCards[index];
    if (!card) return 0;
    const viewport = pricingGrid.parentElement;
    const viewportWidth = viewport ? viewport.clientWidth : window.innerWidth;
    const cardWidth = card.offsetWidth || (viewportWidth * 0.76);
    const cardLeft = card.offsetLeft;
    // Perfect horizontal centering of active card inside the viewport
    return ((viewportWidth - cardWidth) / 2) - cardLeft;
  }

  function getDisplayNumber(index) {
    if (index >= 2 && index <= 6) return index - 1; // 2->1, 3->2, 4->3, 5->4, 6->5
    if (index === 0) return 4;
    if (index === 1) return 5;
    if (index === 7) return 1;
    if (index === 8) return 2;
    return 1;
  }

  function updateCounter(index) {
    if (!counterPill) return;
    const displayNumber = getDisplayNumber(index);
    counterPill.textContent = `${displayNumber}/5`;
  }

  function updateActiveCard(index) {
    allCards.forEach((card, i) => {
      if (i === index) {
        card.classList.add('active-carousel-card');
      } else {
        card.classList.remove('active-carousel-card');
      }
    });
  }

  function setTransform(translateX, withTransition = true) {
    if (withTransition) {
      pricingGrid.style.transition = 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)';
    } else {
      pricingGrid.style.transition = 'none';
    }
    pricingGrid.style.transform = `translate3d(${Math.round(translateX)}px, 0, 0)`;
    currentTranslateX = translateX;
  }

  function jumpToRealCardIfNeeded() {
    if (currentIndex === 7) {
      currentIndex = 2; // Jump from Clone 1 to Real Card 1
      setTransform(getCardPosition(2), false);
      updateActiveCard(2);
    } else if (currentIndex === 8) {
      currentIndex = 3; // Jump from Clone 2 to Real Card 2
      setTransform(getCardPosition(3), false);
      updateActiveCard(3);
    } else if (currentIndex === 1) {
      currentIndex = 6; // Jump from Clone 5 to Real Card 5
      setTransform(getCardPosition(6), false);
      updateActiveCard(6);
    } else if (currentIndex === 0) {
      currentIndex = 5; // Jump from Clone 4 to Real Card 4
      setTransform(getCardPosition(5), false);
      updateActiveCard(5);
    }
  }

  function goToIndex(targetIndex, animate = true) {
    currentIndex = targetIndex;
    updateCounter(currentIndex);
    updateActiveCard(currentIndex);

    if (!isCarouselActive()) {
      pricingGrid.style.transform = '';
      pricingGrid.style.transition = '';
      return;
    }

    const targetPos = getCardPosition(currentIndex);
    clearTimeout(animationSafetyTimer);

    if (animate) {
      isAnimating = true;
      setTransform(targetPos, true);
      // Safety timeout in case transitionend does not fire
      animationSafetyTimer = setTimeout(() => {
        if (isAnimating) {
          isAnimating = false;
          jumpToRealCardIfNeeded();
        }
      }, 420);
    } else {
      isAnimating = false;
      setTransform(targetPos, false);
    }
  }

  // Handle transition end for seamless infinite loop reset
  pricingGrid.addEventListener('transitionend', (e) => {
    if (e.target !== pricingGrid || e.propertyName !== 'transform') return;
    isAnimating = false;
    clearTimeout(animationSafetyTimer);

    if (!isCarouselActive()) return;
    jumpToRealCardIfNeeded();
  });

  // Start gesture (Thumb Touch or Mouse Drag)
  function handleDragStart(clientX, clientY) {
    if (!isCarouselActive()) return;

    if (isAnimating) {
      pricingGrid.style.transition = 'none';
      isAnimating = false;
      clearTimeout(animationSafetyTimer);
    }
    jumpToRealCardIfNeeded();

    isDragging = true;
    hasMoved = false;
    isHorizontalDrag = null;
    startX = clientX;
    startY = clientY;
    startTime = Date.now();
    startTranslateX = getCardPosition(currentIndex);
    pricingGrid.style.transition = 'none';
  }

  // Move gesture with thumb-arc compensation
  function handleDragMove(clientX, clientY, cancelableEvent) {
    if (!isDragging || !isCarouselActive()) return;
    const diffX = clientX - startX;
    const diffY = clientY - startY;
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    if (isHorizontalDrag === null) {
      // Natural thumb gesture detection:
      // If movement is predominantly vertical (absY > 12 and significantly greater than absX), let page scroll
      if (absY > 12 && absY > absX * 1.5) {
        isHorizontalDrag = false;
        isDragging = false;
        return;
      }
      // If user moved horizontally at least 7px with thumb
      if (absX > 7 && absX >= absY * 0.65) {
        isHorizontalDrag = true;
      }
    }

    if (isHorizontalDrag) {
      hasMoved = true;
      if (cancelableEvent && cancelableEvent.cancelable) {
        cancelableEvent.preventDefault();
      }
      setTransform(startTranslateX + diffX, false);
    }
  }

  // End gesture: one swipe advances exactly one card
  function handleDragEnd(clientX) {
    if (!isDragging) return;
    isDragging = false;

    if (!isHorizontalDrag || !hasMoved) {
      isHorizontalDrag = null;
      return;
    }

    const diffX = clientX - startX;
    const elapsed = Math.max(1, Date.now() - startTime);
    const velocityX = diffX / elapsed;

    // Detect flick or standard thumb drag threshold
    const isFlick = Math.abs(velocityX) > 0.22 && Math.abs(diffX) > 16;
    const isSwipe = Math.abs(diffX) > 26;

    if (isFlick || isSwipe) {
      if (diffX < 0) {
        // Swiped left with thumb -> advance forward one card
        goToIndex(currentIndex + 1, true);
      } else {
        // Swiped right with thumb -> go back one card
        goToIndex(currentIndex - 1, true);
      }
    } else {
      // Small touch movement didn't meet threshold -> snap back smoothly to current card
      goToIndex(currentIndex, true);
    }

    isHorizontalDrag = null;
  }

  // --- Attach Touch Event Handlers to both Grid and Viewport ---
  const sliderViewport = pricingGrid.parentElement;
  const touchTargets = [pricingGrid, sliderViewport].filter(Boolean);

  touchTargets.forEach((target) => {
    target.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  });

  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY, e);
    }
  }, { passive: false });

  window.addEventListener('touchend', (e) => {
    if (isDragging) {
      const touch = e.changedTouches ? e.changedTouches[0] : e;
      handleDragEnd(touch.clientX);
    }
  }, { passive: true });

  window.addEventListener('touchcancel', (e) => {
    if (isDragging) {
      const touch = e.changedTouches ? e.changedTouches[0] : e;
      handleDragEnd(touch.clientX);
    }
  }, { passive: true });

  // --- Mouse Drag Support for Desktop testing / DevTools ---
  let isMouseDown = false;
  touchTargets.forEach((target) => {
    target.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isMouseDown = true;
      handleDragStart(e.clientX, e.clientY);
    });
  });

  window.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
      handleDragMove(e.clientX, e.clientY, e);
    }
  });

  window.addEventListener('mouseup', (e) => {
    if (isMouseDown) {
      isMouseDown = false;
      handleDragEnd(e.clientX);
    }
  });

  // Prevent link navigation if the user was swiping with thumb
  pricingGrid.addEventListener('click', (e) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      hasMoved = false;
    }
  }, true);

  // Initial layout & positioning
  function initLayout() {
    if (isCarouselActive()) {
      goToIndex(3, false); // Initialize Professional package (Card 2) centered
    } else {
      pricingGrid.style.transform = '';
      pricingGrid.style.transition = '';
    }
  }

  // Run on ready and after layout settle
  requestAnimationFrame(() => {
    initLayout();
    setTimeout(initLayout, 80);
    setTimeout(initLayout, 250);
  });

  window.addEventListener('resize', () => {
    initLayout();
  });
  window.addEventListener('orientationchange', () => {
    setTimeout(initLayout, 100);
  });
}

