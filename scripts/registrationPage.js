document.addEventListener('DOMContentLoaded', function() {

   // Set user credentials to the console (for testing purposes)
 
  
    
    // --- Change the authentication buttons once finished the registration ---
    const urlParams = new URLSearchParams(window.location.search);
    const userState = urlParams.get('loggedin');

    if (userState === 'true') {
        const authButtons = document.querySelector('.auth-buttons');
        if (authButtons) {
            authButtons.innerHTML = `
                <a href="/pages/profile.html?loggedin=true&fullname=${encodeURIComponent(urlParams.get('fullname'))}&email=${encodeURIComponent(urlParams.get('email'))}&phone=${encodeURIComponent(urlParams.get('phone'))}" class="profile-btn" style="margin-right: 15px; font-weight: bold; color: #333; text-decoration: none;">Profile</a>
                <a href="/pages/homepage.html" class="logout-btn" style="background-color: #e74c3c; color: white; padding: 8px 16px; border-radius: 10px; text-decoration: none; font-weight: bold;">Logout</a>
            `;
        }
    }

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
                alert('Account created successfully!');
                // Redirect to homepage with the login flag

                window.location.href = `/pages/homepage.html?loggedin=true&fullname=${encodeURIComponent(fullname.value)}&email=${encodeURIComponent(email.value)}&phone=${encodeURIComponent(phone.value)}`;
               // window.location.href = `/pages/profile.html?loggedin=true&fullname=${encodeURIComponent(fullname.value)}&email=${encodeURIComponent(email.value)}`;

              
              
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

    const params = new URLSearchParams(window.location.search);

    const fullname = params.get("fullname");
    const email = params.get("email");

    if (fullname && email) {
       console.log("User Full Name:", fullname);
       console.log("User Email:", email);
    } else {

    }
});

