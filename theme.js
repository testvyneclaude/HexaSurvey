
(function () {
  const toggleBtn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');

  const saved = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  function applyTheme(isLight) {
    document.documentElement.classList.toggle('light-theme', isLight);
    if (icon) {
      icon.classList.toggle('fa-sun', !isLight);
      icon.classList.toggle('fa-moon', isLight);
    }
  }

  applyTheme(saved === 'light' || (!saved && prefersLight));

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isLight = !document.documentElement.classList.contains('light-theme');
      applyTheme(isLight);
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }
})();
