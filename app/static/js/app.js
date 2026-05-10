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
        { id: 'company_reg', name: 'Company Registration' },
        { id: 'zimra_tax', name: 'ZIMRA Tax Clearance (ITF263)' },
        { id: 'praz_tender', name: 'PRAZ Tender Registration' },
        { id: 'shop_license', name: 'Shop Licensing Harare' },
        { id: 'bookkeeping', name: 'Professional Bookkeeping' },
        { id: 'trade_marks', name: 'Trademarks & IP' }
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

    let visibleCount = 3;

    const renderServices = () => {
        servicesGrid.innerHTML = '';
        
        services.slice(0, visibleCount).forEach((service, index) => {
            const mtClass = index % 2 !== 0 ? 'lg:mt-12' : '';
            
            const div = document.createElement('div');
            div.className = `bg-navy-900/50 backdrop-blur-sm p-10 rounded-none border-l-2 border-transparent hover:border-gold-DEFAULT transition-all shadow-lg group cursor-pointer ${mtClass} reveal`;
            div.innerHTML = `
                <div class="text-gold-DEFAULT/20 text-5xl font-heading mb-4 group-hover:text-gold-DEFAULT/40 transition-colors">0${index + 1}</div>
                <h3 class="text-2xl font-heading font-bold mb-4 text-white group-hover:text-gold-light transition-colors">${service.name}</h3>
                <p class="text-gray-400 mb-8 font-light leading-relaxed">Expert administration and legal filing to ensure complete compliance.</p>
                <div class="flex justify-between items-center border-t border-white/5 pt-6 text-gold-DEFAULT">
                    <span class="text-sm font-bold uppercase tracking-wider group-hover:text-gold-light transition-colors">Request Info</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            `;
            
            div.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            div.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
            
            servicesGrid.appendChild(div);
        });

        if (visibleCount < services.length) {
            servicesGrid.appendChild(seeMoreContainer);
        }
        
        // Refresh reveal elements and trigger animation
        updateReveals();
        revealOnScroll();
    };

    // Initial call moved to the end to ensure all functions are defined

    seeMoreBtn.addEventListener('click', () => {
        visibleCount = services.length;
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
                paymentMessage.innerHTML = `Success! Redirecting to secure gateway...<br><span class="text-xs text-gray-500 mt-2 block">Ref: ${result.reference}</span>`;
                paymentMessage.classList.add('border-emerald-DEFAULT/30', 'bg-emerald-DEFAULT/10', 'text-emerald-DEFAULT', 'block');
                paymentMessage.classList.remove('hidden');
                
                // Optional: redirect to result.paymentUrl
                // setTimeout(() => window.location.href = result.paymentUrl, 2000);
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

    // --- Liveness: Text Scramble Effect ---
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="opacity-50 text-gold-DEFAULT">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    const heroSub = document.querySelector('#hero p');
    if (heroSub) {
        const scrambler = new TextScramble(heroSub);
        setTimeout(() => scrambler.setText('We simplify company registration, ZIMRA tax clearances, and PRAZ tender compliance so you can operate with absolute legal confidence.'), 1500);
    }

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
});