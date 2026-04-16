(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const searchInput = document.querySelector('.search-container input[type="search"]');

  if (searchInput) {
    searchInput.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;

      const searchValue = searchInput.value.trim();
      const searchUrl = new URL('Shop.html', window.location.href);

      if (searchValue) {
        searchUrl.searchParams.set('filter', searchValue);
      }

      window.location.href = searchUrl.toString();
    });
  }

  if (!hamburger || !mobileMenu) return;

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) closeMenu();
    else openMenu();
  });

  document.addEventListener('click', (e) => {
    if (!mobileMenu.classList.contains('open')) return;
    const inside = mobileMenu.contains(e.target) || hamburger.contains(e.target);
    if (!inside) closeMenu();
  });

  // close when switching to desktop size
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1100) closeMenu();
  });
})();