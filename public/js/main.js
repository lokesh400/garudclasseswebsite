/* ═══════════════════════════════════════════════════════════
   GARUD CLASSES - MAIN FRONTEND JAVASCRIPT
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. navbar scroll effect ── */
  const mainNav = document.getElementById('mainNav');
  if (mainNav) {
    const onScroll = () => {
      mainNav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 2. Hamburger menu toggle ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      }
    });
  }

  /* ── 3. Courses dropdown hover (desktop) & click (mobile) ── */
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(drop => {
    const trigger = drop.querySelector('a');
    const menu    = drop.querySelector('.dropdown-menu');
    if (trigger && menu) {
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth < 1024) {
          e.preventDefault();
          menu.classList.toggle('open');
        }
      });
    }
  });

  /* ── 4. Stats counter animation ── */
  const counters = document.querySelectorAll('[data-target]');
  if (counters.length > 0) {
    const animateCount = (el) => {
      const target   = +el.getAttribute('data-target');
      const duration = 2000;
      const step     = 16;
      const increment = target / (duration / step);
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target >= 1000
                           ? target.toLocaleString()
                           : target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current) >= 1000
                           ? Math.floor(current).toLocaleString()
                           : Math.floor(current);
        }
      }, step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCount(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(c => observer.observe(c));
  }

  /* ── 5. Testimonials slider ── */
  const track  = document.querySelector('.testimonials-track');
  const cards  = document.querySelectorAll('.testimonial-card');
  const dotsEl = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (track && cards.length > 0) {
    let current = 0;
    let perView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    let total   = Math.ceil(cards.length / perView);
    let timer;

    const createDots = () => {
      if (!dotsEl) return;
      dotsEl.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const d = document.createElement('span');
        d.className = 'dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(d);
      }
    };

    const updateDots = () => {
      if (!dotsEl) return;
      dotsEl.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    };

    const goTo = (n) => {
      current = (n + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      updateDots();
    };

    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    const startAuto = () => { timer = setInterval(next, 5000); };
    const stopAuto  = () => clearInterval(timer);

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });

    createDots();
    startAuto();

    /* touch swipe */
    let touchX = 0;
    track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { stopAuto(); diff > 0 ? next() : prev(); startAuto(); }
    });

    window.addEventListener('resize', () => {
      perView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
      total   = Math.ceil(cards.length / perView);
      current = 0;
      track.style.transform = 'translateX(0)';
      createDots();
    });
  }

  /* ── 6. Back to top button ── */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 7. Flash alert auto-dismiss ── */
  const flashAlerts = document.querySelectorAll('.flash-alert');
  flashAlerts.forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.5s, transform 0.5s';
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-10px)';
      setTimeout(() => alert.remove(), 500);
    }, 5000);

    const closeBtn = alert.querySelector('.flash-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
      });
    }
  });

  /* ── 8. Scroll-reveal (simple AOS alternative) ── */
  const revealEls = document.querySelectorAll(
    '.course-card, .faculty-card, .stat-item, .result-card, .blog-card, .gallery-item'
  );
  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 60);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      revealObserver.observe(el);
    });
  }

  /* ── 9. Gallery filter tabs ── */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const galleryItems = document.querySelectorAll('.gallery-item[data-category]');
  if (filterTabs.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.filter;
        galleryItems.forEach(item => {
          const match = cat === 'ALL' || item.dataset.category === cat;
          item.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* ── 10. Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 11. Homepage Banner Slider ── */
  const bannerTrack = document.getElementById('bannerTrack');
  const bannerSlides = bannerTrack ? bannerTrack.querySelectorAll('.banner-slide') : [];
  const bannerDots   = document.querySelectorAll('.banner-dot');
  const bannerPrev   = document.getElementById('bannerPrev');
  const bannerNext   = document.getElementById('bannerNext');

  if (bannerTrack && bannerSlides.length > 1) {
    let bCurrent = 0;
    const bTotal = bannerSlides.length;
    const DURATION = 5000; // ms per slide
    let bTimer;
    let bProgressStart;
    let bProgressEl;

    // Create progress bar element
    bProgressEl = document.createElement('div');
    bProgressEl.className = 'banner-progress';
    bannerTrack.parentElement.appendChild(bProgressEl);

    const goTo = (n) => {
      bannerSlides[bCurrent].classList.remove('slide-active');
      bCurrent = (n + bTotal) % bTotal;
      bannerTrack.style.transform = `translateX(-${bCurrent * 100}%)`;
      bannerSlides[bCurrent].classList.add('slide-active');
      bannerDots.forEach((d, i) => d.classList.toggle('active', i === bCurrent));
      // reset progress bar
      bProgressEl.style.transition = 'none';
      bProgressEl.style.width = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bProgressEl.style.transition = `width ${DURATION}ms linear`;
          bProgressEl.style.width = '100%';
        });
      });
    };

    const startAuto = () => {
      clearInterval(bTimer);
      bTimer = setInterval(() => goTo(bCurrent + 1), DURATION);
    };

    const stopAuto = () => clearInterval(bTimer);

    bannerSlides[0].classList.add('slide-active');
    goTo(0);
    startAuto();

    bannerPrev?.addEventListener('click', () => { stopAuto(); goTo(bCurrent - 1); startAuto(); });
    bannerNext?.addEventListener('click', () => { stopAuto(); goTo(bCurrent + 1); startAuto(); });
    bannerDots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));

    // Touch swipe
    let bTouchX = 0;
    bannerTrack.addEventListener('touchstart', e => { bTouchX = e.touches[0].clientX; stopAuto(); }, { passive: true });
    bannerTrack.addEventListener('touchend', e => {
      const diff = bTouchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(bCurrent + (diff > 0 ? 1 : -1));
      startAuto();
    });

    // Pause on hover
    bannerTrack.parentElement.addEventListener('mouseenter', stopAuto);
    bannerTrack.parentElement.addEventListener('mouseleave', startAuto);
  }

});

