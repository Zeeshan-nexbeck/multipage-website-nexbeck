/**
 * NEXBECK — AUSTRALIAN TRADE & ELECTRICAL WEB DESIGN AGENCY
 * Shared JavaScript for: Home, Services, About, Contact
 * Pure Vanilla JavaScript — Zero Framework Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Subtle electrical ambient background with mouse interaction & click sparks
  initAmbientCanvas();

  // 2. Scroll-triggered reveal animations with auto-observing engine
  initScrollAnimations();

  // 3. Header scroll styling & multi-page active nav
  initHeaderAndNav();

  // 4. Mobile navigation drawer
  initMobileDrawer();

  // 5. Live Project Showcase Toggle (Desktop | Mobile Frame)
  initProjectShowcaseToggle();
  initLaptopIframeScaling();
  initPhoneIframeScaling();

  // 6. Interactive Job Payback / ROI Calculator with Live Volume Slider & Count-Up
  initPaybackCalculator();

  // 7. Interactive Suburb Turf Coverage & Demand Simulator
  initSuburbTurfSimulator();

  // 8. Interactive Package Scope & Inclusions Estimator (Services page)
  initScopeEstimator();

  // 9. FAQ Accordions (Homepage, Services, About, Contact)
  initFaqAccordions();

  // 10. Contact form handling with Live Progress & Trade Presets
  initContactFormHandler();

  // 11. Sticky mobile bar and back-to-top button
  initBackToTopAndMobileBar();

  // 12. Micro-interactions: 3D perspective tilt & tactile hover
  initTiltEffect();
});

/* ==========================================================================
   1. ELECTRICAL AMBIENT CANVAS (With Subtle Cursor Reaction & Click Sparks)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Respect user preference for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  let mouse = { x: -1000, y: -1000, active: false };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Click spark particle engine
  const clickSparks = [];
  window.addEventListener('click', (e) => {
    const numSparks = 10;
    for (let i = 0; i < numSparks; i++) {
      const angle = (Math.PI * 2 * i) / numSparks + (Math.random() - 0.5) * 0.6;
      const speed = Math.random() * 3.2 + 1.2;
      clickSparks.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: Math.random() * 0.035 + 0.025,
        color: Math.random() > 0.3 ? '201, 138, 44' : '28, 26, 23',
        size: Math.random() * 2 + 1
      });
    }
  });

  // Subtle electrical nodes with hairline connections
  const numNodes = 16;
  const nodes = [];

  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      radius: Math.random() * 1.5 + 1.0,
      alpha: Math.random() * 0.2 + 0.08
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw and update ambient floating electrical nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0) n.x = width;
      if (n.x > width) n.x = 0;
      if (n.y < 0) n.y = height;
      if (n.y > height) n.y = 0;

      // Mouse interactive attraction & glow
      let currentAlpha = n.alpha;
      if (mouse.active) {
        const mdx = mouse.x - n.x;
        const mdy = mouse.y - n.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 180) {
          currentAlpha = Math.min(0.45, n.alpha + (1 - mdist / 180) * 0.25);
          // Very gentle attraction drift
          n.x += (mdx / mdist) * 0.15;
          n.y += (mdy / mdist) * 0.15;

          // Draw faint spark hairline to cursor
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(201, 138, 44, ${(1 - mdist / 180) * 0.12})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw amber node particle
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 138, 44, ${currentAlpha})`;
      ctx.fill();

      // Draw subtle connecting hairlines between nearby nodes
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n.x - n2.x;
        const dy = n.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 155) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(201, 138, 44, ${0.05 * (1 - dist / 155)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // 2. Draw and update click sparks
    for (let i = clickSparks.length - 1; i >= 0; i--) {
      const s = clickSparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.06; // subtle gravity
      s.vx *= 0.97; // drag
      s.life -= s.decay;

      if (s.life <= 0) {
        clickSparks.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color}, ${s.life * 0.85})`;
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. SCROLL REVEAL ANIMATIONS (IntersectionObserver Auto Engine)
   ========================================================================== */
