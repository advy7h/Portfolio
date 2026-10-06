// Theme Switcher with Cross-Page Persistence (localStorage)
const themeBtn = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

// Function to apply the theme and update the icon
function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  if (themeBtn) {
    const themeIcon = themeBtn.querySelector('i');
    if (themeIcon) {
      themeIcon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }
}

// Restore saved theme on page load (defaults to 'light' if not set)
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
applyTheme(savedTheme);

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    applyTheme(nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
  });
}

// Cursor Spotlight Tracking
const spotlight = document.getElementById('spotlight');

if (spotlight) {
  document.addEventListener('mousemove', (e) => {
    spotlight.style.left = `${e.clientX}px`;
    spotlight.style.top = `${e.clientY}px`;
  });
}

// Profile Card 3D Tilt Effect
const profileCard = document.querySelector('.hover-tilt');

if (profileCard) {
  profileCard.addEventListener('mousemove', (e) => {
    const rect = profileCard.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    profileCard.style.transform = `perspective(1000px) rotateX(${-y / 25}deg) rotateY(${x / 25}deg)`;
  });

  profileCard.addEventListener('mouseleave', () => {
    profileCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  });
}

// TWO-WAY SCROLL OBSERVER
const scrollObserverOptions = {
  root: null,
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('scroll-show');
    } else {
      entry.target.classList.remove('scroll-show');
    }
  });
}, scrollObserverOptions);

document.addEventListener('DOMContentLoaded', () => {
  const hiddenElements = document.querySelectorAll('.scroll-hidden');
  hiddenElements.forEach(el => scrollObserver.observe(el));

  // Trigger smooth scroll reveal recalculation when details accordion expands or collapses
  const expandableCards = document.querySelectorAll('details.expandable-card');
  expandableCards.forEach(card => {
    card.addEventListener('toggle', () => {
      const childElements = card.querySelectorAll('.scroll-hidden');
      if (card.open) {
        childElements.forEach(el => {
          scrollObserver.unobserve(el);
          scrollObserver.observe(el);
        });
      } else {
        childElements.forEach(el => el.classList.remove('scroll-show'));
      }
    });
  });

  // Prevent external link clicks inside summary from toggling details expansion
  const externalLinks = document.querySelectorAll('.clickable-summary .external-link-btn');
  externalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
});
// Hardware-Accelerated Scroll Progress Bar
let isTicking = false;

window.addEventListener('scroll', () => {
  if (!isTicking) {
    window.requestAnimationFrame(() => {
      updateProgressBar();
      isTicking = false;
    });
    isTicking = true;
  }
}, { passive: true });

function updateProgressBar() {
  const progressBar = document.getElementById('progressBar');
  if (!progressBar) return;

  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (totalHeight <= 0) return;

  const progress = Math.min(Math.max(window.scrollY / totalHeight, 0), 1);
  progressBar.style.transform = `scaleX(${progress})`;
}

// ==========================================
// FORMSPREE FORM SUBMISSION HANDLER
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const contactForms = document.querySelectorAll('.contact-form');

  contactForms.forEach(contactForm => {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
      }

      // Convert Form Data to URL encoded parameters
      const formData = new FormData(contactForm);
      const encodedData = new URLSearchParams(formData).toString();

      try {
        const response = await fetch('https://formspree.io/f/mkjgapzb', {
          method: 'POST',
          body: encodedData,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          alert('Thank you! Your message has been sent successfully.');
          contactForm.reset();
        } else {
          const data = await response.json();
          if (data && data.errors) {
            alert(data.errors.map(err => err.message).join(', '));
          } else {
            alert('Unable to send message. Please check the form fields.');
          }
        }
      } catch (error) {
        alert('Network error. Please try sending again later.');
      } finally {
        if (submitBtn) {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }
      }
    });
  });
});
// ==========================================
// MOBILE NAVIGATION TOGGLE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('active');
      hamburgerBtn.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburgerBtn.classList.remove('active');
      }
    });

    // Close menu when a navigation item is clicked
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburgerBtn.classList.remove('active');
      });
    });
  }
}); 

