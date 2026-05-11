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
    seeMoreBtn.className = 'border border-gold text-gold px-8 py-3 rounded-md font-bold hover:bg-gold/10 transition-colors duration-200 cursor-pointer';
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
        div.className = `bg-white dark:bg-transparent border border-gray-100 dark:border-gold/10 border-l-2 p-10 rounded-none transition-all duration-300 group cursor-pointer ${mtClass} reveal`;
        div.style.cssText = 'border-left-color: transparent;';
        div.addEventListener('mouseenter', () => {
            div.style.borderLeftColor = '#D4AF37';
            cursor.classList.add('hover');
        });
        div.addEventListener('mouseleave', () => {
            div.style.borderLeftColor = 'transparent';
            cursor.classList.remove('hover');
        });
        div.innerHTML = `
            <div class="text-gold/30 text-5xl font-heading mb-4 group-hover:text-gold transition-colors">0${index + 1}</div>
            <h3 class="text-2xl font-heading font-bold mb-4 text-navy-900 dark:text-white group-hover:text-gold transition-colors">${service.name}</h3>
            <p class="text-slate-600 dark:text-slate-300 mb-8 font-light leading-relaxed">${service.description}</p>
            <div class="flex justify-between items-center border-t border-gray-100 dark:border-gold/10 pt-6 text-gold">
                <span class="text-sm font-bold uppercase tracking-wider group-hover:text-navy-900 dark:group-hover:text-white transition-colors">Request Info</span>
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
            link.classList.remove('text-gold');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('text-gold');
            }
        });
    });

    // --- Handle Form Submission (WhatsApp Integration) ---
    const checkoutForm = document.getElementById('checkout-form');
    const submitBtn = document.getElementById('submit-btn');
    const paymentMessage = document.getElementById('payment-message');

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        submitBtn.innerHTML = 'Processing Securely...';
        
        paymentMessage.classList.add('hidden');
        paymentMessage.className = 'mt-4 p-4 rounded-md text-center font-medium border'; // Reset classes
        
        const serviceSelect = document.getElementById('service-select');
        const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
        const fullName = document.getElementById('full-name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;

        const message = `Hello No Vanity Consultancy, I would like to inquire about your services.\n\n*Service*: ${serviceName}\n*Name*: ${fullName}\n*Phone*: ${phone}\n*Email*: ${email}\n\nPlease let me know the next steps.`;
        
        const whatsappNumber = "263785029078";
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        paymentMessage.innerHTML = `✅ Submission received! Redirecting to our official WhatsApp portal...`;
        paymentMessage.classList.remove('hidden');
        paymentMessage.classList.add('border-emerald/30', 'bg-emerald/10', 'text-emerald', 'block');

        // Redirect to WhatsApp gateway
        setTimeout(() => { 
            window.location.href = whatsappUrl; 
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            submitBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                </svg>
                Continue on WhatsApp
            `;
        }, 1500);
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
