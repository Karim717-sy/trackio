document.addEventListener('DOMContentLoaded', () => {
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '1.5rem 4rem';
            navbar.style.boxShadow = '0 4px 20px rgba(46, 64, 54, 0.05)';
        } else {
            navbar.style.padding = '2rem 4rem';
            navbar.style.boxShadow = 'none';
        }
        lastScrollY = window.scrollY;
    }, { passive: true });

    // Intersection Observer for scroll animations (fade in / slide up)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation starting states to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.2}s, box-shadow 0.4s ease`;
        observer.observe(card);
    });

    // Add gentle parallax to the hero image wrapper
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroImage.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
            }
        }, { passive: true });
    }
});
