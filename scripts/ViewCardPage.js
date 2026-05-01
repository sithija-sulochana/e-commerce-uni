
// Load cart items from localStorage
document.addEventListener("DOMContentLoaded", function () {
    loadCart();
});

function loadCart() {
    fetch('/backend/orderManagement/cart/getCart.php')
        .then(res => res.json())
        .then(cartItems => {

            const cartContainer = document.getElementById('cart-items-container');
            const summaryContainer = document.getElementById('cart-summary-container');

            if (!cartContainer) return;

            if (cartItems.length === 0) {
                cartContainer.innerHTML = `
                    <div class="empty-cart">
                        <h2>Your cart is empty</h2>
                        <p>Add some products to get started!</p>
                    </div>
                `;
                if (summaryContainer) summaryContainer.style.display = 'none';
                return;
            }

            cartContainer.innerHTML = cartItems.map(item => `
              <div class="cart-item" data-id="${item.id}">
            <button class="remove-btn" title="Remove item" onclick="removeItem(${item.id})">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                </svg>
            </button>
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <div style="margin-bottom: 10px;">
                    <h3>${item.name}</h3>
                    <p class="item-category" style="margin: 5px 0;">${item.category || 'Product'}</p>
                    <span style="background-color: green; color:white; padding: 4px 8px; border-radius: 10px; font-size: 0.8rem; margin-top: 5px;margin-bottom: 5px;">Discount <span style="font-weight: bold;">${item.discount}%</span></span>
                </div>
                <div class="item-actions">
                    <div class="qty-control">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <span class="item-price">Rs.${(item.price * item.quantity - (item.price * item.quantity * item.discount / 100)).toLocaleString()}</span>
                </div>
            </div>
        </div>
            `).join('');

            updateSummary(cartItems);
        });
}

function addToCart(productId) {
    fetch('/backend/orderManagement/cart/addCart.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId })
    }).then(() => loadCart());
}

// Update cart summary
function updateSummary(cartItems) {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity - (item.price * item.quantity * item.discount / 100)), 0);

    document.getElementById('cart-total').textContent = `Rs.${total.toLocaleString()}`;
    document.getElementById('item-count').textContent = `(${totalItems} items)`;
}

// Update quantity
function updateQuantity(id, change) {
    fetch('/backend/orderManagement/cart/updateCart.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            product_id: id,
            change: change
        })
    }).then(() => loadCart());
}

// Remove item from cart
function removeItem(id) {
    fetch('/backend/orderManagement/cart/removeCart.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: id })
    }).then(() => loadCart());
}

// Clear entire cart
function clearCart() {
    fetch('/backend/orderManagement/cart/clearCart.php', {
        method: 'POST'
    }).then(() => loadCart());
}

// Save product and cart details in localStorage
function setItems() {
    fetch('/backend/orderManagement/checkout.php', {
        method: 'POST'
    }).then(() => {
        window.location.href = '/pages/OrderTrackingPage.html';
    });
}
