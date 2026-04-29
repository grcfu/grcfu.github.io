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
        const pathSvg = aboutSection.querySelector('.about-path-svg');
        const fadeEls = aboutSection.querySelectorAll('.about-fade');

        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Draw the SVG path
                    if (pathSvg) pathSvg.classList.add('drawn');
                    // Fade in text and photos with their individual delays
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
    // EXPERIENCE — THE ARTIST PALETTE
    // ============================================
    const paletteSection = document.getElementById('experience');
    if (paletteSection && paletteSection.classList.contains('palette-section')) {
        // Scroll-in: trigger palette/blob/smear/brush entrance animations once
        const paletteObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    paletteSection.classList.add('is-visible');
                    paletteObserver.unobserve(paletteSection);
                }
            });
        }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
        paletteObserver.observe(paletteSection);

        // ---- Blob → canvas paint-in state machine ----
        const blobs = paletteSection.querySelectorAll('.paint-blob');
        const canvasActive = document.getElementById('canvasActive');
        const canvasDefault = document.getElementById('canvasDefault');
        const paletteIsTouch = window.matchMedia('(hover: none)').matches;
        const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const CANVAS_PROMPT = hoverCapable
            ? 'hover a color to learn more —'
            : 'tap a color to learn more —';

        const canvasPromptEl = canvasDefault && canvasDefault.querySelector('.canvas-prompt');
        if (canvasPromptEl) canvasPromptEl.textContent = CANVAS_PROMPT;

        // Experience data, keyed by data-blob id on each paint-blob
        const EXPERIENCES = {
            google: {
                cat:     'TECHNOLOGY',
                role:    'PM Lead & AI/ML Software Engineer',
                company: 'Google Developers Group',
                date:    'Sep 2025 — Present',
                desc:    'Leading a team of 5 building healthxr.ai; architected HIPAA-compliant data pipelines and patient privacy frameworks.',
                color:   '#F4C9D6'
            },
            teach: {
                cat:     'EDUCATION',
                role:    'Teaching Assistant & Grading Lead',
                company: 'WashU CSE 2407',
                date:    'Jan 2026 — Present',
                desc:    'Manages grading for 200+ students; provides weekly mentorship in lab sessions.',
                color:   '#E8A6B8'
            },
            research: {
                cat:     'RESEARCH',
                role:    'AI & ML Research Assistant',
                company: 'WashU McKelvey School',
                date:    'May 2025 — Present',
                desc:    'Building ML pipeline in PyTorch and Scikit-learn to improve Child Protective Services investigation prioritization.',
                color:   '#B8A998'
            },
            ameri: {
                cat:     'ENTREPRENEURSHIP',
                role:    'Founder & Web Developer',
                company: 'AmeriBakes',
                date:    'Feb 2024 — May 2025',
                desc:    'Founded D2C baking startup; React frontend; scaled to $3,500+ revenue and 150+ orders.',
                color:   '#F3C9B5'
            },
            slu: {
                cat:     'SCIENCE',
                role:    'ML & Bioinformatics Intern',
                company: 'Saint Louis University',
                date:    'Dec 2022 — May 2025',
                desc:    'Deep learning model for warfarin dosing at 81% accuracy; co-authored paper accepted to ICIBM 2025.',
                color:   '#B37487'
            },
            boa: {
                cat:     'LEADERSHIP',
                role:    'Bank of America Student Leaders Intern',
                company: 'United Way of Greater St. Louis',
                date:    'May 2024 — Apr 2025',
                desc:    'Launched literacy program; attended national leadership summit in Washington D.C.',
                color:   '#C7A0AA'
            }
        };

        const PAINT_STAGES = [
            { delay: 100,  cls: 'paint-cat' },
            { delay: 300,  cls: 'paint-role' },
            { delay: 500,  cls: 'paint-divider' },
            { delay: 650,  cls: 'paint-company' },
            { delay: 800,  cls: 'paint-date' },
            { delay: 1000, cls: 'paint-desc' }
        ];
        const PAINT_CLASSES = PAINT_STAGES.map(s => s.cls);

        let activeBlob = null;
        let paintTimeouts = [];
        let resetTimeout = null;
        let leaveDebounce = null;

        function clearAllTimeouts() {
            paintTimeouts.forEach(clearTimeout);
            paintTimeouts = [];
            if (resetTimeout) { clearTimeout(resetTimeout); resetTimeout = null; }
        }

        function cancelLeave() {
            if (leaveDebounce) { clearTimeout(leaveDebounce); leaveDebounce = null; }
        }

        function fillCanvas(data) {
            if (!canvasActive) return;
            canvasActive.querySelector('.canvas-cat').textContent = data.cat;
            canvasActive.querySelector('.canvas-role').textContent = data.role;
            canvasActive.querySelector('.canvas-company').textContent = data.company;
            canvasActive.querySelector('.canvas-date').textContent = data.date;
            canvasActive.querySelector('.canvas-desc').textContent = data.desc;
            canvasActive.style.setProperty('--active-color', data.color);
        }

        function paintCanvas(blobId) {
            const data = EXPERIENCES[blobId];
            if (!data || !canvasActive) return;
            clearAllTimeouts();

            // Reset paint classes so the sweep animations replay from the
            // start. Force a reflow so removed/added animations don't merge.
            PAINT_CLASSES.forEach(c => canvasActive.classList.remove(c));
            void canvasActive.offsetWidth;

            fillCanvas(data);
            if (canvasDefault) canvasDefault.classList.add('is-hidden');
            canvasActive.classList.add('is-active');

            PAINT_STAGES.forEach(stage => {
                paintTimeouts.push(setTimeout(() => {
                    canvasActive.classList.add(stage.cls);
                }, stage.delay));
            });
        }

        function clearCanvas() {
            clearAllTimeouts();
            if (canvasActive) canvasActive.classList.remove('is-active');
            // After active fades out (250ms), reset paint classes and bring
            // the default message back in after a 100ms gap.
            resetTimeout = setTimeout(() => {
                if (canvasActive) {
                    PAINT_CLASSES.forEach(c => canvasActive.classList.remove(c));
                }
                resetTimeout = setTimeout(() => {
                    if (canvasDefault) canvasDefault.classList.remove('is-hidden');
                    resetTimeout = null;
                }, 100);
            }, 350);
        }

        if (paletteIsTouch) {
            // Switch hint copy for touch users
            paletteSection.querySelectorAll('.blob-label-hint').forEach(t => {
                t.textContent = 'tap me';
            });

            blobs.forEach(blob => {
                blob.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (activeBlob === blob) {
                        activeBlob = null;
                        clearCanvas();
                    } else {
                        activeBlob = blob;
                        paintCanvas(blob.dataset.blob);
                    }
                });
            });
            document.addEventListener('click', () => {
                if (activeBlob) {
                    activeBlob = null;
                    clearCanvas();
                }
            });
        } else {
            blobs.forEach(blob => {
                blob.addEventListener('mouseenter', () => {
                    // Always cancel a pending leave first — this is what kills
                    // any residual flicker if the cursor briefly exits and
                    // re-enters within the debounce window.
                    cancelLeave();
                    if (activeBlob === blob) return;
                    activeBlob = blob;
                    paintCanvas(blob.dataset.blob);
                });
                blob.addEventListener('mouseleave', (e) => {
                    // If moving directly to another blob, that mouseenter
                    // handles the swap — don't queue a leave here.
                    const related = e.relatedTarget;
                    if (related && related.closest && related.closest('.paint-blob')) return;
                    // Debounce: 50ms grace period in case mouseenter fires again.
                    cancelLeave();
                    leaveDebounce = setTimeout(() => {
                        leaveDebounce = null;
                        activeBlob = null;
                        clearCanvas();
                    }, 50);
                });
            });

            // Leaving the section entirely is unambiguous — clear immediately.
            paletteSection.addEventListener('mouseleave', () => {
                cancelLeave();
                if (activeBlob) {
                    activeBlob = null;
                    clearCanvas();
                }
            });
        }
    }

    // ============================================
    // RECOGNITION — CURIO CABINET
    // ============================================
    const recognitionSection = document.getElementById('recognition');
    if (recognitionSection) {
        const cabinet3d = document.getElementById('cabinet3d');
        const doorLeft = document.getElementById('cabinetDoorLeft');
        const doorRight = document.getElementById('cabinetDoorRight');
        const awardItems = recognitionSection.querySelectorAll('.award-item');
        const cabinetIsTouch = window.matchMedia('(hover: none)').matches;
        const cabinetIsMobile = window.matchMedia('(max-width: 767px)').matches;
        const cabinetReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Scroll-in entrance: trigger animations once
        const cabinetObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    recognitionSection.classList.add('is-revealed');
                    cabinetObserver.unobserve(recognitionSection);
                }
            });
        }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.18 });
        cabinetObserver.observe(recognitionSection);

        // Mouse parallax + glass shine — desktop only, throttled via rAF
        if (!cabinetIsTouch && !cabinetIsMobile && !cabinetReducedMotion) {
            let cabinetTicking = false;
            let lastMouseX = 0.5;
            let lastMouseY = 0.5;

            function updateParallax() {
                if (cabinet3d) {
                    // ±2deg max rotation following cursor
                    const rx = (0.5 - lastMouseY) * 4;  // mouse up → cabinet tilts up (+rx)
                    const ry = (lastMouseX - 0.5) * 4;
                    cabinet3d.style.setProperty('--cabinet-rx', rx.toFixed(2) + 'deg');
                    cabinet3d.style.setProperty('--cabinet-ry', ry.toFixed(2) + 'deg');
                }
                if (doorLeft) {
                    doorLeft.style.setProperty('--mouse-x', lastMouseX.toFixed(3));
                    doorLeft.style.setProperty('--mouse-y', lastMouseY.toFixed(3));
                }
                if (doorRight) {
                    doorRight.style.setProperty('--mouse-x', lastMouseX.toFixed(3));
                    doorRight.style.setProperty('--mouse-y', lastMouseY.toFixed(3));
                }
                cabinetTicking = false;
            }

            recognitionSection.addEventListener('mousemove', (e) => {
                const rect = recognitionSection.getBoundingClientRect();
                lastMouseX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                lastMouseY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
                if (!cabinetTicking) {
                    requestAnimationFrame(updateParallax);
                    cabinetTicking = true;
                }
            }, { passive: true });

            // Reset to neutral when mouse leaves
            recognitionSection.addEventListener('mouseleave', () => {
                lastMouseX = 0.5;
                lastMouseY = 0.5;
                if (!cabinetTicking) {
                    requestAnimationFrame(updateParallax);
                    cabinetTicking = true;
                }
            });
        }

        // Touch — tap item to open detail card, tap outside to dismiss
        if (cabinetIsTouch) {
            let activeAward = null;
            awardItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (activeAward === item) {
                        item.classList.remove('is-active');
                        activeAward = null;
                    } else {
                        if (activeAward) activeAward.classList.remove('is-active');
                        item.classList.add('is-active');
                        activeAward = item;
                    }
                });
            });
            document.addEventListener('click', () => {
                if (activeAward) {
                    activeAward.classList.remove('is-active');
                    activeAward = null;
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
