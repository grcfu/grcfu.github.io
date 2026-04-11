/**
 * GRACE FU PORTFOLIO - SCRIPT
 * All interactivity and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // UTILITIES
    // ============================================
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ============================================
    // INITIALIZE
    // ============================================

    // Add loaded class for page load animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // ============================================
    // CUSTOM CURSOR
    // ============================================
    const customCursor = document.getElementById('customCursor');
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    if (customCursor && !isTouchDevice) {
        let cursorX = 0;
        let cursorY = 0;
        let currentX = 0;
        let currentY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });

        // Smooth cursor follow
        function animateCursor() {
            const dx = cursorX - currentX;
            const dy = cursorY - currentY;

            currentX += dx * 0.15;
            currentY += dy * 0.15;

            customCursor.style.left = `${currentX}px`;
            customCursor.style.top = `${currentY}px`;

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        // Hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .experience-card, .stat-card, .award-card, .skill-pill, .filter-btn');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                customCursor.classList.add('hover');
            });

            el.addEventListener('mouseleave', () => {
                customCursor.classList.remove('hover');
            });
        });
    }

    // ============================================
    // NAVBAR SCROLL BEHAVIOR
    // ============================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    function handleNavbarScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 80) {
            navbar.classList.add('visible');
        } else {
            navbar.classList.remove('visible');
        }
    }

    // Mobile nav toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Animate hamburger
            const spans = navToggle.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile nav when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // ============================================
    // BACK TO TOP BUTTON
    // ============================================
    const backToTop = document.getElementById('backToTop');

    function handleBackToTopScroll() {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // COMBINED THROTTLED SCROLL HANDLER
    // ============================================
    const throttledScroll = throttle(() => {
        handleNavbarScroll();
        if (backToTop) handleBackToTopScroll();
    }, 16); // ~60fps

    window.addEventListener('scroll', throttledScroll, { passive: true });

    // ============================================
    // HERO PARALLAX EFFECT
    // ============================================
    const heroName = document.querySelector('.hero-name');

    if (heroName) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const parallaxOffset = scrollY * 0.6;
            heroName.style.transform = `translateY(${parallaxOffset}px)`;
        }, { passive: true });
    }

    // ============================================
    // INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll(
        '.stat-card, .experience-card, .project-card, .skill-group, .award-card, .contact-headline, .contact-subtext, .contact-links'
    );

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // ============================================
    // EXPERIENCE ACCORDION (MOBILE)
    // ============================================
    const experienceCards = document.querySelectorAll('.experience-card');

    function setupAccordion(isMobile) {
        experienceCards.forEach(card => {
            const header = card.querySelector('.experience-header');
            if (!header) return;

            // Remove old listener by cloning
            const newHeader = header.cloneNode(true);
            header.parentNode.replaceChild(newHeader, header);

            if (isMobile) {
                card.classList.remove('expanded');
                newHeader.addEventListener('click', () => {
                    experienceCards.forEach(otherCard => {
                        if (otherCard !== card) {
                            otherCard.classList.remove('expanded');
                        }
                    });
                    card.classList.toggle('expanded');
                });
            } else {
                card.classList.remove('expanded');
            }
        });
    }

    const mobileQuery = window.matchMedia('(max-width: 768px)');
    setupAccordion(mobileQuery.matches);
    mobileQuery.addEventListener('change', (e) => {
        setupAccordion(e.matches);
    });

    // ============================================
    // PROJECT FILTER
    // ============================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const filterTimeouts = new Map();

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            // Clear any pending hide timeouts
            filterTimeouts.forEach(timeout => clearTimeout(timeout));
            filterTimeouts.clear();

            // Filter cards with animation
            projectCards.forEach(card => {
                const tags = card.dataset.tags;

                if (filter === 'all' || tags.includes(filter)) {
                    card.classList.remove('hidden', 'fade-out');
                } else {
                    card.classList.add('fade-out');
                    const timeout = setTimeout(() => {
                        card.classList.add('hidden');
                        filterTimeouts.delete(card);
                    }, 300);
                    filterTimeouts.set(card, timeout);
                }
            });
        });
    });

    // ============================================
    // GITHUB API FETCH
    // ============================================
    const githubGrid = document.getElementById('githubGrid');

    async function fetchGitHubRepos() {
        if (!githubGrid) return;

        try {
            const response = await fetch('https://api.github.com/users/grcfu/repos?sort=updated&per_page=6');

            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }

            const repos = await response.json();

            if (repos.length === 0) {
                githubGrid.innerHTML = '<div class="github-error">No public repositories found.</div>';
                return;
            }

            // Language colors
            const langColors = {
                'JavaScript': '#f1e05a',
                'TypeScript': '#2b7489',
                'Python': '#3572A5',
                'Swift': '#ffac45',
                'HTML': '#e34c26',
                'CSS': '#563d7c',
                'Java': '#b07219',
                'C++': '#f34b7d',
                'C': '#555555',
                'Go': '#00ADD8',
                'Rust': '#dea584',
                'Ruby': '#701516',
                'PHP': '#4F5D95'
            };

            githubGrid.innerHTML = repos.map(repo => {
                const langColor = langColors[repo.language] || '#8b949e';
                const description = repo.description || 'No description available';

                return `
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="github-card">
                        <h4>${repo.name}</h4>
                        <p>${description}</p>
                        <div class="github-meta">
                            ${repo.language ? `
                                <span class="github-lang" style="border-left: 3px solid ${langColor}">
                                    ${repo.language}
                                </span>
                            ` : ''}
                            <span class="github-stars">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                ${repo.stargazers_count}
                            </span>
                        </div>
                    </a>
                `;
            }).join('');

        } catch (error) {
            console.error('GitHub API error:', error);
            githubGrid.innerHTML = `
                <div class="github-error">
                    Couldn't load repos right now — <a href="https://github.com/grcfu" target="_blank" rel="noopener noreferrer">visit github.com/grcfu</a> to see my work!
                </div>
            `;
        }
    }

    fetchGitHubRepos();

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // CONSOLE EASTER EGG
    // ============================================
    console.log('%c Hi there, recruiter!', 'font-size: 20px; font-weight: bold; color: #B8D8E8;');
    console.log('%cThanks for checking out my portfolio. I built this with vanilla HTML, CSS, and JS — no frameworks needed when you know the fundamentals!', 'font-size: 14px; color: #4A4A5E;');
    console.log('%cWant to see more? Visit https://github.com/grcfu', 'font-size: 12px; color: #7A7A8E;');
});
