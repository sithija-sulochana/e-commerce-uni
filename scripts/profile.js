// ** Get user details from URL parameters and populate these details in the profile page
document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);

    const fullname = params.get("fullname");
    const email = params.get("email");
    const phone = params.get("phone");
    const sidebarName = document.getElementById('sidebar-name');

    // update the sidebar name with the greeting
    if(sidebarName && fullname){
        sidebarName.innerHTML = `Hey ${fullname.split(' ')[0]}! 👋`;
    }



    // Populate Input Fields
    if (fullname && email && phone && params.get("loggedin") === "true") {
        document.getElementById('input-fullname').value = fullname;
        document.getElementById('input-email').value = email;
        document.getElementById('input-phone').value = phone;

        console.log("User Full Name:", fullname);
    }

    // Set up the button listener for Edit
    const editBtn = document.querySelector('.btn-primary');
    if (editBtn) {
        editBtn.addEventListener('click', toggleEdit);
    }
});

// ** The logic of the profile picture upload and preview
// Note: Ensure your HTML has an <input type="file" id="upload-profile"> 
function setupImageUpload() {
    const uploadInput = document.getElementById('upload-profile');
    const profilePic = document.querySelector('.avatar');

    if (uploadInput) {
        uploadInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    profilePic.src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });
    }
}

//** Funtions for Edit Profile and Go to Homepage buttons
function toggleEdit() {
    const inputs = [
        document.getElementById('input-fullname'),
        document.getElementById('input-email'),
        document.getElementById('input-phone')
    ];
    
    const editBtn = document.querySelector('.btn-primary');

    // Toggle disabled state
    inputs.forEach(input => {
        input.disabled = !input.disabled;
    });

    if (editBtn.textContent === "Edit Profile") {
        editBtn.textContent = "Save Changes";
        editBtn.style.background = "#22c55e"; // Green for save
    } else {
        saveProfile();
    }
}

function saveProfile() {
    const fullname = document.getElementById('input-fullname').value;
    const email = document.getElementById('input-email').value;
    const phone = document.getElementById('input-phone').value;

    // Redirect to homepage with updated info
    window.location.href = `/pages/homepage.html?loggedin=true&fullname=${encodeURIComponent(fullname)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;
}

function goHome() {
    const name = encodeURIComponent(document.getElementById('input-fullname').value);
    const mail = encodeURIComponent(document.getElementById('input-email').value);
    const mob = encodeURIComponent(document.getElementById('input-phone').value);
    
    window.location.href = `/pages/homepage.html?loggedin=true&fullname=${name}&email=${mail}&phone=${mob}`;
}

function logout() {
    window.location.href = '/pages/homepage.html';
}

