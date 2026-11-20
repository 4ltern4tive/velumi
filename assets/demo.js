(function () {
  const player = document.querySelector('[data-demo-player]');
  if (!player) return;

  const slides = Array.from(player.querySelectorAll('.sf-demo-slide'));
  const steps = Array.from(player.querySelectorAll('[data-demo-step]'));
  const toggle = player.querySelector('[data-demo-toggle]');
  const progress = player.querySelector('.sf-demo-progress-bar');
  const stage = player.querySelector('.sf-demo-stage');
  if (!slides.length || !toggle || !progress || !stage) return;

  const DURATION = 5200;
  let index = slides.findIndex(s => s.classList.contains('is-active'));
  if (index < 0) index = 0;
  let timer = null;
  let playing = true;
  let inView = true;

  function setProgress(run) {
    progress.classList.remove('is-animating');
    progress.style.transitionDuration = '0ms';
    progress.style.width = '0%';
    if (!run) return;
    // force reflow so transition restarts
    void progress.offsetWidth;
    progress.classList.add('is-animating');
    progress.style.transitionDuration = DURATION + 'ms';
    progress.style.width = '100%';
  }

  function goTo(next, opts) {
    const options = opts || {};
    index = (next + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    steps.forEach((s, i) => {
      const on = i === index;
      s.classList.toggle('is-active', on);
      s.setAttribute('aria-selected', on ? 'true' : 'false');
      s.tabIndex = on ? 0 : -1;
    });
    setProgress(playing && inView && !options.noProgress);
  }

  function stopTimer() {
    if (timer) { clearTimeout(timer); timer = null; }
  }

  function schedule() {
    stopTimer();
    if (!playing || !inView) return;
    timer = setTimeout(() => {
      goTo(index + 1);
      schedule();
    }, DURATION);
  }

  function updateToggle() {
    toggle.dataset.paused = playing ? 'false' : 'true';
    toggle.setAttribute('aria-pressed', playing ? 'false' : 'true');
    toggle.setAttribute('aria-label', playing ? 'Pausar demostración' : 'Reproducir demostración');
    const text = toggle.querySelector('.sf-demo-toggle-text');
    if (text) text.textContent = playing ? 'Pausar' : 'Reproducir';
  }

  function play(manual) {
    playing = true;
    updateToggle();
    setProgress(inView);
    if (manual) { stopTimer(); schedule(); } else { schedule(); }
  }

  function pause(manual) {
    playing = false;
    updateToggle();
    stopTimer();
    // freeze progress bar at current computed width
    const w = getComputedStyle(progress).width;
    progress.classList.remove('is-animating');
    progress.style.transitionDuration = '0ms';
    progress.style.width = w;
  }

  toggle.addEventListener('click', () => {
    if (playing) pause(true); else play(true);
  });

  steps.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.dataset.demoStep, 10);
      if (Number.isNaN(target)) return;
      goTo(target);
      if (playing) { stopTimer(); schedule(); }
    });
  });

  // Pause when out of view for performance; resume if user hasn't paused
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      const e = entries[0];
      inView = !!(e && e.isIntersecting);
      if (inView) {
        if (playing) { setProgress(true); schedule(); }
      } else {
        stopTimer();
        setProgress(false);
      }
    }, { threshold: 0.35 });
    io.observe(stage);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopTimer();
      setProgress(false);
    } else if (inView && playing) {
      setProgress(true);
      schedule();
    }
  });

  // init
  updateToggle();
  goTo(index, { noProgress: false });
  schedule();
})();
