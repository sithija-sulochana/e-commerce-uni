

// Cart Page - Fetch and display products from localStorage
document.addEventListener("DOMContentLoaded", function () {
    loadCart();
});

// Load cart items from localStorage
function loadCart() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    console.log("Loaded cart items:", cartItems);
    const cartContainer = document.getElementById('cart-items-container');
    const summaryContainer = document.getElementById('cart-summary-container');
    
    // const discount = item.discount;

    // const totalItemPrice = (item.price * item.quantity) 


    if (!cartContainer) return;

    // If cart is empty
    if (cartItems.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some products to get started!</p>
                <a href="/pages/productList.html" class="continue-shopping">Browse Products →</a>
            </div>
        `;
        if (summaryContainer) {
            summaryContainer.style.display = 'none';
        }
        return;
    }
;
    // Render cart items
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
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <span class="item-price">Rs.${(item.price * item.quantity - (item.price * item.quantity * item.discount / 100)).toLocaleString()}</span>
                </div>
            </div>
        </div>
    `).join('');

  
    // Update summary
    updateSummary(cartItems);
}

// Update cart summary
function updateSummary(cartItems) {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity - (item.price * item.quantity * item.discount / 100)), 0);
    

    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    const itemCountEl = document.getElementById('item-count');

    if (subtotalEl) subtotalEl.textContent = `Rs.${subtotal.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `Rs.${subtotal.toLocaleString()}`;
    if (itemCountEl) itemCountEl.textContent = `Subtotal (${totalItems} item${totalItems > 1 ? 's' : ''})`;
}

// Update quantity
function updateQuantity(id, change) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const item = cartItems.find(item => item.id === id);

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cartItems = cartItems.filter(item => item.id !== id);
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        loadCart();
    }
}

// Remove item from cart
function removeItem(id) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems = cartItems.filter(item => item.id !== id);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    loadCart();
}

// Clear entire cart
function clearCart() {
    localStorage.removeItem('cartItems');
    loadCart();
}


// save product and cart details in localstorage

function setItems() {

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    if(cartItems.length === 0) {
        alert("Your cart is empty! Please add items to proceed.");
        return;
    }else{
        const totalPrice = cartItems.reduce((sum,item)=>{
            const itemTotal = item.price * item.quantity;
            const discountAmount = itemTotal * (item.discount / 100);
            return sum + (itemTotal - discountAmount);
        },0)

        console.log("Total price calculated for checkout:", totalPrice);
        const cardSummery ={
            id: Date.now(),
            totalPrice: totalPrice,
            status: 'pending',
            items: cartItems
        }
        localStorage.setItem('cardSummery', JSON.stringify(cardSummery));
        window.location.href = '/pages/OrderTrackingPage.html';
        
    }

}

