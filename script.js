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

    // Force carousels to start at the first item (Rightmost in RTL) on load
    window.addEventListener('load', () => {
        const carousels = document.querySelectorAll('.gallery-grid, .reviews-grid');
        carousels.forEach(c => {
            // Chrome/Firefox use 0 or negative for RTL, Safari uses positive.
            // A safe approach:
            c.scrollLeft = 9999;
            if (c.scrollLeft === 0) {
                // If it didn't change, it means 0 is the max (Chrome/Firefox RTL)
                c.scrollLeft = 0;
            }
        });
    });

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

    // FAQ Accordion - Premium
    document.querySelectorAll('.faq-trigger-premium').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            const panel = trigger.nextElementSibling;
            
            // Toggle active class on item
            const isActive = item.classList.toggle('active');
            trigger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            
            // Adjust panel height for smooth transition
            if (isActive) {
                panel.style.maxHeight = panel.scrollHeight + "px";
            } else {
                panel.style.maxHeight = null;
            }

            // Close other open items (Optional, for better UX)
            document.querySelectorAll('.faq-item-premium').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherTrigger = otherItem.querySelector('.faq-trigger-premium');
                    if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
                    if (otherItem.querySelector('.faq-panel-premium')) {
                        otherItem.querySelector('.faq-panel-premium').style.maxHeight = null;
                    }
                }
            });
        });
    });

    // ========== GALLERY LIGHTBOX ==========
    const galleryImages = [
        { src: 'works/work1.webp', alt: 'צילום קו ביוב לאיתור סתימה ושורשים בצנרת' },
        { src: 'works/work3.webp', alt: 'בדיקת צנרת ביוב עם מצלמה לאיתור תקלה' },
        { src: 'works/work4.webp', alt: 'איתור שורשים בצנרת ביוב' },
        { src: 'works/work5.webp', alt: 'פתיחת סתימה בביוב באמצעות ציוד מקצועי' },
        // New WebP images
        { src: 'works-new/work-new-01.webp', alt: 'צילום קו ביוב בשטח - א.ל אינסטלציה 1' },
        { src: 'works-new/work-new-02.webp', alt: 'פתיחת סתימה בביוב באמצעות ציוד מקצועי - א.ל אינסטלציה 2' },
        { src: 'works-new/work-new-03.webp', alt: 'בדיקת צנרת ביוב עם מצלמה לאיתור תקלה - א.ל אינסטלציה 3' },
        { src: 'works-new/work-new-04.webp', alt: 'עבודת ביובית ופתיחת סתימה בשטח - א.ל אינסטלציה 4' },
        { src: 'works-new/work-new-05.webp', alt: 'איתור שורשים בצנרת ביוב - א.ל אינסטלציה 5' },
        { src: 'works-new/work-new-06.webp', alt: 'צילום צנרת ביוב לאבחון תקלה - א.ל אינסטלציה 6' },
        { src: 'works-new/work-new-07.webp', alt: 'שטיפת קו ביוב ופתיחת סתימה - א.ל אינסטלציה 7' },
        { src: 'works-new/work-new-08.webp', alt: 'בדיקת מערכת ביוב בשטח עם מצלמה - א.ל אינסטלציה 8' },
        { src: 'works-new/work-new-09.webp', alt: 'עבודת אינסטלציה וביובית ללקוח - א.ל אינסטלציה 9' },
        { src: 'works-new/work-new-10.webp', alt: 'פתיחת סתימה מורכבת בצנרת ביוב - א.ל אינסטלציה 10' },
        { src: 'works-new/work-new-11.webp', alt: 'צילום קווי ביוב לפני תיקון תקלה - א.ל אינסטלציה 11' },
        { src: 'works-new/work-new-12.webp', alt: 'שירות ביובית וצילום קו ביוב בשטח - א.ל אינסטלציה 12' }
    ];

    let currentGalleryIndex = 0;
    const lightboxModal = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeLightboxBtn = document.getElementById('closeLightboxBtn');
    const prevLightboxBtn = document.getElementById('prevLightboxBtn');
    const nextLightboxBtn = document.getElementById('nextLightboxBtn');
    const openGalleryBtn = document.getElementById('openGalleryBtn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    function openLightbox(index) {
        if (!lightboxModal) return;
        currentGalleryIndex = index;
        updateLightboxImage();
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (closeLightboxBtn) closeLightboxBtn.focus();
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (openGalleryBtn) openGalleryBtn.focus();
    }

    function updateLightboxImage() {
        if (currentGalleryIndex < 0) currentGalleryIndex = galleryImages.length - 1;
        if (currentGalleryIndex >= galleryImages.length) currentGalleryIndex = 0;
        
        if (lightboxImg) {
            lightboxImg.src = galleryImages[currentGalleryIndex].src;
            lightboxImg.alt = galleryImages[currentGalleryIndex].alt;
        }
    }

    function nextImage(e) {
        if (e) e.stopPropagation();
        currentGalleryIndex++;
        updateLightboxImage();
    }

    function prevImage(e) {
        if (e) e.stopPropagation();
        currentGalleryIndex--;
        updateLightboxImage();
    }

    if (lightboxModal) {
        if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
        if (nextLightboxBtn) nextLightboxBtn.addEventListener('click', nextImage);
        if (prevLightboxBtn) prevLightboxBtn.addEventListener('click', prevImage);
        
        // Close on outside click
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal || (e.target.classList && e.target.classList.contains('lightbox-content-wrapper'))) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightboxModal.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });

        // Swipe support for mobile lightbox
        let touchstartX = 0;
        let touchendX = 0;
        
        lightboxModal.addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        lightboxModal.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            if (touchendX < touchstartX - 50) nextImage();
            if (touchendX > touchstartX + 50) prevImage();
        }
    }

    // Open from specific grid image
    if (galleryItems) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.getAttribute('data-index'));
                if (!isNaN(index)) openLightbox(index);
            });
            
            // Accessibility for keyboard
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const index = parseInt(item.getAttribute('data-index'));
                    if (!isNaN(index)) openLightbox(index);
                }
            });
        });
    }

    // Expansion logic for Gallery Grid (Desktop)
    if (openGalleryBtn) {
        const mainGalleryGrid = document.getElementById('mainGalleryGrid');
        openGalleryBtn.addEventListener('click', () => {
            const isExpanded = mainGalleryGrid.classList.toggle('expanded');
            
            if (isExpanded) {
                openGalleryBtn.textContent = 'הסתר עבודות מהשטח';
            } else {
                openGalleryBtn.textContent = 'לצפייה בעוד עבודות מהשטח';
                // Scroll back to top of gallery section if hidden
                const gallerySection = document.getElementById('gallery');
                if (gallerySection) {
                    gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }

    // ========== REVIEWS SECTION EXPANSION ==========
    const showMoreReviewsBtn = document.getElementById('showMoreReviewsBtn');
    const reviewsGrid = document.getElementById('reviewsGrid');

    if (showMoreReviewsBtn && reviewsGrid) {
        showMoreReviewsBtn.addEventListener('click', () => {
            const isExpanded = reviewsGrid.classList.toggle('expanded');
            showMoreReviewsBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            
            if (isExpanded) {
                showMoreReviewsBtn.textContent = 'הסתר ביקורות';
                // Optional: scroll slightly to show new items smoothly
                setTimeout(() => {
                    window.scrollBy({ top: 200, behavior: 'smooth' });
                }, 100);
            } else {
                showMoreReviewsBtn.textContent = 'לצפייה בעוד ביקורות';
                // Scroll back to top of reviews section
                const reviewsSection = document.getElementById('reviews');
                if (reviewsSection) {
                    reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }

});
