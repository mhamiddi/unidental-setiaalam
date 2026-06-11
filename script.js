// v20260611-1957 — Viewport-triggered animations (no fallback)
(function() {
  const els = document.querySelectorAll('[class*="anim-"]');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => observer.observe(el));
})();
// Trust bar counter — subtle reveal effect (numbers already in HTML, just animate reveal)
(function() {
  const trustItems = document.querySelectorAll('.trust-item');
  if (!trustItems.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  trustItems.forEach(el => obs.observe(el));
})();

// Before & After Carousel
(function() {
  let baIndex = 0;
  const baSlides = document.querySelectorAll('.ba-carousel-slide');
  const baTrack = document.querySelector('.ba-carousel-track');
  const baDots = document.querySelectorAll('.ba-dot');
  
  function updateBA() {
    if (!baTrack) return;
    baTrack.style.transform = 'translateX(-' + (baIndex * 100) + '%)';
    baDots.forEach((d, i) => d.classList.toggle('active', i === baIndex));
  }
  
  function moveBA(dir) {
    baIndex = (baIndex + dir + baSlides.length) % baSlides.length;
    updateBA();
  }
  
  function goBA(idx) { baIndex = idx; updateBA(); }
  
  if (baSlides.length > 0) setInterval(function() { moveBA(1); }, 4000);
  
  // Expose functions globally for inline onclick handlers
  window.moveBA = moveBA;
  window.goBA = goBA;
})();

// Booking Form Submission — Hermes API Backend
async function submitBooking(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = document.getElementById('bf-submit');
  const btnText = document.getElementById('bf-btn-text');
  const btnLoading = document.getElementById('bf-btn-loading');
  
  // Show loading
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';
  
  const data = Object.fromEntries(new FormData(form));
  
  try {
    const res = await fetch('https://api.funnelcraft.my/api/v1/submit/uni-dental', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (res.ok) {
      form.style.display = 'none';
      document.getElementById('formSuccess').classList.add('show');
    } else {
      form.style.display = 'none';
      document.getElementById('formError').style.display = 'block';
    }
  } catch (err) {
    form.style.display = 'none';
    document.getElementById('formError').style.display = 'block';
  }
  
  submitBtn.disabled = false;
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('navHamburger');
  menu.classList.toggle('open');
  hamburger.classList.toggle('open');
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('navHamburger');
  menu.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

// Close mobile menu on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeMobileMenu();
});
