// auth.js
async function checkAuthStatus() {
    try {
        const response = await fetch('/E-commerce/backend/userManagement/GetUserById.php');
        const data = await response.json();


        const protectedPages = ['profile.html', 'checkout.html', 'order-history.html'];
        const currentPage = window.location.pathname.split('/').pop();
        const isProtected = protectedPages.includes(currentPage);

        if (!data.success || data.authenticated === false) {

            localStorage.removeItem('user');

            if (isProtected) {

                alert("Your session has expired. Please log in again.");
                window.location.href = '/E-commerce/pages/loginPage.html';
            } else {
  
                updateNavForGuest();
            }
        } else {
   
            updateNavForUser(data.user);
        }
    } catch (error) {
        console.error("Auth check failed:", error);
    }
}

function updateNavForGuest() {
    const userLink = document.getElementById('nav-user-link');
    if (userLink) userLink.innerHTML = '<a href="/E-commerce/pages/loginPage.html">Login</a>';
}

function updateNavForUser(user) {
    const userLink = document.getElementById('nav-user-link');
    if (userLink) userLink.textContent = user.fullname;
}


document.addEventListener('DOMContentLoaded', checkAuthStatus);