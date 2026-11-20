/**
 * INGEN NETWORK - ISLA NUBLAR TERMINAL CONTROLLER
 * Audio Synthesizer, CRT Controls, Search, Gallery & Telemetry
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER (Web Audio API - Standalone) ---
  let audioCtx = null;
  let soundEnabled = localStorage.getItem('ingen_sound') === 'true';

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
  }

  function playTone(freq, type, duration, gainLevel = 0.05) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainLevel, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy or unavailable
    }
  }

  function playClick() {
    playTone(1800, 'sine', 0.04, 0.04);
  }

  function playBeep() {
    playTone(880, 'square', 0.08, 0.03);
  }

  function playAlert() {
    playTone(440, 'sawtooth', 0.12, 0.05);
  }

  // --- CRT SETTINGS MANAGER ---
  function applyCrtPreferences() {
    const scanlinesOff = localStorage.getItem('ingen_no_scanlines') === 'true';
    const curvatureOff = localStorage.getItem('ingen_no_curvature') === 'true';
    
    if (scanlinesOff) {
      document.body.classList.add('no-scanlines');
    } else {
      document.body.classList.remove('no-scanlines');
    }
    
    if (curvatureOff) {
      document.body.classList.add('no-curvature');
    } else {
      document.body.classList.remove('no-curvature');
    }

    // Update button states
    const btnSound = document.getElementById('btn-sound-toggle');
    if (btnSound) {
      btnSound.classList.toggle('active', soundEnabled);
      btnSound.textContent = soundEnabled ? '🔊 SONIDO: SÍ' : '🔈 SONIDO: NO';
    }

    const btnScan = document.getElementById('btn-scanlines-toggle');
    if (btnScan) {
      btnScan.classList.toggle('active', !scanlinesOff);
      btnScan.textContent = scanlinesOff ? '▦ SCANLINES: NO' : '▦ SCANLINES: SÍ';
    }

    const btnCurve = document.getElementById('btn-curve-toggle');
    if (btnCurve) {
      btnCurve.classList.toggle('active', !curvatureOff);
      btnCurve.textContent = curvatureOff ? '◯ CRT CURVA: NO' : '◯ CRT CURVA: SÍ';
    }
  }

  // --- LIVE TELEMETRY CLOCK ---
  function updateSystemClock() {
    const clockEl = document.getElementById('system-clock');
    if (!clockEl) return;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    clockEl.textContent = `${dateStr} ${timeStr} [CR-ISLA NUBLAR]`;
  }

  // --- INIT DOM ---
  document.addEventListener('DOMContentLoaded', () => {
    applyCrtPreferences();
    updateSystemClock();
    setInterval(updateSystemClock, 1000);

    // Hardware CRT buttons listeners
    const btnSound = document.getElementById('btn-sound-toggle');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem('ingen_sound', soundEnabled);
        if (soundEnabled) {
          initAudio();
          playBeep();
        }
        applyCrtPreferences();
      });
    }

    const btnScan = document.getElementById('btn-scanlines-toggle');
    if (btnScan) {
      btnScan.addEventListener('click', () => {
        const current = document.body.classList.contains('no-scanlines');
        localStorage.setItem('ingen_no_scanlines', !current);
        playClick();
        applyCrtPreferences();
      });
    }

    const btnCurve = document.getElementById('btn-curve-toggle');
    if (btnCurve) {
      btnCurve.addEventListener('click', () => {
        const current = document.body.classList.contains('no-curvature');
        localStorage.setItem('ingen_no_curvature', !current);
        playClick();
        applyCrtPreferences();
      });
    }

    // Attach click sound to interactive elements
    document.querySelectorAll('a, button, .filter-chip, .thumb-item').forEach((el) => {
      el.addEventListener('click', () => {
        playClick();
      });
    });

    // --- INDEX SEARCH & FILTER LOGIC ---
    const searchInput = document.getElementById('dino-search');
    const filterChips = document.querySelectorAll('.filter-chip[data-filter]');
    const cards = document.querySelectorAll('.specimen-card');
    const tableRows = document.querySelectorAll('.unix-table tbody tr');
    const countDisplay = document.getElementById('visible-count');
    const btnViewGrid = document.getElementById('view-grid');
    const btnViewTable = document.getElementById('view-table');
    const gridView = document.getElementById('grid-view-container');
    const tableView = document.getElementById('table-view-container');

    let currentFilter = 'all';

    function filterItems() {
      const query = (searchInput ? searchInput.value.toLowerCase().trim() : '');
      let visibleCount = 0;

      // Filter cards
      cards.forEach((card) => {
        const text = (card.getAttribute('data-search') || '').toLowerCase();
        const category = card.getAttribute('data-category') || '';
        const hasVideo = card.getAttribute('data-has-video') === 'true';

        let matchesFilter = true;
        if (currentFilter === 'has_video') {
          matchesFilter = hasVideo;
        } else if (currentFilter !== 'all') {
          matchesFilter = (category === currentFilter);
        }

        const matchesQuery = !query || text.includes(query);

        if (matchesFilter && matchesQuery) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Filter table rows
      tableRows.forEach((row) => {
        const text = (row.getAttribute('data-search') || '').toLowerCase();
        const category = row.getAttribute('data-category') || '';
        const hasVideo = row.getAttribute('data-has-video') === 'true';

        let matchesFilter = true;
        if (currentFilter === 'has_video') {
          matchesFilter = hasVideo;
        } else if (currentFilter !== 'all') {
          matchesFilter = (category === currentFilter);
        }

        const matchesQuery = !query || text.includes(query);

        if (matchesFilter && matchesQuery) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });

      if (countDisplay) {
        countDisplay.textContent = visibleCount;
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', filterItems);
    }

    if (filterChips.length > 0) {
      filterChips.forEach((chip) => {
        chip.addEventListener('click', () => {
          filterChips.forEach((c) => c.classList.remove('active'));
          chip.classList.add('active');
          currentFilter = chip.getAttribute('data-filter');
          filterItems();
        });
      });
    }

    if (btnViewGrid && btnViewTable && gridView && tableView) {
      btnViewGrid.addEventListener('click', () => {
        btnViewGrid.classList.add('active');
        btnViewTable.classList.remove('active');
        gridView.style.display = 'grid';
        tableView.style.display = 'none';
      });

      btnViewTable.addEventListener('click', () => {
        btnViewTable.classList.add('active');
        btnViewGrid.classList.remove('active');
        gridView.style.display = 'none';
        tableView.style.display = 'block';
      });
    }

    // --- SPECIMEN DETAIL GALLERY & LIGHTBOX ---
    const mainImg = document.getElementById('gallery-main');
    const mainImgWrap = document.getElementById('gallery-main-wrap');
    const thumbs = document.querySelectorAll('.thumb-item');
    const modal = document.getElementById('img-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const modalClose = document.getElementById('modal-close');

    if (thumbs.length > 0 && mainImg) {
      thumbs.forEach((thumb) => {
        thumb.addEventListener('click', () => {
          thumbs.forEach((t) => t.classList.remove('active'));
          thumb.classList.add('active');
          const src = thumb.getAttribute('data-src');
          const alt = thumb.getAttribute('data-alt');
          mainImg.src = src;
          mainImg.alt = alt;
          if (modalCaption) modalCaption.textContent = alt;
        });
      });
    }

    if (mainImgWrap && modal && modalImg) {
      mainImgWrap.addEventListener('click', () => {
        modalImg.src = mainImg.src;
        if (modalCaption) modalCaption.textContent = mainImg.alt;
        modal.classList.add('open');
        playBeep();
      });
    }

    if (modalClose && modal) {
      modalClose.addEventListener('click', () => {
        modal.classList.remove('open');
        playClick();
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
          playClick();
        }
      });
    }

    // --- KEYBOARD SHORTCUTS ---
    document.addEventListener('keydown', (e) => {
      // Lightbox close with ESC
      if (e.key === 'Escape') {
        if (modal && modal.classList.contains('open')) {
          modal.classList.remove('open');
          return;
        }
        const backBtn = document.getElementById('nav-back-index');
        if (backBtn) {
          backBtn.click();
        }
      }

      // Prev / Next specimen navigation on detail pages
      if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        if (e.key === 'ArrowLeft') {
          const prevBtn = document.getElementById('nav-prev');
          if (prevBtn && !prevBtn.classList.contains('disabled')) {
            prevBtn.click();
          }
        } else if (e.key === 'ArrowRight') {
          const nextBtn = document.getElementById('nav-next');
          if (nextBtn && !nextBtn.classList.contains('disabled')) {
            nextBtn.click();
          }
        } else if (e.key === '/' && searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      }
    });
  });
})();
