// ** Get user details from URL parameters and populate these details in the profile page

document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);

    const fullname = params.get("fullname");
    const email = params.get("email");
    const phone = params.get("phone");

    document.getElementById('greeting-name').innerHTML = `Hey ${fullname ? fullname.split(' ')[0] : ''} 👋 `;
    document.getElementById('user-email').innerHTML = `${email ? email : ''}`;



    if (fullname && email && phone && params.get("loggedin") === "true") {
        document.getElementById('input-fullname').value = fullname;
        document.getElementById('input-email').value = email;
        document.getElementById('input-phone').value = phone;

        console.log("User Full Name:", fullname);
    }
});



// ** The logic of the profile picture upload and preview

const uploadInput = document.getElementById('upload-profile');
const profilePic = document.getElementById('profile-pic');

uploadInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profilePic.src = e.target.result;
        }
        reader.readAsDataURL(file);


        document.getElementById('profileImage').src = URL.createObjectURL(file);


    }

});

//** Funtions for Edit Profile and Go to Homepage buttons

function toggleEdit() {
    document.querySelectorAll('.details-grid input').forEach(input => {
        input.disabled = !input.disabled;
    });

    document.getElementById('card-details').innerHTML = '<button onclick="saveProfile()" style="width: 100px;padding: 10px; background: var(--primary); color: white; border-radius: 10px; cursor: pointer;">Save</button>';

    // once finished editing, save the changes and redirect to homepage with updated info

    document.getElementById('card-details').addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') {
            const fullname = document.getElementById('input-fullname').value;
            const email = document.getElementById('input-email').value;
            const phone = document.getElementById('input-phone').value;
            window.location.href = `/pages/homepage.html?loggedin=true&fullname=${encodeURIComponent(fullname)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;

        }
    });

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


//TODO: implement the logic for getting birthday details from the user