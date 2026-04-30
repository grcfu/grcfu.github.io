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
    // HERO — CINEMATIC ENTRANCE
    // ============================================
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const heroBanner    = heroSection.querySelector('.hero-banner');
        const heroPaints    = heroSection.querySelectorAll('.hero-paint');
        const heroCollages  = heroSection.querySelectorAll('.collage');
        const heroSpotify   = heroSection.querySelector('.spotify-widget');
        const heroScrollHint = heroSection.querySelector('.scroll-hint');

        // 100ms — paint blobs fade in (1.2s; 100ms head start so the
        //         atmosphere is already settling when the image appears).
        setTimeout(() => {
            heroPaints.forEach(p => p.classList.add('is-visible'));
        }, 100);

        // 200ms — banner image fades + scales (1.0s, cinematic ease).
        setTimeout(() => {
            if (heroBanner) heroBanner.classList.add('is-visible');
        }, 200);

        // 600ms — Spotify widget fades in (0.4s).
        setTimeout(() => {
            if (heroSpotify) heroSpotify.classList.add('is-visible');
        }, 600);

        // 800ms — washi tape & SVG corner decorations fade in (0.6s),
        //         appearing after the image has mostly settled.
        setTimeout(() => {
            heroCollages.forEach(c => c.classList.add('is-visible'));
        }, 800);

        // 1000ms — scroll hint fades in (0.4s) then continues its bounce.
        setTimeout(() => {
            if (heroScrollHint) heroScrollHint.classList.add('is-visible');
        }, 1000);
    }

    // ============================================
    // INK TRAIL CURSOR
    // ============================================
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    if (supportsHover) {
        let lastInkTime = 0;

        document.addEventListener('mousemove', (e) => {
            const now = performance.now();
            if (now - lastInkTime < 30) return;
            lastInkTime = now;

            const dot = document.createElement('span');
            dot.className = 'ink-dot';
            const size = 4 + Math.random() * 6;
            dot.style.width = size + 'px';
            dot.style.height = size + 'px';
            dot.style.left = (e.clientX - size / 2) + 'px';
            dot.style.top = (e.clientY - size / 2) + 'px';
            document.body.appendChild(dot);

            // Trigger fade on next frame
            requestAnimationFrame(() => dot.classList.add('fade'));

            // Remove from DOM after fade (600ms + buffer)
            setTimeout(() => {
                if (dot.parentNode) dot.parentNode.removeChild(dot);
            }, 700);
        }, { passive: true });
    }

    // ============================================
    // SPOTIFY WIDGET
    // ============================================
    const spotifyBtn = document.getElementById('spotifyBtn');
    const spotifyPlayer = document.getElementById('spotifyPlayer');
    const spotifyClose = document.getElementById('spotifyClose');
    const spotifyBtnText = spotifyBtn?.querySelector('.spotify-btn-text');

    if (spotifyBtn && spotifyPlayer && spotifyClose) {
        function togglePlayer(open) {
            if (open) {
                spotifyPlayer.classList.add('open');
                spotifyBtnText.textContent = 'now playing \u266A';
            } else {
                spotifyPlayer.classList.remove('open');
                spotifyBtnText.textContent = 'play my fav song';
            }
        }

        spotifyBtn.addEventListener('click', () => {
            togglePlayer(!spotifyPlayer.classList.contains('open'));
        });

        spotifyClose.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlayer(false);
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
        '.project-card'
    );

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // ============================================
    // ABOUT SECTION — SVG PATH DRAW + FADE-INS
    // ============================================
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        const fadeEls = aboutSection.querySelectorAll('.about-fade');

        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger the entrance via per-element transition-delay
                    // values defined in CSS — JS just adds the trigger class.
                    fadeEls.forEach(el => el.classList.add('visible'));
                    aboutObserver.unobserve(aboutSection);
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0.15 });
        aboutObserver.observe(aboutSection);
    }

    // ============================================
    // SKILLS — BAG CLICK TO OPEN
    // ============================================
    const bagImg = document.getElementById('bagImg');
    const bagCanvas = document.querySelector('.bag-canvas');

    if (bagImg && bagCanvas) {
        const allBlobs = bagCanvas.querySelectorAll('.skill-blob');
        const allCatLabels = bagCanvas.querySelectorAll('.cat-label');

        // Start bag in resting wobble state
        bagImg.classList.add('is-wobbling');

        // Hover: swap wobble for urgent shake — only while bag is closed
        bagImg.addEventListener('mouseenter', () => {
            if (bagCanvas.classList.contains('opened')) return;
            bagImg.classList.remove('is-wobbling');
            bagImg.classList.add('is-shaking');
        });

        bagImg.addEventListener('mouseleave', () => {
            bagImg.classList.remove('is-shaking');
            if (!bagCanvas.classList.contains('opened')) {
                bagImg.classList.add('is-wobbling');
            }
        });

        bagImg.addEventListener('click', () => {
            const isOpening = !bagCanvas.classList.contains('opened');

            if (isOpening) {
                bagCanvas.classList.add('opened');
                // Stop any animation — bag is open now
                bagImg.classList.remove('is-wobbling', 'is-shaking');
                allBlobs.forEach(b => b.classList.remove('was-open'));
            } else {
                bagCanvas.classList.remove('opened');
                // Restore wobble — bag is closed again
                bagImg.classList.add('is-wobbling');
                allBlobs.forEach(b => b.classList.add('was-open'));
                allCatLabels.forEach(l => l.style.opacity = '0');
            }
        });

        // Skill blob tooltips
        const skillDescriptions = {
            'Python': 'My go-to for ML, scripting, and backend work',
            'React.js': 'Building interactive UIs and SPAs',
            'Next.js': 'Full-stack React with SSR',
            'FastAPI': 'Async Python APIs, fast and clean',
            'Swift/SwiftUI': 'Native iOS development',
            'JavaScript': 'The language of the web',
            'HTML/CSS': 'Semantic markup + styled layouts',
            'React Native': 'Cross-platform mobile apps',
            'p5.js': 'Creative coding and visual sketches',
            'PyTorch': 'Deep learning research and models',
            'TensorFlow': 'Production ML pipelines',
            'Scikit-learn': 'Classical ML and data analysis',
            'Pandas': 'Data wrangling and exploration',
            'NumPy': 'Numerical computing foundations',
            'Supabase': 'Open-source Firebase alternative',
            'PostgreSQL': 'Relational database design',
            'GitHub': 'Version control and collaboration',
            'Firebase': 'Real-time databases and auth',
            'Tailwind CSS': 'Utility-first styling',
            'Figma': 'UI/UX design and prototyping',
            'Vercel': 'Deploy and ship fast'
        };

        let activeTooltip = null;

        // Wrap each blob's text in a .blob-inner span so the hover wiggle
        // transform doesn't conflict with the positioning transform.
        // Store skill name on dataset so tooltip lookup stays clean.
        bagCanvas.querySelectorAll('.skill-blob').forEach(blob => {
            blob.style.cursor = 'pointer';
            const name = blob.textContent.trim();
            blob.dataset.name = name;
            const inner = document.createElement('span');
            inner.className = 'blob-inner';
            inner.textContent = name;
            blob.textContent = '';
            blob.appendChild(inner);

            blob.addEventListener('click', (e) => {
                e.stopPropagation();
                if (activeTooltip) activeTooltip.remove();

                const desc = skillDescriptions[blob.dataset.name];
                if (!desc) return;

                const tip = document.createElement('div');
                tip.className = 'skill-tooltip';
                tip.textContent = desc;
                blob.appendChild(tip);
                activeTooltip = tip;

                setTimeout(() => tip.classList.add('visible'), 10);
            });
        });

        document.addEventListener('click', () => {
            if (activeTooltip) {
                activeTooltip.remove();
                activeTooltip = null;
            }
        });

        // Magnetic hover effect — blobs pull toward cursor
        bagCanvas.addEventListener('mousemove', (e) => {
            if (!bagCanvas.classList.contains('opened')) return;

            const canvasRect = bagCanvas.getBoundingClientRect();
            const mouseX = e.clientX - canvasRect.left;
            const mouseY = e.clientY - canvasRect.top;

            allBlobs.forEach(blob => {
                const blobRect = blob.getBoundingClientRect();
                const blobCenterX = blobRect.left + blobRect.width / 2 - canvasRect.left;
                const blobCenterY = blobRect.top + blobRect.height / 2 - canvasRect.top;

                const dx = mouseX - blobCenterX;
                const dy = mouseY - blobCenterY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 80) {
                    const strength = (1 - distance / 80) * 8;
                    const nudgeX = (dx / distance) * strength;
                    const nudgeY = (dy / distance) * strength;
                    const style = getComputedStyle(blob);
                    const x = style.getPropertyValue('--x').trim();
                    const y = style.getPropertyValue('--y').trim();
                    const r = style.getPropertyValue('--r').trim();
                    blob.style.transform = `translate(calc(-50% + ${x} + ${nudgeX}px), calc(-50% + ${y} + ${nudgeY}px)) scale(1.08) rotate(${r})`;
                } else {
                    blob.style.transform = '';
                }
            });
        });

        bagCanvas.addEventListener('mouseleave', () => {
            allBlobs.forEach(blob => {
                blob.style.transform = '';
            });
        });
    }

    // Observe the contact section — slide text in/out as user scrolls to/from it
    const contactSection = document.querySelector('.contact');
    if (contactSection) {
        const cornerTop = contactSection.querySelector('.contact-corner-top');
        const cornerBottom = contactSection.querySelector('.contact-corner-bottom');
        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    cornerTop?.classList.add('visible');
                    cornerBottom?.classList.add('visible');
                } else {
                    cornerTop?.classList.remove('visible');
                    cornerBottom?.classList.remove('visible');
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0.2 });
        contactObserver.observe(contactSection);
    }

    // ============================================
    // EXPERIENCE — BOTANICAL VINE TIMELINE
    // ============================================
    const vineSection = document.getElementById('experience');
    if (vineSection && vineSection.classList.contains('vine-section')) {
        // Each entry's `trigger` is the vine-progress fraction (0–1) at
        // which its flower should bloom and its card should slide in.
        // Order matches data-idx in the HTML.
        const EXPERIENCES = [
            { id: 'google',   trigger: 0.10  },
            { id: 'teach',    trigger: 0.245 },
            { id: 'research', trigger: 0.395 },
            { id: 'ameri',    trigger: 0.535 },
            { id: 'slu',      trigger: 0.69  },
            { id: 'boa',      trigger: 0.84  }
        ];

        const vineMain = document.getElementById('vineMain');
        const branches = vineSection.querySelectorAll('.vine-branch');
        const flowers  = vineSection.querySelectorAll('.vine-flower');
        const cards    = vineSection.querySelectorAll('.vine-card');
        const sprouts  = vineSection.querySelectorAll('.vine-sprout');
        const vineIsMobile = window.matchMedia('(max-width: 768px)').matches;
        const vineReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // ---- Dynamic flower + card positioning ----
        // The vine SVG uses preserveAspectRatio="xMidYMid meet", which means
        // its content can be letterboxed inside the section depending on
        // viewport aspect. Hardcoded percentage positions for flowers drift
        // off-target. Instead we compute each branch's actual rendered
        // endpoint in section pixels and pin the flower SVG there.
        function positionFlowers() {
            const sectionRect = vineSection.getBoundingClientRect();
            branches.forEach((branch, i) => {
                if (!flowers[i]) return;
                try {
                    const pathLen = branch.getTotalLength();
                    const endPoint = branch.getPointAtLength(pathLen);
                    const svgEl = branch.closest('svg');
                    const svgRect = svgEl.getBoundingClientRect();
                    const viewBox = svgEl.viewBox.baseVal;
                    const scaleX = svgRect.width / viewBox.width;
                    const scaleY = svgRect.height / viewBox.height;
                    const pixelX = (svgRect.left - sectionRect.left) + endPoint.x * scaleX;
                    const pixelY = (svgRect.top - sectionRect.top) + endPoint.y * scaleY;
                    flowers[i].style.left = pixelX + 'px';
                    flowers[i].style.top = pixelY + 'px';
                    flowers[i].style.transform = 'translate(-50%, -50%)';
                } catch (e) {
                    console.warn('positionFlowers idx', i, e);
                }
            });
        }

        function positionCards() {
            flowers.forEach((flower, i) => {
                if (!cards[i]) return;
                const flowerLeft = parseFloat(flower.style.left) || 0;
                const flowerTop = parseFloat(flower.style.top) || 0;
                cards[i].style.top = (flowerTop - 30) + 'px';
                cards[i].style.left = (flowerLeft + 45) + 'px';
            });
        }

        function repositionAll() {
            positionFlowers();
            positionCards();
        }

        // Run once on init, again on window.load (after fonts/images shift
        // layout), and on resize with a 200ms debounce so the layout
        // continuously stays correct as the viewport changes.
        repositionAll();
        window.addEventListener('load', repositionAll);

        let _vineResizeTimer = null;
        window.addEventListener('resize', () => {
            if (_vineResizeTimer) clearTimeout(_vineResizeTimer);
            _vineResizeTimer = setTimeout(repositionAll, 200);
        }, { passive: true });

        // Compute the actual stroke length so dashoffset can mask it cleanly.
        let vineLength = 1000;
        if (vineMain && typeof vineMain.getTotalLength === 'function') {
            try {
                vineLength = vineMain.getTotalLength() || 1000;
                vineMain.style.strokeDasharray = vineLength;
                vineMain.style.strokeDashoffset = vineLength;
            } catch (_) { /* fallback dasharray already set in CSS */ }
        }

        function bloom(idx) {
            if (flowers[idx]) flowers[idx].classList.add('is-bloomed');
            if (cards[idx])   cards[idx].classList.add('is-bloomed');
            if (branches[idx]) branches[idx].classList.add('is-drawn');
        }

        if (vineIsMobile) {
            // Vine is hidden on mobile — fade cards in as they enter.
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-bloomed');
                        cardObserver.unobserve(entry.target);
                    }
                });
            }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
            cards.forEach(c => cardObserver.observe(c));
        } else if (vineReducedMotion) {
            // Skip motion: reveal everything immediately.
            EXPERIENCES.forEach((_, i) => bloom(i));
            sprouts.forEach(s => s.classList.add('is-shown'));
        } else {
            // Scroll-driven vine growth — rAF-throttled for smoothness.
            let vineTicking = false;

            function updateVine() {
                const rect = vineSection.getBoundingClientRect();
                const sectionH = rect.height || 1;
                const viewportH = window.innerHeight || 1;
                // Map scroll-within-section to 0–1:
                //   section top hits viewport top → 0
                //   section bottom hits viewport bottom → 1
                const range = Math.max(1, sectionH - viewportH);
                let progress = -rect.top / range;
                if (progress < 0) progress = 0;
                else if (progress > 1) progress = 1;

                if (vineMain) {
                    vineMain.style.strokeDashoffset = vineLength * (1 - progress);
                }

                EXPERIENCES.forEach((exp, i) => {
                    if (progress >= exp.trigger
                        && flowers[i]
                        && !flowers[i].classList.contains('is-bloomed')) {
                        bloom(i);
                    }
                });

                sprouts.forEach(sprout => {
                    const t = parseFloat(sprout.dataset.trigger || '0');
                    if (progress >= t) sprout.classList.add('is-shown');
                });

                vineTicking = false;
            }

            function onVineScroll() {
                if (!vineTicking) {
                    window.requestAnimationFrame(updateVine);
                    vineTicking = true;
                }
            }

            window.addEventListener('scroll', onVineScroll, { passive: true });
            window.addEventListener('resize', onVineScroll, { passive: true });
            // Initial paint in case the section is already in view.
            updateVine();

            // Belt-and-suspenders: as soon as the section enters the
            // viewport, bloom any flower that scroll progress hasn't yet
            // covered. Guarantees flowers are visible even if the scroll
            // math under-shoots their trigger (short section, fast scroll,
            // anchor jump, etc.). The 150ms-per-flower stagger preserves
            // the sequential opening feel.
            const bloomFallback = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    EXPERIENCES.forEach((_, i) => {
                        if (flowers[i] && !flowers[i].classList.contains('is-bloomed')) {
                            setTimeout(() => bloom(i), i * 150);
                        }
                    });
                    sprouts.forEach(s => s.classList.add('is-shown'));
                    bloomFallback.disconnect();
                });
            }, { threshold: 0.1 });
            bloomFallback.observe(vineSection);
        }
    }

    // ============================================
    // RECOGNITION — POLAROID CORKBOARD
    // ============================================
    const recognitionSection = document.getElementById('recognition');
    if (recognitionSection) {
        const polaroids = recognitionSection.querySelectorAll('.polaroid');
        const corkIsTouch = window.matchMedia('(hover: none)').matches;

        // Reveal on scroll-in (one-shot). Triggers the staggered drop-in
        // animation defined in CSS via per-data-idx transition-delay.
        const corkObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    recognitionSection.classList.add('is-revealed');
                    corkObserver.unobserve(recognitionSection);
                }
            });
        }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.15 });
        corkObserver.observe(recognitionSection);

        if (!corkIsTouch) {
            // Hover z-index boost — JS-driven so the lifted polaroid sits
            // cleanly above its neighbors without transition-driven stacking
            // glitches on fast mouse traversal between polaroids.
            polaroids.forEach(polaroid => {
                polaroid.addEventListener('mouseenter', () => {
                    polaroid.style.zIndex = '100';
                });
                polaroid.addEventListener('mouseleave', () => {
                    polaroid.style.zIndex = '';
                });
            });
        } else {
            // Touch — tap toggles is-active; tap outside dismisses.
            // The same z-index boost applies while a polaroid is active.
            let activePolaroid = null;

            function deactivate(p) {
                if (!p) return;
                p.classList.remove('is-active');
                p.style.zIndex = '';
            }

            polaroids.forEach(polaroid => {
                polaroid.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (activePolaroid === polaroid) {
                        deactivate(polaroid);
                        activePolaroid = null;
                        return;
                    }
                    deactivate(activePolaroid);
                    polaroid.classList.add('is-active');
                    polaroid.style.zIndex = '100';
                    activePolaroid = polaroid;
                });
            });

            document.addEventListener('click', () => {
                if (activePolaroid) {
                    deactivate(activePolaroid);
                    activePolaroid = null;
                }
            });
        }
    }

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

            githubGrid.innerHTML = repos.map((repo, index) => {
                const langColor = langColors[repo.language] || '#8b949e';
                const description = repo.description || 'No description available';
                const leaf = (index % 6) + 1;

                return `
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="github-card" data-leaf="${leaf}">
                        <h4>${repo.name}</h4>
                        <span class="github-rule" aria-hidden="true"></span>
                        <p>${description}</p>
                        <div class="github-meta">
                            ${repo.language ? `
                                <span class="github-lang" style="border-left: 3px solid ${langColor}">
                                    ${repo.language}
                                </span>
                            ` : ''}
                            <span class="github-stars">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                ${repo.stargazers_count}
                            </span>
                        </div>
                    </a>
                `;
            }).join('');

            // Staggered scroll-in: each leaf "falls" into place 80ms after
            // the previous. One-shot — observer disconnects after firing.
            const cards = githubGrid.querySelectorAll('.github-card');
            const leafObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    cards.forEach((card, i) => {
                        setTimeout(() => card.classList.add('is-visible'), i * 80);
                    });
                    leafObserver.disconnect();
                });
            }, { threshold: 0.15 });
            leafObserver.observe(githubGrid);

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
    // GITHUB CONTRIBUTIONS HEATMAP
    // ============================================
    const heatmapGrid = document.getElementById('heatmapGrid');
    const heatmapStats = document.getElementById('heatmapStats');
    const heatmapSection = document.getElementById('heatmapSection');

    async function fetchGitHubContributions() {
        if (!heatmapGrid) return;

        try {
            const response = await fetch('https://github-contributions-api.jogruber.de/v4/grcfu?y=last');
            if (!response.ok) throw new Error('Failed to fetch contributions');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('GitHub contributions API error:', error);
            return null;
        }
    }

    function computeStats(contributions) {
        const total = contributions.reduce((sum, d) => sum + d.count, 0);
        let longestStreak = 0;
        let currentStreak = 0;
        contributions.forEach(d => {
            if (d.count > 0) {
                currentStreak++;
                longestStreak = Math.max(longestStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        });
        return { total, longestStreak };
    }

    function formatDate(isoDate) {
        const d = new Date(isoDate + 'T00:00:00');
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function renderHeatmap(data) {
        if (!data || !data.contributions) return false;

        const contributions = data.contributions;
        const { total } = computeStats(contributions);

        if (heatmapStats) {
            heatmapStats.textContent = `${total.toLocaleString()} contributions this year`;
        }

        // Build grid — 52 weeks x 7 days, column by column
        // First, pad the start so week 1 starts on the right day-of-week
        const firstDate = new Date(contributions[0].date + 'T00:00:00');
        const firstDayOfWeek = firstDate.getDay();

        heatmapGrid.innerHTML = '';
        heatmapGrid.style.gridTemplateColumns = `repeat(53, 1fr)`;

        // Empty leading cells for alignment
        for (let i = 0; i < firstDayOfWeek; i++) {
            const filler = document.createElement('div');
            filler.className = 'heatmap-cell heatmap-level-0 heatmap-cell-filler';
            filler.style.visibility = 'hidden';
            heatmapGrid.appendChild(filler);
        }

        // Determine cutoff for mobile (show only last 26 weeks = 182 days)
        const mobileCutoffIndex = Math.max(0, contributions.length - 182);

        contributions.forEach((day, i) => {
            const cell = document.createElement('div');
            const level = Math.min(day.level !== undefined ? day.level : 0, 4);
            cell.className = `heatmap-cell heatmap-level-${level}`;
            cell.setAttribute('data-tooltip', `${formatDate(day.date)}: ${day.count} ${day.count === 1 ? 'contribution' : 'contributions'}`);
            cell.dataset.column = Math.floor((i + firstDayOfWeek) / 7);
            if (i < mobileCutoffIndex) {
                cell.classList.add('heatmap-cell-hidden');
            }
            heatmapGrid.appendChild(cell);
        });

        return true;
    }

    function animateHeatmap() {
        const cells = heatmapGrid.querySelectorAll('.heatmap-cell:not(.heatmap-cell-filler)');
        cells.forEach(cell => {
            const col = parseInt(cell.dataset.column || '0', 10);
            const delay = col * 18;
            setTimeout(() => {
                cell.style.opacity = '1';
                cell.style.transform = 'scale(1)';
            }, delay);
        });
    }

    function showHeatmapError() {
        if (heatmapStats) heatmapStats.textContent = '';
        heatmapGrid.innerHTML = `
            <div class="heatmap-loading">
                Couldn't load activity right now — <a href="https://github.com/grcfu" target="_blank" rel="noopener noreferrer">visit github.com/grcfu</a> to see my commits!
            </div>
        `;
    }

    async function initHeatmap() {
        if (!heatmapGrid || !heatmapSection) return;

        const data = await fetchGitHubContributions();
        const rendered = renderHeatmap(data);
        if (!rendered) {
            showHeatmapError();
            return;
        }

        // Trigger column-by-column reveal when scrolled into view
        const heatmapObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateHeatmap();
                    heatmapObserver.unobserve(heatmapSection);
                }
            });
        }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

        heatmapObserver.observe(heatmapSection);
    }

    initHeatmap();

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
