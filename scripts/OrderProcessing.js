document.addEventListener("DOMContentLoaded", () => {

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');

    if (!orderId) {
        console.error("No order ID found in URL");
        return;
    }


    fetch(`/E-commerce/backend/orderManagement/order/getOrdersByOrderId.php?order_id=${orderId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                alert("Order not found");
                return;
            }

            renderOrder(data.order);
        })
        .catch(err => console.error("Error fetching order:", err));
});

function renderOrder(order) {

    document.getElementById('order-id').textContent = `#${order.id}`;
    
    const itemsContainer = document.querySelector('.items');
    if (itemsContainer) {
        itemsContainer.innerHTML = order.items.map(item => `
            <div class="item">
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Qty: ${item.quantity}</p>
                </div>
                <span class="item-price" style="color: #007bff; font-weight: bold;">
                    Rs.${parseFloat(item.price_at_purchase).toLocaleString()}
                </span>
            </div>
        `).join('');
    }

    const finalTotalEl = document.querySelector('.final-total');
    if (finalTotalEl) {
        finalTotalEl.textContent = `Rs.${parseFloat(order.total_price).toLocaleString()}`;
    }
}

function printBill() {
    const tracker = document.querySelector('.tracker');
    const nav = document.querySelector('nav');
    const printBtn = document.querySelector('button[onclick="printBill()"]');

    if (tracker) tracker.style.display = 'none';
    if (nav) nav.style.display = 'none';
    if (printBtn) printBtn.style.display = 'none';

    window.print();

    if (tracker) tracker.style.display = 'flex';
    if (nav) nav.style.display = 'block';
    if (printBtn) printBtn.style.display = 'flex';
}