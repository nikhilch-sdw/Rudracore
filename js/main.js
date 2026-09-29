/**
 * Rudracore Technologies - Main JavaScript Module
 * Handles themes, dynamic component interactions, estimator calculations, 
 * industry switcher tabs, portfolio filtering, and contact form processing.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroBgSlider();
  initThemeToggle();
  initHeaderScroll();
  initTypewriterEffect();
  initIndustryTabs();
  initOurWorkSlider();
  initTestimonialSlider();
  initContactForm();
  initMobileMenu();
  initWorkFiltersAndModal();
  initCareerFiltersAndModal();
  initFaqAccordion();
  initProductGallerySlider();
  initTechFilterTabs();
  initHeroInternalParticles();
  initWhySplitShowcase();
});

/* -------------------------------------------------------------
 * 0. Hero Background Image Slider Banner
 * ------------------------------------------------------------- */
function initHeroBgSlider() {
  const slides = document.querySelectorAll('.hero-bg-slide');
  const dots = document.querySelectorAll('.hero-bg-dot');
  if (slides.length === 0) return;

  let currentSlide = 0;
  let slideTimer = null;

  function showSlide(index) {
    slides.forEach((slide, idx) => {
      slide.classList.remove('active');
      if (idx === index) {
        slide.classList.add('active');
      }
    });

    dots.forEach((dot, idx) => {
      dot.classList.remove('active');
      if (idx === index) {
        dot.classList.add('active');
      }
    });

    currentSlide = index;
  }

  function nextSlide() {
    const nextIdx = (currentSlide + 1) % slides.length;
    showSlide(nextIdx);
  }

  function startTimer() {
    stopTimer();
    slideTimer = setInterval(nextSlide, 5000);
  }

  function stopTimer() {
    if (slideTimer) clearInterval(slideTimer);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-slide'), 10);
      if (!isNaN(idx)) {
        showSlide(idx);
        startTimer();
      }
    });
  });

  startTimer();
}

/* -------------------------------------------------------------
 * 1. Dark / Light Theme Switcher
 * ------------------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggle');
  if (!themeBtn) return;

  const currentTheme = localStorage.getItem('rudracore_theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(themeBtn, currentTheme);

  themeBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('rudracore_theme', newTheme);
    updateThemeIcon(themeBtn, newTheme);
  });
}

function updateThemeIcon(btn, theme) {
  const icon = btn.querySelector('i');
  if (icon) {
    if (theme === 'dark') {
      icon.className = 'fas fa-sun';
    } else {
      icon.className = 'fas fa-moon';
    }
  }
}

/* -------------------------------------------------------------
 * 2. Sticky Header Scroll Effect
 * ------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length > 0) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        if (header) header.classList.add('scrolled');
      } else {
        if (header) header.classList.remove('scrolled');
      }

      // ScrollSpy active link detection
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      if (current) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href && (href === `#${current}` || href.endsWith(`#${current}`))) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* -------------------------------------------------------------
 * 3. Hero Typewriter / Word-Morph Text Rotator
 * ------------------------------------------------------------- */
function initTypewriterEffect() {
  const target = document.getElementById('rotatorText');
  if (!target) return;

  const phrases = [
    'Digital Marketing',
    'Custom Software',
    'Mobile App Design',
    'Cloud & AI Engines'
  ];

  let phraseIdx = 0;
  target.textContent = phrases[0];

  setInterval(() => {
    target.style.opacity = '0';
    target.style.transform = 'translateY(-8px)';

    setTimeout(() => {
      phraseIdx = (phraseIdx + 1) % phrases.length;
      target.textContent = phrases[phraseIdx];
      target.style.transform = 'translateY(8px)';

      requestAnimationFrame(() => {
        target.style.opacity = '1';
        target.style.transform = 'translateY(0)';
      });
    }, 280);
  }, 3800);
}

/* -------------------------------------------------------------
 * 4. Industry Solution Tabs Switcher
 * ------------------------------------------------------------- */
