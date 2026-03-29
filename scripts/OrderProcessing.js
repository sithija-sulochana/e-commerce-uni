document.addEventListener("DOMContentLoaded", () => {
    const orderData = JSON.parse(localStorage.getItem('cardSummery')) || null;
    
    if (!orderData || !orderData.items || orderData.items.length === 0) {
        console.log("No order data found");
        return;
    }

    console.log("Order summary retrieved from localStorage:", orderData);

    // Set order ID
    const orderIdEl = document.getElementById('order-id');
    if (orderIdEl) {
        orderIdEl.textContent = `#${orderData.id}`;
    }

    // Render order items
    const itemsContainer = document.querySelector('.items');
    if (itemsContainer && orderData.items) {
        itemsContainer.innerHTML = orderData.items.map(item => {
            const itemTotal = item.price * item.quantity;
            const discountAmount = itemTotal * (item.discount / 100);
            const finalPrice = itemTotal - discountAmount;

            return `
                <div class="item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>Qty: ${item.quantity}</p>
                    </div>
                    <span class="item-price" style="color: #007bff;">Rs.${finalPrice.toLocaleString()}</span>
                </div>
                <div>
                   
                    
                </div>
                
            `;
        }).join('');
    }

    // Set total amount
  const originalPriceEl = document.querySelector('.original-price');
    const finalTotalEl = document.querySelector('.final-total');

    
    // if (originalPriceEl) {
    //     originalPriceEl.textContent = `Rs.${calculatedOriginalTotal.toLocaleString()}`;
    // }

    if (finalTotalEl) {
       
        finalTotalEl.textContent = `Rs.${orderData.totalPrice.toLocaleString()}`;
        
    }

    
});


function printBill() {
    const tracker = document.querySelector('.tracker');
    const body = document.body;

    // hide the navigation bar and other non-essential elements for printing
    const nav = document.querySelector('nav');

    if (tracker) {
        tracker.style.display = 'none';
    }

    if (nav) {
        nav.style.display = 'none';
    }

    nav.style.display = 'none';

    window.print();
}
