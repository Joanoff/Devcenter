// Dev Center — interactions (menu mobile, thème, FAQ). Aucune dépendance externe.
(function () {
  document.getElementById('current-year').textContent = new Date().getFullYear();
  var isEnglish = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;

  // --- Menu mobile ---
  var menuToggle = document.getElementById('menu-toggle');
  var navLinks = document.getElementById('nav-links');
  var iconMenu = document.getElementById('icon-menu');
  var iconClose = document.getElementById('icon-close');
  var t = isEnglish
    ? { openMenu: 'Open menu', closeMenu: 'Close menu', lightTheme: 'Switch to light theme', darkTheme: 'Switch to dark theme' }
    : { openMenu: 'Ouvrir le menu', closeMenu: 'Fermer le menu', lightTheme: 'Activer le thème clair', darkTheme: 'Activer le thème sombre' };

  menuToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? t.closeMenu : t.openMenu);
    iconMenu.style.display = isOpen ? 'none' : '';
    iconClose.style.display = isOpen ? '' : 'none';
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', t.openMenu);
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
    themeToggle.setAttribute('aria-label', isDark ? t.lightTheme : t.darkTheme);
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

  // --- Catalogue des modules du Bot Discord personnalisé ---
  var modulesOpenBtn = document.getElementById('modules-open');
  if (modulesOpenBtn) {
    var MAX_MODULES = 15;
    var moduleCategoriesFr = [
      { name: 'Modération', items: ['Anti-spam', 'Anti-raid', 'Avertissements', 'Kick / ban automatisés', 'Filtre de mots', 'Journal de modération', 'Verrouillage de salon', 'Vérification à l’arrivée'] },
      { name: 'Utilitaires', items: ['Tickets de support', 'Sondages', 'Rappels programmés', 'Suggestions communautaires', 'Réaction-rôles', 'FAQ automatique', 'Statistiques du serveur', 'Sauvegarde de configuration'] },
      { name: 'Fun & divertissement', items: ['Quiz interactifs', 'Mini-jeux', 'Générateur de memes', 'Blagues aléatoires', 'Duels entre membres', 'Cartes à collectionner', 'Roulette virtuelle', 'Effets sonores'] },
      { name: 'Économie & progression', items: ['Crédits internes', 'Boutique virtuelle', 'Niveaux & XP', 'Classement des membres', 'Récompenses quotidiennes', 'Système de paris', 'Métiers virtuels', 'Badges de progression'] },
      { name: 'Musique & audio', items: ['Lecture de musique', 'Playlists partagées', 'Radio communautaire', 'Annonces vocales automatiques'] },
      { name: 'Réseaux & notifications', items: ['Alertes YouTube', 'Alertes Twitch', 'Alertes X / Twitter', 'Annonces programmées'] }
    ];

    var moduleCategoriesEn = [
      { name: 'Moderation', items: ['Anti-spam', 'Anti-raid', 'Warnings', 'Automated kick / ban', 'Word filter', 'Moderation log', 'Channel lockdown', 'Join verification'] },
      { name: 'Utilities', items: ['Support tickets', 'Polls', 'Scheduled reminders', 'Community suggestions', 'Reaction roles', 'Automatic FAQ', 'Server statistics', 'Configuration backup'] },
      { name: 'Fun & entertainment', items: ['Interactive quizzes', 'Mini-games', 'Meme generator', 'Random jokes', 'Member duels', 'Collectible cards', 'Virtual roulette', 'Sound effects'] },
      { name: 'Economy & progression', items: ['Internal credits', 'Virtual shop', 'Levels & XP', 'Member leaderboard', 'Daily rewards', 'Betting system', 'Virtual jobs', 'Progress badges'] },
      { name: 'Music & audio', items: ['Music playback', 'Shared playlists', 'Community radio', 'Automatic voice announcements'] },
      { name: 'Social & notifications', items: ['YouTube alerts', 'Twitch alerts', 'X / Twitter alerts', 'Scheduled announcements'] }
    ];

    var moduleCategories = isEnglish ? moduleCategoriesEn : moduleCategoriesFr;
    var i18n = isEnglish
      ? { counter: function (n) { return '<strong>' + n + '</strong> / ' + MAX_MODULES + ' modules selected'; }, copyHeader: 'Selected modules for my Custom Bot:', copyEmpty: 'No module selected yet.', copyDone: 'Copied ✓' }
      : { counter: function (n) { return '<strong>' + n + '</strong> / ' + MAX_MODULES + ' modules sélectionnés'; }, copyHeader: 'Modules sélectionnés pour mon Bot Perso :', copyEmpty: 'Aucun module sélectionné pour le moment.', copyDone: 'Copié ✓' };

    var modal = document.getElementById('modules-modal');
    var list = document.getElementById('modules-list');
    var counterEl = document.getElementById('modules-counter');
    var closeBtn = document.getElementById('modules-close');
    var resetBtn = document.getElementById('modules-reset');
    var copyBtn = document.getElementById('modules-copy');
    var lastFocused = null;

    // Construction du catalogue.
    moduleCategories.forEach(function (category) {
      var fieldset = document.createElement('fieldset');
      fieldset.className = 'modules-category';
      var legend = document.createElement('legend');
      legend.textContent = category.name;
      fieldset.appendChild(legend);
      var optionsWrap = document.createElement('div');
      optionsWrap.className = 'modules-options';
      category.items.forEach(function (moduleName) {
        var label = document.createElement('label');
        label.className = 'module-option';
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.value = moduleName;
        var span = document.createElement('span');
        span.textContent = moduleName;
        label.appendChild(input);
        label.appendChild(span);
        optionsWrap.appendChild(label);
      });
      fieldset.appendChild(optionsWrap);
      list.appendChild(fieldset);
    });

    var checkboxes = Array.prototype.slice.call(list.querySelectorAll('input[type="checkbox"]'));

    function updateCounter() {
      var checked = checkboxes.filter(function (cb) { return cb.checked; });
      counterEl.innerHTML = i18n.counter(checked.length);
      var limitReached = checked.length >= MAX_MODULES;
      checkboxes.forEach(function (cb) {
        if (!cb.checked) cb.disabled = limitReached;
      });
    }

    checkboxes.forEach(function (cb) {
      cb.addEventListener('change', updateCounter);
    });

    function openModal() {
      lastFocused = document.activeElement;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    modulesOpenBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (event) {
      if (event.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    resetBtn.addEventListener('click', function () {
      checkboxes.forEach(function (cb) { cb.checked = false; cb.disabled = false; });
      updateCounter();
    });

    copyBtn.addEventListener('click', function () {
      var selected = checkboxes.filter(function (cb) { return cb.checked; }).map(function (cb) { return '– ' + cb.value; });
      var text = selected.length ? i18n.copyHeader + '\n' + selected.join('\n') : i18n.copyEmpty;
      var originalLabel = copyBtn.textContent;
      function showCopied() {
        copyBtn.textContent = i18n.copyDone;
        setTimeout(function () { copyBtn.textContent = originalLabel; }, 2000);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(showCopied).catch(function () {});
      }
    });

    updateCounter();
  }

  // --- Effet de tilt 3D au survol (cartes projets et tarifaires) ---
  var canTilt = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  if (canTilt) {
    var tiltCards = document.querySelectorAll('.project-card, .pricing-card');
    var MAX_TILT = 7; // degrés
    var SCALE = 1.02;

    tiltCards.forEach(function (card) {
      var isFeatured = card.classList.contains('featured');
      var baseLift = isFeatured ? 'translateY(-8px) ' : '';

      card.addEventListener('pointerenter', function () {
        card.classList.add('tilt-hover');
      });

      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width;
        var y = (event.clientY - rect.top) / rect.height;
        var rotateY = (x - 0.5) * (MAX_TILT * 2);
        var rotateX = (0.5 - y) * (MAX_TILT * 2);
        card.style.transform = 'perspective(900px) ' + baseLift + 'rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) scale(' + SCALE + ')';
      });

      card.addEventListener('pointerleave', function () {
        card.classList.remove('tilt-hover');
        card.style.transform = '';
      });
    });
  }

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
          // Une fois l'apparition jouée, on retire le délai de stagger : sinon il reste
          // collé sur l'élément et vient aussi retarder ses futures transitions (tilt 3D,
          // survol...), ce qui peut les empêcher de se déclencher visuellement.
          var clearStaggerDelay = function () {
            entry.target.style.transitionDelay = '';
          };
          entry.target.addEventListener('transitionend', clearStaggerDelay, { once: true });
          setTimeout(clearStaggerDelay, 900);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  }
})();
