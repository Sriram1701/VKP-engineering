/* ==========================================================================
   VKP Engineering - Interactive Frontend Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     01. PRELOADER
     ========================================================================== */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
      }, 500);
    });
    // Fallback hide after 1.5s in case load event fired early
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
    }, 1500);
  }

  /* ==========================================================================
     02. HEADER & NAVIGATION BAR
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    const toggleMenu = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      navMenu.classList.toggle('open');
      const isExpanded = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (isExpanded) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    };

    mobileToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking link
    const navLinks = navMenu.querySelectorAll('.nav-link, .btn');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
  }

  // Active Navigation Link on Scroll (Throttled via requestAnimationFrame)
  const sections = document.querySelectorAll('section, header.hero-section');
  const navLinksList = document.querySelectorAll('.nav-link');

  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        let current = '';
        const scrollPosition = window.scrollY + 140;

        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
          }
        });

        navLinksList.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
          }
        });
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  /* ==========================================================================
     03. HERO SECTION & BOTTOM STATS BAR
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-val');
  let animatedStats = false;

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;

    const duration = 3000; // Smooth 3.0 seconds duration for clear readability
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      // Ease-out cubic curve so counting slows down near the end
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * target);

      el.innerText = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.innerText = target + suffix;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  const statsSection = document.querySelector('.hero-stats-bar');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedStats) {
          animatedStats = true;
          setTimeout(() => {
            statNumbers.forEach(stat => animateCount(stat));
          }, 600);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  } else {
    statNumbers.forEach(stat => {
      const target = stat.getAttribute('data-target');
      const suffix = stat.getAttribute('data-suffix') || '';
      if (target) stat.innerText = target + suffix;
    });
  }

  /* ==========================================================================
     04. SCROLL REVEAL OBSERVER
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* ==========================================================================
     07. FEATURED CORE SERVICES ("View Gallery" Shortcut Handler)
     ========================================================================== */
  const viewGalleryBtns = document.querySelectorAll('.view-gallery-btn');
  viewGalleryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const galleryKey = btn.getAttribute('data-gallery');
      if (galleryKey) {
        const gallerySection = document.getElementById('gallery');
        if (gallerySection) {
          gallerySection.scrollIntoView({ behavior: 'smooth' });
        }
        
        const targetFilterBtn = document.querySelector(`.filter-btn[data-filter="${galleryKey}"]`);
        if (targetFilterBtn) {
          targetFilterBtn.click();
        }
      }
    });
  });

  /* ==========================================================================
     08. FILTERABLE WORKS & PRODUCTS GALLERY & LIGHTBOX
     ========================================================================== */
  const galleryData = {
    structural: [
      { path: "images/main-photos/structure-work.jpeg", title: "Structure Work", featured: true },
      { path: "images/structural/ms-structural-steel-and-ss-gi-duct-fabrication.jpeg", title: "MS Structural Steel & SS/GI Duct Fabrication", featured: true },
      { path: "images/structural/heavy-industrial-framework.jpeg", title: "Heavy Industrial Framework" },
      { path: "images/structural/on-site-assembly-erection.jpeg", title: "On-Site Assembly Erection" },
      { path: "images/structural/roofing-support-structures.jpeg", title: "Roofing Support Structures" }
    ],
    machinery: [
      { path: "images/main-photos/precision-machinery-alignment.jpeg", title: "Precision Machinery Alignment", featured: true },
      { path: "images/machinery-erection/machinery-erection-and-electrical-works.jpeg", title: "Machinery Erection & Electrical Works", featured: true },
      { path: "images/machinery-erection/machinery-erection-works-1.jpeg", title: "Machinery Erection Works 1" },
      { path: "images/machinery-erection/machinery-erection-works-2.jpeg", title: "Machinery Erection Works 2" },
      { path: "images/machinery-erection/heavy-machinery-lifting-and-positioning.jpeg", title: "Heavy Machinery Lifting & Positioning" },
      { path: "images/machinery-erection/machinery-erection-works-3.jpeg", title: "Machinery Erection Works 3" },
      { path: "images/machinery-erection/machinery-erection-works-4.jpeg", title: "Machinery Erection Works 4" },
      { path: "images/machinery-erection/machinery-erection-works-5.jpeg", title: "Machinery Erection Works 5" },
      { path: "images/machinery-erection/crane-lifting-machinery.jpeg", title: "Crane Lifting Machinery" },
      { path: "images/machinery-erection/heavy-machinery-installation.jpeg", title: "Heavy Machinery Installation" }
    ],
    ducting: [
      { path: "images/ducting/continuous-plant-machine-erection-and-ducting-system.jpeg", title: "Continuous Plant Machine Erection & Ducting System", featured: true },
      { path: "images/ducting/machinery-erection-and-exhaust-ducting-system.jpeg", title: "Machinery Erection & Exhaust Ducting System", featured: true },
      { path: "images/ducting/machinery-erection-and-ducting.jpeg", title: "Machinery Erection & Ducting", featured: true },
      { path: "images/ducting/textile-machinery-erection-and-duct-work.jpeg", title: "Textile Machinery Erection & Duct Work", featured: true },
      { path: "images/ducting/singeing-machine-erection-and-duct-work.jpeg", title: "Singeing Machine Erection & Duct Work", featured: true },
      { path: "images/ducting/machinery-erection-and-duct-work.jpeg", title: "Machinery Erection & Duct Work", featured: true },
      { path: "images/main-photos/machinery-erection-and-duct-works.jpeg", title: "Machinery Erection & Duct Works", featured: true },
      { path: "images/main-photos/aluminium-hood-works.jpeg", title: "Aluminium Hood Works", featured: true },
      { path: "images/ducting/ducting-chimney-system.jpeg", title: "Ducting Chimney System" },
      { path: "images/ducting/industrial-ducting-system.jpeg", title: "Industrial Ducting System" },
      { path: "images/ducting/hood-assembly-and-erection-work.jpeg", title: "Hood Assembly & Erection Work" },
      { path: "images/ducting/heavy-exhaust-ducting.jpg", title: "Heavy Exhaust Ducting" },
      { path: "images/ducting/hood-assembly-and-erection-works.jpeg", title: "Hood Assembly & Erection Works" },
      { path: "images/ducting/ss-double-show-box-hopper-2.jpeg", title: "SS Double Show Box Hopper" },
      { path: "images/ducting/ss-double-show-box-hopper.jpeg", title: "SS Double Show Box Hopper" },
      { path: "images/ducting/triangular-ducting-hood-1.jpeg", title: "Triangular Ducting Hood" }
    ],
    tanks: [
      { path: "images/main-photos/ss-heavy-tank-works.jpg", title: "SS Heavy Tank Works", featured: true },
      { path: "images/main-photos/ss-softner-tank.jpeg", title: "SS Softner Tank", featured: true },
      { path: "images/tanks/boiler-tank.jpeg", title: "Boiler Tank" },
      { path: "images/tanks/heavy-duty-water-tank.jpeg", title: "Heavy Duty Water Tank" },
      { path: "images/tanks/horizontal-cylindrical-tank.jpeg", title: "Horizontal Cylindrical Tank" },
      { path: "images/tanks/industrial-vertical-storage-tank.jpeg", title: "Industrial Vertical Storage Tank" },
      { path: "images/tanks/ss-horizontal-tank.jpg", title: "SS Horizontal Tank" },
      { path: "images/tanks/stainless-steel-mixing-tank.jpeg", title: "Stainless Steel Mixing Tank" }
    ],
    trolleys: [
      { path: "images/main-photos/ms-trolley-works.jpeg", title: "MS Trolley Works", featured: true },
      { path: "images/trolleys/blue-trolley-frames-2.jpeg", title: "Blue Trolley Frames" },
      { path: "images/trolleys/custom-handling-trolley.jpeg", title: "Custom Handling Trolley" },
      { path: "images/trolleys/ms-trolley-with-wheels.jpeg", title: "MS Trolley with Wheels" },
      { path: "images/trolleys/industrial-work-table.jpeg", title: "Industrial Work Table" },
      { path: "images/trolleys/laundry-box-trolley.jpeg", title: "Laundry Box Trolley" },
      { path: "images/trolleys/rolling-laundry-trolley.jpeg", title: "Rolling Laundry Trolley" },
      { path: "images/trolleys/rolling-material-trolley.jpeg", title: "Rolling Material Trolley" }
    ],
    ss_ducts: [
      { path: "images/main-photos/printing-machine-ss-false-ceiling-work.jpeg", title: "Printing Machine SS False Ceiling Work", featured: true },
      { path: "images/main-photos/printing-machine-ss-false-ceiling.jpeg", title: "Printing Machine SS False Ceiling", featured: true },
      { path: "images/main-photos/ss-double-show-box-hopper.jpeg", title: "SS Double Show Box Hopper", featured: true },
      { path: "images/SS-duct-works/machinery-erection-and-duct-works.jpeg", title: "Machinery Erection & Duct Works" }
    ],
    fans_blowers: [
      { path: "images/main-photos/axial-flow-fan-belt-driven.jpeg", title: "Axial Flow Fan Belt Driven", featured: true },
      { path: "images/main-photos/centrifugal-blower-fan.jpeg", title: "Centrifugal Blower Fan", featured: true },
      { path: "images/blowers/centrifugal-blower-coupling-type.jpeg", title: "Centrifugal Blower Coupling Type", featured: true }
    ],
    other: [
      { path: "images/others/gi-cable-tray-work.jpeg", title: "GI Cable Tray Work", featured: true },
      { path: "images/others/heavy-duty-cable-tray-work.jpeg", title: "Heavy Duty Cable Tray Work", featured: true },
      { path: "images/aluminium-work/aluminium-hood-works.jpeg", title: "Aluminium Hood Works", featured: true },
      { path: "images/others/cable-tray-installation.jpeg", title: "Cable Tray Installation" },
      { path: "images/aluminium-work/aluminium-hood.jpeg", title: "Aluminium Hood" },
      { path: "images/aluminium-work/aluminium-hood-cover.jpeg", title: "Aluminium Hood Cover" }
    ]
  };

  const categoryLabels = {
    structural: "Structural Erection",
    machinery: "Machinery Erection",
    ducting: "Ducting Systems",
    tanks: "Tank Vessels",
    trolleys: "Trolleys & Tables",
    ss_ducts: "SS Duct Works",
    fans_blowers: "Industrial Blowers",
    other: "Cable Tray & Other Works"
  };
  const filterBtns = document.querySelectorAll('.filter-btn');
  const dynamicGalleryGrid = document.getElementById('dynamicGalleryGrid');
  
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryImages = [];
  let currentImageIndex = 0;

  function renderGallery(filterCategory) {
    if (!dynamicGalleryGrid) return;
    
    // Fade out
    dynamicGalleryGrid.style.opacity = '0';
    
    setTimeout(() => {
      dynamicGalleryGrid.innerHTML = '';
      currentGalleryImages = [];
      
      let categoriesToRender = filterCategory === 'all' ? Object.keys(galleryData) : [filterCategory];
      
      categoriesToRender.forEach(cat => {
        if (galleryData[cat]) {
          galleryData[cat].forEach(imgObj => {
            currentGalleryImages.push({ ...imgObj, category: cat });
          });
        }
      });
      
      if (filterCategory === 'all') {
        const idx1 = currentGalleryImages.findIndex(img => img.title === "Printing Machine SS False Ceiling Work");
        const idx2 = currentGalleryImages.findIndex(img => img.title === "Structure Work");
        if (idx1 !== -1 && idx2 !== -1) {
          const temp = currentGalleryImages[idx1];
          currentGalleryImages[idx1] = currentGalleryImages[idx2];
          currentGalleryImages[idx2] = temp;
        }
      }
      
      let imagesToRender = [];
      const viewAllBtn = document.getElementById('viewAllPhotosBtn');
      
      if (filterCategory === 'all' && !window.galleryExpanded) {
        currentGalleryImages.forEach((item, index) => {
          if (item.featured) {
            imagesToRender.push({ item, index });
          }
        });
        if (viewAllBtn) viewAllBtn.style.display = 'inline-block';
      } else {
        imagesToRender = currentGalleryImages.map((item, idx) => ({ item, index: idx }));
        if (viewAllBtn) viewAllBtn.style.display = 'none';
      }
      
      imagesToRender.forEach((obj) => {
        const item = obj.item;
        const index = obj.index;
        const cardHTML = `
          <div class="gallery-item-wrapper">
            <div class="gallery-card" data-category="${item.category}" data-index="${index}">
              <img src="${item.path}" alt="${item.title}" loading="lazy">
              <div class="gallery-card-overlay">
                <div class="gallery-card-title">${categoryLabels[item.category] || 'Project'}</div>
              </div>
              <div class="gallery-zoom-icon"><i class="fas fa-search-plus"></i></div>
            </div>
            <div class="gallery-item-label">${item.title}</div>
          </div>
        `;
        dynamicGalleryGrid.insertAdjacentHTML('beforeend', cardHTML);
      });
      
      // Bind click events for cards
      document.querySelectorAll('.gallery-card').forEach(card => {
        card.addEventListener('click', function() {
          const idx = parseInt(this.getAttribute('data-index'));
          
          // Ensure currentGalleryImages matches the active filter
          const activeBtn = document.querySelector('.filter-btn.active');
          if (activeBtn) {
            const filterCategory = activeBtn.getAttribute('data-filter');
            currentGalleryImages = [];
            let categoriesToRender = filterCategory === 'all' ? Object.keys(galleryData) : [filterCategory];
            categoriesToRender.forEach(cat => {
              if (galleryData[cat]) {
                galleryData[cat].forEach(imgObj => {
                  currentGalleryImages.push({ ...imgObj, category: cat });
                });
              }
            });
          }
          openLightbox(idx);
        });
      });
      
      // Fade in
      dynamicGalleryGrid.style.opacity = '1';
    }, 300);
  }

  function openLightbox(index) {
    if (!lightboxModal || !currentGalleryImages[index]) return;
    currentImageIndex = index;
    const item = currentGalleryImages[currentImageIndex];
    
    lightboxImg.src = item.path;
    lightboxImg.alt = item.title;
    if (lightboxCaption) lightboxCaption.textContent = item.title;
    
    lightboxModal.classList.add('active');
  }

  function showNextImage(e) {
    if (e) e.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
    openLightbox(currentImageIndex);
  }

  function showPrevImage(e) {
    if (e) e.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    openLightbox(currentImageIndex);
  }

  // Bind Lightbox Controls
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  
  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  // Filter Buttons Click Event
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.galleryExpanded = false;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.getAttribute('data-filter'));
    });
  });

  // Initial Gallery Render
  window.galleryExpanded = false;
  const initialBtn = document.querySelector('.filter-btn.active');
  renderGallery(initialBtn ? initialBtn.getAttribute('data-filter') : 'all');
  
  // View All Button Event
  const viewAllBtn = document.getElementById('viewAllPhotosBtn');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      window.galleryExpanded = true;
      const activeBtn = document.querySelector('.filter-btn.active');
      renderGallery(activeBtn ? activeBtn.getAttribute('data-filter') : 'all');
    });
  }

  // Handle Escape key globally for all modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightboxModal && lightboxModal.classList.contains('active')) {
        lightboxModal.classList.remove('active');
      }
      const quoteModalEl = document.getElementById('quoteModal');
      if (quoteModalEl && quoteModalEl.classList.contains('active')) {
        quoteModalEl.classList.remove('active');
      }
    }
  });

  /* ==========================================================================
     10. CUSTOMER SATISFACTION & VALUABLE CLIENTS MARQUEE
     ========================================================================== */
  const scrollLists = document.querySelectorAll('.customer-scroll-list');
  scrollLists.forEach(list => {
    // Duplicate inner content for seamless infinite auto-scroll
    const content = list.innerHTML;
    list.innerHTML = content + content;
  });

  /* ==========================================================================
     11. CLIENT REVIEWS & FEEDBACK (GOOGLE REVIEWS SLIDER)
     ========================================================================== */
  const reviewSlider = document.getElementById('reviewSlider');
  const reviewDotsContainer = document.getElementById('reviewDots');
  
  if (reviewSlider && reviewDotsContainer) {
    const reviews = [
      { name: 'Ramesh Kumar', initial: 'R', text: 'Excellent workmanship! The structural erection for our new garment factory was completed before the deadline. VKP Engineering team is highly professional.', date: '2 months ago' },
      { name: 'Senthil Textiles', initial: 'S', text: 'We ordered custom MS ducting for our spinning mill. The airflow efficiency has improved drastically, and the build quality is top-notch. Highly recommended in Tirupur!', date: '3 months ago' },
      { name: 'Karthik Fabrication', initial: 'K', text: 'Ordered two heavy SS 304 storage tanks. They matched our precise volume specs and the welding finish is perfect. Great pricing too.', date: '4 months ago' },
      { name: 'Anand Mills', initial: 'A', text: 'VKP handled our machinery erection seamlessly. They aligned the heavy imported setups perfectly without any vibrations during operation. Excellent technical knowledge.', date: '5 months ago' },
      { name: 'Manoj Logistics', initial: 'M', text: 'Got custom material handling trolleys fabricated. Very sturdy and exactly to our dimensions. Will definitely partner with them again.', date: '6 months ago' }
    ];

    reviews.forEach((review, idx) => {
      const card = document.createElement('div');
      card.className = 'review-card';
      card.innerHTML = `
        <div class="review-header">
          <div class="review-avatar">${review.initial}</div>
          <div class="review-author">
            <h4>${review.name}</h4>
            <div class="google-badge"><i class="fab fa-google"></i> Google Review &bull; ${review.date}</div>
          </div>
        </div>
        <div class="review-stars">
          <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
        </div>
        <p class="review-text">"${review.text}"</p>
      `;
      reviewSlider.appendChild(card);

      const dot = document.createElement('div');
      dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToReview(idx));
      reviewDotsContainer.appendChild(dot);
    });

    let currentReview = 0;
    let reviewInterval;

    function goToReview(idx) {
      currentReview = idx;
      reviewSlider.style.transform = `translateX(-${currentReview * 100}%)`;
      
      document.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentReview);
      });
      resetReviewInterval();
    }

    function nextReview() {
      currentReview = (currentReview + 1) % reviews.length;
      goToReview(currentReview);
    }

    function resetReviewInterval() {
      clearInterval(reviewInterval);
      reviewInterval = setInterval(nextReview, 5000);
    }

    resetReviewInterval();
  }

  /* ==========================================================================
     12. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)
     ========================================================================== */
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const faqAnswer = faqItem.querySelector('.faq-answer');

      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
          const ans = item.querySelector('.faq-answer');
          if (ans) ans.style.maxHeight = null;
          const qBtn = item.querySelector('.faq-question');
          if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
        }
      });

      faqItem.classList.toggle('active');
      const isExpanded = faqItem.classList.contains('active');
      question.setAttribute('aria-expanded', isExpanded);
      
      if (isExpanded) {
        faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
      } else {
        faqAnswer.style.maxHeight = null;
      }
    });
  });

  /* ==========================================================================
     13. FLOATING QUICK ACTION BUTTONS & SCROLL TO TOP
     ========================================================================== */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    const checkScrollPosition = () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', checkScrollPosition, { passive: true });
    checkScrollPosition();

    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     14. MODALS (QUOTE REQUEST MODAL & WHATSAPP SUBMISSION)
     ========================================================================== */
  const quoteModal = document.getElementById('quoteModal');
  const openQuoteBtns = document.querySelectorAll('.open-quote-modal');
  const closeQuoteBtn = document.getElementById('closeQuoteModal');
  const quoteForm = document.getElementById('quoteForm');

  openQuoteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const predefinedService = btn.getAttribute('data-service');
      if (predefinedService && quoteForm) {
        const selectEl = quoteForm.querySelector('#serviceSelect');
        if (selectEl) {
          selectEl.value = predefinedService;
        }
      }
      if (quoteModal) {
        quoteModal.classList.add('active');
      }
    });
  });

  if (closeQuoteBtn && quoteModal) {
    closeQuoteBtn.addEventListener('click', () => {
      quoteModal.classList.remove('active');
    });

    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) {
        quoteModal.classList.remove('active');
      }
    });
  }

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const service = document.getElementById('serviceSelect').value;
      const details = document.getElementById('projectDetails').value.trim();

      const whatsappNumber = '917418208984';
      const message = `Hello VKP Engineering,%0A%0AI would like to request a quote for:%0A- *Service Required:* ${encodeURIComponent(service)}%0A- *Name:* ${encodeURIComponent(name)}%0A- *Phone:* ${encodeURIComponent(phone)}%0A- *Project Details:* ${encodeURIComponent(details || 'N/A')}`;

      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');

      if (quoteModal) {
        quoteModal.classList.remove('active');
      }
      quoteForm.reset();
    });
  }

});
