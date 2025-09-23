// Analytics configuration and tracking
let analytics = null;

// Initialize analytics when ThriveStack is ready
function initializeAnalytics() {
    if (window.thriveStack) {
        analytics = window.thriveStack;
        console.log('ThriveStack analytics initialized successfully');
        
        // Track app initialization
        trackEvent('app_initialized', {
            page: window.location.pathname,
            timestamp: new Date().toISOString()
        });
    } else {
        // Retry if ThriveStack isn't ready yet
        setTimeout(initializeAnalytics, 100);
    }
}

// Helper function to track events
function trackEvent(eventName, properties = {}) {
    if (analytics && analytics.track) {
        analytics.track(eventName, properties).catch(error => {
            console.warn('Analytics tracking failed:', error);
        });
    }
}

// Helper function to identify users
function identifyUser(userId, userEmail, traits = {}) {
    if (analytics && analytics.setUser) {
        analytics.setUser(userId, userEmail, traits).catch(error => {
            console.warn('User identification failed:', error);
        });
    }
}

// Navigation functions
function goToDashboard() {
    trackEvent('navigation_click', {
        from_page: 'home',
        to_page: 'dashboard',
        element: 'cta_button'
    });
    window.location.href = 'dashboard.html';
}

function goToHome() {
    trackEvent('navigation_click', {
        from_page: 'dashboard',
        to_page: 'home',
        element: 'nav_link'
    });
    window.location.href = 'index.html';
}

// Dashboard functions
function addNewUser() {
    trackEvent('dashboard_action_click', {
        action: 'add_new_user',
        page: 'dashboard',
        element: 'action_button'
    });
    alert('Add New User functionality would be implemented here!');
    // In a real app, this would open a modal or redirect to a form
}

function viewReports() {
    trackEvent('dashboard_action_click', {
        action: 'view_reports',
        page: 'dashboard',
        element: 'action_button'
    });
    alert('View Reports functionality would be implemented here!');
    // In a real app, this would redirect to a reports page
}

function settings() {
    trackEvent('dashboard_action_click', {
        action: 'settings',
        page: 'dashboard',
        element: 'action_button'
    });
    alert('Settings functionality would be implemented here!');
    // In a real app, this would redirect to a settings page
}

// Animate numbers on dashboard load
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number');
    
    numbers.forEach(number => {
        const target = parseInt(number.textContent.replace(/[^\d]/g, ''));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format the number based on the original format
            if (number.textContent.includes('$')) {
                number.textContent = '$' + Math.floor(current).toLocaleString();
            } else if (number.textContent.includes(',')) {
                number.textContent = Math.floor(current).toLocaleString();
            } else {
                number.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Add smooth scrolling for anchor links
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add loading animation
function showLoading() {
    const loading = document.createElement('div');
    loading.id = 'loading';
    loading.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;
    
    document.body.appendChild(loading);
    
    // Remove loading after 1 second
    setTimeout(() => {
        if (document.getElementById('loading')) {
            document.getElementById('loading').remove();
        }
    }, 1000);
}

// Add CSS for loading spinner
function addLoadingStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            text-align: center;
        }
        
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize analytics first
    initializeAnalytics();
    
    // Add loading styles
    addLoadingStyles();
    
    // Show loading animation
    showLoading();
    
    // Initialize smooth scrolling
    smoothScroll();
    
    // Track page view
    trackEvent('page_view', {
        page_title: document.title,
        page_url: window.location.href,
        page_path: window.location.pathname,
        referrer: document.referrer || 'direct'
    });
    
    // If we're on the dashboard page, animate the numbers
    if (window.location.pathname.includes('dashboard.html')) {
        setTimeout(animateNumbers, 1000); // Wait for loading to complete
        
        // Track dashboard view
        trackEvent('dashboard_viewed', {
            stats_visible: true,
            timestamp: new Date().toISOString()
        });
    } else if (window.location.pathname.includes('index.html')) {
        // Track home page view
        trackEvent('home_viewed', {
            features_visible: true,
            timestamp: new Date().toISOString()
        });
    }
    
    // Add click handlers for navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href !== window.location.pathname.split('/').pop()) {
                // Track navigation click
                trackEvent('navigation_click', {
                    from_page: window.location.pathname.split('/').pop(),
                    to_page: href,
                    element: 'nav_link',
                    link_text: this.textContent.trim()
                });
                
                showLoading();
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            }
        });
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.feature-card, .stat-card, .dashboard-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            
            // Track card hover
            trackEvent('card_hover', {
                card_type: this.classList.contains('feature-card') ? 'feature' : 
                          this.classList.contains('stat-card') ? 'stat' : 'dashboard',
                card_title: this.querySelector('h3, h4')?.textContent || 'unknown',
                page: window.location.pathname.split('/').pop()
            });
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Track CTA button clicks
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('cta_click', {
                button_text: this.textContent.trim(),
                page: window.location.pathname.split('/').pop(),
                element: 'cta_button'
            });
        });
    });
    
    // Track feature card interactions
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h4')?.textContent || 'unknown';
            trackEvent('feature_card_click', {
                feature_title: title,
                page: 'home'
            });
        });
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals or overlays
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => modal.style.display = 'none');
        }
    });
});

