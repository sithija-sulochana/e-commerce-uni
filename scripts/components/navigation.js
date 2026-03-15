// navbar.js
const navbarTemplate = `
<style>
    :root {
        --primary: #667eea;
        --secondary: #764ba2;
        --text-dark: #2d3436;
        --bg-lighter: #ffffff;
        --border-light: #eee;
        --shadow-sm: 0 2px 4px rgba(0,0,0,0.05);
        --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
        --radius-sm: 4px;
        --radius-md: 8px;
        --transition: all 0.3s ease;
    }

    .navbar { position: fixed; width: 100%; top: 0; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-light); z-index: 1000; box-shadow: var(--shadow-sm); font-family: 'Poppins', sans-serif; }
    .nav-container { display: flex; justify-content: space-between; align-items: center; padding: 0 6%; height: 70px; max-width: 1400px; margin: 0 auto; width: 100%; box-sizing: border-box; }
    .logo { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 24px; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-decoration: none; cursor: pointer; }
    .nav-center { display: flex; gap: 40px; align-items: center; }
    .nav-links { display: flex; gap: 30px; align-items: center; list-style: none; margin: 0; padding: 0; }
    .nav-links a { text-decoration: none; color: var(--text-dark); font-weight: 500; font-size: 14px; position: relative; transition: var(--transition); }
    .nav-links a:hover { color: var(--primary); }
    .dropdown { position: relative; }
    .dropdown-content { display: none; position: absolute; top: 100%; left: 0; background: var(--bg-lighter); border-radius: var(--radius-md); box-shadow: var(--shadow-md); margin-top: 10px; overflow: hidden; min-width: 180px; border: 1px solid var(--border-light); }
    .dropdown-content a { display: block; padding: 12px 16px; font-size: 14px; }
    .dropdown:hover .dropdown-content { display: block; }
    .btn-auth { display: flex; gap: 10px; }
    .btn-login, .btn-register { padding: 8px 18px; border-radius: var(--radius-sm); font-weight: 600; font-size: 14px; cursor: pointer; transition: var(--transition); text-decoration: none; display: inline-block; }
    .btn-login { border: 1.5px solid var(--primary); background: transparent; color: var(--primary); }
    .btn-login:hover { background: var(--primary); color: white; }
    .btn-register { background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; border: none; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); }
    .icon-link { width: 40px; height: 40px; border: 1.5px solid var(--primary); border-radius: var(--radius-sm); display: inline-flex; align-items: center; justify-content: center; color: var(--primary); transition: var(--transition); text-decoration: none; }
    .icon-link svg { width: 20px; height: 20px; }
    .icon-link:hover { background: var(--primary); color: #fff; }
    .menu-toggle { display: none; font-size: 24px; cursor: pointer; background: none; border: none; }

    @media (max-width: 768px) {
        .nav-center { position: fixed; top: 70px; right: -100%; width: 70%; height: calc(100vh - 70px); background: var(--bg-lighter); flex-direction: column; align-items: flex-start; padding: 30px; gap: 20px; transition: var(--transition); box-shadow: var(--shadow-md); }
        .nav-center.active { right: 0; }
        .nav-links { flex-direction: column; gap: 15px; width: 100%; }
        .menu-toggle { display: block; }
        .dropdown-content { position: static; display: none; width: 100%; }
        .dropdown.active .dropdown-content { display: block; }
    }
</style>

<header class="navbar">
    <div class="nav-container">
        <div class="logo" onclick="window.location.href='#'">🚀 TechHub</div>
        <div class="nav-center" id="navCenter">
            <nav class="nav-links">
                <a href="/pages/homepage.html">Home</a>
                <div class="dropdown" onclick="this.classList.toggle('active')">
                    <a href="/pages/productList.html">Products ▾</a>
                   
                </div>
                <a href="/pages/AboutPage.html">About</a>
                <a href="/pages/ContactPage.html">Contact</a>
            </nav>
            <div class="btn-auth">
                <a href="/pages/loginPage.html" class="btn-login">Login</a>
                <a href="/pages/registrationPage.html" class="btn-register">Register</a>
            </div>
        </div>
        <button class="menu-toggle" id="menuToggle">☰</button>
    </div>
</header>
`;



// Inject into the top of the body
document.body.insertAdjacentHTML('afterbegin', navbarTemplate);

// Check login state and update auth buttons
const user = JSON.parse(localStorage.getItem('user'));
const authButtons = document.querySelector('.btn-auth');

if (user && user.isLoggedIn && authButtons) {
    authButtons.innerHTML = `
        <a href="/pages/ViewCartPage.html" class="icon-link" aria-label="Cart" title="Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart-icon lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </a>
        <a href="/pages/profile.html" class="icon-link" aria-label="Profile" title="Profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </a>
        <a href="#" class="btn-register" onclick="localStorage.removeItem('user'); window.location.href='/pages/homepage.html';">Logout</a>
    `;
}


// Mobile Menu Logic
const menuToggle = document.getElementById('menuToggle');
const navCenter = document.getElementById('navCenter');

menuToggle.addEventListener('click', () => {
    navCenter.classList.toggle('active');
    menuToggle.innerHTML = navCenter.classList.contains('active') ? '✕' : '☰';
});