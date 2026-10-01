/**
 * OFFGRID STUDIO — Interactive Vanilla JavaScript
 * Modern, Minimal, High-Performance Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initCustomCursor();
  initHeroCanvas();
  initMobileMenu();
  initServicesAccordion();
  initProjectModal();
  initContactForm();
  initClipboardToast();
  initLiveClocks();
  initScrollAnimations();
});

/* --------------------------------------------------------------------------
   1. Scroll Progress Bar
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${scrollPercent}%`;
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   2. Custom Cursor with Magnetic Tracking & State Switching
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  // Check if touch device
  if (window.matchMedia('(pointer: coarse)').matches || !window.matchMedia('(hover: hover)').matches) {
    return;
  }

  const cursorDot = document.querySelector('.custom-cursor');
  const cursorFollower = document.querySelector('.custom-cursor-follower');
  const cursorText = document.querySelector('.cursor-text');

  if (!cursorDot || !cursorFollower) return;

  let mouseX = -100;
  let mouseY = -100;
  let followerX = -100;
  let followerY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }, { passive: true });

  // Smooth trailing physics for follower ring
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;

    cursorFollower.style.left = `${followerX}px`;
    cursorFollower.style.top = `${followerY}px`;

    requestAnimationFrame(animateFollower);
  }
  requestAnimationFrame(animateFollower);

  // Portfolio items hover -> VIEW ↗
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover-view');
      if (cursorText) cursorText.textContent = 'VIEW ↗';
    });
    card.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover-view');
    });
  });

  // Buttons & Interactive Links Hover -> Expand / OPEN ↗
  const interactiveElements = document.querySelectorAll('button, a, .type-pill, .service-header');
  interactiveElements.forEach((el) => {
    // Skip if it's inside project card (handled separately)
    if (el.closest('.project-card')) return;

    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover-button');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover-button');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorFollower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorFollower.style.opacity = '1';
  });
}

/* --------------------------------------------------------------------------
   3. Hero Kinetic Abstract Geometry Canvas
   -------------------------------------------------------------------------- */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-kinetic-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  let mouseX = width * 0.6;
  let mouseY = height * 0.4;
  let targetMouseX = mouseX;
  let targetMouseY = mouseY;
  let isCanvasVisible = true;

  // Window resize handler
  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }, { passive: true });

  // Track mouse over hero
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    }, { passive: true });
  }

  // IntersectionObserver to pause rendering when scrolled out of view
  const heroObserver = new IntersectionObserver((entries) => {
    isCanvasVisible = entries[0].isIntersecting;
  }, { threshold: 0.1 });
  heroObserver.observe(canvas);

  let time = 0;

  // Abstract Architectural Kinetic Grid & Wave Points
  const cols = 28;
  const rows = 14;

  function render() {
    if (isCanvasVisible) {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      time += 0.016;

      const spacingX = width / (cols - 1);
      const spacingY = height / (rows - 1);

      ctx.save();

      // Render architectural isometric / undulating dot grid with connections
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        let first = true;

        for (let c = 0; c < cols; c++) {
          const baseX = c * spacingX;
          const baseY = r * spacingY;

          // Distance to cursor
          const dx = baseX - mouseX;
          const dy = baseY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseFactor = Math.max(0, 1 - dist / 320);

          // Kinetic wave displacement
          const wave = Math.sin(c * 0.25 + time) * Math.cos(r * 0.28 + time * 0.8) * 18;
          const mouseWave = Math.sin(dist * 0.03 - time * 3) * mouseFactor * 35;

          const x = baseX + Math.sin(r * 0.3 + time) * 6;
          const y = baseY + wave + mouseWave;

          if (first) {
            ctx.moveTo(x, y);
            first = false;
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = 'rgba(17, 17, 17, 0.065)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Vertical intersecting lines with accent highlights
      for (let c = 0; c < cols; c += 2) {
        ctx.beginPath();
        let first = true;

        for (let r = 0; r < rows; r++) {
          const baseX = c * spacingX;
          const baseY = r * spacingY;

          const dx = baseX - mouseX;
          const dy = baseY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseFactor = Math.max(0, 1 - dist / 320);

          const wave = Math.sin(c * 0.25 + time) * Math.cos(r * 0.28 + time * 0.8) * 18;
          const mouseWave = Math.sin(dist * 0.03 - time * 3) * mouseFactor * 35;

          const x = baseX + Math.sin(r * 0.3 + time) * 6;
          const y = baseY + wave + mouseWave;

          if (first) {
            ctx.moveTo(x, y);
            first = false;
          } else {
            ctx.lineTo(x, y);
          }

          // Accent intersection crossbars near cursor
          if (mouseFactor > 0.45 && (r + c) % 3 === 0) {
            ctx.save();
            ctx.fillStyle = '#D4FF00';
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        ctx.strokeStyle = 'rgba(17, 17, 17, 0.045)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* --------------------------------------------------------------------------
   4. Mobile Hamburger Drawer Menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.querySelector('.menu-toggle-btn');
  const drawer = document.querySelector('.mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-item');

  if (!menuBtn || !drawer) return;

  function toggleMenu() {
    const isOpen = drawer.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    drawer.classList.add('is-open');
    menuBtn.classList.add('is-active');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('is-open');
    menuBtn.classList.remove('is-active');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', toggleMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   5. Services Accordion / Expandable Numbered List
   -------------------------------------------------------------------------- */
function initServicesAccordion() {
  const serviceItems = document.querySelectorAll('.service-item');
  if (!serviceItems.length) return;

  serviceItems.forEach((item, index) => {
    const header = item.querySelector('.service-header');
    if (!header) return;

    // Expand first one by default on desktop for instant visual clue
    if (index === 0 && window.innerWidth > 768) {
      item.classList.add('is-expanded');
    }

    header.addEventListener('click', () => {
      const isAlreadyExpanded = item.classList.contains('is-expanded');

      // Optional: close other items for clean single accordion
      serviceItems.forEach((other) => other.classList.remove('is-expanded'));

      if (!isAlreadyExpanded) {
        item.classList.add('is-expanded');
      }
    });

    // Keyboard accessibility
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'button');
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. Project Case Study Modal
   -------------------------------------------------------------------------- */
const projectData = {
  nexa: {
    title: 'NEXA',
    category: 'Brand Identity / Motion',
    client: 'NEXA Spatial Audio',
    year: '2026',
    image: 'assets/project-01-nexa.jpg',
    description: 'A comprehensive brand identity redesign for high-end spatial audio technology. We developed a bespoke typographic system, tactile print collateral with embossed metallic foiling, and kinetic motion graphics designed to translate sound waves into sculptural visual forms.',
    deliverables: ['Visual Identity', 'Motion Language', 'Packaging Design', 'Brand Guidelines', 'Typography Specimen']
  },
  mono: {
    title: 'MONO',
    category: 'Social Campaign / Video',
    client: 'MONO Apparel & Sound',
    year: '2026',
    image: 'assets/project-02-mono.jpg',
    description: 'An aggressive, high-contrast monochrome social campaign shot on 35mm anamorphic glass. Combining cinematic narrative, industrial studio sets, and pulse-pounding sound design, MONO generated 4.8M impressions across TikTok and Instagram within 72 hours of launch.',
    deliverables: ['Creative Direction', 'Cinematography', 'Sound Design', 'Short-form Social Cuts', 'Color Grading']
  },
  vanta: {
    title: 'VANTA',
    category: 'UI/UX / Digital Experience',
    client: 'Vanta Quantum Labs',
    year: '2025',
    image: 'assets/project-03-vanta.jpg',
    description: 'A dark-mode digital dashboard and spatial web application built for institutional asset managers. Combining Swiss editorial grid principles with real-time reactive charting, custom micro-interactions, and ultra-fluid gestures.',
    deliverables: ['Product Architecture', 'Design System', 'Interactive Prototyping', 'Spatial UI Framework', 'Design QA']
  },
  orbit: {
    title: 'ORBIT',
    category: 'Product Branding / A+ Content',
    client: 'Orbit Wellness Labs',
    year: '2025',
    image: 'assets/project-04-orbit.jpg',
    description: 'Avant-garde packaging architecture and Amazon A+ e-commerce content for a brutalist skincare line. We produced 3D CGI hero renders, textural macro shots on basalt rock, and modular layout modules engineered to maximize conversion rates.',
    deliverables: ['3D CGI Product Renders', 'Amazon A+ Content', 'Packaging Die-lines', 'Art Direction', 'Editorial Photography']
  },
  frame: {
    title: 'FRAME',
    category: 'Motion Graphics / Logo Animation',
    client: 'Frame Media Network',
    year: '2026',
    image: 'assets/project-05-frame.jpg',
    description: 'A dynamic 3D kinetic typography and logo animation package for a modern media network. Liquid chrome lettering interacts with tactile studio lighting to create unforgettable broadcast idents and digital splash screens.',
    deliverables: ['Kinetic Typography', '3D Simulation', 'Broadcast Idents', 'Logo Ident Suite', 'Sound Synthesis']
  },
  north: {
    title: 'NORTH',
    category: 'Social Media / Brand Design',
    client: 'North Technical Goods',
    year: '2025',
    image: 'assets/project-06-north.jpg',
    description: 'A raw, editorial social media system and printed seasonal lookbook for technical outdoor gear. Pairing Swiss typography with risograph-inspired color separations and documentary-style photography.',
    deliverables: ['Social Strategy', 'Seasonal Lookbook', 'Grid Templates', 'Art Direction', 'Digital Guidelines']
  }
};

function initProjectModal() {
  const modal = document.querySelector('.project-modal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!modal || !closeBtn) return;

  const modalImg = modal.querySelector('.modal-img');
  const modalTitle = modal.querySelector('.modal-title');
  const modalCategory = modal.querySelector('.modal-category');
  const modalDesc = modal.querySelector('.modal-narrative');
  const modalDeliverables = modal.querySelector('.modal-deliverables-list');
  const modalClient = modal.querySelector('.modal-client-val');
  const modalYear = modal.querySelector('.modal-year-val');

  projectCards.forEach((card) => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project-id');
      const data = projectData[projectId];
      if (!data) return;

      if (modalImg) modalImg.src = data.image;
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalCategory) modalCategory.textContent = data.category;
      if (modalDesc) modalDesc.textContent = data.description;
      if (modalClient) modalClient.textContent = data.client;
      if (modalYear) modalYear.textContent = data.year;

      if (modalDeliverables) {
        modalDeliverables.innerHTML = '';
        data.deliverables.forEach((item) => {
          const pill = document.createElement('span');
          pill.className = 'service-pill-tag';
          pill.textContent = item;
          modalDeliverables.appendChild(pill);
        });
      }

      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   7. Contact Form & Project Type Pill Selectors
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  const pills = document.querySelectorAll('.type-pill');
  const hiddenInput = document.getElementById('project-type-input');
  const statusMsg = document.querySelector('.form-status-msg');

  if (!form) return;

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('is-selected'));
      pill.classList.add('is-selected');
      if (hiddenInput) {
        hiddenInput.value = pill.getAttribute('data-value');
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value;
    const email = form.querySelector('[name="email"]')?.value;

    if (!name || !email) {
      alert('Please complete all required fields.');
      return;
    }

    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.innerHTML = 'TRANSMITTING INQUIRY...';
      submitBtn.disabled = true;
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.innerHTML = 'INQUIRY TRANSMITTED ✦';
        submitBtn.style.backgroundColor = '#22c55e';
      }

      if (statusMsg) {
        statusMsg.classList.add('is-success');
        statusMsg.textContent = `Thank you, ${name}. Your inquiry has been received by our lead director. We will review your project brief within 24 hours.`;
      }

      form.reset();
      pills.forEach((p) => p.classList.remove('is-selected'));

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.style.backgroundColor = '';
          submitBtn.disabled = false;
        }
      }, 6000);
    }, 1100);
  });
}

/* --------------------------------------------------------------------------
   8. Clipboard Copy & Toast Notifications
   -------------------------------------------------------------------------- */
function initClipboardToast() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');
  const toast = document.querySelector('.toast-notice');
  const toastText = document.querySelector('.toast-msg');

  if (!toast) return;

  function showToast(message) {
    if (toastText) toastText.textContent = message;
    toast.classList.add('is-visible');

    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3200);
  }

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'hello@offgrid.studio';
      navigator.clipboard.writeText(email).then(() => {
        showToast('COPIED: hello@offgrid.studio');
      }).catch(() => {
        showToast('hello@offgrid.studio');
      });
    });
  });
}

/* --------------------------------------------------------------------------
   9. Live Studio World Clocks
   -------------------------------------------------------------------------- */
function initLiveClocks() {
  const clockEl = document.querySelector('.live-studio-time');
  if (!clockEl) return;

  function updateTime() {
    const now = new Date();

    // Format IST (India Standard Time UTC+5:30)
    const istOptions = {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    const istTime = now.toLocaleTimeString('en-GB', istOptions);

    // Format UTC
    const utcOptions = {
      timeZone: 'UTC',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    };
    const utcTime = now.toLocaleTimeString('en-GB', utcOptions);

    clockEl.textContent = `NEW DELHI ${istTime} IST • UTC ${utcTime}`;
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* --------------------------------------------------------------------------
   10. IntersectionObserver Scroll Reveal Animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-fade');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in-view');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));
}