function initIndustryTabs() {
  const tabs = document.querySelectorAll('.ind-tab');
  const panels = document.querySelectorAll('.industry-panel');

  if (tabs.length === 0 || panels.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------
 * 6. OUR WORK Interactive Horizontal Slider
 * ------------------------------------------------------------- */
function initOurWorkSlider() {
  const wrapper = document.querySelector('.work-carousel-wrapper');
  const track = document.getElementById('workTrack');
  const prevBtn = document.getElementById('workPrev');
  const nextBtn = document.getElementById('workNext');

  if (!track || !prevBtn || !nextBtn || !wrapper) return;

  const cards = track.querySelectorAll('.work-slide-card');
  if (cards.length === 0) return;

  let currentSlide = 0;
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  function updateSlider() {
    cards.forEach((card, idx) => {
      card.classList.remove('active');
      if (idx === currentSlide) {
        card.classList.add('active');
      }
    });

    const gap = window.innerWidth <= 992 ? 16 : 28;
    const cardWidth = cards[0].offsetWidth + gap;
    currentTranslate = -currentSlide * cardWidth;
    prevTranslate = currentTranslate;

    track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + cards.length) % cards.length;
    updateSlider();
  });

  nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % cards.length;
    updateSlider();
  });

  wrapper.addEventListener('mousedown', (e) => {
    isDragging = true;
    startPos = e.clientX;
    wrapper.style.cursor = 'grabbing';
    track.style.transition = 'none';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const currentPosition = e.clientX;
    const diff = currentPosition - startPos;
    const newTranslate = prevTranslate + diff;
    track.style.transform = `translateX(${newTranslate}px)`;
  });

  window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    wrapper.style.cursor = 'grab';
    const movedBy = e.clientX - startPos;

    if (movedBy < -60 && currentSlide < cards.length - 1) {
      currentSlide++;
    } else if (movedBy > 60 && currentSlide > 0) {
      currentSlide--;
    }
    updateSlider();
  });

  wrapper.addEventListener('touchstart', (e) => {
    startPos = e.touches[0].clientX;
    isDragging = true;
    track.style.transition = 'none';
  }, { passive: true });

  wrapper.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentPosition = e.touches[0].clientX;
    const diff = currentPosition - startPos;
    const newTranslate = prevTranslate + diff;
    track.style.transform = `translateX(${newTranslate}px)`;
  }, { passive: true });

  wrapper.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const movedBy = e.changedTouches[0].clientX - startPos;

    if (movedBy < -50 && currentSlide < cards.length - 1) {
      currentSlide++;
    } else if (movedBy > 50 && currentSlide > 0) {
      currentSlide--;
    }
    updateSlider();
  });

  window.addEventListener('resize', updateSlider);
}

/* -------------------------------------------------------------
 * 7. Testimonials Carousel / Slider
 * ------------------------------------------------------------- */
function initTestimonialSlider() {
  const testimonials = [
    {
      quote: "Rudracore transformed our healthcare platform. Their custom EHR integration and HIPAA-compliant telemedicine system scaled our patient reach by 300% in 6 months.",
      author: "Dr. Aris Vance",
      role: "CTO, ApexHealth Care"
    },
    {
      quote: "The PropTech solution built by Rudracore gave our real estate agency virtual 3D tour capabilities and seamless MLS synchronization. Truly enterprise quality.",
      author: "Samantha Sterling",
      role: "VP Product, Horizon Properties"
    },
    {
      quote: "Our logistics fleet tracking app runs seamlessly across iOS and Android. Their digital marketing team also boosted our organic lead acquisition by 240%.",
      author: "David K. Miller",
      role: "Operations Director, LogiSpeed Global"
    }
  ];

  let currentIdx = 0;
  const quoteEl = document.getElementById('testiQuote');
  const authorEl = document.getElementById('testiAuthor');
  const roleEl = document.getElementById('testiRole');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');

  if (!quoteEl) return;

  function renderTestimonial(idx) {
    const item = testimonials[idx];
    quoteEl.textContent = `"${item.quote}"`;
    authorEl.textContent = item.author;
    roleEl.textContent = item.role;
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      currentIdx = (currentIdx - 1 + testimonials.length) % testimonials.length;
      renderTestimonial(currentIdx);
    });

    nextBtn.addEventListener('click', () => {
      currentIdx = (currentIdx + 1) % testimonials.length;
      renderTestimonial(currentIdx);
    });
  }

  setInterval(() => {
    currentIdx = (currentIdx + 1) % testimonials.length;
    renderTestimonial(currentIdx);
  }, 6000);
}

/* -------------------------------------------------------------
 * 8. Contact Form Validation, Budget Selector & Toast
 * ------------------------------------------------------------- */
