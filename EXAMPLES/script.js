// English: Form Submission logic (AJAX / Webhook pattern for cloud)
document.addEventListener('DOMContentLoaded', () => {
    // ========== המבורגר תפריט מובייל ==========
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // סגירת התפריט לאחר בחירת לינק
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Select elements
    const form = document.getElementById('leadForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    const btnText = submitBtn.querySelector('span');
    const loader = submitBtn.querySelector('.loader');

    // English: Webhook URL (Make.com for WhatsApp Automation via Green API)
    const WEBHOOK_URL = 'https://hook.eu1.make.com/aqb8tap8o4yv2qahwwklcalgjsm3e25m';

    form.addEventListener('submit', async (e) => {
        // Prevent page reload
        e.preventDefault();

        // Gather form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.timestamp = new Date().toISOString();
        data.source = 'APages Landing Page';

        // Update UI to loading
        submitBtn.disabled = true;
        btnText.textContent = 'שולח...';
        loader.classList.remove('hidden');
        formMessage.classList.add('hidden');
        formMessage.className = 'form-message';

        try {
            // Send to Webhook
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // English: Self-healing / graceful check if we are using the dummy URL
            if (!response.ok && WEBHOOK_URL.includes('your-webhook-url.com')) {
                console.warn("Using dummy webhook URL. Simulating success for preview.");
                await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
                showSuccess();
                return;
            }

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Success handling
            showSuccess();

        } catch (error) {
            console.error('Error submitting form:', error);

            // Checking if we caught a generic fetch error because of the dummy URL
            if (WEBHOOK_URL.includes('your-webhook-url.com')) {
                console.warn("Caught network error with dummy URL. Simulating success gracefully.");
                showSuccess();
            } else {
                showError('אירעה שגיאה בשליחת הטופס. נסו שוב מאוחר יותר.');
            }
        } finally {
            // Reset UI
            submitBtn.disabled = false;
            btnText.textContent = 'שליחה';
            loader.classList.add('hidden');
        }
    });

    const heroForm = document.getElementById('heroForm');
    if (heroForm) {
        const heroSubmitBtn = document.getElementById('heroSubmitBtn');
        const heroFormMessage = document.getElementById('heroFormMessage');
        const heroBtnText = heroSubmitBtn.querySelector('span');
        const heroLoader = heroSubmitBtn.querySelector('.loader');

        heroForm.addEventListener('submit', async (e) => {
            // Prevent page reload
            e.preventDefault();

            // Gather form data
            const formData = new FormData(heroForm);
            const data = Object.fromEntries(formData.entries());
            data.timestamp = new Date().toISOString();
            data.source = 'APages Landing Page - Hero Form'; // distinct source tag

            // Update UI to loading
            heroSubmitBtn.disabled = true;
            heroBtnText.textContent = 'שולח...';
            heroLoader.classList.remove('hidden');
            heroFormMessage.classList.add('hidden');
            heroFormMessage.className = 'form-message';

            try {
                // Send to Webhook
                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                // English: Self-healing / graceful check if we are using the dummy URL
                if (!response.ok && WEBHOOK_URL.includes('your-webhook-url.com')) {
                    console.warn("Using dummy webhook URL. Simulating success for preview.");
                    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
                    showHeroSuccess();
                    return;
                }

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                // Success handling
                showHeroSuccess();

            } catch (error) {
                console.error('Error submitting hero form:', error);

                // Checking if we caught a generic fetch error because of the dummy URL
                if (WEBHOOK_URL.includes('your-webhook-url.com')) {
                    console.warn("Caught network error with dummy URL. Simulating success gracefully.");
                    showHeroSuccess();
                } else {
                    showHeroError('אירעה שגיאה בשליחת הטופס. נסו שוב מאוחר יותר.');
                }
            } finally {
                // Reset UI
                heroSubmitBtn.disabled = false;
                heroBtnText.textContent = 'שליחה';
                heroLoader.classList.add('hidden');
            }
        });

        function showHeroSuccess() {
            const container = heroForm.parentElement;
            const userName = heroForm.querySelector('#heroFullName').value || 'מתעניין';

            // Hide form content
            heroForm.classList.add('form-content-hidden');

            // Inject Success View
            const successHtml = `
                <div class="success-view">
                    <div class="success-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h3>תודה רבה, ${userName}!</h3>
                    <p>פרטיך התקבלו בהצלחה. נחזור אליך בהקדם המיידי.</p>
                    <a href="https://wa.me/972546276683?text=היי%20אריאל,%20השארתי%20פרטים%20בטופס%20העליון%20ואני%20רוצה%20מענה%20מהיר" target="_blank" class="btn-whatsapp-success">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" /></svg>
                        מענה מהיר בוואטסאפ
                    </a>
                </div>
            `;

            container.insertAdjacentHTML('beforeend', successHtml);
        }

        function showHeroError(msg) {
            heroFormMessage.textContent = msg;
            heroFormMessage.classList.add('error');
            heroFormMessage.classList.remove('hidden');
        }
    }

    function showSuccess() {
        const container = form.parentElement;
        const userName = form.querySelector('#fullName').value || 'מתעניין';

        // Hide form content
        form.classList.add('form-content-hidden');

        // Inject Success View
        const successHtml = `
            <div class="success-view">
                <div class="success-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3>תודה רבה, ${userName}!</h3>
                <p>הפרטים התקבלו בהצלחה. אנחנו כבר בדרך לבדוק את הפניה שלך.</p>
                <a href="https://wa.me/972546276683?text=היי%20אריאל,%20השארתי%20פרטים%20בטופס%20התחתון%20ואני%20רוצה%20מענה%20מהיר" target="_blank" class="btn-whatsapp-success">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" /></svg>
                    דבר איתי בוואטסאפ
                </a>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', successHtml);
    }

    function showError(msg) {
        formMessage.textContent = msg;
        formMessage.classList.add('error');
        formMessage.classList.remove('hidden');
    }

    // ========== FAQ ACCORDION ==========
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');

            // Close all other FAQs
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Toggle current FAQ
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 'px';
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
                document.body.style.overflow = 'hidden'; // Prevent scrolling
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
                    document.body.className = '';
                    document.documentElement.classList.remove('grayscale', 'contrast', 'text-xs', 'text-sm', 'text-xl', 'text-xxl');
                    accOptions.forEach(btn => btn.classList.remove('active'));
                    currentTextScale = 0;
                } else if (action === 'increase-text') {
                    if (currentTextScale < 2) currentTextScale++;
                    updateTextScale();
                } else if (action === 'decrease-text') {
                    if (currentTextScale > -2) currentTextScale--;
                    updateTextScale();
                } else {
                    document.body.classList.toggle(action);
                    document.documentElement.classList.toggle(action);
                    opt.classList.toggle('active');

                    // Mutual exclusion for contrast and grayscale
                    if (action === 'contrast') {
                        document.body.classList.remove('grayscale');
                        document.documentElement.classList.remove('grayscale');
                        document.querySelector('[data-action="grayscale"]').classList.remove('active');
                    } else if (action === 'grayscale') {
                        document.body.classList.remove('contrast');
                        document.documentElement.classList.remove('contrast');
                        document.querySelector('[data-action="contrast"]').classList.remove('active');
                    }
                }
            });
        });
    }

    // ========== FLOATING CTA ==========
    const floatingCTA = document.getElementById('floatingCTA');
    const contactSection = document.getElementById('leadForm');

    if (floatingCTA && contactSection) {
        // Show after scrolling 50px down
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            const contactPos = contactSection.getBoundingClientRect().top + window.scrollY;
            const windowHeight = window.innerHeight;

            // Show if scrolled past 50px AND haven't reached the very end of the contact section
            if (scrollPos > 50 && scrollPos + windowHeight < contactPos + contactSection.offsetHeight + 100) {
                floatingCTA.classList.add('visible');
            } else {
                floatingCTA.classList.remove('visible');
            }
        });
    }
});
