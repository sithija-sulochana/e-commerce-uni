document.addEventListener('DOMContentLoaded', function() {

   console.log("js is working");
    const registrationForm = document.getElementById('registerForm');
    
   
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const fullname = document.getElementById('fullname');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
         const address = document.getElementById('address');
            const phone = document.getElementById('phone');
            const terms = document.getElementById('terms');

            clearErrors();
            let isValid = true;

            // Validation
            if (fullname.value.trim().length < 3) {
                showError(fullname, 'Name must be at least 3 characters');
                isValid = false;
            }

            if (!isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            }

            if (!isValidPhone(phone.value)) {
                showError(phone, 'Please enter a valid phone number');
                isValid = false;
            }

            if (password.value.length < 8) {
                showError(password, 'Password must be at least 8 characters');
                isValid = false;
            }

          

            if (!terms.checked) {
                showError(terms, 'You must agree to the terms');
                isValid = false;
            }

            if (isValid) {
                const formData = {
                    fullname: fullname.value,
                    email: email.value,
                    password: password.value,
                    phone: phone.value,
                    address: address.value
                };

                console.log("Form Data:", formData);

                console.log("Sending request")

                fetch('http://localhost/E-commerce/backend/auth/register.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
           
                .then(data => {
                    if (data.success) {
                        alert(data.message);
                      
                        localStorage.setItem('user', JSON.stringify({
                            isLoggedIn: true,
                            fullname: fullname.value,
                            email: email.value
                        }));
                        alert('Registration successful! Welcome, ' + fullname.value + '!');
                        window.location.href = '../pages/homepage.html';
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred during registration.');
                });
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

function isValidEmail(value) {
    const emailValue = value.trim();  //sithijahiripitiya16@gmail.com
    const atIndex = emailValue.indexOf('@'); // 20
    const lastAtIndex = emailValue.lastIndexOf('@');//19

    if (atIndex <= 0 || atIndex !== lastAtIndex) return false; 

    const localPart = emailValue.slice(0, atIndex); //sithijahiripitiya16 
    const domainPart = emailValue.slice(atIndex + 1); //gmail.com
    if (!localPart || !domainPart) return false;

    const dotIndex = domainPart.indexOf('.');
    const lastDotIndex = domainPart.lastIndexOf('.');
    if(domainPart != "gmail.com") showError(email,"Ensure that your are login through only google");
    if (dotIndex <= 0 || lastDotIndex === domainPart.length - 1) return false;

    if (emailValue.includes(' ')) return false;

    return true;
}

function isValidPhone(value) {
    const phoneValue = value.trim();
    if (phoneValue.length < 10) return false;

    for (let i = 0; i < phoneValue.length; i++) {
        const char = phoneValue[i];
        if (char < '0' || char > '9') {
            return false;
        }
    }
    

    return true; 
    
}

