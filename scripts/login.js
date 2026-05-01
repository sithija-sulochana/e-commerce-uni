function logIn(event) {
    if (event) event.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Clear errors
    emailError.textContent = '';
    passwordError.textContent = '';

    // Basic validation
    if (!email || !password) {
        if (!email) {
            emailError.textContent = 'Email is required';
            emailInput.style.borderColor = '#e74c3c';
        }
        if (!password) {
            passwordError.textContent = 'Password is required';
            passwordInput.style.borderColor = '#e74c3c';
        }
        return;
    }

    console.log("fetch is running");
    // Send request to backend
    fetch('http://localhost/E-commerce/backend/auth/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);

        if (data.success && data.user) {

            // Store user in localStorage
            localStorage.setItem('user', JSON.stringify({
                isLoggedIn: true,
                fullname: data.user.fullname,
                email: data.user.email,
                phone: data.user.phone
            }));

            alert('Welcome back, ' + data.user.fullname + '!');
            window.location.href = '../pages/homepage.html';

        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during login.');
    });
}