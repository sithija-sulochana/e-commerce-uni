function logIn(event) {
    if (event) event.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Reset messages 
    emailError.textContent = '';
    passwordError.textContent = '';

    // Validation
 

    // Retrieve stored user
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));

    // Check credentials
    if (storedUser && storedUser.email === email && storedUser.password === password) {
        // Update login state
        storedUser.isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(storedUser));
        
        // Also set 'user' for navigation to show Cart, Profile, Logout buttons
        localStorage.setItem('user', JSON.stringify({
            isLoggedIn: true,
            fullname: storedUser.fullname,
            email: storedUser.email,
            password: storedUser.password,
            phone: storedUser.phone || ''
        }));
        
        alert("Login successful!");
        window.location.href = '/pages/homepage.html';
    } else {
       
    }

    if(!email || !password) {
        emailInput.style.borderColor = !email ? '#e74c3c' : '#ddd';
        passwordInput.style.borderColor = !password ? '#e74c3c' : '#ddd';
        if(!email) emailError.textContent = 'Email is required.';
        if(!password) passwordError.textContent = 'Password is required.';


    }if(storedUser.email !== email || storedUser.password !== password) {
        emailInput.style.borderColor = '#e74c3c';
        passwordInput.style.borderColor = '#e74c3c';
        emailError.textContent = 'Invalid email or password.';
        passwordError.textContent = 'Invalid email or password.';}
}