function initContactForm() {
  const heroForm = document.getElementById('heroEnquiryForm');
  const heroPills = document.querySelectorAll('.hero-budget-pill');

  heroPills.forEach(pill => {
    pill.addEventListener('click', () => {
      heroPills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
    });
  });

  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('heroName').value.trim();
      const email = document.getElementById('heroEmail').value.trim();

      if (!name || !email) {
        showToast('Please fill out all required fields.', 'error');
        return;
      }

      const btn = heroForm.querySelector('button[type="submit"]');
      const origText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Proposal...';

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = origText;
        heroForm.reset();
        showToast('Thank you! Your proposal request has been received.', 'success');
      }, 1200);
    });
  }

  const form = document.getElementById('contactForm');
  const budgetPills = document.querySelectorAll('.budget-pill-opt');

  budgetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      budgetPills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
    });
  });

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();

    if (!name || !email) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Consultation Request...';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = origText;
      form.reset();
      showToast('Thank you! Your inquiry has been submitted to Rudracore Technologies.', 'success');
    }, 1200);
  });
}

function showToast(message, type = 'success') {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* -------------------------------------------------------------
 * 9. Mobile Menu & Dropdown Toggle
 * ------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('navMenu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
    const icon = toggle.querySelector('i');
    if (menu.classList.contains('active')) {
      icon.className = 'fas fa-times';
    } else {
      icon.className = 'fas fa-bars';
    }
  });

  const dropdownItems = document.querySelectorAll('.nav-item-dropdown');
  dropdownItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        item.classList.toggle('open');
      }
    });
  });

  const links = menu.querySelectorAll('.dropdown-item, .nav-link:not(.nav-item-dropdown > .nav-link)');
  links.forEach(l => {
    l.addEventListener('click', () => {
      menu.classList.remove('active');
      if (toggle.querySelector('i')) toggle.querySelector('i').className = 'fas fa-bars';
    });
  });
}

/* -------------------------------------------------------------
 * 10. Work Page Portfolio Filter & Case Study Detail Modal
 * ------------------------------------------------------------- */
function initWorkFiltersAndModal() {
  const filterBtns = document.querySelectorAll('.work-filter-btn');
  const caseCards = document.querySelectorAll('.case-study-card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        caseCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Case Study Detail Modal Triggers
  const modalOverlay = document.getElementById('caseStudyModal');
  const viewBtns = document.querySelectorAll('.view-case-study-btn');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (viewBtns.length > 0 && modalOverlay) {
    viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-title') || 'Case Study Details';
        const client = btn.getAttribute('data-client') || 'Enterprise Client';
        const desc = btn.getAttribute('data-desc') || 'Full implementation case study details.';

        const modalTitle = document.getElementById('modalCaseTitle');
        const modalClient = document.getElementById('modalCaseClient');
        const modalDesc = document.getElementById('modalCaseDesc');

        if (modalTitle) modalTitle.textContent = title;
        if (modalClient) modalClient.textContent = client;
        if (modalDesc) modalDesc.textContent = desc;

        modalOverlay.classList.add('active');
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
      });
    }

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }
}

/* -------------------------------------------------------------
 * 11. Career Page Filters & Job Application Modal
 * ------------------------------------------------------------- */
function initCareerFiltersAndModal() {
  const filterBtns = document.querySelectorAll('.job-filter-btn');
  const jobCards = document.querySelectorAll('.job-card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const dept = btn.getAttribute('data-department');

        jobCards.forEach(card => {
          const cardDept = card.getAttribute('data-department');
          if (dept === 'all' || cardDept === dept) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Job Apply Modal
  const jobModal = document.getElementById('jobApplyModal');
  const applyBtns = document.querySelectorAll('.apply-job-btn');
  const jobModalClose = document.getElementById('jobModalClose');
  const jobTitleInput = document.getElementById('appliedJobTitle');

  if (applyBtns.length > 0 && jobModal) {
    applyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const jobTitle = btn.getAttribute('data-job') || 'Position Application';
        if (jobTitleInput) jobTitleInput.value = jobTitle;

        const modalHeading = document.getElementById('applyJobHeading');
        if (modalHeading) modalHeading.textContent = `Apply for ${jobTitle}`;

        jobModal.classList.add('active');
      });
    });

    if (jobModalClose) {
      jobModalClose.addEventListener('click', () => {
        jobModal.classList.remove('active');
      });
    }

    jobModal.addEventListener('click', (e) => {
      if (e.target === jobModal) {
        jobModal.classList.remove('active');
      }
    });

    const jobForm = document.getElementById('jobApplicationForm');
    if (jobForm) {
      jobForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = jobForm.querySelector('button[type="submit"]');
        const origText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Application...';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
          jobForm.reset();
          jobModal.classList.remove('active');
          showToast('Your job application has been submitted successfully!', 'success');
        }, 1200);
      });
    }
  }
}

