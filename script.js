/* ============================================
   MOVE AND BREATHE LILLE — Interactions
   ============================================ */

(function () {
  'use strict';

  /* -------- NAV: scrolled state -------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const setScrolled = () => {
      if (window.scrollY > 24) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  }

  /* -------- NAV: burger menu (mobile) -------- */
  const burger = document.querySelector('.nav-burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      burger.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* -------- REVEAL ON SCROLL (IntersectionObserver) -------- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    // Fallback: just show everything
    reveals.forEach((el) => el.classList.add('visible'));
  }

  /* -------- YOUTUBE LITE (lazy load on click) -------- */
  document.querySelectorAll('.yt-lite').forEach((el) => {
    const videoId = el.dataset.videoId;
    if (!videoId) return;
    // Set thumbnail
    const thumb = el.querySelector('.yt-thumb');
    if (thumb && !thumb.src) {
      thumb.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    }
    el.addEventListener('click', function () {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`);
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute(
        'allow',
        'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
      );
      iframe.setAttribute('allowfullscreen', '1');
      iframe.style.position = 'absolute';
      iframe.style.inset = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = '0';
      el.innerHTML = '';
      el.appendChild(iframe);
      el.classList.add('yt-active');
    });
  });

  /* -------- CONTACT FORM (graceful submit -> mailto) -------- */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = new FormData(contactForm);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const subject = (data.get('subject') || 'Demande de contact').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      const body =
        `Nom : ${name}%0D%0A` +
        `Email : ${email}%0D%0A` +
        `Téléphone : ${phone}%0D%0A%0D%0A` +
        `${encodeURIComponent(message)}`;

      const mailto = `mailto:contact@moveandbreathelille.fr?subject=${encodeURIComponent(
        subject
      )}&body=${body}`;

      window.location.href = mailto;

      const status = document.querySelector('#form-status');
      if (status) {
        status.textContent =
          'Votre client mail va s’ouvrir. Si ce n’est pas le cas, écrivez directement à contact@moveandbreathelille.fr';
        status.style.display = 'block';
      }
    });
  }

  /* -------- SET ACTIVE NAV LINK BASED ON URL -------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (
      href === currentPath ||
      (currentPath === '' && href === 'index.html') ||
      (currentPath === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active');
    }
  });

  /* -------- YEAR IN FOOTER -------- */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