function initScrollAnimations() {
  const autoSelectors = [
    '.section-header',
    '.comp-asymmetric-split',
    '.calc-open-container',
    '.editorial-pillars-grid > *',
    '.editorial-value-split',
    '.process-timeline-flow > *',
    '.faq-editorial-item',
    '.final-cta-open',
    '.pricing-card',
    '.feature-matrix-table',
    '.about-mission-open',
    '.about-diff-row',
    '.turf-simulator-container'
  ];

  autoSelectors.forEach((sel) => {
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
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.06
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const targets = document.querySelectorAll('.reveal-on-scroll, .reveal-stagger');
  targets.forEach((target) => observer.observe(target));
}

/* ==========================================================================
   2. HEADER SCROLL & MULTI-PAGE NAVIGATION
   ========================================================================== */
function initHeaderAndNav() {
  const header = document.getElementById('main-header');

  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
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
      toggleBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.getAttribute('data-showcase-view');
      if (view === 'mobile') {
        laptopView.style.display = 'none';
        phoneView.style.display = 'flex';
      } else {
        laptopView.style.display = 'flex';
        phoneView.style.display = 'none';
      }
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
   Smooth numerical count-up easing
   ========================================================================== */
function animateNumber(element, startVal, endVal, prefix = '', suffix = '', duration = 400) {
  if (!element) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
      requestAnimationFrame(step);
    } else {
      element.textContent = `${prefix}${endVal.toLocaleString('en-AU')}${suffix}`;
    }
  }

  requestAnimationFrame(step);
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

  function updateCalculatorView() {
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

    if (annualRevenueEl) {
      animateNumber(annualRevenueEl, previousRevenue, calculatedAnnualRevenue, '$', ' AUD/yr', 450);
      previousRevenue = calculatedAnnualRevenue;
    }

    if (hipagesWasteEl) {
      animateNumber(hipagesWasteEl, previousWaste, calculatedLeadWaste, '$', ' AUD/yr Saved', 450);
      previousWaste = calculatedLeadWaste;
    }

    if (netSavingsEl) {
      animateNumber(netSavingsEl, 0, calculatedNetSavings, '+$', ' Net Gain', 450);
    }
  }

  // Job selection button handlers
  calcButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      calcButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentJobKey = btn.getAttribute('data-job') || 'switchboard';
      updateCalculatorView();
    });
  });

  // Slider change handler
  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      updateCalculatorView();
    });
  }

  // Initialize initial state
  updateCalculatorView();
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
      animateNumber(totalCostEl, 0, basePrice, '$', ' AUD', 300);
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
   5. FAQ ACCORDION SYSTEM (Works across all pages)
   ========================================================================== */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item, .faq-editorial-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger, .faq-editorial-trigger');
    const panel = item.querySelector('.faq-panel, .faq-editorial-panel');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close sibling FAQs in the same container for clean accordion flow
      const container = item.closest('.faq-accordion-container, .faq-editorial-container');
      if (container) {
        const siblings = container.querySelectorAll('.faq-item.active, .faq-editorial-item.active');
        siblings.forEach((sibling) => {
          if (sibling !== item) {
            sibling.classList.remove('active');
            const sibTrigger = sibling.querySelector('.faq-trigger, .faq-editorial-trigger');
            if (sibTrigger) sibTrigger.setAttribute('aria-expanded', 'false');
            const sibPanel = sibling.querySelector('.faq-panel, .faq-editorial-panel');
            if (sibPanel) sibPanel.style.maxHeight = '0px';
          }
        });
      }

      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 32 + 'px';
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
      } else if (selectedPkg === 'custom' || selectedPkg === 'general') {
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
    if (inputEl) inputEl.classList.add('has-error');
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
      if (scrollY > 500) {
        bttBtn.style.display = 'flex';
      } else {
        bttBtn.style.display = 'none';
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

/* ==========================================================================
   12. MICRO-INTERACTIONS: 3D PERSPECTIVE TILT
   ========================================================================== */
function initTiltEffect() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window) return;

  // 1. Hero Showcase Browser Frame (Subtle Floating Animation + 3D Perspective Tilt on Mouse-Hover)
  const heroWrapper = document.querySelector('#home-hero .hero-visual .showcase-wrapper');
  const heroFrame = heroWrapper ? heroWrapper.querySelector('.browser-frame') : null;

  if (heroFrame) {
    heroFrame.addEventListener('mousemove', (e) => {
      const rect = heroFrame.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4.5;
      const rotateY = ((x - centerX) / centerX) * 4.5;

      heroFrame.style.animationPlayState = 'paused';
      heroFrame.style.transform = `perspective(1200px) translateY(-10px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.012, 1.012, 1.012)`;
    });

    heroFrame.addEventListener('mouseleave', () => {
      heroFrame.style.animationPlayState = 'running';
      heroFrame.style.transform = '';
      heroFrame.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
    });

    heroFrame.addEventListener('mouseenter', () => {
      heroFrame.style.transition = 'transform 0.12s ease-out, box-shadow 0.3s ease';
    });
  }

  // 2. Featured cards tilt
  const otherTiltElements = document.querySelectorAll('.tradie-comp-card.highlight, .pricing-card.featured');
  otherTiltElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3.5;
      const rotateY = ((x - centerX) / centerX) * 3.5;

      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'transform 0.1s ease-out';
    });
  });
}
