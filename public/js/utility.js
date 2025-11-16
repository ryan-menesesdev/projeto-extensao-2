function applySavedAccessibilitySettings() {
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        document.documentElement.style.fontSize = savedFontSize;
    }
}

function setupFontSizeControls() {
    const increaseFontBtn = document.getElementById('font-increase-btn');
    const decreaseFontBtn = document.getElementById('font-decrease-btn');
    const resetFontBtn = document.getElementById('font-reset-btn');

    const changeFontSize = (amount) => {
        const html = document.documentElement;
        let currentSize = parseFloat(window.getComputedStyle(html).fontSize) || 16;
        let newSize = currentSize + amount;
        
        if (newSize < 12) newSize = 12; 
        if (newSize > 24) newSize = 24;

        html.style.fontSize = `${newSize}px`;

        localStorage.setItem('fontSize', `${newSize}px`);
    };

    if (increaseFontBtn) increaseFontBtn.addEventListener('click', () => changeFontSize(1));
    if (decreaseFontBtn) decreaseFontBtn.addEventListener('click', () => changeFontSize(-1));
    if (resetFontBtn) resetFontBtn.addEventListener('click', () => {
        document.documentElement.style.fontSize = ''; 
        localStorage.removeItem('fontSize');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const carouselSlides = document.querySelector('.carousel-slides');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playPauseIcon = document.getElementById('playPauseIcon');
    const carouselDotsContainer = document.getElementById('carouselDots');

    let currentSlideIndex = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;
    let isAutoPlaying = true;
    const autoPlayDelay = 3000; 

    function showSlide(index) {
        if (index >= totalSlides) {
            currentSlideIndex = 0; 
        } else if (index < 0) {
            currentSlideIndex = totalSlides - 1;
        } else {
            currentSlideIndex = index;
        }

        carouselSlides.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

        updateDots();
    }

    function nextSlide() {
        showSlide(currentSlideIndex + 1);
    }

    function prevSlide() {
        showSlide(currentSlideIndex - 1);
    }

    function startAutoPlay() {
        if (!isAutoPlaying) {
            autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
            isAutoPlaying = true;
            playPauseIcon.classList.remove('fa-play');
            playPauseIcon.classList.add('fa-pause');
        }
    }

    function stopAutoPlay() {
        if (isAutoPlaying) {
            clearInterval(autoPlayInterval);
            isAutoPlaying = false;
            playPauseIcon.classList.remove('fa-pause');
            playPauseIcon.classList.add('fa-play');
        }
    }

    function createDots() {
        carouselDotsContainer.innerHTML = ''; 
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.dataset.index = i; 
            dot.addEventListener('click', () => {
                stopAutoPlay(); 
                showSlide(i);
            });
            carouselDotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentSlideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    prevBtn.addEventListener('click', () => {
        stopAutoPlay(); 
        prevSlide();
    });

    nextBtn.addEventListener('click', () => {
        stopAutoPlay(); 
        nextSlide();
    });

    playPauseBtn.addEventListener('click', () => {
        if (isAutoPlaying) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });

    createDots(); 
    showSlide(currentSlideIndex); 
    autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
});

document.addEventListener('DOMContentLoaded', () => {
    applySavedAccessibilitySettings();
    setupFontSizeControls();

    const menuToggleBtn = document.getElementById('menuDropdownToggle');
    const menuDropdown = document.getElementById('menuDropdown');

    const accessibilityToggleBtn = document.getElementById('header-accessibility-toggle-btn');
    const accessibilityMenu = document.getElementById('header-accessibility-menu');

    if (menuToggleBtn && menuDropdown) {
        menuToggleBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            if (accessibilityMenu && accessibilityMenu.classList.contains('show')) {
                accessibilityMenu.classList.remove('show');
                if (accessibilityToggleBtn) accessibilityToggleBtn.setAttribute('aria-expanded', 'false');
            }
            menuDropdown.classList.toggle('show');
            const isExpanded = menuDropdown.classList.contains('show');
            menuToggleBtn.setAttribute('aria-expanded', isExpanded);
        });
    }

    if (accessibilityToggleBtn && accessibilityMenu) {
        accessibilityToggleBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            if (menuDropdown && menuDropdown.classList.contains('show')) {
                menuDropdown.classList.remove('show');
                if (menuToggleBtn) menuToggleBtn.setAttribute('aria-expanded', 'false');
            }
            accessibilityMenu.classList.toggle('show');
            const isExpanded = accessibilityMenu.classList.contains('show');
            accessibilityToggleBtn.setAttribute('aria-expanded', isExpanded);
        });
    }

    window.addEventListener('click', (event) => {
        if (menuDropdown && menuDropdown.classList.contains('show') && !menuToggleBtn.contains(event.target)) {
            menuDropdown.classList.remove('show');
            menuToggleBtn.setAttribute('aria-expanded', 'false');
        }

        if (accessibilityMenu && accessibilityMenu.classList.contains('show') && !accessibilityToggleBtn.contains(event.target)) {
            if (!accessibilityMenu.contains(event.target)) {
                accessibilityMenu.classList.remove('show');
                accessibilityToggleBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
});