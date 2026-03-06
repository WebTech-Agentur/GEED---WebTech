document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check local storage for theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Fallback to system preference
        body.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }

    themeToggleBtn.addEventListener('click', () => {
        let theme = body.getAttribute('data-theme');
        if (theme === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            updateThemeIcon('light');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            updateThemeIcon('dark');
        }
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    }

    // --- Sticky Header ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // --- Mobile Menu ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const isOpen = navLinks.classList.contains('open');
            mobileMenuBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }

    // --- Scroll Animations ---
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- Global Background Animation ---
    function initBackgroundAnimation() {
        // Create container
        const bgContainer = document.createElement('div');
        bgContainer.id = 'bg-animation-container';
        document.body.prepend(bgContainer);

        const numShapes = 15; // Number of floating particles

        for (let i = 0; i < numShapes; i++) {
            createShape(bgContainer);
        }
    }

    function createShape(container) {
        const shape = document.createElement('div');
        shape.classList.add('bg-shape');

        // Randomize size between 50px and 250px
        const size = Math.random() * 200 + 50;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;

        // Randomize starting X position
        shape.style.left = `${Math.random() * 100}vw`;

        // Randomize animation duration between 15s and 35s for slow, elegant movement
        const duration = Math.random() * 20 + 15;
        shape.style.animationDuration = `${duration}s`;

        // Randomize animation delay to stagger spawns
        const delay = Math.random() * 15;
        shape.style.animationDelay = `-${delay}s`; // Negative delay means it starts already progressed

        container.appendChild(shape);
    }

    // Initialize the background effects
    initBackgroundAnimation();

    // --- Language Manager ---
    let currentLang = 'de';

    function initLanguage() {
        const langBtn = document.getElementById('lang-btn');
        const langDropdown = document.getElementById('lang-dropdown');
        const langOptions = document.querySelectorAll('.lang-option');

        // Load preference
        currentLang = localStorage.getItem('language') || 'de';
        setLanguage(currentLang);

        if (langBtn && langDropdown) {
            langBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                langDropdown.classList.toggle('active');
                console.log('Language dropdown toggled');
            });

            document.addEventListener('click', (e) => {
                if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                    langDropdown.classList.remove('active');
                }
            });

            langOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const lang = option.getAttribute('data-lang');
                    console.log('Selecting language:', lang);
                    setLanguage(lang);
                    langDropdown.classList.remove('active');
                });
            });
        }
    }

    function setLanguage(lang) {
        if (!window.translations || !window.translations[lang]) return;

        currentLang = lang;
        localStorage.setItem('language', lang);

        // Update HTML attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'fa') ? 'rtl' : 'ltr';

        // Update UI content
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (window.translations[lang][key]) {
                el.innerHTML = window.translations[lang][key];
            }
        });

        // Update placeholders
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (window.translations[lang][key]) {
                el.placeholder = window.translations[lang][key];
            }
        });

        // Update active class in dropdown
        const options = document.querySelectorAll('.lang-option');
        options.forEach(opt => {
            opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
            if (opt.getAttribute('data-lang') === lang) {
                const flagHtml = opt.querySelector('span').innerHTML;
                const btn = document.getElementById('lang-btn');
                if (btn) btn.innerHTML = `${flagHtml} <i class="fa-solid fa-chevron-down" style="font-size: 0.7rem; margin-left: 2px;"></i>`;
            }
        });
    }

    // Wait for translations to load if injected via script tag
    if (window.translations) {
        initLanguage();
    } else {
        // Fallback or wait for script load
        window.addEventListener('load', () => {
            if (window.translations) initLanguage();
        });
    }
});
