(function () {
  "use strict";

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Sticky header background on scroll */
  var header = document.getElementById('siteHeader');
  if (header) {
    function onScroll() {
      if (window.scrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Mobile menu */
  var hamburger = document.getElementById('hamburgerBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in-view'); });
    }
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          openItem.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* Reviews carousel */
  var track = document.getElementById('reviewsTrack');
  var wrap = document.getElementById('reviewsWrap');
  var dotsWrap = document.getElementById('reviewDots');
  if (track && wrap && dotsWrap) {
    var slides = track.querySelectorAll('.review-slide');
    var current = 0;
    var autoplayTimer;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Show review ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () { goTo(i); resetAutoplay(); });
      dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap.querySelectorAll('button');

    function goTo(i) {
      current = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, di) { d.classList.toggle('active', di === current); });
    }
    function next() { goTo(current + 1); }
    function resetAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(next, 6000);
    }
    resetAutoplay();
    wrap.addEventListener('mouseenter', function () { clearInterval(autoplayTimer); });
    wrap.addEventListener('mouseleave', resetAutoplay);

    var touchStartX = 0;
    wrap.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    wrap.addEventListener('touchend', function (e) {
      var delta = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) > 40) {
        delta < 0 ? goTo(current + 1) : goTo(current - 1);
        resetAutoplay();
      }
    }, { passive: true });
  }

  /* Meal details dialog */
  var mealOverlay = document.getElementById('mealDialogOverlay');
  if (mealOverlay) {
    var mealTag = document.getElementById('mealDialogTag');
    var mealTitle = document.getElementById('mealDialogTitle');
    var mealDesc = document.getElementById('mealDialogDesc');
    var mealHighlights = document.getElementById('mealDialogHighlights');
    var mealClose = document.getElementById('mealDialogClose');
    var lastFocused = null;

    function openMealDialog(card) {
      lastFocused = document.activeElement;
      mealTag.textContent = card.getAttribute('data-tag') || '';
      mealTitle.textContent = card.getAttribute('data-name') || '';
      mealDesc.textContent = card.getAttribute('data-desc') || '';
      mealHighlights.innerHTML = '';
      (card.getAttribute('data-highlights') || '').split(',').forEach(function (item) {
        if (!item.trim()) return;
        var li = document.createElement('li');
        li.textContent = item.trim();
        mealHighlights.appendChild(li);
      });
      mealOverlay.hidden = false;
      requestAnimationFrame(function () { mealOverlay.classList.add('is-open'); });
      document.body.style.overflow = 'hidden';
      mealClose.focus();
    }

    function closeMealDialog() {
      mealOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(function () { mealOverlay.hidden = true; }, 300);
      if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll('.meal-details-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openMealDialog(btn.closest('.meal-card'));
      });
    });
    mealClose.addEventListener('click', closeMealDialog);
    mealOverlay.addEventListener('click', function (e) {
      if (e.target === mealOverlay) closeMealDialog();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mealOverlay.hidden) closeMealDialog();
    });
  }
})();
