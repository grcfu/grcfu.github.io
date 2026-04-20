/**
 * GRACE FU PORTFOLIO - SCRIPT
 * All interactivity and animations
 */

// ============================================
// FILM GRAIN — animate feTurbulence seed
// Runs outside DOMContentLoaded to start as early as possible
// ============================================
(function animateGrain() {
    const turbulence = document.getElementById('grainTurbulence');
    if (!turbulence) {
        // Retry once DOM is parsed
        document.addEventListener('DOMContentLoaded', animateGrain);
        return;
    }

    let seed = 1;
    let frameCount = 0;

    function tick() {
        frameCount++;
        // Update seed every 3 frames (~20fps grain shift) for performance
        if (frameCount % 3 === 0) {
            seed = (seed + 1) % 1000;
            turbulence.setAttribute('seed', seed);
        }
        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
})();

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
    // CINEMATIC HERO — ENTRANCE SEQUENCE + TYPING
    // ============================================
    const heroSection = document.getElementById('hero');
    const heroLine1 = document.getElementById('heroLine1');
    const heroLine2 = document.getElementById('heroLine2');
    const heroLine3 = document.getElementById('heroLine3');
    const heroUnderline = document.querySelector('.hero-underline');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function typeLine(lineEl, text, speed, done) {
        const typedSpan = lineEl.querySelector('.hero-typed');
        const cursorSpan = lineEl.querySelector('.hero-cursor');
        let i = 0;

        function step() {
            if (i <= text.length) {
                typedSpan.textContent = text.slice(0, i);
                i++;
                setTimeout(step, speed);
            } else {
                if (cursorSpan) cursorSpan.classList.add('done');
                if (done) done();
            }
        }
        step();
    }

    if (heroSection) {
        // Vignette fades in first (via CSS transition on is-loaded)
        // Video fades in starting at 0.4s
        setTimeout(() => heroSection.classList.add('is-loaded'), 0);

        // Scroll transition: vignette deepens, text drifts + fades, video lingers
        const heroText = document.getElementById('heroText');
        const heroVideoWrap = document.querySelector('.hero-video-wrap');
        let scrollTicking = false;

        function updateHeroScroll() {
            const rect = heroSection.getBoundingClientRect();
            const heroHeight = rect.height || 1;
            const progress = Math.max(0, Math.min(1, -rect.top / heroHeight));

            // Text: fades + drifts up faster
            if (heroText) {
                const textProgress = Math.min(progress * 1.3, 1);
                heroText.style.opacity = 1 - textProgress;
                heroText.style.transform = `translateY(${-40 * textProgress}px)`;
            }

            // Video: lingers — fades slower (0.7x)
            if (heroVideoWrap) {
                const videoProgress = Math.min(progress * 0.8, 1);
                heroVideoWrap.style.opacity = 1 - videoProgress;
            }

            // Vignette: deepens via CSS custom property
            heroSection.style.setProperty('--vignette-boost', progress.toFixed(3));

            scrollTicking = false;
        }

        function onHeroScroll() {
            if (!scrollTicking) {
                window.requestAnimationFrame(updateHeroScroll);
                scrollTicking = true;
            }
        }

        window.addEventListener('scroll', onHeroScroll, { passive: true });

        // Typing starts at 1.0s
        if (heroLine1 && heroLine2 && heroLine3) {
            if (prefersReducedMotion) {
                heroLine1.querySelector('.hero-typed').textContent = "Hi, I'm Grace.";
                heroLine2.querySelector('.hero-typed').textContent = 'I build things that matter.';
                heroLine3.querySelector('.hero-typed').textContent = 'CS & Business @ WashU · Class of 2029';
                heroLine1.querySelectorAll('.hero-cursor').forEach(c => c.classList.add('done'));
                heroLine2.querySelectorAll('.hero-cursor').forEach(c => c.classList.add('done'));
                heroLine3.querySelectorAll('.hero-cursor').forEach(c => c.classList.add('done'));
                if (heroUnderline) heroUnderline.classList.add('is-drawn');
            } else {
                setTimeout(() => {
                    typeLine(heroLine1, "Hi, I'm Grace.", 55, () => {
                        setTimeout(() => {
                            typeLine(heroLine2, 'I build things that matter.', 55, () => {
                                setTimeout(() => {
                                    typeLine(heroLine3, 'CS & Business @ WashU · Class of 2029', 55, () => {
                                        if (heroUnderline) heroUnderline.classList.add('is-drawn');
                                    });
                                }, 400);
                            });
                        }, 400);
                    });
                }, 1000);
            }
        }
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

        bagImg.addEventListener('click', () => {
            const isOpening = !bagCanvas.classList.contains('opened');

            if (isOpening) {
                bagCanvas.classList.add('opened');
                allBlobs.forEach(b => b.classList.remove('was-open'));
            } else {
                bagCanvas.classList.remove('opened');
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

        bagCanvas.querySelectorAll('.skill-blob').forEach(blob => {
            blob.style.cursor = 'pointer';
            blob.addEventListener('click', (e) => {
                e.stopPropagation();
                if (activeTooltip) activeTooltip.remove();

                const name = blob.textContent.trim();
                const desc = skillDescriptions[name];
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
    // EXPERIENCE — GROWING VINE TIMELINE
    // ============================================
    const vineSection = document.getElementById('experience');
    if (vineSection) {
        const vineTimeline = document.getElementById('vineTimeline');
        const stem = vineSection.querySelector('.vine-stem');
        const branches = vineSection.querySelectorAll('.vine-branch');
        const flowers = vineSection.querySelectorAll('.vine-flower');
        const cards = vineSection.querySelectorAll('.vine-card');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        // Flower Y-positions in viewBox units (match transform translate in HTML)
        const flowerYs = [250, 640, 1020, 1390, 1780, 2160];
        const viewBoxHeight = 2400;

        if (stem && !isMobile && !reducedMotion) {
            const stemLength = stem.getTotalLength();
            stem.style.strokeDasharray = stemLength;
            stem.style.strokeDashoffset = stemLength;

            let ticking = false;

            function updateVine() {
                const rect = vineTimeline.getBoundingClientRect();
                const viewportH = window.innerHeight;

                // Progress: 0 when section bottom enters viewport, 1 when section top exits
                // Effectively: how much of the timeline has passed a point ~40% down the viewport
                const trigger = viewportH * 0.6;
                let progress = (trigger - rect.top) / rect.height;
                progress = Math.max(0, Math.min(1, progress));

                // Draw stem based on progress
                stem.style.strokeDashoffset = stemLength * (1 - progress);

                // Compute the current "tip" Y in viewBox units
                const tipY = progress * viewBoxHeight;

                flowers.forEach((flower, i) => {
                    const flowerY = flowerYs[i];
                    if (tipY >= flowerY - 30) {
                        flower.classList.add('bloomed');
                        if (branches[i]) branches[i].classList.add('bloomed');
                        if (cards[i]) cards[i].classList.add('bloomed');
                    } else {
                        flower.classList.remove('bloomed');
                        if (branches[i]) branches[i].classList.remove('bloomed');
                        if (cards[i]) cards[i].classList.remove('bloomed');
                    }
                });

                ticking = false;
            }

            function onScroll() {
                if (!ticking) {
                    window.requestAnimationFrame(updateVine);
                    ticking = true;
                }
            }

            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onScroll, { passive: true });
            updateVine();
        } else {
            // Mobile or reduced motion: reveal everything statically
            flowers.forEach(f => f.classList.add('bloomed'));
            branches.forEach(b => b.classList.add('bloomed'));
            cards.forEach(c => c.classList.add('bloomed'));
            if (stem) stem.style.strokeDashoffset = '0';
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
