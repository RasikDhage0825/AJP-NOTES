/**
 * Spring Framework Study Notes — Interactive Documentation Scripts
 * Features:
 * - Synchronized Points & Explanations (ScrollSpy & Click navigation)
 * - Live Instant Search & Filtering of Points
 * - Interactive Spring MVC 8-Step Request Flow Simulator
 * - Interactive Architecture Layer Inspector
 * - Dark/Light Theme Switcher with LocalStorage
 * - Split View vs Focus Mode toggle
 * - One-Click Code Snippet Copy with Toast Notification
 * - Reading Progress Bar
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const themeToggle = document.getElementById('theme-toggle');
  const searchInput = document.getElementById('point-search');
  const clearSearchBtn = document.getElementById('clear-search');
  const pointsNav = document.getElementById('points-nav');
  const pointItems = document.querySelectorAll('.point-item');
  const explanationCards = document.querySelectorAll('.explanation-card');
  const progressBar = document.getElementById('reading-progress');
  const toast = document.getElementById('toast');
  const copyButtons = document.querySelectorAll('.copy-btn');
  const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
  const pointsSidebar = document.getElementById('points-sidebar');
  const modeSplitBtn = document.getElementById('mode-split');
  const modeFocusBtn = document.getElementById('mode-focus');
  const pointsCountBadge = document.getElementById('points-count-badge');

  // --- 1. Theme Management (Dark / Light) ---
  const savedTheme = localStorage.getItem('ajp_docs_theme') || 'theme-dark';
  document.body.className = savedTheme;

  themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('theme-dark')) {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      localStorage.setItem('ajp_docs_theme', 'theme-light');
    } else {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
      localStorage.setItem('ajp_docs_theme', 'theme-dark');
    }
  });

  // --- 2. Mobile Menu Toggle ---
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      pointsSidebar.classList.toggle('mobile-open');
    });
  }

  // --- 3. View Mode Toggle (Split View vs Focus Mode) ---
  if (modeSplitBtn && modeFocusBtn) {
    modeSplitBtn.addEventListener('click', () => {
      document.body.classList.remove('mode-focus-active');
      modeSplitBtn.classList.add('active');
      modeFocusBtn.classList.remove('active');
    });

    modeFocusBtn.addEventListener('click', () => {
      document.body.classList.add('mode-focus-active');
      modeFocusBtn.classList.add('active');
      modeSplitBtn.classList.remove('active');
      showToast('Focus Mode activated: Highlights selected card');
    });
  }

  // --- 4. Synchronized Points Navigation (Left Side Click -> Right Side Scroll) ---
  function setActivePoint(pointId) {
    pointItems.forEach(item => {
      if (item.getAttribute('href') === `#${pointId}`) {
        item.classList.add('active');
        // Keep active point in view within sidebar
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });

    explanationCards.forEach(card => {
      if (card.id === pointId) {
        card.classList.add('highlight-focused');
      } else {
        card.classList.remove('highlight-focused');
      }
    });
  }

  pointItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActivePoint(targetId);

        // Close sidebar on mobile after clicking
        if (window.innerWidth <= 768) {
          pointsSidebar.classList.remove('mobile-open');
        }
      }
    });
  });

  // --- 5. ScrollSpy & Reading Progress via Scroll Observer ---
  let isManualScrolling = false;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -65% 0px',
    threshold: 0
  };

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isManualScrolling) {
        const id = entry.target.id;
        setActivePoint(id);
      }
    });
  }, observerOptions);

  explanationCards.forEach(card => {
    cardObserver.observe(card);
  });

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const scrolled = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${Math.min(scrolled, 100)}%`;
    }
  });

  // --- 6. Live Point Search / Filter ---
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    clearSearchBtn.style.display = query.length > 0 ? 'block' : 'none';

    let visibleCount = 0;
    const chapters = document.querySelectorAll('.chapter-group');

    chapters.forEach(chapter => {
      const items = chapter.querySelectorAll('.point-item');
      let chapterHasVisible = false;

      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = 'flex';
          chapterHasVisible = true;
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });

      chapter.style.display = chapterHasVisible ? 'flex' : 'none';
    });

    if (query) {
      pointsCountBadge.textContent = `${visibleCount} Match${visibleCount === 1 ? '' : 'es'}`;
    } else {
      pointsCountBadge.textContent = '26 Points';
    }
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
    searchInput.focus();
  });

  // --- 7. Interactive Spring MVC 8-Step Request Flow Simulator ---
  const mvcSteps = document.querySelectorAll('.mvc-step-node');
  const simPrev = document.getElementById('sim-prev');
  const simNext = document.getElementById('sim-next');
  const simReset = document.getElementById('sim-reset');
  const simIndicator = document.getElementById('sim-step-indicator');
  let currentMvcStep = 1;

  function updateMvcStep(step) {
    currentMvcStep = step;
    mvcSteps.forEach(node => {
      const nodeStep = parseInt(node.getAttribute('data-mvc-step'), 10);
      if (nodeStep === currentMvcStep) {
        node.classList.add('sim-active');
        node.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        node.classList.remove('sim-active');
      }
    });

    if (simIndicator) {
      simIndicator.textContent = `Step ${currentMvcStep} of 8 Active`;
    }
  }

  // Initialize Step 1 active
  updateMvcStep(1);

  if (simNext) {
    simNext.addEventListener('click', () => {
      if (currentMvcStep < 8) {
        updateMvcStep(currentMvcStep + 1);
      } else {
        updateMvcStep(1); // loop back
      }
    });
  }

  if (simPrev) {
    simPrev.addEventListener('click', () => {
      if (currentMvcStep > 1) {
        updateMvcStep(currentMvcStep - 1);
      }
    });
  }

  if (simReset) {
    simReset.addEventListener('click', () => {
      updateMvcStep(1);
    });
  }

  // Allow clicking on any step node directly
  mvcSteps.forEach(node => {
    node.addEventListener('click', () => {
      const step = parseInt(node.getAttribute('data-mvc-step'), 10);
      updateMvcStep(step);
    });
  });

  // --- 8. Architecture Layer Interactive Inspector ---
  const archLayers = document.querySelectorAll('.arch-layer');
  archLayers.forEach(layer => {
    layer.addEventListener('click', () => {
      archLayers.forEach(l => l.classList.remove('active-highlight'));
      layer.classList.add('active-highlight');
      const name = layer.querySelector('.layer-title').textContent;
      showToast(`Selected Architecture Layer: ${name}`);
    });
  });

  // --- 9. Code Snippet Copy Functionality ---
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-target');
      const codeElement = document.getElementById(targetId);
      if (!codeElement) return;

      try {
        await navigator.clipboard.writeText(codeElement.textContent);
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        showToast('Code copied to clipboard!');

        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = codeElement.textContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Code copied to clipboard!');
      }
    });
  });

  // --- 10. Toast Notification Helper ---
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
});
