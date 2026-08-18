/* ==========================================================================
   VKP Engineering - Interactive Frontend Script (Enhanced)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Hide Preloader smoothly
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

  // 2. Mobile Menu Toggle
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

  // Active Navigation Link on Scroll (Throttled)
  const sections = document.querySelectorAll('section');
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
  });

  // 4. Scroll Counter Animation for Stats
  const statNumbers = document.querySelectorAll('.stat-number');
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

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedStats) {
          animatedStats = true;
          statNumbers.forEach(stat => animateCount(stat));
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

  // 5. Scroll Reveal Observer for Smooth Section Animations
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

  // 6. Dynamic Gallery & Lightbox
  const galleryData = {
    ducting: [
      { path: "images/ducting/ducting-chimney-system.jpeg", title: "Ducting Chimney System" },
      { path: "images/ducting/ducting-components.jpg", title: "Ducting Components" },
      { path: "images/ducting/ducting-pipe-system.webp", title: "Ducting Pipe System" },
      { path: "images/ducting/funnel-metal-cover.jpeg", title: "Funnel Metal Cover" },
      { path: "images/ducting/heavy-exhaust-ducting.jpg", title: "Heavy Exhaust Ducting" },
      { path: "images/ducting/industrial-ducting-pipes.webp", title: "Industrial Ducting Pipes" },
      { path: "images/ducting/large-white-ducting-cover-2.jpeg", title: "Large White Ducting Cover" },
      { path: "images/ducting/metal-ducting-cover-1.jpeg", title: "Metal Ducting Cover" },
      { path: "images/ducting/metal-ducting-cover-2.jpeg", title: "Metal Ducting Cover" },
      { path: "images/ducting/metal-ducting-cover-3.jpeg", title: "Metal Ducting Cover" },
      { path: "images/ducting/triangular-ducting-hood-1.jpeg", title: "Triangular Ducting Hood" },
      { path: "images/ducting/triangular-ducting-hood-2.jpeg", title: "Triangular Ducting Hood" },
      { path: "images/ducting/triangular-ducting-hood-3.jpeg", title: "Triangular Ducting Hood" }
    ],
    tanks: [
      { path: "images/tanks/heavy-duty-lorry-water-tank.jpeg", title: "Heavy Duty Lorry Water Tank" },
      { path: "images/tanks/heavy-tank.jpg", title: "Heavy Tank" },
      { path: "images/tanks/horizontal-cylindrical-tank-1.jpeg", title: "Horizontal Cylindrical Tank" },
      { path: "images/tanks/horizontal-cylindrical-tank-2.jpeg", title: "Horizontal Cylindrical Tank" },
      { path: "images/tanks/industrial-vertical-storage-tank.jpeg", title: "Industrial Vertical Storage Tank" },
      { path: "images/tanks/square-metal-bins-1.jpeg", title: "Square Metal Bins" },
      { path: "images/tanks/square-metal-bins-2.jpeg", title: "Square Metal Bins" },
      { path: "images/tanks/ss-horizontal-tank.jpg", title: "SS Horizontal Tank" },
      { path: "images/tanks/stainless-steel-mixing-tank.jpeg", title: "Stainless Steel Mixing Tank" },
      { path: "images/tanks/vertical-mixing-tanks.jpeg", title: "Vertical Mixing Tanks" }
    ],
    trolleys: [
      { path: "images/trolleys/blue-trolley-frames-1.jpeg", title: "Blue Trolley Frames" },
      { path: "images/trolleys/blue-trolley-frames-2.jpeg", title: "Blue Trolley Frames" },
      { path: "images/trolleys/blue-wheeled-trolley.jpeg", title: "Blue Wheeled Trolley" },
      { path: "images/trolleys/custom-handling-trolley.jpeg", title: "Custom Handling Trolley" },
      { path: "images/trolleys/heavy-duty-material-cart.jpeg", title: "Heavy Duty Material Cart" },
      { path: "images/trolleys/industrial-work-table.jpeg", title: "Industrial Work Table" },
      { path: "images/trolleys/rolling-laundry-trolley.jpeg", title: "Rolling Laundry Trolley" },
      { path: "images/trolleys/rolling-material-trolley.jpeg", title: "Rolling Material Trolley" },
      { path: "images/trolleys/white-wheeled-carts.jpeg", title: "White Wheeled Carts" }
    ],
    structural: [
      { path: "images/structural/factory-shed-setup.jpeg", title: "Factory Shed Setup" },
      { path: "images/structural/flat-metal-structural-base.jpeg", title: "Flat Metal Structural Base" },
      { path: "images/structural/heavy-industrial-framework.jpeg", title: "Heavy Industrial Framework" },
      { path: "images/structural/on-site-assembly-erection.jpeg", title: "On-Site Assembly Erection" },
      { path: "images/structural/roofing-support-structures.jpeg", title: "Roofing Support Structures" },
      { path: "images/structural/steel-structure-fabrication.jpeg", title: "Steel Structure Fabrication" }
    ],
    machinery: [
      { path: "images/machinery-erection/crane-lifting-machinery.jpeg", title: "Crane Lifting Machinery" },
      { path: "images/machinery-erection/heavy-machinery-installation.jpeg", title: "Heavy Machinery Installation" },
      { path: "images/machinery-erection/industrial-machinery-setup.jpeg", title: "Industrial Machinery Setup" },
      { path: "images/machinery-erection/machine-assembly-frame.jpeg", title: "Machine Assembly Frame" },
      { path: "images/machinery-erection/precision-machinery-alignment.jpeg", title: "Precision Machinery Alignment" },
      { path: "images/machinery-erection/roller-machine-installation.jpeg", title: "Roller Machine Installation" },
      { path: "images/machinery-erection/tall-ducting-chimneys.jpeg", title: "Tall Ducting Chimneys" }
    ]
  };

  const categoryLabels = {
    ducting: "Ducting Systems",
    tanks: "Tanks & Vessels",
    trolleys: "Trolleys & Equipment",
    structural: "Structural Erection",
    machinery: "Machinery Erection"
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
      
      let imagesToRender = currentGalleryImages;
      const viewAllBtn = document.getElementById('viewAllPhotosBtn');
      
      if (filterCategory === 'all' && !window.galleryExpanded) {
        imagesToRender = currentGalleryImages.slice(0, 8);
        if (viewAllBtn && currentGalleryImages.length > 8) {
          viewAllBtn.style.display = 'inline-block';
        }
      } else {
        if (viewAllBtn) viewAllBtn.style.display = 'none';
      }
      
      imagesToRender.forEach((item, index) => {
        const cardHTML = `
          <div class="gallery-card" data-category="${item.category}" data-index="${index}">
            <img src="${item.path}" alt="${item.title}" loading="lazy">
            <div class="gallery-card-overlay">
              <span class="gallery-card-category">${categoryLabels[item.category] || 'Project'}</span>
              <div class="gallery-card-title">${item.title}</div>
            </div>
            <div class="gallery-zoom-icon"><i class="fas fa-search-plus"></i></div>
          </div>
        `;
        dynamicGalleryGrid.insertAdjacentHTML('beforeend', cardHTML);
      });
      
      // Bind click events for new cards
      document.querySelectorAll('.gallery-card').forEach(card => {
        card.addEventListener('click', function() {
          const idx = parseInt(this.getAttribute('data-index'));
          
          // Ensure currentGalleryImages matches the grid before opening
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
      window.galleryExpanded = false; // Reset expand state on filter change
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.getAttribute('data-filter'));
    });
  });

  // Initial Render
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

  // Handle Escape key globally for modals
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

  // 8. FAQ Accordion Toggle
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

  // 9. Request Quote Modal & WhatsApp Form Integration
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

      const whatsappNumber = '919095007447';
      const message = `Hello VKP Engineering,%0A%0AI would like to request a quote for:%0A- *Service Required:* ${encodeURIComponent(service)}%0A- *Name:* ${encodeURIComponent(name)}%0A- *Phone:* ${encodeURIComponent(phone)}%0A- *Project Details:* ${encodeURIComponent(details || 'N/A')}`;

      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');

      if (quoteModal) {
        quoteModal.classList.remove('active');
      }
      quoteForm.reset();
    });
  }

  // 11. View Gallery Feature in Structural Card
  const viewGalleryBtns = document.querySelectorAll('.view-gallery-btn');
  viewGalleryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const galleryKey = btn.getAttribute('data-gallery');
      if (galleryKey && galleryData[galleryKey]) {
        // Prepare the lightbox images for this specific category
        currentGalleryImages = galleryData[galleryKey].map(img => ({ ...img, category: galleryKey }));
        openLightbox(0);
      }
    });
  });

});

document.addEventListener('DOMContentLoaded', () => {
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
});