/* -------------------------------------------------------------
 * 12. Contact Page FAQ Accordion
 * ------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------
 * 13. Product Gallery Slider Component
 * ------------------------------------------------------------- */
function initProductGallerySlider() {
  const sliders = document.querySelectorAll('.pm-gallery-card');
  if (sliders.length === 0) return;

  sliders.forEach(slider => {
    const track = slider.querySelector('.pm-gallery-track');
    const slides = slider.querySelectorAll('.pm-gallery-slide');
    const prevBtn = slider.querySelector('.pm-gallery-arrow.prev');
    const nextBtn = slider.querySelector('.pm-gallery-arrow.next');
    const dotsContainer = slider.parentElement.querySelector('.pm-gallery-dots');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let timer = null;

    // Create dots if container exists
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.classList.add('pm-gallery-dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
      });
    }

    function updateDots() {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.pm-gallery-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    function goToSlide(index) {
      if (index < 0) {
        currentIndex = slides.length - 1;
      } else if (index >= slides.length) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }

      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
      resetTimer();
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    }

    function startTimer() {
      stopTimer();
      timer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 5000);
    }

    function stopTimer() {
      if (timer) clearInterval(timer);
    }

    function resetTimer() {
      startTimer();
    }

    // Pause auto-slide on mouse enter
    slider.addEventListener('mouseenter', stopTimer);
    slider.addEventListener('mouseleave', startTimer);

    startTimer();
  });
}

/* -------------------------------------------------------------
 * 13. Tech Stack Matrix Category Filter Tabs
 * ------------------------------------------------------------- */
