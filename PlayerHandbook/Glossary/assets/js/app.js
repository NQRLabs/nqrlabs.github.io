/* ═══════════════════════════════════════════════════════════════════════════
   THE ARG COOKBOOK - RECIPE TEMPLATE JAVASCRIPT
   Scroll-driven animations, parallax effects, and interactivity
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    /* ═══════════════════════════════════════════════════════════════════════
       INITIALIZATION
       ═══════════════════════════════════════════════════════════════════════ */
    document.addEventListener('DOMContentLoaded', function() {
        initScrollAnimations();
        initParallax();
        initProgressBar();
        initNavigation();
        initModals();
        initSmoothScroll();
        initMobileNav();

        // Glossary-specific initialization
        initGlossarySearch();
        initCategoryFilters();
        initAccordions();
        initAlphabetNav();
    });

    /* ═══════════════════════════════════════════════════════════════════════
       SCROLL ANIMATIONS
       Intersection Observer for revealing elements on scroll
       ═══════════════════════════════════════════════════════════════════════ */
    function initScrollAnimations() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Show all elements immediately
            document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
                el.classList.add('animated');
            });
            return;
        }

        var observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var element = entry.target;
                    var delay = parseInt(element.dataset.delay) || 0;

                    setTimeout(function() {
                        element.classList.add('animated');
                    }, delay);

                    // Unobserve after animation
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
            observer.observe(el);
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════
       PARALLAX EFFECTS
       Smooth background movement on scroll
       ═══════════════════════════════════════════════════════════════════════ */
    function initParallax() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        var parallaxElements = document.querySelectorAll('[data-parallax]');

        if (parallaxElements.length === 0) return;

        var ticking = false;

        function updateParallax() {
            var scrollY = window.pageYOffset;

            parallaxElements.forEach(function(element) {
                var speed = parseFloat(element.dataset.parallax) || 0.3;
                var rect = element.getBoundingClientRect();
                var elementTop = rect.top + scrollY;
                var windowHeight = window.innerHeight;

                // Only animate when element is in view
                if (scrollY + windowHeight > elementTop && scrollY < elementTop + rect.height) {
                    var yOffset = (scrollY - elementTop) * speed;

                    // Find the image inside and transform it
                    var image = element.querySelector('.hero-image, .video-bg-image, .examples-bg-image, .cta-bg-image');
                    if (image) {
                        image.style.transform = 'translate3d(0, ' + yOffset + 'px, 0)';
                    }
                }
            });

            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });

        // Initial call
        updateParallax();
    }

    /* ═══════════════════════════════════════════════════════════════════════
       PROGRESS BAR
       Shows scroll progress through the page
       ═══════════════════════════════════════════════════════════════════════ */
    function initProgressBar() {
        var progressFill = document.querySelector('.progress-fill');

        if (!progressFill) return;

        function updateProgress() {
            var scrollTop = window.pageYOffset;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var progress = (scrollTop / docHeight) * 100;

            progressFill.style.width = progress + '%';
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress(); // Initial call
    }

    /* ═══════════════════════════════════════════════════════════════════════
       NAVIGATION
       Scroll-based styling and active states
       ═══════════════════════════════════════════════════════════════════════ */
    function initNavigation() {
        var nav = document.querySelector('.recipe-nav');

        if (!nav) return;

        var scrollThreshold = 100;

        function updateNav() {
            if (window.pageYOffset > scrollThreshold) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', updateNav, { passive: true });
        updateNav(); // Initial call
    }

    /* ═══════════════════════════════════════════════════════════════════════
       MOBILE NAVIGATION
       Toggle menu for small screens
       ═══════════════════════════════════════════════════════════════════════ */
    function initMobileNav() {
        var toggle = document.querySelector('.nav-toggle');
        var navLinks = document.querySelector('.nav-links');

        if (!toggle || !navLinks) return;

        toggle.addEventListener('click', function() {
            var isExpanded = navLinks.style.display === 'flex';

            if (isExpanded) {
                navLinks.style.display = '';
                toggle.setAttribute('aria-expanded', 'false');
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.flexDirection = 'column';
                navLinks.style.padding = '16px';
                navLinks.style.background = 'rgba(4, 7, 10, 0.95)';
                navLinks.style.borderTop = '1px solid rgba(93, 225, 255, 0.1)';
                toggle.setAttribute('aria-expanded', 'true');
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navLinks.style.display = '';
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Reset on resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navLinks.style = '';
            }
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════
       MODALS
       Open/close modal dialogs
       ═══════════════════════════════════════════════════════════════════════ */
    function initModals() {
        // Open modal triggers
        document.querySelectorAll('[data-modal]').forEach(function(trigger) {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                var modalId = 'modal-' + this.dataset.modal;
                var modal = document.getElementById(modalId);

                if (modal) {
                    openModal(modal);
                }
            });
        });

        // Close buttons
        document.querySelectorAll('.modal-close').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var modal = this.closest('.modal');
                if (modal) {
                    closeModal(modal);
                }
            });
        });

        // Close on backdrop click
        document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
            backdrop.addEventListener('click', function() {
                var modal = this.closest('.modal');
                if (modal) {
                    closeModal(modal);
                }
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                var activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    closeModal(activeModal);
                }
            }
        });
    }

    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    /* ═══════════════════════════════════════════════════════════════════════
       SMOOTH SCROLL
       Smooth scrolling for anchor links
       ═══════════════════════════════════════════════════════════════════════ */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                var targetId = this.getAttribute('href');

                // Skip if just "#"
                if (targetId === '#') return;

                var target = document.querySelector(targetId);

                if (target) {
                    e.preventDefault();

                    var navHeight = document.querySelector('.recipe-nav').offsetHeight || 0;
                    var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════
       UTILITY FUNCTIONS
       Helper functions for common operations
       ═══════════════════════════════════════════════════════════════════════ */

    // Debounce function
    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    // Throttle function
    function throttle(func, limit) {
        var inThrottle;
        return function() {
            var context = this;
            var args = arguments;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }

    /* ═══════════════════════════════════════════════════════════════════════
       GLOSSARY SEARCH
       Real-time filtering of terms
       ═══════════════════════════════════════════════════════════════════════ */
    function initGlossarySearch() {
        var searchInput = document.getElementById('glossary-search-input');
        var resultsCount = document.getElementById('results-count');
        var noResults = document.getElementById('no-results');

        if (!searchInput) return;

        var debouncedSearch = debounce(function() {
            var query = searchInput.value.toLowerCase().trim();
            var visibleCount = 0;
            var totalCount = 0;

            // Get all term elements
            var termCards = document.querySelectorAll('.term-card, .term-accordion, .term-item, .term-expanded, .term-featured');
            var letterSections = document.querySelectorAll('.letter-section');

            termCards.forEach(function(card) {
                totalCount++;
                var termName = card.querySelector('.term-name');
                var termDef = card.querySelector('.term-definition');

                var nameText = termName ? termName.textContent.toLowerCase() : '';
                var defText = termDef ? termDef.textContent.toLowerCase() : '';

                var matches = query === '' || nameText.includes(query) || defText.includes(query);

                if (matches) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Hide empty letter sections
            letterSections.forEach(function(section) {
                var visibleTerms = section.querySelectorAll('.term-card:not([style*="display: none"]), .term-accordion:not([style*="display: none"]), .term-item:not([style*="display: none"])');
                section.style.display = visibleTerms.length === 0 ? 'none' : '';
            });

            // Update results count
            if (resultsCount) {
                if (query === '') {
                    resultsCount.textContent = '';
                } else {
                    resultsCount.textContent = visibleCount + ' of ' + totalCount + ' terms';
                }
            }

            // Show/hide no results message
            if (noResults) {
                noResults.style.display = visibleCount === 0 && query !== '' ? 'block' : 'none';
            }
        }, 200);

        searchInput.addEventListener('input', debouncedSearch);
    }

    /* ═══════════════════════════════════════════════════════════════════════
       CATEGORY FILTERS
       Filter terms by category
       ═══════════════════════════════════════════════════════════════════════ */
    function initCategoryFilters() {
        var categoryPills = document.querySelectorAll('.category-pill');

        if (categoryPills.length === 0) return;

        categoryPills.forEach(function(pill) {
            pill.addEventListener('click', function() {
                var category = this.dataset.category;

                // Update active state
                categoryPills.forEach(function(p) {
                    p.classList.remove('active');
                });
                this.classList.add('active');

                // Filter terms (only in glossary content, not the filter buttons)
                var termCards = document.querySelectorAll('#glossary-content [data-category]');
                var letterSections = document.querySelectorAll('.letter-section');

                termCards.forEach(function(card) {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Hide empty letter sections
                letterSections.forEach(function(section) {
                    var visibleTerms = section.querySelectorAll('[data-category]:not([style*="display: none"])');
                    section.style.display = visibleTerms.length === 0 ? 'none' : '';
                });
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════
       ACCORDIONS
       Expand/collapse accordion terms
       ═══════════════════════════════════════════════════════════════════════ */
    function initAccordions() {
        var accordionHeaders = document.querySelectorAll('.term-accordion-header');

        if (accordionHeaders.length === 0) return;

        accordionHeaders.forEach(function(header) {
            header.addEventListener('click', function() {
                var accordion = this.closest('.term-accordion');

                if (accordion) {
                    accordion.classList.toggle('open');
                }
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════
       ALPHABET NAVIGATION
       Highlight active letter on scroll
       ═══════════════════════════════════════════════════════════════════════ */
    function initAlphabetNav() {
        var alphabetLinks = document.querySelectorAll('.alphabet-links a');
        var letterSections = document.querySelectorAll('.letter-section');

        if (alphabetLinks.length === 0 || letterSections.length === 0) return;

        var throttledUpdate = throttle(function() {
            var scrollPosition = window.pageYOffset + 200;
            var currentLetter = '';

            letterSections.forEach(function(section) {
                var sectionTop = section.offsetTop;
                var sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentLetter = section.id;
                }
            });

            // Update active state
            alphabetLinks.forEach(function(link) {
                var href = link.getAttribute('href');
                if (href === '#' + currentLetter) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }, 100);

        window.addEventListener('scroll', throttledUpdate, { passive: true });
        throttledUpdate(); // Initial call
    }

    /* ═══════════════════════════════════════════════════════════════════════
       MINI-TOOL PLACEHOLDER
       Space for additional interactive tools
       ═══════════════════════════════════════════════════════════════════════ */

})();
