document.addEventListener('DOMContentLoaded', () => {
    initializeProfile();
    setupEditActions();
    setupOrderHistory();
});

async function initializeProfile() {
    try {
        const profilePic = document.getElementById('profile-pic');
        const response = await fetch('/E-commerce/backend/userManagement/GetUserById.php');
        
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const data = await response.json();

        if (!data.success) throw new Error(data.message || 'Error fetching user data');
        
        const user = data.user || {};
        checkRole(user.role);
        displayAdminPageNavigationButton(user.role);
        console.log(user.role)


        if (document.getElementById('name')) document.getElementById('name').value = user.fullname || '';
        if (document.getElementById('email')) document.getElementById('email').value = user.email || '';

  
        const displayName = document.getElementById('display-name');
        const displayEmail = document.getElementById('display-email');
        if (displayEmail) displayEmail.textContent = user.email || 'No email provided';
        if (displayName) displayName.textContent = user.fullname , checkRole(user.role) || 'Guest';

       
        if (profilePic) {
            const nameForAvatar = user.fullname || 'Guest';
       
            profilePic.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nameForAvatar)}&background=2563eb&color=fff&size=128`;
        }

    } catch (error) {
        console.error("Error initializing profile:", error);
        
     
        const profilePic = document.getElementById('profile-pic');
        if (profilePic) {
            profilePic.src = `https://ui-avatars.com/api/?name=?&background=cbd5e1&color=fff`;
        }
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

    
}

async function setupOrderHistory() {
    const orderGrid = document.getElementById('orderGrid');
    const searchInput = document.getElementById('search-order');

    if (!orderGrid) return;

    try {
        const orderHistory = await getOrderHistoryFromBackend();
        
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
                    const orderDate = String(order.order_date || '').toLowerCase();
                    const deliveryId = String(order.id || '').toLowerCase();
                    return productNames.includes(query) || orderDate.includes(query) || orderStatus.includes(query) || deliveryId.includes(query);
                });

                renderOrders(filtered, orderGrid);
            });
        }
    } catch (error) {
        console.error("Could not fetch order history:", error);
        orderGrid.innerHTML = `<div class="order-card order-empty reveal"><h4>Failed to load order history</h4><p>There was an error fetching your orders. Please try again later.</p></div>`;
    }
}

async function getOrderHistoryFromBackend() {
    try {
        
        const response = await fetch('/E-commerce/backend/orderManagement/order/getAllOrders.php');
        if (!response.ok) throw new Error('Network response error.');
        
        const rawRows = await response.json();
        
      
        const ordersMap = {};

        rawRows.forEach((row) => {
            const orderId = row.order_id;

        
            if (!ordersMap[orderId]) {
                ordersMap[orderId] = {
                    id: orderId,
                    status: (row.status || 'pending').toLowerCase(),
                    totalPrice: Number(row.total_price || 0),
                    order_date: formatOrderDate(row.order_date),
                    items: []
                };
            }

       
            ordersMap[orderId].items.push({
                name: row.product_name,
                quantity: Number(row.quantity || 1),
                price: Number(row.price_at_purchase || 0),
                image: row.product_image || 'https://via.placeholder.com/150' 
            });
        });

     
        return Object.values(ordersMap).map(order => {
            order.itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
            return order;
        });

    } catch (error) {
        console.error("Error loading order history from database rows:", error);
        return [];
    }
}

function formatOrderDate(orderId) {
    const timestamp = Number(orderId);
    if (Number.isNaN(timestamp)) return 'N/A';

    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return 'N/A';

    return date.toLocaleDateString();
}