function initTechFilterTabs() {
  const filterBtns = document.querySelectorAll('.tech-filter-btn');
  const techCards = document.querySelectorAll('.tech-cards-grid .tech-card-item');

  if (filterBtns.length === 0 || techCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      techCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('is-hidden');
          card.style.animation = 'none';
          card.offsetHeight; // force reflow
          card.style.animation = 'techFadeInUp 0.28s ease forwards';
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}

/* -------------------------------------------------------------
 * 15. Hero Showcase Image: Internal Particles & Structure Engine
 * ------------------------------------------------------------- */
function initHeroInternalParticles() {
  const canvas = document.getElementById('heroInternalCanvas');
  const wrapper = document.getElementById('heroImageWrapper');
  if (!canvas || !wrapper) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let isVisible = true;
  let animId = null;

  // Normalized coordinate base (1000 x 1000)
  const BASE_SIZE = 1000;

  // Track cursor position inside canvas coordinates (normalized to 1000x1000)
  const mouse = {
    x: -9999,
    y: -9999,
    active: false,
    radius: 140
  };

  // 1. Structure Nodes (Mapped to the neural lattice and tech structures in the artwork)
  const rawNodes = [
    // Bottom-Left Foreground Cluster
    { x: 140, y: 740, color: '#38bdf8', r: 4.2 },
    { x: 210, y: 670, color: '#f97316', r: 4.8 },
    { x: 280, y: 760, color: '#06b6d4', r: 5.2 },
    { x: 340, y: 690, color: '#fbbf24', r: 3.8 },
    { x: 220, y: 810, color: '#ffffff', r: 3.2 },
    { x: 130, y: 640, color: '#0284c7', r: 3.6 },
    { x: 270, y: 620, color: '#f97316', r: 4.5 },
    { x: 380, y: 780, color: '#38bdf8', r: 3.5 },
    { x: 320, y: 830, color: '#06b6d4', r: 3.0 },

    // Central Foreground Bridge
    { x: 440, y: 730, color: '#fb923c', r: 4.0 },
    { x: 500, y: 770, color: '#38bdf8', r: 4.6 },
    { x: 540, y: 700, color: '#ffffff', r: 3.4 },
    { x: 470, y: 650, color: '#f97316', r: 3.8 },

    // Bottom-Right Foreground Cluster
    { x: 670, y: 720, color: '#06b6d4', r: 3.6 },
    { x: 740, y: 780, color: '#38bdf8', r: 4.2 },
    { x: 790, y: 690, color: '#f97316', r: 5.0 },
    { x: 850, y: 750, color: '#ffffff', r: 4.0 },
    { x: 890, y: 670, color: '#38bdf8', r: 4.5 },
    { x: 830, y: 620, color: '#fb923c', r: 4.2 },
    { x: 920, y: 730, color: '#06b6d4', r: 3.2 },
    { x: 870, y: 810, color: '#f97316', r: 3.6 },

    // Middle & Floating Glass Panel Nodes
    { x: 250, y: 490, color: '#38bdf8', r: 3.4 },
    { x: 370, y: 440, color: '#fb923c', r: 3.2 },
    { x: 630, y: 450, color: '#06b6d4', r: 3.6 },
    { x: 730, y: 420, color: '#f97316', r: 3.8 },
    { x: 190, y: 350, color: '#38bdf8', r: 3.0 },
    { x: 800, y: 330, color: '#38bdf8', r: 3.2 },
    { x: 490, y: 320, color: '#ffffff', r: 3.5 },
    { x: 670, y: 280, color: '#fb923c', r: 3.0 }
  ];

  const nodes = rawNodes.map((rn, i) => ({
    id: i,
    baseX: rn.x,
    baseY: rn.y,
    x: rn.x,
    y: rn.y,
    vx: 0,
    vy: 0,
    color: rn.color,
    baseR: rn.r,
    r: rn.r,
    freqX: 0.8 + Math.random() * 0.9,
    freqY: 0.7 + Math.random() * 0.8,
    phaseX: Math.random() * Math.PI * 2,
    phaseY: Math.random() * Math.PI * 2,
    amp: 4 + Math.random() * 5,
    pulseOffset: Math.random() * 10,
    flash: 0,
    connections: []
  }));

  // Build node connectivity based on proximity
  const MAX_CONNECT_DIST = 135;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].baseX - nodes[j].baseX;
      const dy = nodes[i].baseY - nodes[j].baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAX_CONNECT_DIST) {
        nodes[i].connections.push(j);
        nodes[j].connections.push(i);
      }
    }
  }

  // 2. Dynamic Synaptic Data Packets (Energy Pulses Travelling Along Lines)
  const packets = [];
  const TOTAL_PACKETS = 18;

  function spawnPacket() {
    const candidates = nodes.filter(n => n.connections.length > 0);
    const startNode = candidates[Math.floor(Math.random() * candidates.length)];
    const targetIdx = startNode.connections[Math.floor(Math.random() * startNode.connections.length)];
    return {
      from: startNode.id,
      to: targetIdx,
      progress: 0,
      speed: 0.012 + Math.random() * 0.018,
      color: Math.random() > 0.45 ? '#ffffff' : (Math.random() > 0.5 ? '#38bdf8' : '#fb923c'),
      history: []
    };
  }

  for (let i = 0; i < TOTAL_PACKETS; i++) {
    const pkt = spawnPacket();
    pkt.progress = Math.random();
    packets.push(pkt);
  }

  // 3. Swirling Orbital Energy Stream Particles (Looping around laptop & phone)
  const orbitalParticles = [];
  const TOTAL_ORBITALS = 48;
  const ORBIT_CX = 510;
  const ORBIT_CY = 475;
  const ORBIT_ANGLE = -23 * (Math.PI / 180); // Tilted ellipse matching artwork light vortex

  for (let i = 0; i < TOTAL_ORBITALS; i++) {
    orbitalParticles.push({
      theta: Math.random() * Math.PI * 2,
      speed: 0.012 + Math.random() * 0.018,
      rx: 290 + (Math.random() - 0.5) * 80,
      ry: 135 + (Math.random() - 0.5) * 45,
      r: 1.6 + Math.random() * 2.2,
      color: Math.random() > 0.5 ? '#ff7700' : (Math.random() > 0.3 ? '#00e5ff' : '#ffffff'),
      history: []
    });
  }

  // 4. Ambient Quantum Floating Sparks / Digital Embers
  const ambientSparks = [];
  const TOTAL_SPARKS = 24;
  for (let i = 0; i < TOTAL_SPARKS; i++) {
    ambientSparks.push({
      x: Math.random() * BASE_SIZE,
      y: Math.random() * BASE_SIZE,
      vy: -(0.3 + Math.random() * 0.7),
      driftFreq: 0.5 + Math.random() * 1.5,
      driftPhase: Math.random() * Math.PI * 2,
      r: 1.0 + Math.random() * 2.0,
      alpha: Math.random(),
      color: Math.random() > 0.5 ? '#38bdf8' : '#fb923c'
    });
  }

  // 5. Star Flares / Cross Glints
  const flares = [];
  function addFlare() {
    if (flares.length >= 4) return;
    const target = nodes[Math.floor(Math.random() * nodes.length)];
    flares.push({
      x: target.x,
      y: target.y,
      life: 0,
      maxLife: 45 + Math.random() * 30,
      size: 10 + Math.random() * 14,
      color: target.color
    });
  }

  // Canvas Dimension Sizing with DPI support
  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }

  const mobileEl = document.getElementById('heroActiveMobile');
  const badgeCloudEl = document.getElementById('badgeCloud');
  const badgeSpeedEl = document.getElementById('badgeSpeed');
  const laptopImgEl = document.getElementById('heroShowcaseImage');

  // Multiplane Interactive Layer Movement (Active Mobile & Floating Widgets)
  wrapper.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    mouse.x = (clientX / rect.width) * BASE_SIZE;
    mouse.y = (clientY / rect.height) * BASE_SIZE;
    mouse.active = true;

    // Subtle 3D parallax depth between layers without tilting the frame
    const normX = (clientX / rect.width) - 0.5;
    const normY = (clientY / rect.height) - 0.5;

    if (mobileEl) {
      mobileEl.style.transform = `translate3d(${normX * 18}px, ${normY * 18 - 6}px, 0) rotate(${normX * 4}deg)`;
    }
    if (badgeCloudEl) {
      badgeCloudEl.style.transform = `translate3d(${normX * -12}px, ${normY * -10}px, 0)`;
    }
    if (badgeSpeedEl) {
      badgeSpeedEl.style.transform = `translate3d(${normX * -14}px, ${normY * -12}px, 0)`;
    }
    if (laptopImgEl) {
      laptopImgEl.style.transform = `translate3d(${normX * 6}px, ${normY * 6}px, 0)`;
    }
  });

  wrapper.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
    if (mobileEl) mobileEl.style.transform = '';
    if (badgeCloudEl) badgeCloudEl.style.transform = '';
    if (badgeSpeedEl) badgeSpeedEl.style.transform = '';
    if (laptopImgEl) laptopImgEl.style.transform = '';
  });

  wrapper.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * BASE_SIZE;
    const cy = ((e.clientY - rect.top) / rect.height) * BASE_SIZE;

    nodes.forEach(n => {
      const dx = n.x - cx;
      const dy = n.y - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 220 && d > 0) {
        const force = (1 - d / 220) * 18;
        n.vx += (dx / d) * force;
        n.vy += (dy / d) * force;
        n.flash = 1;
      }
    });

    for (let k = 0; k < 5; k++) {
      addFlare();
    }
  });

  // Visibility optimization via IntersectionObserver
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          animId = requestAnimationFrame(render);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(wrapper);
  }

  function debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }

  window.addEventListener('resize', debounce(resize, 150));
  resize();

  let time = 0;

  // Main Render Loop
  function render() {
    if (!isVisible) {
      animId = null;
      return;
    }

    time += 0.02;

    ctx.save();
    ctx.scale(dpr, dpr);
    const scale = width / BASE_SIZE;

    // Clear frame
    ctx.clearRect(0, 0, width, height);

    // Random star flare trigger
    if (Math.random() < 0.04) {
      addFlare();
    }

    // A. UPDATE & DRAW NODES
    nodes.forEach(node => {
      const targetX = node.baseX + Math.sin(time * node.freqX + node.phaseX) * node.amp;
      const targetY = node.baseY + Math.cos(time * node.freqY + node.phaseY) * node.amp;

      if (mouse.active) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (1 - dist / mouse.radius) * 7;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
        }
      }

      node.vx += (targetX - node.x) * 0.08;
      node.vy += (targetY - node.y) * 0.08;
      node.vx *= 0.82;
      node.vy *= 0.82;
      node.x += node.vx;
      node.y += node.vy;

      if (node.flash > 0) {
        node.flash -= 0.04;
        if (node.flash < 0) node.flash = 0;
      }
    });

    // B. DRAW CONNECTIONS BETWEEN NODES
    ctx.lineWidth = 1.2 * scale;
    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i];
      for (let k = 0; k < n1.connections.length; k++) {
        const j = n1.connections[k];
        if (j > i) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_CONNECT_DIST) {
            const alpha = (1 - dist / MAX_CONNECT_DIST) * 0.42;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(n1.x * scale, n1.y * scale);
            ctx.lineTo(n2.x * scale, n2.y * scale);
            ctx.stroke();
          }
        }
      }
    }

    // Dynamic energy lines to active mouse cursor (NO card tilt)
    if (mouse.active) {
      let connectedCount = 0;
      nodes.forEach(n => {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && connectedCount < 5) {
          connectedCount++;
          const alpha = (1 - dist / mouse.radius) * 0.75;
          ctx.strokeStyle = `rgba(249, 115, 22, ${alpha})`;
          ctx.lineWidth = 1.4 * scale;
          ctx.beginPath();
          ctx.moveTo(mouse.x * scale, mouse.y * scale);
          ctx.lineTo(n.x * scale, n.y * scale);
          ctx.stroke();
        }
      });
    }

    // C. UPDATE & DRAW SYNAPTIC DATA PACKETS (Travelling Light Sparks)
    packets.forEach((pkt, idx) => {
      pkt.progress += pkt.speed;
      if (pkt.progress >= 1) {
        const targetNode = nodes[pkt.to];
        if (targetNode) {
          targetNode.flash = 1.0;
          if (targetNode.connections.length > 0) {
            pkt.from = pkt.to;
            pkt.to = targetNode.connections[Math.floor(Math.random() * targetNode.connections.length)];
            pkt.progress = 0;
          } else {
            packets[idx] = spawnPacket();
          }
        } else {
          packets[idx] = spawnPacket();
        }
      }

      const nFrom = nodes[pkt.from];
      const nTo = nodes[pkt.to];
      if (!nFrom || !nTo) return;

      const px = nFrom.x + (nTo.x - nFrom.x) * pkt.progress;
      const py = nFrom.y + (nTo.y - nFrom.y) * pkt.progress;

      ctx.save();
      ctx.shadowBlur = 10 * scale;
      ctx.shadowColor = pkt.color;
      ctx.fillStyle = pkt.color;
      ctx.beginPath();
      ctx.arc(px * scale, py * scale, 3.2 * scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px * scale, py * scale, 1.6 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // D. DRAW NODES (Glowing spheres with breathing halo)
    nodes.forEach(node => {
      const pulse = Math.sin(time * 2.5 + node.pulseOffset) * 0.25 + 0.75;
      const currentR = (node.baseR + node.flash * 3.5) * pulse * scale;

      ctx.save();
      const haloR = currentR * 3.2;
      const grad = ctx.createRadialGradient(
        node.x * scale, node.y * scale, currentR * 0.3,
        node.x * scale, node.y * scale, haloR
      );
      grad.addColorStop(0, node.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(node.x * scale, node.y * scale, haloR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = node.flash > 0.3 ? '#ffffff' : node.color;
      ctx.shadowBlur = 8 * scale;
      ctx.shadowColor = node.color;
      ctx.beginPath();
      ctx.arc(node.x * scale, node.y * scale, Math.max(currentR, 1.5), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // E. UPDATE & DRAW SWIRLING ORBITAL STREAM PARTICLES (Vortex around tech)
    orbitalParticles.forEach(op => {
      op.theta += op.speed;
      if (op.theta > Math.PI * 2) op.theta -= Math.PI * 2;

      const cosT = Math.cos(op.theta);
      const sinT = Math.sin(op.theta);
      const ex = cosT * op.rx;
      const ey = sinT * op.ry;

      const cosA = Math.cos(ORBIT_ANGLE);
      const sinA = Math.sin(ORBIT_ANGLE);
      const xRot = ex * cosA - ey * sinA + ORBIT_CX;
      const yRot = ex * sinA + ey * cosA + ORBIT_CY;

      const depthZ = sinT;
      const depthAlpha = 0.35 + (depthZ + 1) * 0.32;
      const depthRadius = Math.max(1.2, op.r * (0.7 + (depthZ + 1) * 0.35)) * scale;

      op.history.unshift({ x: xRot * scale, y: yRot * scale, alpha: depthAlpha });
      if (op.history.length > 6) op.history.pop();

      if (op.history.length > 1) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(op.history[0].x, op.history[0].y);
        for (let h = 1; h < op.history.length; h++) {
          ctx.lineTo(op.history[h].x, op.history[h].y);
        }
        ctx.strokeStyle = op.color;
        ctx.globalAlpha = depthAlpha * 0.7;
        ctx.lineWidth = depthRadius * 0.9;
        ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      ctx.globalAlpha = depthAlpha;
      ctx.fillStyle = op.color;
      ctx.shadowBlur = (depthZ > 0 ? 12 : 4) * scale;
      ctx.shadowColor = op.color;
      ctx.beginPath();
      ctx.arc(xRot * scale, yRot * scale, depthRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // F. AMBIENT QUANTUM SPARKS (Rising digital dust)
    ambientSparks.forEach(sp => {
      sp.y += sp.vy;
      sp.x += Math.sin(time * sp.driftFreq + sp.driftPhase) * 0.4;
      if (sp.y < 50) {
        sp.y = BASE_SIZE - 20;
        sp.x = Math.random() * BASE_SIZE;
      }

      ctx.save();
      ctx.globalAlpha = 0.4 + Math.sin(time * 3 + sp.driftPhase) * 0.3;
      ctx.fillStyle = sp.color;
      ctx.shadowBlur = 6 * scale;
      ctx.shadowColor = sp.color;
      ctx.beginPath();
      ctx.arc(sp.x * scale, sp.y * scale, sp.r * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // G. STAR FLARES / TWINKLES
    for (let f = flares.length - 1; f >= 0; f--) {
      const fl = flares[f];
      fl.life++;
      const progress = fl.life / fl.maxLife;
      if (progress >= 1) {
        flares.splice(f, 1);
        continue;
      }

      const flareAlpha = Math.sin(progress * Math.PI);
      const flareSize = fl.size * Math.sin(progress * Math.PI) * scale;

      ctx.save();
      ctx.globalAlpha = flareAlpha * 0.9;
      ctx.strokeStyle = '#ffffff';
      ctx.shadowBlur = 14 * scale;
      ctx.shadowColor = fl.color;
      ctx.lineWidth = 1.5 * scale;

      ctx.beginPath();
      ctx.moveTo(fl.x * scale - flareSize, fl.y * scale);
      ctx.lineTo(fl.x * scale + flareSize, fl.y * scale);
      ctx.moveTo(fl.x * scale, fl.y * scale - flareSize);
      ctx.lineTo(fl.x * scale, fl.y * scale + flareSize);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(fl.x * scale, fl.y * scale, 2.5 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();

    animId = requestAnimationFrame(render);
  }

  animId = requestAnimationFrame(render);
}

/* -------------------------------------------------------------
 * 23. Why Choose Us: Interactive Split Showcase
 * ------------------------------------------------------------- */
function initWhySplitShowcase() {
  const tabs = document.querySelectorAll('.why-pillar-tab');
  const panels = document.querySelectorAll('.why-preview-panel');
  const showcase = document.getElementById('whySplitShowcase');

  if (tabs.length === 0 || panels.length === 0) return;

  let currentIndex = 0;
  let autoTimer = null;
  let isHovered = false;

  function activateTab(index, isUserInteraction = false) {
    if (index < 0 || index >= tabs.length) return;
    currentIndex = index;

    const activeTab = tabs[index];
    const targetId = activeTab.getAttribute('data-target');

    tabs.forEach((tab, i) => {
      const isCurrent = i === index;
      tab.classList.toggle('active', isCurrent);
      tab.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    });

    panels.forEach(panel => {
      if (panel.id === targetId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    if (isUserInteraction) {
      resetTimer();
    }
  }

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => {
      activateTab(idx, true);
    });

    tab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateTab(idx, true);
      }
    });
  });

  function startTimer() {
    stopTimer();
    autoTimer = setInterval(() => {
      if (!isHovered) {
        const nextIdx = (currentIndex + 1) % tabs.length;
        activateTab(nextIdx, false);
      }
    }, 6000);
  }

  function stopTimer() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function resetTimer() {
    stopTimer();
    startTimer();
  }

  if (showcase) {
    showcase.addEventListener('mouseenter', () => {
      isHovered = true;
    });
    showcase.addEventListener('mouseleave', () => {
      isHovered = false;
    });
  }

  startTimer();
}

