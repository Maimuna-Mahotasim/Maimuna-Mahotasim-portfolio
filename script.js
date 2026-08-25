// =====================================================================
// Maimuna Mahotasim — Portfolio interactivity
// =====================================================================
document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Sticky navbar + scroll state ---------------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  function onScroll(){
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    if (window.scrollY > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------------- Mobile hamburger menu ---------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu(){
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function toggleMobileMenu(){
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  hamburger.addEventListener('click', toggleMobileMenu);
  mobileMenu.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ---------------- Smooth scroll for in-page links ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.length > 1) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ---------------- Active section indicator (scrollspy) ---------------- */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => spyObserver.observe(sec));

  /* ---------------- Scroll reveal animations ---------------- */
  if (reduceMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }

  /* ---------------- Gallery: filter ---------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const masonryItems = document.querySelectorAll('.masonry-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      masonryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.cat === filter;
        item.style.display = match ? '' : 'none';
      });
    });
  });

  /* ---------------- Gallery: lightbox ---------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxPh = document.getElementById('lightboxPh');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  let visibleItems = [];
  let currentIndex = 0;

  function getVisibleItems(){
    return Array.from(masonryItems).filter(item => item.style.display !== 'none');
  }

  function openLightboxAt(index){
    visibleItems = getVisibleItems();
    if (!visibleItems.length) return;
    currentIndex = (index + visibleItems.length) % visibleItems.length;
    const item = visibleItems[currentIndex];
    const title = item.querySelector('.ov-title')?.textContent || 'Untitled';
    const cat = item.querySelector('.ov-cat')?.textContent || '';
    const sourceBox = item.querySelector('.ph-box');
    const img = sourceBox.querySelector('img');

    if (img) {
      lightboxImage.className = 'ph-box has-photo';
      lightboxImage.innerHTML = `<img src="${img.getAttribute('src')}" alt="${img.getAttribute('alt') || title}">`;
    } else {
      const phClass = sourceBox.className.match(/ph-c\d/)?.[0] || 'ph-c1';
      lightboxImage.className = 'ph-box ' + phClass;
      lightboxImage.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span>Add Image</span>`;
    }
    lightboxCaption.textContent = `${title} — ${cat}`;

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  masonryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightboxAt(idx));
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightboxAt(idx); }
    });
  });

  function closeLightbox(){
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  lbPrev.addEventListener('click', () => openLightboxAt(currentIndex - 1));
  lbNext.addEventListener('click', () => openLightboxAt(currentIndex + 1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightboxAt(currentIndex - 1);
    if (e.key === 'ArrowRight') openLightboxAt(currentIndex + 1);
  });

  /* ---------------- Certificate "View Certificate" -> lightbox-style open ---------------- */
  document.querySelectorAll('.js-cert-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const card = link.closest('.cert-card');
      const title = card.querySelector('h4')?.textContent || 'Certificate';
      const org = card.querySelector('.cert-org')?.textContent || '';
      const media = card.querySelector('.ph-box');
      const img = media.querySelector('img');

      if (img) {
        lightboxImage.className = 'ph-box has-photo';
        lightboxImage.innerHTML = `<img src="${img.getAttribute('src')}" alt="${img.getAttribute('alt') || title}">`;
      } else {
        const phClass = media.className.match(/ph-c\d/)?.[0] || 'ph-c1';
        lightboxImage.className = 'ph-box ' + phClass;
        lightboxImage.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span>Add Certificate Image</span>`;
      }
      lightboxCaption.textContent = `${title} — ${org}`;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  /* ---------------- Project details modal (EVM) ---------------- */
  const evmModal = document.getElementById('evmModal');
  const openEvmModal = document.getElementById('openEvmModal');
  const closeEvmModal = document.getElementById('closeEvmModal');

  function openModal(){
    evmModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    evmModal.classList.remove('open');
    document.body.style.overflow = '';
  }
  openEvmModal.addEventListener('click', openModal);
  closeEvmModal.addEventListener('click', closeModal);
  evmModal.addEventListener('click', (e) => { if (e.target === evmModal) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && evmModal.classList.contains('open')) closeModal();
  });

  /* ---------------- Contact form validation ---------------- */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function setFieldError(field, hasError){
    field.closest('.field').classList.toggle('error', hasError);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formSuccess.classList.remove('show');

    const name = document.getElementById('cf-name');
    const email = document.getElementById('cf-email');
    const message = document.getElementById('cf-message');

    let valid = true;

    if (!name.value.trim()) { setFieldError(name, true); valid = false; } else { setFieldError(name, false); }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailPattern.test(email.value.trim())) { setFieldError(email, true); valid = false; } else { setFieldError(email, false); }

    if (!message.value.trim() || message.value.trim().length < 5) { setFieldError(message, true); valid = false; } else { setFieldError(message, false); }

    if (valid) {
      // Google Sheet এ record রাখার জন্য
      fetch('https://script.google.com/macros/s/AKfycbxY2flvuXr_X_KZvvGSB4OIs4KC_y9oy5_p0MErqsw5oJ84liQuIzc7sNdprBeMWrLn/exec', {
        method: 'POST',
        body: new FormData(form)
      }).catch(() => {});

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(response => {
          if (response.ok) {
            formSuccess.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Thanks! Your message has been sent — I\'ll get back to you soon.';
            formSuccess.classList.add('show');
            form.reset();
          } else {
            formSuccess.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg> Something went wrong. Please try again or email me directly.';
            formSuccess.classList.add('show');
          }
        })
        .catch(() => {
          formSuccess.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg> Something went wrong. Please check your connection and try again.';
          formSuccess.classList.add('show');
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        });
    } else {
      const firstError = form.querySelector('.field.error input, .field.error textarea');
      if (firstError) firstError.focus();
    }
  });

});
