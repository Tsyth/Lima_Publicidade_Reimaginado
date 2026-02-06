// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('.header');
const themeToggle = document.getElementById('theme-toggle');

// Accessibility: ensure hamburger has aria-expanded state
if (hamburger) {
    // initialize state
    hamburger.setAttribute('aria-expanded', 'false');
    // ensure it's keyboard-focusable if it's not a native button
    if (!hamburger.hasAttribute('tabindex')) hamburger.setAttribute('tabindex', '0');
}

// Theme Management
function initTheme() {
    // Verifica se há tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Define o tema inicial
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Atualiza o ícone do botão
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggle.setAttribute('aria-label', 'Alternar para modo claro');
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.setAttribute('aria-label', 'Alternar para modo escuro');
    }

    // Troca a logo quando em modo escuro
    try {
        const logos = document.querySelectorAll('.logo');
        logos.forEach(img => {
            // Salva o src original em data-src-light se não existir
            if (!img.dataset.srcLight) img.dataset.srcLight = img.src || 'assets/lima-escuro.svg';
            const darkSrc = 'assets/logo-lima.png';
            img.src = (theme === 'dark') ? darkSrc : img.dataset.srcLight;
        });
    } catch (e) {
        // fail silently
        console.warn('Não foi possível trocar logos:', e);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Event listener para o botão de tema
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Inicializa o tema quando a página carrega
document.addEventListener('DOMContentLoaded', initTheme);

// Detecta mudanças na preferência do sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// Mobile Navigation Toggle
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Toggle nav overlay
        let overlay = document.querySelector('.nav-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'nav-overlay';
            document.body.appendChild(overlay);
        }
        overlay.classList.toggle('active');

        // Update aria-expanded for accessibility
        const expanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });

    // Allow keyboard activation (Enter / Space) for non-button hamburger
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hamburger.click();
        }
    });

    // Close mobile menu when clicking on a link or overlay
    const navLinksItems = navLinks.querySelectorAll('a');
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('menu-open');
            const overlay = document.querySelector('.nav-overlay');
            if (overlay) overlay.classList.remove('active');
        });
    });
    
    // Close menu when clicking overlay
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-overlay')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('menu-open');
            e.target.classList.remove('active');
        }
    });
}

// Header Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Testimonials Slider
let currentTestimonial = 1;
const totalTestimonials = document.querySelectorAll('.testimonial').length;

function showTestimonial(n) {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    
    if (n > totalTestimonials) {
        currentTestimonial = 1;
    }
    if (n < 1) {
        currentTestimonial = totalTestimonials;
    }
    
    testimonials.forEach(testimonial => {
        testimonial.classList.remove('active');
    });
    
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    if (testimonials[currentTestimonial - 1]) {
        testimonials[currentTestimonial - 1].classList.add('active');
    }
    
    if (dots[currentTestimonial - 1]) {
        dots[currentTestimonial - 1].classList.add('active');
    }
}

function currentSlide(n) {
    currentTestimonial = n;
    showTestimonial(currentTestimonial);
}

function nextTestimonial() {
    currentTestimonial++;
    showTestimonial(currentTestimonial);
}

// Auto-advance testimonials every 5 seconds
setInterval(nextTestimonial, 5000);

// Initialize testimonials
document.addEventListener('DOMContentLoaded', () => {
    showTestimonial(currentTestimonial);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .step, .portfolio-item, .program-step, .testimonial');
    animatedElements.forEach(el => observer.observe(el));
});

// Form handling (if forms are added later)
function handleContactForm(event) {
    event.preventDefault();
    // Add form handling logic here
    console.log('Form submitted');
}

// WhatsApp contact function
function openWhatsApp() {
    const phone = '5531998868718';
    const message = 'Olá! Gostaria de saber mais sobre os serviços da Lima Publicidade.';
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Add click event to WhatsApp buttons
document.addEventListener('DOMContentLoaded', () => {
    const whatsappButtons = document.querySelectorAll('a[href*="whatsapp"]');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Let the default behavior handle the WhatsApp link
            // but add analytics tracking if needed
            console.log('WhatsApp button clicked');
        });
    });
});

// Lazy loading for images (simple implementation)
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Portfolio item click tracking
document.addEventListener('DOMContentLoaded', () => {
    const portfolioLinks = document.querySelectorAll('.portfolio-link');
    portfolioLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log('Portfolio item clicked:', link.closest('.portfolio-item').querySelector('h3').textContent);
        });
    });
});

// Add loading states for better UX
function showLoading(element) {
    element.style.opacity = '0.7';
    element.style.pointerEvents = 'none';
}

function hideLoading(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
}

// Simple analytics tracking (replace with your analytics service)
function trackEvent(eventName, eventData = {}) {
    console.log('Event tracked:', eventName, eventData);
    // Add your analytics tracking code here
    // Example: gtag('event', eventName, eventData);
}

// Track page sections viewed
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionName = entry.target.id || entry.target.className;
            trackEvent('section_viewed', { section: sectionName });
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => sectionObserver.observe(section));
});

