document.addEventListener('DOMContentLoaded', () => {
    initializeProfile();
    setupEditActions();
    setupOrderHistory();
});

function initializeProfile() {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const fullname = user.fullname || 'John Doe';
    const email = user.email || ' ';

    const displayName = document.getElementById('display-name');
    const displayEmail = document.getElementById('display-email');
    const profilePic = document.getElementById('profile-pic');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    if (displayName) displayName.textContent = fullname;
    if (displayEmail) displayEmail.innerHTML = `<i class="fa-solid fa-envelope"></i> ${email}`;

    if (nameInput) nameInput.value = fullname;
    if (emailInput) emailInput.value = email;

    if (profilePic) {
        profilePic.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullname)}&background=2563eb&color=fff`;
    }
}

function setupEditActions() {
    const editBtn = document.getElementById('edit-profile-btn');
    const cancelBtn = document.getElementById('cancel-edit');
    const form = document.getElementById('edit-form');

    if (editBtn) {
        editBtn.addEventListener('click', toggleEditSection);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', toggleEditSection);
    }

    if (form) {
        form.addEventListener('submit', handleProfileSave);
    }
}

function toggleEditSection() {
    const editSection = document.getElementById('edit-section');
    if (!editSection) return;

    const isActive = editSection.classList.toggle('edit-section-active');
    if (isActive) {
        editSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function handleProfileSave(event) {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    const fullname = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';

    const user = JSON.parse(localStorage.getItem('user')) || {};
    user.fullname = fullname;
    user.email = email;
    localStorage.setItem('user', JSON.stringify(user));

    const displayName = document.getElementById('display-name');
    const displayEmail = document.getElementById('display-email');
    const profilePic = document.getElementById('profile-pic');

    if (displayName) displayName.textContent = fullname || 'John Doe';
    if (displayEmail) displayEmail.innerHTML = `<i class="fa-solid fa-envelope"></i> ${email || 'john.doe@example.com'}`;

    if (profilePic) {
        profilePic.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullname || 'John Doe')}&background=2563eb&color=fff`;
    }

    toggleEditSection();
}

function setupOrderHistory() {
    const orderGrid = document.getElementById('orderGrid');
    const searchInput = document.getElementById('search-order');

    if (!orderGrid) return;

    const orderHistory = getOrderHistoryFromStorage();
    renderOrders(orderHistory, orderGrid);

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();

            if (!query) {
                renderOrders(orderHistory, orderGrid);
                return;
            }

            const filtered = orderHistory.filter((order) => {
                const productNames = (order.items || [])
                    .map((item) => (item.name || '').toLowerCase())
                    .join(' ');

                
                const orderStatus = String(order.status || '').toLowerCase();

                const orderDate = String(order.date || '').toLowerCase();
                const deliverYId = String(order.id || '').toLowerCase();
                return productNames.includes(query) || orderDate.includes(query) || orderStatus.includes(query) || deliverYId.includes(query);
            });

            renderOrders(filtered, orderGrid);
        });
    }
}

function getOrderHistoryFromStorage() {
    const summary = JSON.parse(localStorage.getItem('cardSummery'));

    if (!summary) return [];

    const rawOrders = Array.isArray(summary) ? summary : [summary];

    return rawOrders.map((order) => {
        const orderId = order.id || Date.now();
        const status = order.status || 'pending';
        const items = Array.isArray(order.items) ? order.items : [];
        
        const itemCount = items.reduce((total, item) => total + (item.quantity || 0), 0);
        console.log("Items in order:", items);
        const totalPrice = Number(order.totalPrice || 0);

        return {
            id: orderId,
            status,
            items,
            itemCount,
            totalPrice,
            date: formatOrderDate(orderId)
        };
    }).sort((a, b) => Number(b.id) - Number(a.id));
}

function formatOrderDate(orderId) {
    const timestamp = Number(orderId);
    if (Number.isNaN(timestamp)) return 'N/A';

    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return 'N/A';

    return date.toLocaleDateString();
}

