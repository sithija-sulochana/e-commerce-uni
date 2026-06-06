// auth.js - Authentication and Authorization checks

/**
 * Check authentication status for protected pages
 * This should only be called on pages that require authentication
 */
async function checkAuthStatus() {
    try {
        const response = await fetch('/E-commerce/backend/userManagement/GetUserById.php');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        // List of pages that require authentication
        const protectedPages = ['profile.html', 'ViewCartPage.html', 'OrderTrackingPage.html'];
        const currentPage = window.location.pathname.split('/').pop();
        const isProtected = protectedPages.includes(currentPage);

        // If not authenticated
        if (!data.success || data.authenticated === false) {
            localStorage.removeItem('user');

            // Redirect to login only for protected pages
            if (isProtected) {
                alert("Your session has expired. Please log in again.");
                window.location.href = '/E-commerce/pages/loginPage.html';
            } else {
                // For public pages, just update navigation
                updateNavForGuest();
            }
        } else {
            // User is authenticated
            const userData = {
                ...data.user,
                isLoggedIn: true
            };
            updateNavForUser(data.user);
            localStorage.setItem('user', JSON.stringify(userData));
        }
    } catch (error) {
        console.error("Auth check failed:", error);
        // On error, assume user is not logged in and update nav accordingly
        updateNavForGuest();
    }
}

/**
 * Update navigation for guest users
 */
function updateNavForGuest() {
    const userLink = document.getElementById('nav-user-link');
    if (userLink) {
        userLink.innerHTML = '<a href="/E-commerce/pages/loginPage.html">Login</a>';
    }
}

/**
 * Update navigation for authenticated users
 */
function updateNavForUser(user) {
    const userLink = document.getElementById('nav-user-link');
    if (userLink) {
        userLink.innerHTML = `<span>${user.fullname}</span>`;
    }
}

/**
 * Check if user is logged in (based on localStorage)
 */
function isUserLoggedIn() {
    const user = localStorage.getItem('user');
    return user !== null;
}

/**
 * Logout user
 */
async function logout() {
    try {
        await fetch('/E-commerce/backend/auth/logout.php');
    } catch (error) {
        console.error('Logout error:', error);
    }
    
    localStorage.removeItem('user');
    window.location.href = '/E-commerce/pages/loginPage.html';
}

// Run auth check when DOM is loaded
document.addEventListener('DOMContentLoaded', checkAuthStatus);