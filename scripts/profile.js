// ** Get user details from URL parameters and populate the profile page
document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);

    const fullname = params.get("fullname");
    const email = params.get("email");
    const phone = params.get("phone");
    const isLoggedIn = params.get("loggedin") === "true";

    // Update Header Display
    const displayName = document.getElementById('display-name');
    const displayEmail = document.getElementById('display-email');

    if (fullname && displayName) {
        displayName.textContent = fullname;
    }
    if (email && displayEmail) {
        displayEmail.innerHTML = `<i class="fa-solid fa-envelope"></i> ${email}`;
    }

    // Populate Form Input Fields (if logged in)
    if (isLoggedIn) {
        if (fullname) document.getElementById('name').value = fullname;
        if (email) document.getElementById('email').value = email;
       
    }

    // Initialize Profile Pic if needed
    const profilePic = document.getElementById('profile-pic');
    if (profilePic && fullname) {
        profilePic.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullname)}&background=2563eb&color=fff`;
    }

    // Set up standard button listeners
    const editBtn = document.getElementById('edit-profile-btn');
    if (editBtn) {
        editBtn.addEventListener('click', toggleEditSection);
    }

    setupImageUpload();
});

// ** Image upload logic for the new profile-pic ID
function setupImageUpload() {
    const uploadInput = document.getElementById('upload-profile'); // Add this ID to your camera button input
    const profilePic = document.getElementById('profile-pic');

    if (uploadInput && profilePic) {
        uploadInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => profilePic.src = e.target.result;
                reader.readAsDataURL(file);
            }
        });
    }
}

// ** Logic to show/hide the edit section
function toggleEditSection() {
    const editSection = document.getElementById('edit-section');
    if (editSection) {
        const isActive = editSection.classList.toggle('edit-section-active');
        if (isActive) {
            editSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// ** Redirect/Save logic
function saveProfile() {
    const fullname = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    // Construct URL with new values to persist "state" back to homepage
    const query = `?loggedin=true&fullname=${encodeURIComponent(fullname)}&email=${encodeURIComponent(email)}`;
    window.location.href = `/pages/homepage.html${query}`;
}

function logout() {
    window.location.href = '/pages/homepage.html';
}

function init() {
    const orderList = [
    { id: 'ORD12345', date: '2024-05-01', status: 'Delivered', itemPrice: 'Rs.401,000', itemImage: "https://images.unsplash.com/photo-1593642632823-8f785bf67e45?w=500&q=80", itemName: 'Asus TUF Gaming F15' },
    { id: 'ORD12346', date: '2024-05-15', status: 'Processing', itemPrice: 'Rs.150,000', itemImage: "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=500&q=80", itemName: 'Lenovo Legion 5 Pro' },
    { id: 'ORD12347', date: '2024-06-01', status: 'Shipped', itemPrice: 'Rs.200,000', itemImage: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80", itemName: 'Dell G15 Gaming Laptop' }
];

const orderGrid = document.getElementById('orderGrid');

// Render Cards
orderGrid.innerHTML = orderList.map(order => `
                <div class="order-card">
                    <img src="${order.itemImage}" alt="${order.itemName}" class="order-img">
                    <div class="order-info">
                        <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
                        <h3 style="margin-top: 8px;">${order.itemName}</h3>
                        <p style="color: var(--muted-color); font-size: 0.85rem;">Ordered on ${order.date}</p>
                        <div class="order-meta">
                            <span class="price">${order.itemPrice}</span>
                            <p style="font-size: 0.8rem; color: var(--muted-color)">ID: ${order.id}</p>
                        </div>
                    </div>
                    <button class="btn-view">View Details</button>
                </div>
            `).join('');

// --- Scroll Reveal Logic ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('reveal');
            }, index * 150); // Staggered delay
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.order-card').forEach(card => observer.observe(card));

// --- Profile Logic ---
const profilePic = document.getElementById('profile-pic');
profilePic.src = 'https://ui-avatars.com/api/?name=John+Doe&background=2563eb&color=fff';

// --- Toggle Logic ---
const editBtn = document.getElementById('edit-profile-btn');
const editSection = document.getElementById('edit-section');
const toggleEdit = () => {
    const isActive = editSection.classList.toggle('edit-section-active');
    if (isActive) editSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
};




}





window.onload = init;

editBtn.addEventListener('click', toggleEdit);
document.getElementById('cancel-edit').addEventListener('click', toggleEdit);

document.getElementById('edit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('display-name').textContent = document.getElementById('name').value;
    document.getElementById('display-email').innerHTML = `<i class="fa-solid fa-envelope"></i> ${document.getElementById('email').value}`;
    toggleEdit();
});
