document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form inputs
    const fullname = document.getElementById('fullname');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirm = document.getElementById('confirm');
    const terms = document.getElementById('terms');

    // Reset error messages
    clearErrors();

    // Validation flags
    let isValid = true;

    // Validate Full Name
    if (fullname.value.trim().length < 3) {
        showError(fullname, 'Name must be at least 3 characters');
        isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }

    // Validate Password
    if (password.value.length < 8) {
        showError(password, 'Password must be at least 8 characters');
        isValid = false;
    }

    // Validate Confirm Password
    if (password.value !== confirm.value) {
        showError(confirm, 'Passwords do not match');
        isValid = false;
    }

    // Validate Terms
    if (!terms.checked) {
        showError(terms, 'You must agree to the terms');
        isValid = false;
    }

    // Submit if valid
    if (isValid) {
        console.log('[v0] Registration form submitted successfully');
        alert('Account created successfully!');
        // You can send data to server here
        this.reset();
    }
});

// Show error message
function showError(input, message) {
    const errorMsg = input.parentElement.querySelector('.error-msg');
    if (errorMsg) {
        errorMsg.textContent = message;
        input.style.borderColor = '#e74c3c';
    }
}

// Clear all error messages
function clearErrors() {
    document.querySelectorAll('.error-msg').forEach(msg => msg.textContent = '');
    document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]').forEach(input => {
        input.style.borderColor = '#ddd';
    });
}

// Real-time validation on input
document.querySelectorAll('#registerForm input[type="text"], #registerForm input[type="email"], #registerForm input[type="password"]').forEach(input => {
    input.addEventListener('blur', function() {
        clearErrors();
    });
});
