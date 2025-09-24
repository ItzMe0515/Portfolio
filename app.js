// Portfolio Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();

    // Language switching functionality
    initLanguageSwitcher();
    
    // Smooth scrolling navigation
    initSmoothScrolling();
    
    // Contact form handling
    initContactForm();
    
    // Scroll animations
    initScrollAnimations();
    
    // Header scroll effects
    initHeaderEffects();
});

// Language Switcher
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const body = document.body;
    
    // Get saved language or default to English
    const savedLang = localStorage.getItem('preferred-language') || 'en';
    setLanguage(savedLang);
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
            localStorage.setItem('preferred-language', lang);
        });
    });
    
    function setLanguage(lang) {
        // Update body data-lang attribute
        body.setAttribute('data-lang', lang);
        
        // Update active button
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
        
        // Update all text elements
        const elements = document.querySelectorAll('[data-en][data-nl]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                element.textContent = text;
            }
        });
        
        // Update placeholders
        updatePlaceholders(lang);
        
        // Update document title
        const titles = {
            en: 'Joren De Koninck - ItzMe | Portfolio',
            nl: 'Joren De Koninck - ItzMe | Portfolio'
        };
        document.title = titles[lang];
    }
    
    function updatePlaceholders(lang) {
        const placeholders = {
            en: {
                name: 'Your Name',
                email: 'your.email@example.com',
                subject: 'Subject',
                message: 'Your message here...'
            },
            nl: {
                name: 'Uw Naam',
                email: 'uw.email@voorbeeld.com',
                subject: 'Onderwerp',
                message: 'Uw bericht hier...'
            }
        };
        
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const subjectField = document.getElementById('subject');
        const messageField = document.getElementById('message');
        
        if (nameField) nameField.placeholder = placeholders[lang].name;
        if (emailField) emailField.placeholder = placeholders[lang].email;
        if (subjectField) subjectField.placeholder = placeholders[lang].subject;
        if (messageField) messageField.placeholder = placeholders[lang].message;
    }
}

// Smooth Scrolling Navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const headerHeight = document.querySelector('.header').offsetHeight;
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });
        
        if (currentSection) {
            updateActiveNavLink(currentSection);
        }
    });
    
    function updateActiveNavLink(targetId) {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === targetId);
        });
    }
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');
    const currentLang = document.body.getAttribute('data-lang') || 'en';
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Get current language for messages
        const lang = document.body.getAttribute('data-lang') || 'en';
        
        const messages = {
            en: {
                sending: 'Sending...',
                success: 'Message sent successfully! I\'ll get back to you soon.',
                error: 'Failed to send message. Please try again or contact me directly.',
                validation: 'Please fill in all required fields.'
            },
            nl: {
                sending: 'Versturen...',
                success: 'Bericht succesvol verzonden! Ik neem spoedig contact met u op.',
                error: 'Versturen mislukt. Probeer opnieuw of neem direct contact op.',
                validation: 'Vul alle verplichte velden in.'
            }
        };
        
        // Clear previous messages
        clearFormMessages();
        
        // Validate form
        if (!validateForm(formData, messages[lang].validation)) {
            return;
        }
        
        // Update button state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>${messages[lang].sending}</span>`;
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await simulateFormSubmission(formData);
            
            // Show success message
            showFormMessage(messages[lang].success, 'success');
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            showFormMessage(messages[lang].error, 'error');
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
    
    function validateForm(formData, validationMessage) {
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const subject = formData.get('subject')?.trim();
        const message = formData.get('message')?.trim();
        
        if (!name || !email || !subject || !message) {
            showFormMessage(validationMessage, 'error');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            const lang = document.body.getAttribute('data-lang') || 'en';
            const emailError = lang === 'en' ? 'Please enter a valid email address.' : 'Voer een geldig e-mailadres in.';
            showFormMessage(emailError, 'error');
            return false;
        }
        
        return true;
    }
    
    function simulateFormSubmission(formData) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // Simulate success (in real implementation, send to your backend)
                console.log('Form data:', Object.fromEntries(formData));
                resolve();
            }, 1500);
        });
    }
    
    function showFormMessage(message, type) {
        clearFormMessages();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-${type}`;
        messageDiv.textContent = message;
        
        form.appendChild(messageDiv);
        
        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    }
    
    function clearFormMessages() {
        const existingMessages = form.querySelectorAll('.form-success, .form-error');
        existingMessages.forEach(msg => msg.remove());
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.skill-category, .project-card, .service-card, .education-card');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Header Effects
function initHeaderEffects() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class for styling
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add hover effects for project cards
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-4px)';
        });
    });
});

// Add typing effect to hero title (optional enhancement)
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero__title span');
    if (!heroTitle) return;
    
    const texts = {
        en: "Hi, I'm Joren De Koninck",
        nl: "Hoi, ik ben Joren De Koninck"
    };
    
    function typeText(element, text, speed = 100) {
        element.textContent = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Initial typing effect
    const currentLang = document.body.getAttribute('data-lang') || 'en';
    setTimeout(() => {
        typeText(heroTitle, texts[currentLang], 80);
    }, 500);
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    // Add loading class to body initially
    document.body.classList.add('loading');
    
    // Remove loading class after everything is loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.body.classList.remove('loading');
        }, 300);
    });
    
    // Initialize typing effect
    // initTypingEffect();
    
    // Add keyboard navigation support
    initKeyboardNavigation();
});

// Keyboard Navigation
function initKeyboardNavigation() {
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && element.tagName === 'A') {
                element.click();
            }
        });
    });
}

// Performance optimization: Lazy load images if any are added later
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Handle orientation change on mobile
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        window.scrollTo(window.scrollX, window.scrollY);
    }, 100);
});