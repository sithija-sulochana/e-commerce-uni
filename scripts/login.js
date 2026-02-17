function logIn(event) {
    // 1. Prevent the page from refreshing
    if (event) event.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // Select the specific error paragraphs
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Reset the messages 
    emailError.textContent = '';
    passwordError.textContent = '';

    let hasError = false;

    if (email === '') {
        emailError.textContent = 'Please enter your email.';
        hasError = true;
    } else if (!validateEmail(email)) {
        emailError.textContent = 'Please enter a valid email address.';
        hasError = true;
    }


    if (password === '') {
        passwordError.textContent = 'Please enter your password.';
        hasError = true;
    } else if (!validatePassword(password)) {
        passwordError.textContent = 'Password must be at least 8 characters long.';
        hasError = true;
    }

    if (!hasError) {

        console.log("Attempting login with:", email);
        alert("Login successful!");
        window.location.href = `/pages/profile.html?fullname=John%20Doe&email=${encodeURIComponent(email)}&phone=1234567890&loggedin=true`;
    
    }
}

// Check email correctness (helper method)
    function validateEmail(email){
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
        
    }

//Check password correctness (helper method)
    function validatePassword(password){
        return password.length >= 8;
    }