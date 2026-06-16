document.addEventListener('DOMContentLoaded', () => {
    fetchOrders();

});


function fetchOrders() {

    fetch('../backend/orderManagement/order/getAllOrders.php')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#orderTable tbody');
            tbody.innerHTML = '';

            const orderArray = Array.isArray(data) ? data : [data];

            console.log("Fetched orders:", data);

            if (data.status === 'error') {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">${data.message}</td></tr>`;
                return;
            }

            orderArray.forEach(order => {
                const row = `
                    <tr>
                        <td>#${order.order_id}</td>
                        <td>${order.user_id}</td>
                        <td>${order.user_email}</td>
                        <td>${order.order_date}</td>
                        <td>$${parseFloat(order.total_price).toFixed(2)}</td>
                        <td>
                            <span class="status-badge status-${order.status.toLowerCase()}">
                                ${order.status}
                            </span>
                        </td>
                        <td>
                            <button onclick="viewDetails(${order.order_id})" style="width:auto; padding:5px 10px;">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });

        })
        .catch(err => console.error("Error fetching orders:", err));

}

function updateOrder(event) {
    if (event) event.preventDefault();

    const orderId = document.getElementById('orderIdInput').value;
    const status = document.getElementById('statusSelect').value;

    if (!orderId) {
        alert('Please enter a valid Order ID.');
        return;
    }

    fetch('../backend/orderManagement/order/updateOrderStatus.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `order_id=${encodeURIComponent(orderId)}&status=${encodeURIComponent(status)}`
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) fetchOrders();
        })
        .catch(error => alert('Update failed.'));
}


function cancelOrder(event) {
    if (event) event.preventDefault();
    const orderIdInput = document.getElementById('cancelOrderIdInput');
    const orderId = orderIdInput.value.trim();


    if (!orderId) {
        alert('Please enter a valid Order ID.');
        return;
    }
    fetch('../backend/orderManagement/order/updateOrderStatus.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `order_id=${encodeURIComponent(orderId)}&status=${encodeURIComponent('Cancelled')}`
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) fetchOrders();
        })
        .catch(error => alert('Cancellation failed.'));

}

function filterOrders() {
    const input = document.getElementById('orderSearch').value.toUpperCase();
    const rows = document.querySelectorAll('#orderTable tbody tr');

    rows.forEach(row => {
        const text = row.textContent || row.innerText;
        row.style.display = text.toUpperCase().includes(input) ? "" : "none";
    });
}


function viewDetails(orderId) {
    const dialog = document.getElementById('detailsDialog');
    const content = document.getElementById('dialogContent');
    const closeBtn = document.getElementById('closeBtn');


    $.ajax({
        url: `http://localhost/E-commerce/backend/orderManagement/cartItems/getAllOrderItems.php?order_id=${orderId}`,
        method: 'GET',
        contentType: 'application/json',
        success: function (response) {
            console.log(response)
            if (response.status === 'error') {
                content.innerHTML = `<p style="color:red; text-align:center;">${response.message}</p>`;
                return;
            }
            const items = Array.isArray(response) ? response : [response];
            content.innerHTML = `
                <h2>Order #${orderId} Details</h2>
                <table>
                    <tr></tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price at Purchase</th>
                    </tr>
                    ${items.map(item => `
                        <tr>
                            <td>${item.product_name}</td>
                            <td>${item.quantity}</td>
                            <td>$${parseFloat(item.price_at_purchase).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </table>
            `;
        }, error: function (xhr, status, error) {
            console.log("Error in view Details")
        }

        
    })

    dialog.showModal();
    closeBtn.addEventListener('click', () => {
        dialog.close();
    });




}