// Add some sample data updates for the dashboard
function updateDashboardData() {
    // Simulate real-time data updates
    setInterval(() => {
        if (window.location.pathname.includes('dashboard.html')) {
            const activeSessions = document.getElementById('activeSessions');
            if (activeSessions) {
                const currentValue = parseInt(activeSessions.textContent.replace(/[^\d]/g, ''));
                const newValue = currentValue + Math.floor(Math.random() * 10) - 5;
                activeSessions.textContent = Math.max(0, newValue).toLocaleString();
            }
        }
    }, 10000); // Update every 10 seconds
}

// Start data updates
updateDashboardData();

// Advanced analytics tracking features
function setupAdvancedTracking() {
    // Track time on page
    if (window.ThriveStackConfig?.customEvents?.trackTimeOnPage) {
        let timeOnPage = 0;
        const interval = window.ThriveStackConfig.customEvents.timeOnPageInterval || 30000;
        
        setInterval(() => {
            timeOnPage += interval / 1000; // Convert to seconds
            trackEvent('time_on_page', {
                page: window.location.pathname.split('/').pop(),
                time_seconds: timeOnPage,
                time_minutes: Math.round(timeOnPage / 60 * 100) / 100
            });
        }, interval);
    }
    
    // Track scroll depth
    if (window.ThriveStackConfig?.customEvents?.trackScrollDepth) {
        const thresholds = window.ThriveStackConfig.customEvents.scrollDepthThresholds || [25, 50, 75, 90, 100];
        const trackedThresholds = new Set();
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);
            
            thresholds.forEach(threshold => {
                if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
                    trackedThresholds.add(threshold);
                    trackEvent('scroll_depth', {
                        page: window.location.pathname.split('/').pop(),
                        scroll_percentage: threshold,
                        scroll_position: scrollTop
                    });
                }
            });
        });
    }
    
    // Track exit intent
    if (window.ThriveStackConfig?.customEvents?.trackExitIntent) {
        let exitIntentTracked = false;
        
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !exitIntentTracked) {
                exitIntentTracked = true;
                trackEvent('exit_intent', {
                    page: window.location.pathname.split('/').pop(),
                    time_on_page: Math.round((Date.now() - performance.timing.navigationStart) / 1000)
                });
            }
        });
    }
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
        trackEvent('visibility_change', {
            page: window.location.pathname.split('/').pop(),
            visibility_state: document.visibilityState,
            timestamp: new Date().toISOString()
        });
    });
    
    // Track window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            trackEvent('window_resize', {
                page: window.location.pathname.split('/').pop(),
                viewport_width: window.innerWidth,
                viewport_height: window.innerHeight
            });
        }, 250);
    });
}

// Setup advanced tracking after a short delay to ensure ThriveStack is ready
setTimeout(setupAdvancedTracking, 1000);
