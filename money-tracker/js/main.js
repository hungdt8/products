/* ============================================
   Money Tracker Landing Page - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar scroll effect ---
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // --- Mobile menu toggle ---
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  navToggle?.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  // Close mobile menu on link click
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });

  // --- Smooth scroll for nav links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Animate stats counter ---
  const animateCounters = () => {
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseFloat(el.dataset.count);
      const duration = 2000;
      const start = performance.now();
      const isFloat = target % 1 !== 0;

      const animate = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = target * ease;

        el.textContent = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    });
  };

  // Trigger counter animation when hero is visible
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const heroSection = document.getElementById('hero');
  if (heroSection) heroObserver.observe(heroSection);

  // --- Feature cards fade-in on scroll ---
  const featureObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 100);
        featureObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card').forEach(card => {
    featureObserver.observe(card);
  });

  // --- Screenshot carousel ---
  const screenshots = document.querySelectorAll('.screenshot-item');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let autoSlideTimer;

  const showSlide = (index) => {
    screenshots.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    screenshots[index]?.classList.add('active');
    dots[index]?.classList.add('active');
    currentSlide = index;
  };

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      showSlide(parseInt(dot.dataset.index));
      resetAutoSlide();
    });
  });

  const autoSlide = () => {
    autoSlideTimer = setInterval(() => {
      showSlide((currentSlide + 1) % screenshots.length);
    }, 4000);
  };

  const resetAutoSlide = () => {
    clearInterval(autoSlideTimer);
    autoSlide();
  };

  if (screenshots.length > 0) autoSlide();

  // --- Touch/swipe support for carousel ---
  const carousel = document.querySelector('.screenshots-carousel');
  let touchStartX = 0;
  let touchEndX = 0;

  carousel?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSlide < screenshots.length - 1) {
        showSlide(currentSlide + 1);
      } else if (diff < 0 && currentSlide > 0) {
        showSlide(currentSlide - 1);
      }
      resetAutoSlide();
    }
  }, { passive: true });

  // --- Review cards hover parallax ---
  document.querySelectorAll('.review-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // --- Pricing card sparkle on hover ---
  document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.3s ease';
    });
  });

});