document.addEventListener('DOMContentLoaded', () => {
  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    const text = heroName.textContent.trim();
    heroName.innerHTML = text
      .split('')
      .map(char => {
        if (char === ' ') {
          return `<span class="char space">&nbsp;</span>`;
        }
        return `<span class="char" data-char="${char}">${char}</span>`;
      })
      .join('');
  }
});

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId = null;
  let width = 0;
  let height = 0;
  let dpr = 1;

  // Track mouse coordinates for hover displacement
  const mouse = {
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    radius: 220 // Increased interaction radius (was 120)
  };

  let stars = [];

  const starColors = [
    'rgba(255, 255, 255, ',
    'rgba(255, 248, 230, ',
    'rgba(250, 240, 210, ',
    'rgba(240, 225, 190, '
  ];

  class Star {
    constructor(layer) {
      this.layer = layer; // 0: Background, 1: Midground, 2: Foreground
      this.init();
    }

    init() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;

      // Increased drift movement speeds across all layers
      let speedScale = 0.22; // Background (was 0.08)
      if (this.layer === 1) speedScale = 0.38; // Midground (was 0.15)
      if (this.layer === 2) speedScale = 0.18; // Foreground (was 0.05)

      const angle = Math.random() * Math.PI * 2;
      this.vx = Math.cos(angle) * speedScale * (0.6 + Math.random() * 0.4);
      this.vy = Math.sin(angle) * speedScale * (0.6 + Math.random() * 0.4);

      if (this.layer === 0) {
        this.radius = 0.4 + Math.random() * 0.6;
        this.baseAlpha = 0.15 + Math.random() * 0.35;
      } else if (this.layer === 1) {
        this.radius = 0.8 + Math.random() * 0.6;
        this.baseAlpha = 0.3 + Math.random() * 0.4;
      } else {
        this.radius = 1.3 + Math.random() * 0.5;
        this.baseAlpha = 0.5 + Math.random() * 0.35;
      }

      this.colorPrefix = starColors[Math.floor(Math.random() * starColors.length)];
      this.twinkleSpeed = 0.003 + Math.random() * 0.008;
      this.twinklePhase = Math.random() * Math.PI * 2;

      this.offsetX = 0;
      this.offsetY = 0;
    }

    update() {
      // 1. Continuous drift movement
      if (!prefersReducedMotion) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        if (this.y > height + 10) this.y = -10;
      }

      // 2. Enhanced mouse displacement & reaction
      if (mouse.x > 0 && mouse.y > 0) {
        const dx = (this.x + this.offsetX) - mouse.x;
        const dy = (this.y + this.offsetY) - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
          // Max displacement increased to ~35px (was ~8px) for higher responsiveness
          const force = (1 - dist / mouse.radius) * 35;
          const angle = Math.atan2(dy, dx);
          const targetOffsetX = Math.cos(angle) * force;
          const targetOffsetY = Math.sin(angle) * force;

          // Slightly faster easing factor (0.08) for smoother response
          this.offsetX += (targetOffsetX - this.offsetX) * 0.08;
          this.offsetY += (targetOffsetY - this.offsetY) * 0.08;
        } else {
          this.offsetX *= 0.94;
          this.offsetY *= 0.94;
        }
      } else {
        this.offsetX *= 0.94;
        this.offsetY *= 0.94;
      }

      // 3. Twinkle effect
      this.twinklePhase += this.twinkleSpeed;
      const alphaVariation = Math.sin(this.twinklePhase) * 0.15;
      this.currentAlpha = Math.max(0.05, Math.min(1, this.baseAlpha + alphaVariation));
    }

    draw() {
      const renderX = this.x + this.offsetX;
      const renderY = this.y + this.offsetY;

      ctx.beginPath();
      ctx.arc(renderX, renderY, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.colorPrefix + this.currentAlpha + ')';
      ctx.fill();
    }
  }

  function initStarfield() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const area = width * height;
    const baseDensity = area / 3200;

    const bgCount = Math.floor(baseDensity * 0.70);
    const midCount = Math.floor(baseDensity * 0.25);
    const fgCount = Math.floor(baseDensity * 0.05);

    stars = [];

    for (let i = 0; i < bgCount; i++) stars.push(new Star(0));
    for (let i = 0; i < midCount; i++) stars.push(new Star(1));
    for (let i = 0; i < fgCount; i++) stars.push(new Star(2));
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    mouse.x += (mouse.targetX - mouse.x) * 0.15;
    mouse.y += (mouse.targetY - mouse.y) * 0.15;

    for (let i = 0; i < stars.length; i++) {
      stars[i].update();
      stars[i].draw();
    }

    animationFrameId = requestAnimationFrame(render);
  }

  let resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      initStarfield();
    }, 150);
  });

  window.addEventListener('mousemove', function (e) {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });

  window.addEventListener('mouseleave', function () {
    mouse.targetX = -9999;
    mouse.targetY = -9999;
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    } else {
      animationFrameId = requestAnimationFrame(render);
    }
  });

  initStarfield();
  render();
})();

