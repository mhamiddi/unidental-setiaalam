// Fade-up animations — with safety fallback after 3s
(function() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target); // once seen, stop watching
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => observer.observe(el));
  // Fallback: show all after 3s in case observer fails (no scroll, JS issue, etc.)
  setTimeout(function() {
    els.forEach(el => el.classList.add('visible'));
  }, 3000);
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
