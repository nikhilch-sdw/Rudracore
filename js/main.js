/**
 * Rudracore Technologies - Main JavaScript Module
 * Handles themes, dynamic component interactions, estimator calculations, 
 * industry switcher tabs, portfolio filtering, and contact form processing.
 */

document.addEventListener('DOMContentLoaded', () => {
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
});

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
 * 3. Hero Typewriter Text Rotator
 * ------------------------------------------------------------- */
function initTypewriterEffect() {
  const target = document.getElementById('rotatorText');
  if (!target) return;

  const phrases = [
    'Digital Marketing',
    'Mobile App Development',
    'Custom Software Engineering',
    'Cloud & Enterprise AI'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
    } else {
      target.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === currentPhrase.length) {
      typeSpeed = 2200; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
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

    const gap = window.innerWidth <= 768 ? 16 : 28;
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

