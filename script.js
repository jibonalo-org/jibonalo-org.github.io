/* ============================================================
   জীবন আলো সেবা সংগঠন — Main Script
   Features: Navbar, Hamburger, Scroll Animations,
             Counter, Active Nav Links, Back-to-Top
   ============================================================ */

'use strict';

/* ---------- DOM References ---------- */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navEl      = document.querySelector('nav');
const navLinks   = document.querySelectorAll('.nav-link');
const backToTop  = document.getElementById('backToTop');
const yearEl     = document.getElementById('copyright-year');

/* ---------- Copyright Year ---------- */
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Navbar: Scroll Shadow ---------- */
function handleNavScroll() {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

/* ---------- Back-to-Top Visibility ---------- */
function handleBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

/* ---------- Back-to-Top Click ---------- */
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Active Nav Link Highlighting ---------- */
const sections = document.querySelectorAll('section[id]');

function setActiveLink() {
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop    = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId     = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (link) {
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

/* ---------- Hamburger Menu ---------- */
function toggleMenu() {
  const isOpen = hamburger.classList.toggle('open');
  navEl.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen.toString());
  hamburger.setAttribute('aria-label', isOpen ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন');
}

if (hamburger) {
  hamburger.addEventListener('click', toggleMenu);
}

/* Close mobile menu when a nav link is clicked */
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navEl.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'মেনু খুলুন');
  });
});

/* Close mobile menu on outside click */
document.addEventListener('click', (e) => {
  if (
    navEl.classList.contains('open') &&
    !navEl.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    hamburger.classList.remove('open');
    navEl.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

/* ---------- Scroll Animation (Intersection Observer) ---------- */
const scrollElements = document.querySelectorAll('.scroll-animate');

const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        /* Unobserve after animating in for performance */
        scrollObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

scrollElements.forEach(el => scrollObserver.observe(el));

/* ---------- Animated Counter ---------- */
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800; // ms
  const step     = Math.max(1, Math.floor(target / (duration / 16)));
  let current    = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current.toLocaleString('bn-BD');
  }, 16);
}

const counterEls  = document.querySelectorAll('.stat-number');
const counterDone = new Set();

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counterDone.has(entry.target)) {
        counterDone.add(entry.target);
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

counterEls.forEach(el => counterObserver.observe(el));

/* ---------- Smooth Scroll for Anchor Links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---------- Keyboard Accessibility: ESC closes menu ---------- */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navEl.classList.contains('open')) {
    hamburger.classList.remove('open');
    navEl.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.focus();
  }
});

/* ---------- Consolidated Scroll Handler ---------- */
let scrollTicking = false;

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(() => {
      handleNavScroll();
      handleBackToTop();
      setActiveLink();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

/* Initial calls on page load */
handleNavScroll();
handleBackToTop();
setActiveLink();
