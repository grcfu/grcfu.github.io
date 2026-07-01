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

        // Scroll-driven flower spin. Rotation is a function of scrollY, so
        // scrolling down accumulates clockwise rotation and scrolling up
        // unwinds it. rAF-throttled for smoothness.
        const flowerImgs = aboutSection.querySelectorAll('.about-flower-img');
        if (flowerImgs.length) {
            let aboutSpinTicking = false;

            function updateFlowerSpin() {
                const spin = (window.scrollY * 0.18).toFixed(2) + 'deg';
                flowerImgs.forEach(img => {
                    img.style.setProperty('--spin', spin);
                });
                aboutSpinTicking = false;
            }

            function onAboutSpinScroll() {
                if (!aboutSpinTicking) {
                    requestAnimationFrame(updateFlowerSpin);
                    aboutSpinTicking = true;
                }
            }

            window.addEventListener('scroll', onAboutSpinScroll, { passive: true });
            updateFlowerSpin();
        }
    }

    // ============================================
    // SKILLS — BAG CLICK TO OPEN
    // ============================================
    const bagImg = document.getElementById('bagImg');
    const bagCanvas = document.querySelector('.bag-canvas');

    if (bagImg && bagCanvas) {
        const allBlobs = bagCanvas.querySelectorAll('.skill-blob');
        const allCatLabels = bagCanvas.querySelectorAll('.cat-label');

        // Zipper elements — may be null if the SVG isn't in DOM (defensive)
        const zipperSvg     = document.getElementById('zipperSvg');
        const zipperTrackTop = document.getElementById('zipperTrackTop');
        const zipperTrackBot = document.getElementById('zipperTrackBot');
        const zipperPull    = document.getElementById('zipperPull');
        const zipperTeeth   = zipperSvg ? zipperSvg.querySelectorAll('.zipper-tooth') : [];

        // Track length matches the path d="M 0 8 L 200 8" + the dasharray
        // declared in CSS. When viewBox stretches with CSS width, the
        // stroke-dash math still operates in viewBox units.
        const TRACK_LEN = 200;

        // Sequence timings — open
        const ZIPPER_DRAW_MS    = 750;
        const FOLD_START_MS     = 800;
        const FOLD_MS           = 400;
        const BLOB_RISE_START   = 1200;
        const BLOB_RISE_MS      = 280;
        const BLOB_DRIFT_MS     = 380;
        const BLOB_STAGGER_MS   = 75;
        // Sequence timings — close
        const CLOSE_FOLD_MS     = 380;
        const ZIPPER_REDRAW_MS  = 600;
        const ZIPPER_REDRAW_AT  = 800;
        const ZIPPER_FADE_AT    = 1450;

        // All pending timers from any in-flight sequence. Cleared on every
        // click so a rapid open→close→open never leaves a half-folded bag
        // or a half-drawn zipper.
        let zipTimeouts = [];
        let zipRaf = null;

        function clearZipState() {
            zipTimeouts.forEach(t => clearTimeout(t));
            zipTimeouts.length = 0;
            if (zipRaf) {
                cancelAnimationFrame(zipRaf);
                zipRaf = null;
            }
        }

        // Position the zipper SVG over the top opening of the bag image.
        // Called on init, on window.load (image dims now final), and on
        // resize (debounced). Uses BCR relative to the canvas — wobble
        // class is removed during measurement so the static layout is read.
        function positionZipper() {
            if (!zipperSvg || !bagImg || !bagCanvas) return;
            const wasWobbling = bagImg.classList.contains('is-wobbling');
            const wasShaking  = bagImg.classList.contains('is-shaking');
            if (wasWobbling) bagImg.classList.remove('is-wobbling');
            if (wasShaking)  bagImg.classList.remove('is-shaking');

            const canvasRect = bagCanvas.getBoundingClientRect();
            const bagRect    = bagImg.getBoundingClientRect();

            if (wasWobbling) bagImg.classList.add('is-wobbling');
            if (wasShaking)  bagImg.classList.add('is-shaking');

            const bagTop    = bagRect.top - canvasRect.top;
            const bagLeft   = bagRect.left - canvasRect.left;
            const bagWidth  = bagRect.width;
            const bagHeight = bagRect.height;
            if (!bagWidth || !bagHeight) return;

            const zipperW = bagWidth * 0.50;
            // Match the SVG viewBox aspect (200:50 = 4:1). Tall enough to
            // hold a dramatic backpack-top arch without clipping.
            const zipperH = zipperW * 0.25;
            // Biased slightly left of center so the right end pulls in more
            // than the left as the total length shrinks — the bag's opening
            // on rebag.png sits a touch left of true center anyway.
            const zipperLeft = bagLeft + (bagWidth - zipperW) / 2 - bagWidth * 0.03 - 4;
            // Sit at the very top edge of the bag (where a real zipper opening is),
            // not in the middle of the upper portion.
            const zipperTop  = bagTop + bagHeight * 0.06;

            zipperSvg.style.position = 'absolute';
            zipperSvg.style.left   = zipperLeft + 'px';
            zipperSvg.style.top    = zipperTop + 'px';
            zipperSvg.style.width  = zipperW + 'px';
            zipperSvg.style.height = zipperH + 'px';
        }

        // One-time setup of the curved tracks: set stroke-dash to the path's
        // actual viewBox-unit length so the draw animation reveals the full
        // curve cleanly, and place each tooth on its curve at evenly spaced
        // parametric points (alternating above top track / below bot track).
        function initZipperGeometry() {
            if (!zipperTrackTop || !zipperTrackBot) return;
            try {
                const topLen = zipperTrackTop.getTotalLength();
                const botLen = zipperTrackBot.getTotalLength();
                zipperTrackTop.style.strokeDasharray = topLen;
                zipperTrackTop.style.strokeDashoffset = topLen;
                zipperTrackBot.style.strokeDasharray = botLen;
                zipperTrackBot.style.strokeDashoffset = botLen;
                zipperTeeth.forEach((tooth, i) => {
                    const tProg = (i + 0.5) / zipperTeeth.length;
                    const above = i % 2 === 0;
                    const trackElem = above ? zipperTrackTop : zipperTrackBot;
                    const len = above ? topLen : botLen;
                    const pt = trackElem.getPointAtLength(len * tProg);
                    // Tooth rect is 4×6 at local (0,0). Translate so it sits
                    // flush against the track edge.
                    const tx = pt.x - 2;
                    const ty = above ? pt.y - 6 : pt.y;
                    tooth.setAttribute('transform', `translate(${tx}, ${ty})`);
                });
            } catch (e) {
                console.warn('initZipperGeometry', e);
            }
        }

        positionZipper();
        initZipperGeometry();
        window.addEventListener('load', () => {
            positionZipper();
            initZipperGeometry();
        });
        let _zipResizeTimer = null;
        window.addEventListener('resize', () => {
            if (_zipResizeTimer) clearTimeout(_zipResizeTimer);
            _zipResizeTimer = setTimeout(positionZipper, 200);
        }, { passive: true });

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        // Drive the zipper along the CURVED top track: stroke-dashoffset
        // for both tracks, pull tab translates via getPointAtLength so it
        // hugs the curve, teeth fade in as the draw progress passes them.
        // easeInOutCubic so the pull tab feels weighted.
        function animateZipper(direction, durationMs, onDone) {
            if (!zipperSvg) { if (onDone) onDone(); return; }
            const opening = direction === 'open';
            const start = performance.now();
            const topLen = zipperTrackTop ? zipperTrackTop.getTotalLength() : TRACK_LEN;
            const botLen = zipperTrackBot ? zipperTrackBot.getTotalLength() : TRACK_LEN;

            function tick(now) {
                const elapsed = now - start;
                let p = Math.min(1, elapsed / durationMs);
                p = easeInOutCubic(p);
                // drawP: 0 = fully closed/empty, 1 = fully drawn
                const drawP = opening ? p : 1 - p;

                if (zipperTrackTop) zipperTrackTop.style.strokeDashoffset = topLen * (1 - drawP);
                if (zipperTrackBot) zipperTrackBot.style.strokeDashoffset = botLen * (1 - drawP);
                if (zipperPull && zipperTrackTop) {
                    // Pull rides the top track. Its content is drawn around
                    // y=6–14 with the line at y=10; subtract 8 so the track
                    // passes through the upper portion of the D-ring.
                    const pt = zipperTrackTop.getPointAtLength(topLen * drawP);
                    zipperPull.setAttribute('transform', `translate(${pt.x}, ${pt.y - 8})`);
                }
                zipperTeeth.forEach((tooth, i) => {
                    // Reveal each tooth as the draw passes its center
                    const tp = (i + 0.5) / zipperTeeth.length;
                    tooth.style.opacity = drawP > tp ? '1' : '0';
                });

                if (elapsed < durationMs) {
                    zipRaf = requestAnimationFrame(tick);
                } else {
                    zipRaf = null;
                    if (onDone) onDone();
                }
            }
            zipRaf = requestAnimationFrame(tick);
        }

        // Fold the bag flap open via 3D rotateX. Mobile uses a shallower
        // angle since touch-screen depth perception is reduced.
        // CSS animations win over inline transform per the cascade, so the
        // existing .bag-canvas.opened .bag-img wobble-shrunk animation has
        // to be suppressed inline for this fold transform to actually show.
        function foldBagOpen() {
            const isTouch = window.matchMedia('(hover: none)').matches;
            const foldDeg = isTouch ? -14 : -22;
            bagImg.style.animation = 'none';
            bagImg.style.transformOrigin = 'top center';
            bagImg.style.transition = 'transform ' + FOLD_MS + 'ms cubic-bezier(0.25, 0.46, 0.45, 0.94), filter ' + FOLD_MS + 'ms ease';
            bagImg.style.transform = 'translate(-50%, -50%) scale(0.97) rotateX(' + foldDeg + 'deg)';
            bagImg.style.filter = 'drop-shadow(0 8px 16px rgba(68, 47, 42, 0.3))';
        }

        // Reverse the fold: rotateX→0, scale→1, drop the shadow. Bag returns
        // to its full pre-click size; CSS wobble takes over once inline is
        // cleared at the end of the close sequence.
        function foldBagClose() {
            bagImg.classList.remove('is-wobbling', 'is-shaking');
            bagImg.style.transformOrigin = 'top center';
            bagImg.style.transition = 'transform ' + CLOSE_FOLD_MS + 'ms ease, filter ' + CLOSE_FOLD_MS + 'ms ease';
            bagImg.style.transform = 'translate(-50%, -50%) scale(1) rotateX(0deg)';
            bagImg.style.filter = '';
        }

        // ---- Open sequence ----
        function runOpenSequence() {
            bagCanvas.classList.add('opened');
            bagCanvas.classList.add('is-folding');
            bagCanvas.classList.remove('blobs-ready');
            bagImg.classList.remove('is-wobbling', 'is-shaking');

            // The .bag-canvas.opened .bag-img CSS rule sets scale(0.6) +
            // wobble-shrunk animation. Suppress both inline so the bag
            // stays at full size + still until the fold kicks in at 800ms.
            bagImg.style.animation = 'none';
            bagImg.style.transition = 'none';
            bagImg.style.transform = 'translate(-50%, -50%)';
            bagImg.style.filter = '';

            // Reset blobs to invisible center so the rise reads cleanly,
            // regardless of any prior magnetic-hover inline transforms.
            allBlobs.forEach(b => {
                b.classList.remove('was-open');
                b.style.transition = 'none';
                b.style.opacity = '0';
                b.style.transform = 'translate(-50%, -50%) scale(0)';
            });
            // Force reflow so the next transform change actually transitions.
            void bagCanvas.offsetWidth;

            // Phase 1 (0ms): zipper visible
            if (zipperSvg) zipperSvg.style.opacity = '1';

            // Phase 2 (0–750ms): zipper draws left→right
            animateZipper('open', ZIPPER_DRAW_MS);

            // Phase 3 (800–1200ms): bag flap folds open
            zipTimeouts.push(setTimeout(foldBagOpen, FOLD_START_MS));

            // Defer the cat-label fade-in until 1.5s after the last blob
            // starts (overrides the CSS .bag-canvas.opened .cat-label
            // animation-delay so the labels never appear before the blobs).
            const lastBlobStarts = BLOB_RISE_START + (allBlobs.length - 1) * BLOB_STAGGER_MS;
            const labelDelayMs = lastBlobStarts + 1500;
            allCatLabels.forEach(l => {
                l.style.opacity = '';
                l.style.animationDelay = labelDelayMs + 'ms';
            });

            // Phase 4 (1200ms+): blobs rise + drift, staggered
            allBlobs.forEach((blob, idx) => {
                const startAt = BLOB_RISE_START + idx * BLOB_STAGGER_MS;
                // Stage A — rise out of the bag opening
                zipTimeouts.push(setTimeout(() => {
                    blob.style.transition = 'transform ' + BLOB_RISE_MS + 'ms ease-out, opacity ' + BLOB_RISE_MS + 'ms ease-out';
                    blob.style.opacity = '1';
                    blob.style.transform = 'translate(-50%, calc(-50% - 55px)) scale(0.6) rotate(0deg)';
                }, startAt));
                // Stage B — drift to the final --x/--y with spring easing
                zipTimeouts.push(setTimeout(() => {
                    const cs = getComputedStyle(blob);
                    const x = cs.getPropertyValue('--x').trim();
                    const y = cs.getPropertyValue('--y').trim();
                    const r = cs.getPropertyValue('--r').trim();
                    blob.style.transition = 'transform ' + BLOB_DRIFT_MS + 'ms cubic-bezier(0.34, 1.56, 0.64, 1)';
                    blob.style.transform = 'translate(calc(-50% + ' + x + '), calc(-50% + ' + y + ')) scale(1) rotate(' + r + ')';
                }, startAt + BLOB_RISE_MS));
            });

            // After the last blob lands, mark blobs-ready (enables magnetic
            // hover) and clear inline styles so the .opened CSS resting
            // rule provides the final position from then on.
            const lastBlobLands = BLOB_RISE_START
                + (allBlobs.length - 1) * BLOB_STAGGER_MS
                + BLOB_RISE_MS + BLOB_DRIFT_MS;
            zipTimeouts.push(setTimeout(() => {
                allBlobs.forEach(b => {
                    b.style.transition = '';
                    b.style.transform = '';
                    b.style.opacity = '';
                });
                bagCanvas.classList.add('blobs-ready');
            }, lastBlobLands));
        }

        // ---- Close sequence ----
        function runCloseSequence() {
            bagCanvas.classList.remove('blobs-ready');
            // Phase 1 (0ms): blobs fly back in via existing CSS animation
            allBlobs.forEach(b => {
                b.style.transition = '';
                b.style.transform = '';
                b.style.opacity = '';
                b.classList.add('was-open');
            });
            allCatLabels.forEach(l => {
                l.style.opacity = '0';
                l.style.animationDelay = '';
            });
            bagCanvas.classList.remove('opened');
            bagCanvas.classList.remove('is-folding');

            // Phase 2 (~immediate, 380ms duration): bag flap closes
            foldBagClose();
            // Restore wobble after the unfold completes — also clear the
            // inline `animation: none` that suppressed wobble-shrunk during open.
            zipTimeouts.push(setTimeout(() => {
                bagImg.style.transition = '';
                bagImg.style.transform = '';
                bagImg.style.filter = '';
                bagImg.style.animation = '';
                bagImg.classList.add('is-wobbling');
            }, CLOSE_FOLD_MS + 20));

            // Phase 3 (800ms): zipper redraws right→left
            zipTimeouts.push(setTimeout(() => {
                animateZipper('close', ZIPPER_REDRAW_MS);
            }, ZIPPER_REDRAW_AT));

            // Phase 4 (1450ms): zipper fades out
            zipTimeouts.push(setTimeout(() => {
                if (zipperSvg) zipperSvg.style.opacity = '0';
            }, ZIPPER_FADE_AT));
        }

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
            // Always wipe pending state so rapid clicks can't strand the
            // bag mid-fold or mid-zip.
            clearZipState();
            const isOpening = !bagCanvas.classList.contains('opened');
            if (isOpening) {
                runOpenSequence();
            } else {
                runCloseSequence();
            }
        });

        // Skill blob tooltips
        const skillDescriptions = {
            // Languages
            'Python': 'My go-to for ML, backends, and scripting',
            'TypeScript': 'Typed JavaScript for reliable web apps',
            'Java': 'OOP fundamentals and coursework',
            'C/C++': 'Systems + IoT work (Arduino, sensor bridges)',
            'Rust': 'Fast, safe systems code — Tauri desktop apps',
            // Frameworks & libraries
            'React': 'Building interactive UIs',
            'Next.js': 'Full-stack React with SSR',
            'Node.js': 'JavaScript backends and microservices',
            'FastAPI': 'Async Python APIs, fast and clean',
            'PyTorch': 'Deep learning research and models',
            // Tools & platforms
            'PostgreSQL': 'Relational database design',
            'Docker': 'Containerizing apps for consistent deploys',
            'AWS': 'Cloud infrastructure and deployment',
            'GCP': 'Google Cloud services and hosting',
            'Git': 'Version control and collaboration',
            // Proficiencies
            'Native iOS Dev': 'SwiftUI apps for iPhone',
            'AI Agent Dev': 'Building LLM-powered agents',
            'Prompt Engineering': 'Getting the most out of LLMs',
            'REST APIs': 'Designing clean, well-structured endpoints',
            'Agile/Scrum': 'Sprint-based team development'
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
            // Don't yank blobs around mid-rise — wait until they've landed.
            if (!bagCanvas.classList.contains('blobs-ready')) return;

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
            // Triggers track the branch y-positions in the SVG
            // (viewBox 0–200) so each card blooms as the vine reaches it.
            { id: 'wwt',      trigger: 0.06  },
            { id: 'ops',      trigger: 0.19  },
            { id: 'healthxr', trigger: 0.315 },
            { id: 'ta',       trigger: 0.45  },
            { id: 'capital',  trigger: 0.575 },
            { id: 'boa',      trigger: 0.71  },
            { id: 'ameri',    trigger: 0.84  }
        ];

        const vineMain = document.getElementById('vineMain');
        const vineMainRight = document.getElementById('vineMainRight');
        // Left vine has all 6 branches; right vine has only the 3 that
        // attach to far-column cards (data-idx 1, 3, 5).
        const leftBranches  = vineSection.querySelectorAll('.vine-trunk:not(.vine-trunk-right) .vine-branch');
        const rightBranches = vineSection.querySelectorAll('.vine-trunk-right .vine-branch');
        // Combined list — used by .is-drawn animations + reduced-motion path.
        const branches = vineSection.querySelectorAll('.vine-branch');
        const flowers  = vineSection.querySelectorAll('.vine-flower');
        const cards    = vineSection.querySelectorAll('.vine-card');
        const sprouts  = vineSection.querySelectorAll('.vine-sprout');
        // Match the vine-section CSS breakpoint — below this, the staggered
        // two-column layout overlaps and we fall back to a stacked single
        // column with the vine hidden.
        const vineIsMobile = window.matchMedia('(max-width: 1000px)').matches;
        const vineReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const bigScreenMQ = window.matchMedia('(min-width: 1400px)');
        // Far cards (idx 1, 3, 5) attach to the right vine on big screens.
        const isFarIdx = (i) => i === 1 || i === 3 || i === 5;
        const rightBranchFor = (i) => rightBranches[(i - 1) / 2];

        // ---- Dynamic flower + card positioning ----
        // The vine SVG uses preserveAspectRatio="xMidYMid meet", which means
        // its content can be letterboxed inside the section depending on
        // viewport aspect. Hardcoded percentage positions for flowers drift
        // off-target. Instead we compute each branch's actual rendered
        // endpoint in section pixels and pin the flower SVG there.
        function positionFlowers() {
            const sectionRect = vineSection.getBoundingClientRect();
            const big = bigScreenMQ.matches;
            flowers.forEach((flower, i) => {
                if (!flower) return;
                // On big screens, far cards' flowers anchor to the
                // right-vine branch; otherwise use the left-vine branch.
                const useRight = big && isFarIdx(i);
                const branch = useRight ? rightBranchFor(i) : leftBranches[i];
                if (!branch) return;
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
                    flower.style.left = pixelX + 'px';
                    flower.style.top = pixelY + 'px';
                    flower.style.transform = 'translate(-50%, -50%)';
                    flower.dataset.attach = useRight ? 'right' : 'left';
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
                const flowerHalfW = (flower.offsetWidth || 70) / 2;
                cards[i].style.top = (flowerTop - 30) + 'px';
                if (flower.dataset.attach === 'right') {
                    // Big-screen far card: flower anchors to the card's
                    // top-right; card extends LEFTWARD from there.
                    const cardW = cards[i].offsetWidth || 400;
                    cards[i].style.left = (flowerLeft - flowerHalfW - 16 - cardW) + 'px';
                } else {
                    // Default: card extends rightward from flower.
                    cards[i].style.left = (flowerLeft + flowerHalfW + 16) + 'px';
                }
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
        let vineLengthRight = 1000;
        if (vineMainRight && typeof vineMainRight.getTotalLength === 'function') {
            try {
                vineLengthRight = vineMainRight.getTotalLength() || 1000;
                vineMainRight.style.strokeDasharray = vineLengthRight;
                vineMainRight.style.strokeDashoffset = vineLengthRight;
            } catch (_) { /* noop */ }
        }

        function bloom(idx) {
            if (flowers[idx]) flowers[idx].classList.add('is-bloomed');
            if (cards[idx])   cards[idx].classList.add('is-bloomed');
            // Mark both left and right branches for this idx as drawn —
            // CSS hides whichever isn't active for the current breakpoint.
            if (leftBranches[idx]) leftBranches[idx].classList.add('is-drawn');
            const rb = rightBranchFor(idx);
            if (rb) rb.classList.add('is-drawn');
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
                if (vineMainRight) {
                    vineMainRight.style.strokeDashoffset = vineLengthRight * (1 - progress);
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
    // RECOGNITION — EDITORIAL REEL REVEAL
    // ============================================
    // When the reel scrolls into view, fade each award row in with a
    // small stagger so the list reads top-down rather than slamming in
    // all at once.
    const recognitionSection = document.getElementById('recognition');
    if (recognitionSection) {
        const awardRows = recognitionSection.querySelectorAll('.award-row');
        const recogObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                awardRows.forEach((row, i) => {
                    setTimeout(() => row.classList.add('is-revealed'), i * 80);
                });
                recogObserver.unobserve(recognitionSection);
            });
        }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
        recogObserver.observe(recognitionSection);

        // Scroll-driven flower spin for the three bottom flowers — same
        // pattern as the About section's --spin var, rAF-throttled.
        const recogFlowerImgs = recognitionSection.querySelectorAll('.recog-flower-img');
        if (recogFlowerImgs.length) {
            let recogSpinTicking = false;
            function updateRecogSpin() {
                const spin = (window.scrollY * 0.2).toFixed(2) + 'deg';
                recogFlowerImgs.forEach(img => {
                    img.style.setProperty('--spin', spin);
                });
                recogSpinTicking = false;
            }
            function onRecogSpinScroll() {
                if (!recogSpinTicking) {
                    requestAnimationFrame(updateRecogSpin);
                    recogSpinTicking = true;
                }
            }
            window.addEventListener('scroll', onRecogSpinScroll, { passive: true });
            updateRecogSpin();
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

        // Slice to the past ~6 months. The API returns the trailing year;
        // we just take the last 183 days so the grid stays compact and recent.
        const RECENT_DAYS = 183;
        const allContributions = data.contributions;
        const contributions = allContributions.slice(-RECENT_DAYS);
        const { total } = computeStats(contributions);

        if (heatmapStats) {
            heatmapStats.textContent = `${total.toLocaleString()} contributions in the past 6 months`;
        }

        // Pad the start so week 1 begins on the correct day-of-week column
        const firstDate = new Date(contributions[0].date + 'T00:00:00');
        const firstDayOfWeek = firstDate.getDay();
        const totalCells = firstDayOfWeek + contributions.length;
        const columnCount = Math.ceil(totalCells / 7);

        heatmapGrid.innerHTML = '';
        // Fixed-size cell tracks (clamped) so cells stay readable on wide
        // screens. Combined with justify-content: space-between in CSS, the
        // extra horizontal slack distributes as gap rather than inflating cells.
        heatmapGrid.style.gridTemplateColumns = `repeat(${columnCount}, clamp(11px, 1.5vw, 20px))`;

        // Empty leading cells for alignment
        for (let i = 0; i < firstDayOfWeek; i++) {
            const filler = document.createElement('div');
            filler.className = 'heatmap-cell heatmap-level-0 heatmap-cell-filler';
            filler.style.visibility = 'hidden';
            heatmapGrid.appendChild(filler);
        }

        contributions.forEach((day, i) => {
            const cell = document.createElement('div');
            const level = Math.min(day.level !== undefined ? day.level : 0, 4);
            cell.className = `heatmap-cell heatmap-level-${level}`;
            cell.setAttribute('data-tooltip', `${formatDate(day.date)}: ${day.count} ${day.count === 1 ? 'contribution' : 'contributions'}`);
            cell.dataset.column = Math.floor((i + firstDayOfWeek) / 7);
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