// Performance optimization - Defer non-critical resources
window.addEventListener('load', () => {
    // Load non-critical CSS
    const deferredStyles = document.getElementById('deferred-styles');
    if (deferredStyles) {
        const loadDeferredStyles = () => {
            const addStylesNode = document.getElementById('deferred-styles');
            const replacement = document.createElement('div');
            replacement.innerHTML = addStylesNode.textContent;
            document.body.appendChild(replacement);
            addStylesNode.parentElement.removeChild(addStylesNode);
        };
        
        const raf = requestAnimationFrame || mozRequestAnimationFrame ||
                    webkitRequestAnimationFrame || msRequestAnimationFrame;
        if (raf) raf(() => window.setTimeout(loadDeferredStyles, 0));
        else window.addEventListener('load', loadDeferredStyles);
    }
});

// Error handling for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Replace broken images with placeholder
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0xMjUgNzVMMTc1IDEyNUgxMjVIMTAwTDEyNSA3NVoiIGZpbGw9IiNEMEQwRDAiLz4KPGNpcmNsZSBjeD0iMTI1IiBjeT0iNzUiIHI9IjEwIiBmaWxsPSIjRDBEMEQwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTEwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiPkltYWdlbSBuw6NvIGVuY29udHJhZGE8L3RleHQ+Cjwvc3ZnPgo=';
            this.alt = 'Imagem não encontrada';
        });
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Navigate testimonials with arrow keys
    if (document.activeElement.closest('.testimonials')) {
        if (e.key === 'ArrowLeft') {
            currentSlide(currentTestimonial > 1 ? currentTestimonial - 1 : totalTestimonials);
        } else if (e.key === 'ArrowRight') {
            currentSlide(currentTestimonial < totalTestimonials ? currentTestimonial + 1 : 1);
        }
    }
});

// Add focus styles for better accessibility
document.addEventListener('DOMContentLoaded', () => {
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid #667eea';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = '';
            element.style.outlineOffset = '';
        });
    });
});

// Clients carousel (usa a marcação atual: .clients-carrossel > img.clients-imagem)
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.clients-carrossel');
    if (!carousel) return;

    const items = Array.from(carousel.querySelectorAll('img.clients-imagem'));
    const total = items.length;
    if (total === 0) return;

    let center = 0; // índice do item central
    const VISIBLE_DESKTOP = 5;
    const VISIBLE_MOBILE = 3;
    let autoplayId = null;
    const AUTOPLAY_MS = 5000;

    function applyClasses() {
        const isMobile = window.innerWidth <= 768;
        items.forEach((el, i) => {
            // remove todas as classes posicionais antes de recalcular
            el.classList.remove('center', 'pos1', 'pos2', 'pos3', 'pos1_right', 'pos2_right', 'pos3_right', 'hidden');

            // calcula o offset relativo ao centro com wrap-around (mais robusto)
            let offset = i - center;
            const half = Math.floor(total / 2);
            if (offset > half) offset -= total;
            if (offset < -half) offset += total;

            if (offset === 0) el.classList.add('center');
            else if (offset === -1) el.classList.add('pos1');
            else if (offset === -2) el.classList.add('pos2');
            else if (offset === -3 && !isMobile) el.classList.add('pos3');
            else if (offset === 1) el.classList.add('pos1_right');
            else if (offset === 2) el.classList.add('pos2_right');
            else if (offset === 3 && !isMobile) el.classList.add('pos3_right');
            else el.classList.add('hidden');
        });
        // debugging: mostra índice central e quantos visíveis
        try {
            const visible = items.filter(it => !it.classList.contains('hidden')).length;
            console.debug('[carousel] center=', center, 'visible=', visible, 'isMobile=', isMobile);
        } catch (e) {}
    }

    function next() {
        center = (center + 1) % total;
        applyClasses();
        console.debug('[carousel] next -> center', center);
    }

    function prev() {
        center = (center - 1 + total) % total;
        applyClasses();
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayId = setInterval(next, AUTOPLAY_MS);
    }

    function stopAutoplay() {
        if (autoplayId) clearInterval(autoplayId);
        autoplayId = null;
    }

    // Inicializa
    applyClasses();
    startAutoplay();

    // Pausa ao passar o mouse / focar
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);

    // Swipe/touch handling
    let touchStartX = 0;
    let touchDeltaX = 0;

    carousel.addEventListener('touchstart', (e) => {
        stopAutoplay();
        touchStartX = e.touches[0].clientX;
        touchDeltaX = 0;
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
        touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
        if (Math.abs(touchDeltaX) > 40) {
            if (touchDeltaX < 0) next(); else prev();
        }
        touchDeltaX = 0;
        startAutoplay();
    });

    // Clique em item centraliza
    items.forEach((el, idx) => {
        el.addEventListener('click', () => {
            if (idx === center) return; // já central
            center = idx;
            applyClasses();
            startAutoplay();
        });
    });

    // Teclado
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prev();
        else if (e.key === 'ArrowRight') next();
    });

    // Ajuste ao redimensionar
    window.addEventListener('resize', () => applyClasses());
});