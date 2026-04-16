(function setupMarquee() {
  const wrapper = document.querySelector('.marquee-wrapper');
  if (!wrapper) return;

  const original = wrapper.querySelector('.marquee-content');
  if (!original) return;

  const base = original.cloneNode(true);

  function build() {
    // start from a single base node to avoid uncontrolled growth
    wrapper.innerHTML = '';
    wrapper.appendChild(base.cloneNode(true));

    const maxCopies = 50;
    let copies = 1;
    // ensure the track is at least twice the viewport wide (safety)
    while (wrapper.scrollWidth < window.innerWidth * 2 && copies < maxCopies) {
      wrapper.appendChild(base.cloneNode(true));
      copies++;
    }

    // keep a consistent speed regardless of width
    const pxPerSecond = 120; // increase to make it faster
    const duration = Math.max(8, Math.round(wrapper.scrollWidth / pxPerSecond));
    wrapper.style.animationDuration = duration + 's';
  }

  build();

  // debounced rebuild on resize
  let rTimer;
  window.addEventListener('resize', () => {
    clearTimeout(rTimer);
    rTimer = setTimeout(build, 150);
  });
})();