function renderOrders(orders, container) {
    if (!orders.length) {
        container.innerHTML = `
            <div class="order-card order-empty reveal">
                <h4>No order history found</h4>
                <p>Complete checkout to store your cart summary and view it here.</p>
            </div>
        `;
        return;
    }

    const colorForStatus = [{
        pending: '#fbbf24',
        processing: '#3b82f6',
        shipped: '#14b8a6',
        delivered: '#22c55e',
        cancelled: '#ef4444'
    }]

    container.innerHTML = orders.map((order, index) => {
        const itemPreview = order.items
            .slice(0, 2)
            .map((item) => item.name)
            .filter(Boolean)
            .join('<br/> ');


            console.log(order.items.slice(0,2).map((item) => item.name))
            // function to get color based on status of order
        function ColorPicker() {

            let result = colorForStatus.map((statusObj) => {
                let color = '';
                let resultColor = order.status == 'pending' ? color = statusObj.pending : order.status == 'processing' ? color = statusObj.processing : order.status == 'shipped' ? color = statusObj.shipped : order.status == 'delivered' ? color = statusObj.delivered : order.status == 'cancelled' ? color = statusObj.cancelled : color = '#e2e8f0';
                return color;
            })
            return result;
        }

        const IsOrderPending = order.status === 'pending';


        return `
            <div class="order-card" style="animation-delay:${index * 60}ms; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; background: #ffffff; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);">
                <img src = ${order.items[0]?.image || 'https://via.placeholder.com/150'} alt="Product Image" class="order-image" style="object-fit: cover; border-radius: 8px; width: 100%; height: 150px;">
                <h4 class="order-id" style="background: linear-gradient(to right, var(--primary-color), var(--secondary-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem; font-size: 1.1rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem;">Order #${order.id}</h4>
                <div class="order-details" style="font-size: 0.9rem; color: #475569; display: flex; flex-direction: column; gap: 6px;">
                <p class="order-line" style=""><strong>Date:</strong> ${order.date}</p>
                <p class="order-line"><strong>Items:</strong> ${order.itemCount}</p>
                <p class="order-line"><strong>Total:</strong> Rs.${order.totalPrice.toLocaleString()}</p>
                <p class="order-line"><strong>Status:</strong> <span class="status-pill" style="background: ${ColorPicker() || '#e2e8f0'}; color: ${colorForStatus[0][order.status] ? '#ffffff' : '#475569'};">${capitalize(order.status)}</span></p>
                <p class="order-products" style="margin: 0; color: #334155; background: linear-gradient(135deg, #f8fafc, #eef2ff); padding: 0.65rem 0.75rem; border-radius: 10px; border: 1px solid #e2e8f0; border-left: 4px solid #6366f1; font-size: 0.86rem; line-height: 1.45; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06); margin-top: 0.5rem;"><strong style="color: #1e293b; font-weight: 700;">Products:</strong><br/> ${itemPreview || 'View order for details'}</p>
                <div style="display: flex; gap: 10px; margin-top: 0.75rem; justify-content: space-between;">
                  ${IsOrderPending ? `<button class="btn btn-primary" style="margin-top: 0.75rem; background: #ef4444; border-color: #ef4444;" onclick="viewOrderDetails(${order.id})" onclick='cancelOrder(${order.id})'>Cancel Order</button>` : ''}
                  <button class="btn btn-secondary" style="margin-top: 0.75rem;" onclick="viewOrderDetails(${order.id})">View Details</button>
                </div>
               </div>
                </div>
        `;

    }).join('');





    requestAnimationFrame(() => {
        document.querySelectorAll('.order-card').forEach((card) => {
            card.classList.add('reveal');
        });
    });
}

function capitalize(value) {
    const text = String(value || 'pending');
    return text.charAt(0).toUpperCase() + text.slice(1);
}


function viewOrderDetails(orderId) {
    localStorage.setItem('selectedOrderId', orderId);
    window.location.href = '/E-commerce/pages/OrderTrackingPage.html';
}
