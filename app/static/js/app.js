document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader Logic ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => preloader.remove(), 800);
        }, 1000);
    }

    // --- Lenis Smooth Scroll ---
    let lenis;
    try {
        if (typeof Lenis !== 'undefined') {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }
    } catch (e) {
        console.error('Lenis failed to initialize:', e);
    }

    // --- Custom Cursor Logic ---
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });

    const hoverElements = document.querySelectorAll('a, button, input, select, .cursor-pointer');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // --- Services Data ---
    const services = [
        { id: 'itf263',       name: 'Tax Clearance (ITF263)',              description: 'Expedited annual and periodic tax compliance.' },
        { id: 'company_reg',  name: 'Company Registration & Re-Registration',      description: 'Seamless legal filing for new ventures and updates.' },
        { id: 'shop_license', name: 'Shop Licencing',                     description: 'Regulatory assistance for municipal and trade permits.' },
        { id: 'praz_tender',  name: 'PRAZ Tender Registration',           description: 'Comprehensive vendor registration for national tenders.' },
        { id: 'zimra_returns',name: 'ZIMRA Tax Returns',                  description: 'Accurate preparation of corporate and individual filings.' },
        { id: 'bookkeeping',  name: 'Professional Bookkeeping',           description: 'High-integrity financial record-keeping and reporting.' },
        { id: 'printing',     name: 'Printing & Design',                  description: 'High-quality corporate branding materials and business cards.' },
        { id: 'web_design',   name: 'Website Design & Hosting',           description: 'Fast, responsive, and SEO-optimized digital solutions.' },
        { id: 'social_media', name: 'Social Media Marketing Campaigns',             description: 'Targeted strategies to drive real business growth.' }
    ];

    // --- Populate Services Grid (Editorial / Asymmetric style) ---
    const servicesGrid = document.getElementById('services-grid');
    const serviceSelect = document.getElementById('service-select');
    
    // Create a container for the 'See More' button
    const seeMoreContainer = document.createElement('div');
    seeMoreContainer.className = 'col-span-1 md:col-span-2 lg:col-span-3 flex justify-center mt-8';
    const seeMoreBtn = document.createElement('button');
    seeMoreBtn.className = 'border border-gold-DEFAULT text-gold-DEFAULT px-8 py-3 rounded-md font-bold hover:bg-gold-DEFAULT/10 transition-colors duration-200 cursor-pointer';
    seeMoreBtn.textContent = 'View All Services';
    seeMoreContainer.appendChild(seeMoreBtn);

    let isExpanded = false;

    const renderServices = () => {
        // Clear grid only if it's empty (first run)
        if (servicesGrid.children.length === 0) {
            services.slice(0, 3).forEach((service, index) => {
                const div = createServiceCard(service, index);
                servicesGrid.appendChild(div);
            });
        }

        if (isExpanded) {
            // Add the remaining services
            services.slice(3).forEach((service, index) => {
                const div = createServiceCard(service, index + 3);
                servicesGrid.appendChild(div);
            });
            seeMoreBtn.textContent = 'Show Less Services';
        } else {
            // Remove services beyond the first 3
            const cards = Array.from(servicesGrid.children);
            cards.forEach((child, index) => {
                if (index >= 3 && child !== seeMoreContainer) {
                    child.remove();
                }
            });
            seeMoreBtn.textContent = 'View All Services';
        }

        // Always keep the button at the bottom
        servicesGrid.appendChild(seeMoreContainer);
        
        updateReveals();
        setTimeout(revealOnScroll, 50); // Small delay to ensure DOM is ready
    };

    const createServiceCard = (service, index) => {
        const mtClass = index % 2 !== 0 ? 'lg:mt-12' : '';
        const div = document.createElement('div');
        div.className = `bg-white dark:bg-transparent border border-gray-100 dark:border-gold-DEFAULT p-10 rounded-none transition-all duration-300 group cursor-pointer ${mtClass} reveal`;
        div.innerHTML = `
            <div class="text-gold-DEFAULT/50 text-5xl font-heading mb-6 group-hover:text-gold-DEFAULT transition-colors">0${index + 1}</div>
            <h3 class="text-2xl font-heading font-bold mb-4 text-navy-900 dark:text-white group-hover:text-gold-DEFAULT transition-colors">${service.name}</h3>
            
            <div class="flex items-start gap-3 mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gold-DEFAULT flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p class="text-slate-600 dark:text-[#F8FAFC] font-light leading-relaxed transition-colors">${service.description}</p>
            </div>
            
            <div class="flex justify-between items-center border-t border-gray-100 dark:border-gold-DEFAULT/30 pt-6 text-gold-DEFAULT transition-colors">
                <span class="text-sm font-bold uppercase tracking-wider text-navy-900 dark:text-white group-hover:text-gold-DEFAULT transition-colors">Request Info</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </div>
        `;

        // Request Info click: scroll to checkout and pre-select this service
        div.addEventListener('click', () => {
            const serviceSelect = document.getElementById('service-select');
            if (serviceSelect) serviceSelect.value = service.id;
            document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
        });

        return div;
    };

    // Initial call moved to the end to ensure all functions are defined

    seeMoreBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        renderServices();
    });

    // --- Swiper Initialization ---
    const swiper = new Swiper('.testimonial-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            }
        }
    });

    // Populate Select Dropdown
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.id;
        option.textContent = service.name;
        serviceSelect.appendChild(option);
    });

    // --- Reveal Animations on Scroll ---
    let reveals = document.querySelectorAll('.reveal');

    const updateReveals = () => {
        reveals = document.querySelectorAll('.reveal');
    };

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 50; // trigger earlier

        reveals.forEach((reveal, index) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                // Add staggered delay for sibling reveals if needed
                if (!reveal.classList.contains('active')) {
                    setTimeout(() => {
                        reveal.classList.add('active');
                    }, (index % 3) * 100);
                }
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // --- Smooth Scroll Active Link Highlighting ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-gold-DEFAULT');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('text-gold-DEFAULT');
            }
        });
    });

    // --- Handle Form Submission ---
    const checkoutForm = document.getElementById('checkout-form');
    const submitBtn = document.getElementById('submit-btn');
    const paymentMessage = document.getElementById('payment-message');

    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        submitBtn.innerHTML = 'Processing Securely...';
        
        paymentMessage.classList.add('hidden');
        paymentMessage.className = 'mt-4 p-4 rounded-md text-center font-medium border'; // Reset classes
        
        // Call Real Backend API
        try {
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service: document.getElementById('service-select').value,
                    fullName: document.getElementById('full-name').value,
                    phone: document.getElementById('phone').value,
                    email: document.getElementById('email').value
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                paymentMessage.innerHTML = `✅ Submission received! Redirecting to secure payment gateway in 3 seconds...<br><span class="text-xs text-gray-500 mt-2 block">Ref: ${result.reference}</span>`;
                paymentMessage.classList.add('border-emerald-DEFAULT/30', 'bg-emerald-DEFAULT/10', 'text-emerald-DEFAULT', 'block');
                paymentMessage.classList.remove('hidden');

                // Redirect to payment gateway
                setTimeout(() => { window.location.href = result.paymentUrl; }, 3000);
            } else {
                throw new Error(result.error || 'Server error');
            }
        } catch (error) {
            paymentMessage.textContent = error.message;
            paymentMessage.classList.add('border-red-500/30', 'bg-red-500/10', 'text-red-400', 'block');
            paymentMessage.classList.remove('hidden');
        }
        
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        submitBtn.innerHTML = 'Proceed to Encrypted Payment';
    });

    // Hero paragraph is static — TextScramble removed for immediate legibility.

    // --- Stat Count Up Animation ---
    const stats = document.querySelectorAll('.stat-reveal');
    const animateStats = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = target.innerText;
                if (endValue.includes('%') || endValue.includes('h')) {
                    let count = 0;
                    const suffix = endValue.replace(/[0-9]/g, '');
                    const finalNum = parseInt(endValue);
                    const duration = 2000;
                    const startTime = performance.now();

                    const updateCount = (now) => {
                        const progress = Math.min((now - startTime) / duration, 1);
                        const current = Math.floor(progress * finalNum);
                        target.innerText = current + suffix;
                        if (progress < 1) requestAnimationFrame(updateCount);
                    };
                    requestAnimationFrame(updateCount);
                }
                observer.unobserve(target);
            }
        });
    };
    const statsObserver = new IntersectionObserver(animateStats, { threshold: 0.5 });
    stats.forEach(stat => statsObserver.observe(stat));

    // --- Mesh Gradient background on hero ---
    const hero = document.getElementById('hero');
    if (hero) hero.classList.add('mesh-gradient');

    // --- Initialize Data ---
    renderServices();

    // --- Theme Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    if (themeToggle) {
        // Unchecked = Dark Mode (default). Checked = Light Mode.
        themeToggle.checked = !htmlElement.classList.contains('dark');
        
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                htmlElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                htmlElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});