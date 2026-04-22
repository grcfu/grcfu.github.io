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
    // HERO — SPLIT SCREEN 4-PHASE ENTRANCE
    // ============================================
    const heroSection = document.getElementById('hero');
    const heroPrefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const heroIsMobile = window.matchMedia('(max-width: 767px)').matches;

    if (heroSection) {
        // Mark is-loaded immediately so paint blobs, GIF opacity fade in
        heroSection.classList.add('is-loaded');

        const lineTiny = document.querySelector('#heroLineTiny .hero-reveal');
        const lineName = document.querySelector('#heroLineName .hero-reveal');
        const wavy = document.getElementById('heroWavy');
        const lineTagline = document.querySelector('#heroLineTagline .hero-reveal');
        const lineTagline2 = document.querySelector('#heroLineTagline2 .hero-reveal');
        const lineCredentials = document.querySelector('#heroLineCredentials .hero-reveal');

        function revealText(el, cls) {
            if (el) el.classList.add(cls || 'is-revealed');
        }

        if (heroPrefersReduced || heroIsMobile) {
            // Skip split-screen animation: jump straight to phase-text + phase-finish
            // Mobile uses static layout (see CSS media queries); just reveal everything.
            heroSection.classList.add('phase-split', 'phase-text', 'phase-finish');
            revealText(lineTiny);
            revealText(lineName);
            revealText(wavy, 'is-drawn');
            revealText(lineTagline);
            revealText(lineTagline2);
            revealText(lineCredentials);
        } else {
            // ----- Phase 1: Opening state (0–0.6s) -----
            // GIF centered, text hidden, panel off-screen. Just let the user see it.

            // ----- Phase 2: Split (0.6s, 0.9s duration) -----
            setTimeout(() => {
                heroSection.classList.add('phase-split');
            }, 600);

            // ----- Phase 3: Text reveals (starts at 1.5s = 0.6s + 0.9s) -----
            // Each line sweeps in via clip-path, 0.35s stagger
            setTimeout(() => {
                heroSection.classList.add('phase-text');
                revealText(lineTiny);
            }, 1500);

            setTimeout(() => revealText(lineName), 1500 + 350);
            setTimeout(() => revealText(wavy, 'is-drawn'), 1500 + 700);
            setTimeout(() => revealText(lineTagline), 1500 + 1050);
            setTimeout(() => revealText(lineTagline2), 1500 + 1400);
            setTimeout(() => revealText(lineCredentials), 1500 + 1750);

            // ----- Phase 4: Finishing touches (after last text line ~3.25s) -----
            setTimeout(() => {
                heroSection.classList.add('phase-finish');
            }, 1500 + 1750 + 500);
        }

        // ----- Scroll transition (runs always after entrance) -----
        const heroText = document.getElementById('heroText');
        const heroGifWrap = document.getElementById('heroGifWrap');
        const heroPaints = document.querySelectorAll('.hero-paint');
        const heroCollages = document.querySelectorAll('.collage');
        let heroTicking = false;

        function updateHeroScroll() {
            // Skip scroll fade effect on mobile per spec
            if (heroIsMobile) { heroTicking = false; return; }

            const rect = heroSection.getBoundingClientRect();
            const heroHeight = rect.height || 1;
            const progress = Math.max(0, Math.min(1, -rect.top / heroHeight));

            if (heroText) {
                const textP = Math.min(progress * 1.4, 1);
                heroText.style.opacity = 1 - textP;
                heroText.style.transform = `translateY(${-40 * textP}px)`;
            }
            if (heroGifWrap) {
                heroGifWrap.style.opacity = 1 - Math.min(progress * 0.85, 1);
            }
            heroPaints.forEach(p => {
                p.style.opacity = Math.max(0, 1 - progress * 1.1);
            });
            heroCollages.forEach(c => {
                c.style.opacity = Math.max(0, 1 - progress * 0.55);
            });

            heroTicking = false;
        }

        function onHeroScroll() {
            if (!heroTicking) {
                window.requestAnimationFrame(updateHeroScroll);
                heroTicking = true;
            }
        }

        window.addEventListener('scroll', onHeroScroll, { passive: true });
    }

    // ============================================
    // HERO GIF — PLAY FOR GIF_DURATION_MS, FREEZE ON 2500ms FRAME
    // ============================================
    // The GIF plays fully for GIF_DURATION_MS; at GIF_SNAPSHOT_MS we
    // capture the current frame to canvas, and at GIF_DURATION_MS we
    // swap to that canvas — so the visible freeze frame is the one
    // from GIF_SNAPSHOT_MS even though playback ran the full duration.
    const GIF_DURATION_MS = 3000;
    const GIF_SNAPSHOT_MS = 2500;

    // Optional: parse the GIF binary to find the exact time a specific frame
    // starts. Set to null to skip parsing and use the constants above.
    const GIF_FREEZE_FRAME = null;
    let gifFreezeTimeMs = GIF_DURATION_MS;
    let gifSnapshotTimeMs = GIF_SNAPSHOT_MS;

    // Parse GIF binary to compute time when a given 1-indexed frame appears.
    // Returns the cumulative ms delay of frames 1..(targetFrame-1).
    async function computeFrameStartTime(url, targetFrame) {
        try {
            const res = await fetch(url);
            const buf = await res.arrayBuffer();
            const bytes = new Uint8Array(buf);

            // Skip header (6) + logical screen descriptor (7 bytes)
            let pos = 13;
            const packed = bytes[10];
            if (packed & 0x80) {
                const gctSize = 3 * Math.pow(2, (packed & 0x07) + 1);
                pos += gctSize;
            }

            let frameCount = 0;
            let cumulativeMs = 0;
            let lastDelay = 0;

            while (pos < bytes.length) {
                const marker = bytes[pos];
                if (marker === 0x3B) break; // GIF trailer

                if (marker === 0x21) {
                    // Extension block
                    const label = bytes[pos + 1];
                    if (label === 0xF9) {
                        // Graphic Control Extension
                        // bytes[pos+4..5] = delay in hundredths of a second, LE
                        const delayCs = bytes[pos + 4] | (bytes[pos + 5] << 8);
                        lastDelay = delayCs * 10;
                        pos += 8;
                    } else {
                        // Skip other extensions (label + sub-blocks until 0x00)
                        pos += 2;
                        while (pos < bytes.length) {
                            const blockSize = bytes[pos];
                            if (blockSize === 0) { pos++; break; }
                            pos += blockSize + 1;
                        }
                    }
                } else if (marker === 0x2C) {
                    // Image descriptor = a frame
                    frameCount++;
                    if (frameCount >= targetFrame) {
                        return cumulativeMs;
                    }
                    cumulativeMs += lastDelay || 100;

                    // Skip image descriptor (10 bytes) + optional LCT + LZW data
                    const imgPacked = bytes[pos + 9];
                    pos += 10;
                    if (imgPacked & 0x80) {
                        const lctSize = 3 * Math.pow(2, (imgPacked & 0x07) + 1);
                        pos += lctSize;
                    }
                    pos++; // LZW minimum code size
                    while (pos < bytes.length) {
                        const blockSize = bytes[pos];
                        if (blockSize === 0) { pos++; break; }
                        pos += blockSize + 1;
                    }
                } else {
                    pos++;
                }
            }

            // Fewer than targetFrame frames — return total
            return cumulativeMs;
        } catch (err) {
            console.warn('GIF frame parse failed, using fallback duration:', err);
            return null;
        }
    }

    const heroGifEl = document.querySelector('.hero-gif');
    if (heroGifEl && heroSection) {
        const gifSrc = heroGifEl.getAttribute('src');
        const transparentPx = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        let freezeTimer = null;
        let snapshotTimer = null;
        let frozenCanvas = null;
        let isPlaying = false;

        // If GIF_FREEZE_FRAME is set, parse the GIF to find that frame's
        // start time and override the simple GIF_DURATION_MS timer.
        if (GIF_FREEZE_FRAME) {
            computeFrameStartTime(gifSrc, GIF_FREEZE_FRAME).then(ms => {
                if (ms !== null && ms > 0) {
                    gifFreezeTimeMs = ms;
                    if (isPlaying && freezeTimer) {
                        clearTimeout(freezeTimer);
                        freezeTimer = setTimeout(freezeGif, ms);
                    }
                }
            });
        }

        // Capture the currently visible frame to canvas (live img stays visible)
        function snapshotCurrentFrame() {
            try {
                const rect = heroGifEl.getBoundingClientRect();
                const w = heroGifEl.naturalWidth || rect.width;
                const h = heroGifEl.naturalHeight || rect.height;
                if (!w || !h) return;

                if (!frozenCanvas) {
                    frozenCanvas = document.createElement('canvas');
                    frozenCanvas.className = 'hero-gif hero-gif-frozen';
                    heroGifEl.parentNode.insertBefore(frozenCanvas, heroGifEl);
                }
                frozenCanvas.width = w;
                frozenCanvas.height = h;
                const ctx = frozenCanvas.getContext('2d');
                ctx.drawImage(heroGifEl, 0, 0, w, h);
            } catch (err) {
                console.warn('GIF snapshot failed:', err);
            }
        }

        // Swap the live GIF for the already-captured canvas
        function freezeGif() {
            if (frozenCanvas) {
                heroGifEl.style.display = 'none';
                frozenCanvas.style.display = 'block';
            } else {
                // Fallback if snapshot hadn't fired yet: try to snapshot now
                snapshotCurrentFrame();
                if (frozenCanvas) {
                    heroGifEl.style.display = 'none';
                    frozenCanvas.style.display = 'block';
                } else {
                    heroGifEl.src = transparentPx;
                    setTimeout(() => { heroGifEl.src = gifSrc; }, 0);
                }
            }
            isPlaying = false;
        }

        function playGifOnce() {
            if (isPlaying) return;
            isPlaying = true;

            // Restore live img, hide any previous frozen canvas
            if (frozenCanvas) {
                frozenCanvas.style.display = 'none';
            }
            heroGifEl.style.display = 'block';
            // Cache-bust src so the GIF animation restarts from frame 1
            heroGifEl.src = gifSrc + '?t=' + Date.now();

            if (snapshotTimer) clearTimeout(snapshotTimer);
            if (freezeTimer) clearTimeout(freezeTimer);

            // At gifSnapshotTimeMs, capture the frame (but keep GIF playing)
            snapshotTimer = setTimeout(snapshotCurrentFrame, gifSnapshotTimeMs);
            // At gifFreezeTimeMs, swap the live GIF out for the canvas snapshot
            freezeTimer = setTimeout(freezeGif, gifFreezeTimeMs);
        }

        // Initial play when hero first loads
        if (heroGifEl.complete) {
            playGifOnce();
        } else {
            heroGifEl.addEventListener('load', playGifOnce, { once: true });
        }

        // Replay whenever hero re-enters the viewport
        const gifReplayObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isPlaying) {
                    playGifOnce();
                }
            });
        }, { root: null, threshold: 0.35 });

        gifReplayObserver.observe(heroSection);
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
        '.project-card, .award-card'
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
        const paletteSvg = document.getElementById('paletteSvg');
        const paletteStage = document.getElementById('paletteStage');
        const splashText = document.getElementById('splashText');
        const blobs = paletteSection.querySelectorAll('.paint-blob');
        const splashes = paletteSection.querySelectorAll('.splash');
        const isTouch = window.matchMedia('(hover: none)').matches;

        // Map blob id → splash id
        function findSplash(blobId) {
            return paletteSection.querySelector(`.splash[data-splash="${blobId}"]`);
        }

        // Position text overlay over the splash center in SVG coordinates
        function positionTextOver(blob) {
            if (!splashText || !paletteSvg || !paletteStage) return;
            const m = blob.getAttribute('transform').match(/translate\(([-\d.]+)\s+([-\d.]+)\)/);
            if (!m) return;
            const cx = parseFloat(m[1]);
            const cy = parseFloat(m[2]);
            // SVG uses viewBox 0 0 1000 700; convert to stage pixels
            const stageRect = paletteStage.getBoundingClientRect();
            const svgRect = paletteSvg.getBoundingClientRect();
            const scaleX = svgRect.width / 1000;
            const scaleY = svgRect.height / 700;
            const x = (svgRect.left - stageRect.left) + cx * scaleX;
            const y = (svgRect.top - stageRect.top) + cy * scaleY;
            splashText.style.left = x + 'px';
            splashText.style.top = y + 'px';
        }

        // Fill text overlay with blob's data attributes
        function fillText(blob) {
            if (!splashText) return;
            splashText.querySelector('.splash-cat').textContent = blob.dataset.cat || '';
            splashText.querySelector('.splash-role').textContent = blob.dataset.role || '';
            splashText.querySelector('.splash-company').textContent = blob.dataset.company || '';
            splashText.querySelector('.splash-date').textContent = blob.dataset.date || '';
            splashText.querySelector('.splash-desc').textContent = blob.dataset.desc || '';
        }

        // State
        let activeBlob = null;
        let closeTimer = null;

        function openSplash(blob) {
            if (activeBlob === blob) return;
            const openOnce = (newBlob) => {
                const splash = findSplash(newBlob.dataset.blob);
                if (!splash) return;
                fillText(newBlob);
                positionTextOver(newBlob);
                splash.classList.remove('is-closing');
                splash.classList.add('is-open');
                splashText.classList.add('is-open');
                activeBlob = newBlob;
            };

            if (activeBlob) {
                // Close current then open new after 50ms gap
                closeSplash(false);
                if (closeTimer) clearTimeout(closeTimer);
                closeTimer = setTimeout(() => openOnce(blob), 50);
            } else {
                openOnce(blob);
            }
        }

        function closeSplash(clearActive = true) {
            splashes.forEach(s => {
                if (s.classList.contains('is-open')) {
                    s.classList.remove('is-open');
                    s.classList.add('is-closing');
                    setTimeout(() => s.classList.remove('is-closing'), 320);
                }
            });
            if (splashText) splashText.classList.remove('is-open');
            if (clearActive) activeBlob = null;
        }

        if (isTouch) {
            // Tap to open, tap blob again or anywhere else to close
            blobs.forEach(blob => {
                blob.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (activeBlob === blob) {
                        closeSplash();
                    } else {
                        openSplash(blob);
                    }
                });
            });
            document.addEventListener('click', () => {
                if (activeBlob) closeSplash();
            });
        } else {
            // Hover interaction on desktop
            blobs.forEach(blob => {
                blob.addEventListener('mouseenter', () => openSplash(blob));
                blob.addEventListener('mouseleave', (e) => {
                    // If moving directly to another blob, openSplash handles the swap
                    const related = e.relatedTarget;
                    if (!related || !related.closest || !related.closest('.paint-blob')) {
                        closeSplash();
                    }
                });
            });
            // Close if mouse leaves the section entirely
            paletteSection.addEventListener('mouseleave', () => closeSplash());
        }

        // Reposition text overlay on window resize when open
        window.addEventListener('resize', () => {
            if (activeBlob) positionTextOver(activeBlob);
        }, { passive: true });
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
