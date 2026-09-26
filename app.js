/**
 * Spring Framework Study Notes — Interactive Documentation Scripts
 * Features:
 * - Cross-Platform Responsive Mobile & Desktop Architecture (iOS & Android + Windows/macOS)
 * - Synchronized Points & Explanations (ScrollSpy & Click navigation)
 * - Off-Canvas Mobile Drawer with Touch Swipe Gestures & Backdrop dismissal
 * - Mobile Quick Bottom Navigation Bar (Prev / Next point jumper & Chapter indicator)
 * - Real-Time Dual Search (Desktop + Mobile overlay search)
 * - Mobile-Friendly Interactive Spring MVC 8-Step Request Flow Simulator
 * - Interactive Architecture Layer Inspector
 * - Dark/Light Theme Switcher with LocalStorage & OS <meta name="theme-color"> sync
 * - Split View vs Focus Mode toggle
 * - One-Click Code Snippet Copy with Toast Notification
 * - Reading Progress Bar & Floating Top Button
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const themeToggle = document.getElementById('theme-toggle');
  const themeColorMeta = document.getElementById('theme-color-meta');
  const searchInput = document.getElementById('point-search');
  const clearSearchBtn = document.getElementById('clear-search');
  const mobileSearchToggle = document.getElementById('mobile-search-toggle');
  const mobileSearchBar = document.getElementById('mobile-search-bar');
  const pointSearchMobile = document.getElementById('point-search-mobile');
  const clearSearchMobile = document.getElementById('clear-search-mobile');
  const closeSearchMobile = document.getElementById('close-search-mobile');
  const pointsNav = document.getElementById('points-nav');
  const pointItems = document.querySelectorAll('.point-item');
  const explanationCards = document.querySelectorAll('.explanation-card');
  const progressBar = document.getElementById('reading-progress');
  const toast = document.getElementById('toast');
  const copyButtons = document.querySelectorAll('.copy-btn');
  const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
  const pointsSidebar = document.getElementById('points-sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const closeSidebarBtn = document.getElementById('close-sidebar-btn');
  const modeSplitBtn = document.getElementById('mode-split');
  const modeFocusBtn = document.getElementById('mode-focus');
  const pointsCountBadge = document.getElementById('points-count-badge');
  const mobileBarMenu = document.getElementById('mobile-bar-menu');
  const mobileBarPrev = document.getElementById('mobile-bar-prev');
  const mobileBarNext = document.getElementById('mobile-bar-next');
  const mobileBarIndicator = document.getElementById('mobile-bar-indicator');
  const mobileCurrentPt = document.getElementById('mobile-current-pt');
  const mobileCurrentTitle = document.getElementById('mobile-current-title');
  const mobileBarTop = document.getElementById('mobile-bar-top');
  const desktopBackToTop = document.getElementById('desktop-back-to-top');

  // --- 1. Theme Management (Dark / Light) & OS Theme Bar Sync ---
  const savedTheme = localStorage.getItem('ajp_docs_theme') || 'theme-dark';
  document.body.className = savedTheme;
  updateThemeColorMeta(savedTheme);

  function updateThemeColorMeta(theme) {
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme === 'theme-light' ? '#f8fafc' : '#0b0f19');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.contains('theme-dark');
      if (isDark) {
        document.body.classList.remove('theme-dark');
        document.body.classList.add('theme-light');
        localStorage.setItem('ajp_docs_theme', 'theme-light');
        updateThemeColorMeta('theme-light');
      } else {
        document.body.classList.remove('theme-light');
        document.body.classList.add('theme-dark');
        localStorage.setItem('ajp_docs_theme', 'theme-dark');
        updateThemeColorMeta('theme-dark');
      }
    });
  }

  // --- 2. Mobile Drawer Navigation & Backdrop Management ---
  function openDrawer() {
    if (pointsSidebar) pointsSidebar.classList.add('mobile-open');
    if (mobileMenuBtn) mobileMenuBtn.classList.add('active');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    document.body.classList.add('mobile-drawer-open');
  }

  function closeDrawer() {
    if (pointsSidebar) pointsSidebar.classList.remove('mobile-open');
    if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    document.body.classList.remove('mobile-drawer-open');
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      if (pointsSidebar && pointsSidebar.classList.contains('mobile-open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', closeDrawer);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeDrawer);
  }

  if (mobileBarMenu) {
    mobileBarMenu.addEventListener('click', openDrawer);
  }

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      if (mobileSearchBar) mobileSearchBar.classList.remove('active');
    }
  });

  // Touch Swipe Gestures (Swipe left to close drawer, swipe from edge to open)
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
      const isDrawerOpen = pointsSidebar && pointsSidebar.classList.contains('mobile-open');
      if (isDrawerOpen && diffX < -50) {
        closeDrawer();
      } else if (!isDrawerOpen && touchStartX < 35 && diffX > 60) {
        openDrawer();
      }
    }
  }, { passive: true });

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

  // --- 4. Points Cataloging & Mobile Bottom Bar Navigation ---
  const pointsArray = Array.from(pointItems).map(item => {
    const id = item.getAttribute('href').substring(1);
    const index = item.querySelector('.point-index')?.textContent.trim() || '';
    const title = item.querySelector('.point-title')?.textContent.trim() || '';
    return { id, index, title };
  });

  let currentPointIndex = 0;

  function updateBottomBarIndicator(pointId) {
    const idx = pointsArray.findIndex(p => p.id === pointId);
    if (idx !== -1) {
      currentPointIndex = idx;
      if (mobileCurrentPt) mobileCurrentPt.textContent = pointsArray[idx].index;
      if (mobileCurrentTitle) mobileCurrentTitle.textContent = pointsArray[idx].title;
    }
  }

  function navigateToPointIndex(index) {
    if (index < 0 || index >= pointsArray.length) return;
    currentPointIndex = index;
    const targetPoint = pointsArray[index];
    const targetEl = document.getElementById(targetPoint.id);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActivePoint(targetPoint.id);
      updateBottomBarIndicator(targetPoint.id);
    }
  }

  if (mobileBarPrev) {
    mobileBarPrev.addEventListener('click', () => {
      if (currentPointIndex > 0) {
        navigateToPointIndex(currentPointIndex - 1);
      } else {
        showToast('At the beginning of syllabus');
      }
    });
  }

  if (mobileBarNext) {
    mobileBarNext.addEventListener('click', () => {
      if (currentPointIndex < pointsArray.length - 1) {
        navigateToPointIndex(currentPointIndex + 1);
      } else {
        showToast('At the end of syllabus! 🎉');
      }
    });
  }

  if (mobileBarIndicator) {
    mobileBarIndicator.addEventListener('click', () => {
      openDrawer();
      const activeItem = document.querySelector('.point-item.active');
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // --- 5. Synchronized Points Navigation (Click -> Viewport Scroll) ---
  function setActivePoint(pointId) {
    pointItems.forEach(item => {
      if (item.getAttribute('href') === `#${pointId}`) {
        item.classList.add('active');
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

    updateBottomBarIndicator(pointId);
  }

  pointItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActivePoint(targetId);
        closeDrawer();
      }
    });
  });

  // --- 6. ScrollSpy & Reading Progress via IntersectionObserver ---
  let isManualScrolling = false;

  const observerOptions = {
    root: null,
    rootMargin: '-15% 0px -65% 0px',
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
      if (progressBar) progressBar.style.width = `${Math.min(scrolled, 100)}%`;
    }

    // Toggle Desktop Back to Top button
    if (desktopBackToTop) {
      if (window.scrollY > 350) {
        desktopBackToTop.classList.add('visible');
      } else {
        desktopBackToTop.classList.remove('visible');
      }
    }
  });

  // Scroll to Top buttons
  if (mobileBarTop) {
    mobileBarTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (desktopBackToTop) {
    desktopBackToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 7. Real-Time Search / Filter (Desktop & Mobile synchronized) ---
  function handleSearch(query) {
    const clean = query.toLowerCase().trim();
    if (clearSearchBtn) clearSearchBtn.style.display = clean.length > 0 ? 'block' : 'none';
    if (clearSearchMobile) clearSearchMobile.style.display = clean.length > 0 ? 'block' : 'none';

    let visibleCount = 0;
    const chapters = document.querySelectorAll('.chapter-group');

    chapters.forEach(chapter => {
      const items = chapter.querySelectorAll('.point-item');
      let chapterHasVisible = false;

      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(clean)) {
          item.style.display = 'flex';
          chapterHasVisible = true;
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });

      chapter.style.display = chapterHasVisible ? 'flex' : 'none';
    });

    if (pointsCountBadge) {
      if (clean) {
        pointsCountBadge.textContent = `${visibleCount} Match${visibleCount === 1 ? '' : 'es'}`;
      } else {
        pointsCountBadge.textContent = '26 Points';
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      if (pointSearchMobile && pointSearchMobile.value !== e.target.value) {
        pointSearchMobile.value = e.target.value;
      }
      handleSearch(e.target.value);
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      if (pointSearchMobile) pointSearchMobile.value = '';
      handleSearch('');
      searchInput.focus();
    });
  }

  if (mobileSearchToggle && mobileSearchBar) {
    mobileSearchToggle.addEventListener('click', () => {
      const isActive = mobileSearchBar.classList.toggle('active');
      if (isActive && pointSearchMobile) {
        pointSearchMobile.focus();
      }
    });
  }

  if (closeSearchMobile && mobileSearchBar) {
    closeSearchMobile.addEventListener('click', () => {
      mobileSearchBar.classList.remove('active');
    });
  }

  if (pointSearchMobile) {
    pointSearchMobile.addEventListener('input', (e) => {
      if (searchInput && searchInput.value !== e.target.value) {
        searchInput.value = e.target.value;
      }
      handleSearch(e.target.value);
    });

    if (clearSearchMobile) {
      clearSearchMobile.addEventListener('click', () => {
        pointSearchMobile.value = '';
        if (searchInput) searchInput.value = '';
        handleSearch('');
        pointSearchMobile.focus();
      });
    }
  }

  // --- 8. Interactive Spring MVC 8-Step Request Flow Simulator ---
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

  updateMvcStep(1);

  if (simNext) {
    simNext.addEventListener('click', () => {
      if (currentMvcStep < 8) {
        updateMvcStep(currentMvcStep + 1);
      } else {
        updateMvcStep(1);
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

  mvcSteps.forEach(node => {
    node.addEventListener('click', () => {
      const step = parseInt(node.getAttribute('data-mvc-step'), 10);
      updateMvcStep(step);
    });
  });

  // --- 9. Architecture Layer Interactive Inspector ---
  const archLayers = document.querySelectorAll('.arch-layer');
  archLayers.forEach(layer => {
    layer.addEventListener('click', () => {
      archLayers.forEach(l => l.classList.remove('active-highlight'));
      layer.classList.add('active-highlight');
      const name = layer.querySelector('.layer-title')?.textContent || 'Layer';
      showToast(`Selected Architecture Layer: ${name}`);
    });
  });

  // --- 10. Code Snippet Copy Functionality ---
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

  // --- 11. Toast Notification Helper ---
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
