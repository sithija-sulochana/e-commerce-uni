document.addEventListener('DOMContentLoaded', function() {

    // --- Validation Logic for Registration Form ---
    const registrationForm = document.getElementById('registerForm');
    
    // This "if" check prevents the "Cannot read properties of null" error
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const fullname = document.getElementById('fullname');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
         
            const phone = document.getElementById('phone');
            const terms = document.getElementById('terms');

            clearErrors();
            let isValid = true;

            // Validation
            if (fullname.value.trim().length < 3) {
                showError(fullname, 'Name must be at least 3 characters');
                isValid = false;
            }

            if(phone.value.trim().length<10){
                showError(phone, 'Please enter a valid phone number');
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            }

            if (password.value.length < 8) {
                showError(password, 'Password must be at least 8 characters');
                isValid = false;
            }

            // if (password.value !== confirm.value) {
            //     showError(confirm, 'Passwords do not match');
            //     isValid = false;
            // }

            if (!terms.checked) {
                showError(terms, 'You must agree to the terms');
                isValid = false;
            }

            if (isValid) {
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify({
                    isLoggedIn: true,
                    fullname: fullname.value,
                    email: email.value,
                    password: password.value,
                    phone: phone.value
                }));
                
                alert('Account created successfully!');
                window.location.href = '/pages/homepage.html';
                
                localStorage.setItem('currentUser', JSON.stringify({
                    isLoggedIn: false,
                    fullname: fullname.value,
                    password: password.value,
                    email: email.value,
                }));

              
              
            }

       
            
        });
        
    }

  


   
});

// Helper function to Show error messages
function showError(input, message) {
    const errorMsg = input.parentElement.querySelector('.error-msg');
    if (errorMsg) {
        errorMsg.textContent = message;
        input.style.borderColor = '#e74c3c';
    }
}

// Helper functions to Clear all error messages
function clearErrors() {
    document.querySelectorAll('.error-msg').forEach(msg => msg.textContent = '');
    document.querySelectorAll('input').forEach(input => {
        if(input.type !== 'checkbox') input.style.borderColor = '#ddd';
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.fullname && user.email) {
       console.log("User Full Name:", user.fullname);
       console.log("User Email:", user.email);
    }
});

