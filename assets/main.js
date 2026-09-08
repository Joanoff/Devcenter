// Dev Center — interactions (menu mobile, thème, FAQ). Aucune dépendance externe.
(function () {
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // --- Menu mobile ---
  var menuToggle = document.getElementById('menu-toggle');
  var navLinks = document.getElementById('nav-links');
  var iconMenu = document.getElementById('icon-menu');
  var iconClose = document.getElementById('icon-close');

  menuToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    iconMenu.style.display = isOpen ? 'none' : '';
    iconClose.style.display = isOpen ? '' : 'none';
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
      iconMenu.style.display = '';
      iconClose.style.display = 'none';
    });
  });

  // --- Thème clair / sombre ---
  var themeToggle = document.getElementById('theme-toggle');
  var iconMoon = document.getElementById('icon-moon');
  var iconSun = document.getElementById('icon-sun');

  function syncThemeIcon() {
    var isDark = document.documentElement.classList.contains('dark');
    iconMoon.style.display = isDark ? 'none' : '';
    iconSun.style.display = isDark ? '' : 'none';
    themeToggle.setAttribute('aria-label', isDark ? 'Activer le thème clair' : 'Activer le thème sombre');
  }
  syncThemeIcon();

  themeToggle.addEventListener('click', function () {
    var next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    try { window.localStorage.setItem('dev-center-theme', next ? 'dark' : 'light'); } catch (e) {}
    syncThemeIcon();
  });

  // Ne suit le système que si l'utilisateur n'a pas fixé de préférence explicite.
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (event) {
      var saved;
      try { saved = window.localStorage.getItem('dev-center-theme'); } catch (e) {}
      if (saved) return;
      document.documentElement.classList.toggle('dark', event.matches);
      syncThemeIcon();
    });
  }

  // --- FAQ (accordéon accessible) ---
  document.querySelectorAll('.faq-question').forEach(function (button) {
    button.addEventListener('click', function () {
      var expanded = button.getAttribute('aria-expanded') === 'true';
      var answer = document.getElementById(button.getAttribute('aria-controls'));
      button.setAttribute('aria-expanded', String(!expanded));
      if (answer) answer.hidden = expanded;
    });
  });

  // --- Animations au défilement ---
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js-reveal');

    // Décale l'apparition de chaque élément d'un même groupe (effet cascade).
    document.querySelectorAll('.reveal-group').forEach(function (group) {
      var items = Array.prototype.filter.call(group.children, function (child) {
        return child.classList.contains('reveal');
      });
      items.forEach(function (item, index) {
        item.style.transitionDelay = Math.min(index * 90, 360) + 'ms';
      });
    });

    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  }
})();
