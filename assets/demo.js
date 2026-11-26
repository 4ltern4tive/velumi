(function () {
  const player = document.querySelector('[data-demo-player]');
  if (!player) return;

  const video = player.querySelector('[data-demo-video]');
  const toggle = player.querySelector('[data-demo-toggle]');
  const bigPlay = player.querySelector('[data-demo-bigplay]');
  const range = player.querySelector('[data-demo-range]');
  const fill = player.querySelector('[data-demo-fill]');
  const knob = player.querySelector('[data-demo-knob]');
  const currentEl = player.querySelector('[data-demo-current]');
  const durationEl = player.querySelector('[data-demo-duration]');
  const endCard = player.querySelector('[data-demo-end]');
  const replay = player.querySelector('[data-demo-replay]');
  const chapters = Array.from(player.querySelectorAll('[data-demo-chapter]'));
  if (!video || !toggle || !range || !fill || !endCard) return;

  if (video.dataset.mobileSrc && window.matchMedia('(max-width: 720px)').matches) {
    video.src = video.dataset.mobileSrc;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let inView = false;
  let userPaused = false;
  let ended = false;
  let duration = 32.68;
  let activeChapter = -1;
  let pendingSeek = null;

  function seekTo(time) {
    if (video.readyState === 0) {
      pendingSeek = time;
      try { video.load(); } catch (e) {}
      return;
    }
    try {
      video.currentTime = time;
    } catch (e) {}
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
    const total = Math.floor(seconds);
    return Math.floor(total / 60) + ':' + String(total % 60).padStart(2, '0');
  }

  function formatDuration(seconds) {
    if (!Number.isFinite(seconds) || seconds <= 0) return '0:33';
    const total = Math.round(seconds);
    return Math.floor(total / 60) + ':' + String(total % 60).padStart(2, '0');
  }

  function updateToggle(paused) {
    const isPaused = paused !== undefined ? paused : video.paused;
    const label = isPaused ? 'Reproducir demostración' : 'Pausar demostración';
    toggle.dataset.paused = isPaused ? 'true' : 'false';
    toggle.setAttribute('aria-label', label);
    const text = toggle.querySelector('.sf-demo-toggle-text');
    if (text) text.textContent = isPaused ? 'Reproducir' : 'Pausar';
  }

  function updateProgress() {
    const d = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : duration;
    const t = Math.min(video.currentTime || 0, d);
    const pct = d ? (t / d) * 100 : 0;

    fill.style.width = pct + '%';
    if (knob) knob.style.left = pct + '%';
    if (currentEl) currentEl.textContent = formatTime(t);
    if (durationEl) durationEl.textContent = formatDuration(d);

    range.value = String(t);
    range.setAttribute('aria-valuetext', formatTime(t) + ' de ' + formatDuration(d));

    let idx = -1;
    for (let i = 0; i < chapters.length; i++) {
      if (parseFloat(chapters[i].dataset.time) <= t + 0.25) idx = i;
    }
    if (idx !== activeChapter) {
      activeChapter = idx;
      chapters.forEach((btn, i) => {
        btn.classList.toggle('is-active', i === idx);
        if (i === idx) btn.setAttribute('aria-current', 'true');
        else btn.removeAttribute('aria-current');
      });
    }
  }

  function hideEnd() {
    ended = false;
    endCard.hidden = true;
    player.removeAttribute('data-ended');
  }

  function showEnd() {
    ended = true;
    player.setAttribute('data-ended', 'true');
    endCard.hidden = false;
    updateToggle(true);
    updateProgress();
  }

  function playVideo() {
    const promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        // Autoplay bloqueado o interrumpido: mostramos el botón grande.
        if (!ended) player.removeAttribute('data-started');
        updateToggle(true);
      });
    }
  }

  function togglePlayback() {
    if (video.paused || video.ended) {
      if (video.ended) {
        hideEnd();
        video.currentTime = 0;
      }
      userPaused = false;
      playVideo();
    } else {
      userPaused = true;
      video.pause();
    }
  }

  video.addEventListener('loadedmetadata', function () {
    if (Number.isFinite(video.duration) && video.duration > 0) {
      duration = video.duration;
      range.max = String(duration);
    }
    if (pendingSeek !== null) {
      try {
        video.currentTime = pendingSeek;
      } catch (e) {}
      pendingSeek = null;
    }
    updateProgress();
  });

  video.addEventListener('play', function () {
    player.setAttribute('data-started', 'true');
    player.setAttribute('data-playing', 'true');
    if (video.ended) hideEnd();
    updateToggle(false);
  });

  video.addEventListener('pause', function () {
    player.setAttribute('data-playing', 'false');
    updateToggle(true);
  });

  video.addEventListener('timeupdate', updateProgress);
  video.addEventListener('seeked', updateProgress);
  video.addEventListener('click', togglePlayback);
  video.addEventListener('ended', showEnd);

  toggle.addEventListener('click', togglePlayback);
  if (bigPlay) bigPlay.addEventListener('click', function () {
    userPaused = false;
    if (video.ended) {
      hideEnd();
      video.currentTime = 0;
    }
    playVideo();
  });

  if (replay) replay.addEventListener('click', function () {
    hideEnd();
    video.currentTime = 0;
    userPaused = false;
    playVideo();
    toggle.focus({ preventScroll: true });
  });

  range.addEventListener('input', function () {
    const value = parseFloat(range.value);
    if (!Number.isFinite(value)) return;
    if (ended) hideEnd();
    seekTo(value);
    updateProgress();
  });

  chapters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const time = parseFloat(btn.dataset.time);
      if (!Number.isFinite(time)) return;
      hideEnd();
      userPaused = false;
      seekTo(time);
      playVideo();
      updateProgress();
    });
  });

  // Reproducción automática silenciada al entrar en pantalla; pausa al salir.
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      const entry = entries[0];
      inView = !!(entry && entry.isIntersecting);
      if (inView) {
        if (!userPaused && !ended && !reduceMotion) playVideo();
      } else if (!video.paused) {
        video.pause();
      }
    }, { threshold: 0.45 });
    io.observe(video);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (!video.paused) video.pause();
    } else if (inView && !userPaused && !ended && !reduceMotion) {
      playVideo();
    }
  });

  // Estado inicial: poster con botón de reproducción.
  player.setAttribute('data-started', 'false');
  player.setAttribute('data-playing', 'false');
  updateToggle(true);
  updateProgress();
})();
