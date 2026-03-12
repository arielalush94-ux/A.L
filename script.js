document.addEventListener('DOMContentLoaded', () => {

    // ========== FLOATING CTA ==========
    const floatingCTA = document.getElementById('floatingCTA');
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // We want the floating CTA to appear right after scrolling past the Hero section mostly
    if (floatingCTA) {
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            
            // Floating CTA visibility
            if (scrollPos > 300) {
                floatingCTA.classList.add('visible');
            } else {
                floatingCTA.classList.remove('visible');
            }

            // Navbar and Logo animation trigger
            if (scrollPos > 50) {
                document.body.classList.add('scrolled');
            } else {
                document.body.classList.remove('scrolled');
            }
        });
    }

    // ========== LEGAL MODALS ==========
    const legalTriggers = document.querySelectorAll('.legal-trigger');
    const modal = document.getElementById('legalModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.querySelector('.modal-close');

    legalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalType = trigger.getAttribute('data-modal');
            const template = document.getElementById(`${modalType}-content`);

            if (template) {
                modalBody.innerHTML = template.innerHTML;
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; 
            }
        });
    });

    const closeModal = () => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // ========== ACCESSIBILITY WIDGET ==========
    const accBtn = document.getElementById('accessibilityBtn');
    const accMenu = document.getElementById('accessibilityMenu');
    const closeAcc = document.getElementById('closeAccessibility');
    const accOptions = document.querySelectorAll('.acc-opt');

    if (accBtn && accMenu) {
        accBtn.addEventListener('click', () => {
            accMenu.classList.toggle('show');
        });

        if (closeAcc) {
            closeAcc.addEventListener('click', () => {
                accMenu.classList.remove('show');
            });
        }

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!accMenu.contains(e.target) && !accBtn.contains(e.target)) {
                accMenu.classList.remove('show');
            }
        });

        // Setup State for Text Scaling (Range: -2 to +2)
        let currentTextScale = 0;

        function updateTextScale() {
            const html = document.documentElement;
            html.classList.remove('text-xs', 'text-sm', 'text-xl', 'text-xxl');
            if (currentTextScale === -2) html.classList.add('text-xs');
            if (currentTextScale === -1) html.classList.add('text-sm');
            if (currentTextScale === 1) html.classList.add('text-xl');
            if (currentTextScale === 2) html.classList.add('text-xxl');

            // Update buttons active state visually
            const incBtn = document.querySelector('[data-action="increase-text"]');
            const decBtn = document.querySelector('[data-action="decrease-text"]');

            if (currentTextScale > 0) incBtn.classList.add('active');
            else incBtn.classList.remove('active');

            if (currentTextScale < 0) decBtn.classList.add('active');
            else decBtn.classList.remove('active');
        }

        accOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                const action = opt.getAttribute('data-action');

                if (action === 'reset') {
                    // Fix: Stop wiping all classes (don't break 'scrolled' class on body)
                    document.documentElement.classList.remove('grayscale', 'contrast', 'text-xs', 'text-sm', 'text-xl', 'text-xxl', 'highlight-links');
                    document.body.classList.remove('grayscale', 'contrast', 'highlight-links');
                    accOptions.forEach(btn => btn.classList.remove('active'));
                    currentTextScale = 0;
                } else if (action === 'increase-text') {
                    if (currentTextScale < 2) currentTextScale++;
                    updateTextScale();
                } else if (action === 'decrease-text') {
                    if (currentTextScale > -2) currentTextScale--;
                    updateTextScale();
                } else {
                    const isActive = opt.classList.contains('active');
                    
                    if (action === 'highlight-links') {
                        document.documentElement.classList.toggle('highlight-links');
                        opt.classList.toggle('active');
                    } else {
                        // For filters (contrast, grayscale)
                        if (!isActive) {
                            // Turn on
                            document.documentElement.classList.add(action);
                            opt.classList.add('active');
                            
                            // Handle mutual exclusion
                            if (action === 'contrast') {
                                document.documentElement.classList.remove('grayscale');
                                document.querySelector('[data-action="grayscale"]').classList.remove('active');
                            } else if (action === 'grayscale') {
                                document.documentElement.classList.remove('contrast');
                                document.querySelector('[data-action="contrast"]').classList.remove('active');
                            }
                        } else {
                            // Turn off
                            document.documentElement.classList.remove(action);
                            opt.classList.remove('active');
                        }
                    }
                }
            });
        });
    }

    // ========== SCROLL REVEAL ANIMATIONS ==========
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('active'));
    }

});
