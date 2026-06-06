/**
 * Session Manager
 * Handles session timeout and auto-logout after 1 day
 */

class SessionManager {
    constructor() {
        this.sessionTimeout = 86400; // 24 hours in seconds
        this.warningTime = 300; // Show warning 5 minutes before timeout
        this.checkInterval = 60000; // Check every 1 minute
        this.sessionCheckUrl = '/E-commerce/backend/auth/checkSession.php';
        this.logoutUrl = '/E-commerce/backend/auth/logout.php';
        this.loginPageUrl = '/E-commerce/pages/loginPage.html';
        this.adminLoginUrl = '/E-commerce/adminPages/adminHome.html';
        
        this.isWarningShown = false;
        this.inactivityTimer = null;
        this.sessionCheckTimer = null;
    }

    /**
     * Initialize session manager
     */
    init() {
        // Only initialize if user is logged in
        if (!this.isUserLoggedIn()) {
            return;
        }

        // Start periodic session check
        this.startSessionCheck();
        
        // Setup activity listeners
        this.setupActivityListeners();
        
        console.log('Session Manager initialized');
    }

    /**
     * Check if user is logged in
     */
    isUserLoggedIn() {
        try {
            const userString = localStorage.getItem('user');
            if (!userString) return false;
            
            const user = JSON.parse(userString);
            // User is logged in if the isLoggedIn flag is true OR if they have an id property (from auth response)
            return user && (user.isLoggedIn === true || user.id);
        } catch (error) {
            console.error('Error checking login status:', error);
            return false;
        }
    }

    /**
     * Start periodic session validation
     */
    startSessionCheck() {
        // Check immediately
        this.validateSession();
        
        // Then check every minute
        this.sessionCheckTimer = setInterval(() => {
            this.validateSession();
        }, this.checkInterval);
    }

    /**
     * Validate session with server
     */
    async validateSession() {
        try {
            const response = await fetch(this.sessionCheckUrl);
            const data = await response.json();

            if (!data.authenticated) {
                if (data.sessionExpired) {
                    this.handleSessionExpired();
                } else {
                    this.handleUserLoggedOut();
                }
                return;
            }

            // Session is valid, update remaining time
            const timeRemaining = data.sessionInfo.timeRemaining;
            const isAdmin = this.isAdminPage();

            if (timeRemaining <= this.warningTime && !this.isWarningShown) {
                this.showSessionWarning(timeRemaining, isAdmin);
            } else if (timeRemaining > this.warningTime && this.isWarningShown) {
                this.hideSessionWarning();
            }

        } catch (error) {
            console.error('Session validation error:', error);
        }
    }

    /**
     * Show session expiration warning
     */
    showSessionWarning(timeRemaining, isAdmin = false) {
        this.isWarningShown = true;
        
        // Create warning modal
        const modal = document.createElement('div');
        modal.id = 'session-warning-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;

        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
                max-width: 400px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            ">
                <h2 style="color: #ff6b6b; margin-top: 0;">Session Expiring Soon</h2>
                <p style="font-size: 16px; color: #333; margin: 15px 0;">
                    Your session will expire in <strong>${minutes}m ${seconds}s</strong>
                </p>
                <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
                    Click below to stay logged in or you will be automatically logged out.
                </p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="sessionManager.continueSession()" style="
                        padding: 10px 20px;
                        background: #0066cc;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 14px;
                    ">Stay Logged In</button>
                    <button onclick="sessionManager.logout()" style="
                        padding: 10px 20px;
                        background: #666;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 14px;
                    ">Logout</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Update countdown every second
        this.countdownInterval = setInterval(() => {
            this.updateWarningCountdown(modal);
        }, 1000);
    }

    /**
     * Update warning countdown display
     */
    updateWarningCountdown(modal) {
        // This will be updated via session validation
    }

    /**
     * Hide session warning modal
     */
    hideSessionWarning() {
        this.isWarningShown = false;
        const modal = document.getElementById('session-warning-modal');
        if (modal) {
            modal.remove();
        }
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }

    /**
     * Continue session (make activity)
     */
    async continueSession() {
        this.hideSessionWarning();
        
        try {
            // Just validating session will update last_activity on server
            await this.validateSession();
            console.log('Session continued');
        } catch (error) {
            console.error('Error continuing session:', error);
        }
    }

    /**
     * Handle session expired
     */
    async handleSessionExpired() {
        this.hideSessionWarning();
        this.clearSessionManager();
        
        alert('Your session has expired. Please log in again.');
        
        // Clear user data
        localStorage.removeItem('user');
        sessionStorage.clear();
        
        // Redirect to login
        window.location.href = this.isAdminPage() ? this.adminLoginUrl : this.loginPageUrl;
    }

    /**
     * Handle user logged out (session data cleared server-side)
     */
    handleUserLoggedOut() {
        this.hideSessionWarning();
        this.clearSessionManager();
        
        localStorage.removeItem('user');
        sessionStorage.clear();
        
        window.location.href = this.isAdminPage() ? this.adminLoginUrl : this.loginPageUrl;
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            await fetch(this.logoutUrl);
            this.handleUserLoggedOut();
        } catch (error) {
            console.error('Logout error:', error);
            this.clearSessionManager();
            localStorage.removeItem('user');
            window.location.href = this.loginPageUrl;
        }
    }

    /**
     * Setup activity listeners
     */
    setupActivityListeners() {
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
        
        events.forEach(event => {
            document.addEventListener(event, () => {
                this.resetInactivityTimer();
            }, true);
        });
    }

    /**
     * Reset inactivity timer
     */
    resetInactivityTimer() {
        // Activity detected - session will be updated on next validation
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }
    }

    /**
     * Check if current page is admin page
     */
    isAdminPage() {
        const pathname = window.location.pathname.toLowerCase();
        return pathname.includes('adminpages') || pathname.includes('admin');
    }

    /**
     * Clear session manager timers
     */
    clearSessionManager() {
        if (this.sessionCheckTimer) {
            clearInterval(this.sessionCheckTimer);
        }
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }

    /**
     * Destroy session manager
     */
    destroy() {
        this.clearSessionManager();
        this.hideSessionWarning();
    }
}

// Create global instance
const sessionManager = new SessionManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    sessionManager.init();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    sessionManager.destroy();
});