function renderOrders(orders, container) {
    if (!orders || orders.length === 0) {
        container.innerHTML = `
            <div class="order-card order-empty reveal">
                <h4>No order history found</h4>
                <p>You have not placed any orders yet.</p>
            </div>
        `;
        return;
    }

    const colorForStatus = {
        pending: '#fbbf24',
        processing: '#3b82f6',
        shipped: '#14b8a6',
        delivered: '#22c55e',
        cancelled: '#ef4444'
    };

    container.innerHTML = orders.map((order, index) => {
        const itemPreview = order.items
            .slice(0, 2)
            .map((item) => `${item.name} (x${item.quantity})`)
            .join('<br/> ');

        const IsOrderPending = order.status === 'pending';
        const statusColor = colorForStatus[order.status] || '#e2e8f0';

        return `
            <div class="order-card" style="animation-delay:${index * 60}ms; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; background: #ffffff; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);">
                <img src="${order.items[0]?.image || 'https://via.placeholder.com/150'}" alt="Product Image" class="order-image" style="object-fit: cover; border-radius: 8px; width: 100%; height: 150px;">
                <h4 class="order-id" style="background: linear-gradient(to right, var(--primary-color), var(--secondary-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem; font-size: 1.1rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem;">Order #${order.id}</h4>
                <div class="order-details" style="font-size: 0.9rem; color: #475569; display: flex; flex-direction: column; gap: 6px;">
                    <p class="order-line"><strong>Date:</strong> ${order.order_date}</p>
                    <p class="order-line"><strong>Items:</strong> ${order.itemCount}</p>
                    <p class="order-line"><strong>Total:</strong> Rs.${order.totalPrice.toLocaleString()}</p>
                    <p class="order-line"><strong>Status:</strong> <span class="status-pill" style="background: ${statusColor}; color: #ffffff;">${capitalize(order.status)}</span></p>
                    <p class="order-products" style="margin: 0; color: #334155; background: linear-gradient(135deg, #f8fafc, #eef2ff); padding: 0.65rem 0.75rem; border-radius: 10px; border: 1px solid #e2e8f0; border-left: 4px solid #6366f1; font-size: 0.86rem; line-height: 1.45; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06); margin-top: 0.5rem;"><strong style="color: #1e293b; font-weight: 700;">Products:</strong><br/> ${itemPreview || 'View order for details'}</p>
                    <div style="display: flex; gap: 10px; margin-top: 0.75rem; justify-content: space-between;">
                      ${IsOrderPending ? `<button class="btn btn-primary" style="margin-top: 0.75rem; background: #ef4444; border-color: #ef4444;" onclick="cancelOrder(${order.id})">Cancel Order</button>` : ''}
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





    requestAnimationFrame(() => {
        document.querySelectorAll('.order-card').forEach((card) => {
            card.classList.add('reveal');
        });
    });


function capitalize(value) {
    const text = String(value || 'pending');
    return text.charAt(0).toUpperCase() + text.slice(1);
}


function viewOrderDetails(orderId) {
    
    window.location.href = `/E-commerce/pages/OrderTrackingPage.html?order_id=${orderId}`;
}

function cancelOrder(orderId){
    
    const status = "CANCELED";
    const userConfirmed = confirm("Are you sure you want to cancel this order? This action cannot be undone.");
    if(!userConfirmed) {
        return;
    }else{
        const orderData = {
            order_id: orderId,
            status: status
        }

    
    $.ajax({
        url: 'http://localhost/E-commerce/backend/orderManagement/order/updateOrderStatus.php',
        method:'POST',
        
        
        data: `order_id=${encodeURIComponent(orderId)}&status=${encodeURIComponent('Cancelled')}`,
        success: function(response){
            console.log("Order cancellation response:", response);
        },
        error : function(xhr, status, error){
            console.error("Error cancelling order:", error);
        }
    })
}
}
function checkRole(userRole){
    if(userRole && userRole === 'Admin'){
        const displayName = document.getElementById('display-name');
        if(displayName) {
            displayName.innerHTML += `<img src="../assets/Icons/6711626-removebg-preview.png" width="24" height="24" />`;
        }
    }
}
function displayAdminPageNavigationButton(userRole){
    const navBtn = document.getElementById('adminPage-btn');
    if(userRole && userRole === 'Admin'){
        
        if(navBtn){
            navBtn.style.display = 'inline-block';

        }
    }

    document.getElementById('adminPage-btn').addEventListener('click', () => {
        window.location.href = '../adminPages/adminHome.html';
    });

}

console.log(checkRole(user.role))