let product; 

const brandImages = {
        'Apple': '/E-commerce/assets/brandsLogos/phones/apple.png',
        'Dell': '/E-commerce/assets/brandsLogos/laptopsComputer/Dell_Logo.svg-removebg-preview.png',
        'Asus': '/E-commerce/assets/brandsLogos/laptopsComputer/asus.png',
        'Samsung': '/E-commerce/assets/brandsLogos/phones/samsung.png',
        'HP': '/E-commerce/assets/brandsLogos/laptopsComputer/hp.png',
  };
document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('productId');

    if (!productId) {
        document.getElementById('product-section').innerHTML = '<p>No product ID specified.</p>';
        return;
    }

    try {
        const res = await fetch(`/E-commerce/backend/products/GetProductsWithSpecs.php?productId=${productId}`);
        if (!res.ok) {
            throw new Error('Product not found');
        }
        product = await res.json();

        
      

        renderProduct(product);
        renderPaymentOptions(product);
        renderSpecsTable(product.specs);
        attachEventListeners();

    } catch (error) {
        console.error("Failed to fetch product details:", error);
    
        document.getElementById('product-section').innerHTML = `<p>Error loading product details: ${error.message}</p>`;
    }
});



function renderProduct(product) {
    const productDetails = document.getElementById('product-section');
    const brand = product.name.split(" ")[0];
    const brandImage = brandImages[brand] || 'https://via.placeholder.com/50';
    if (productDetails) {
        productDetails.innerHTML = `
            <div>
                <div class="laptop-type" style="position: relative; top: 20px; left: 10px;">
                    <span style="background: var(--primary); color: white; padding: 4px 8px; border-radius: 20px;">${product.category}</span>
                </div>
                <img 
                    id="productImage"
                    class="product-image" 
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                />
            </div>
            <div class="product-info">
                
                <h1 id="productName">${product.name}</h1>
                <p class="product-desc" id="productDesc">${product.description}</p>
                <div class="price-section">
                    <span class="price" id="productPrice">Rs.${Number(product.price).toLocaleString()}</span>
                    <span class="discount">Save ${Math.round(product.discount_percentage) || 0}% Today</span>
                </div>
                <h3 class="features-heading">Key Features</h3>
                <ul class="features">
                    ${product.specs && Object.keys(product.specs).length > 0 ? Object.values(product.specs).slice(0, 3).map(spec => `<li>${spec}</li>`).join('') : '<li>No key features listed.</li>'}
                </ul>
                <div class="buy-section">
                    <div class="qty-group">
                        <label for="qty" class="qty-label">Qty:</label>
                        <input type="number" id="qty" class="qty-input" min="1" max="10" value="1" />
                    </div>
                    <button class="btn btn-primary" id="addToCartBtn">Add to Cart</button>
                    <button class="btn btn-secondary" id="wishlistBtn">❤ Wishlist</button>
                </div>
            </div>`;
    }
}

function renderPaymentOptions(product){
    const paymentSection = document.getElementById('payment-section');
    
    if(paymentSection){
        paymentSection.innerHTML = `
        <div class="payment-header">
        <i class="fas fa-credit-card"></i>
        <h2>Secure Payment Options</h2>
      </div>
      <p class="payment-subtitle">Choose your preferred payment method for fast & secure checkout</p>
      
      <div class="payment-methods-grid">
        <div class="payment-card" data-method="visa">
          <div class="payment-icon-wrapper">
            <img src="https://laptop.lk/wp-content/uploads/visa.png" alt="Visa" />
          </div>
          <div class="payment-details">
            <span class="payment-name">Visa Card</span>
            <span class="payment-price">Rs.${product.price}</span>
          </div>
          <div class="payment-badge">Popular</div>
        </div>
        <div class="payment-card" data-method="mastercard">
          <div class="payment-icon-wrapper">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" />
          </div>
          <div class="payment-details">
            <span class="payment-name">Mastercard</span>
            <span class="payment-price">Rs. ${product.price - 200}.00</span>
          </div>
        </div>
        <div class="payment-card" data-method="cod">
          <div class="payment-icon-wrapper">
            <i class="fas fa-money-bill-wave"></i>
          </div>
          <div class="payment-details">
            <span class="payment-name">Cash on Delivery</span>
            <span class="payment-price">Rs. ${product.price - 500}.00</span>
          </div>
        </div>
        <div class="payment-card" data-method="installment">
          <div class="payment-icon-wrapper">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div class="payment-details">
            <span class="payment-name">Installments</span>
            <span class="payment-price">Rs. ${product.price / 12}/month</span>
          </div>
          <div class="payment-badge installment">0% Interest</div>
        </div>
      </div>
        
        `
    }
}

function renderSpecsTable(specs) {
    const detailsTable = document.getElementById('table-section');
    if (detailsTable && specs && typeof specs === 'object') {
        detailsTable.innerHTML = `
            <table class="specs-table">
                <tr>
                    <th>Component</th>
                    <th>Specification</th>
                </tr>
                ${Object.entries(specs).map(([key, value]) => `
                    <tr>
                        <td><strong>${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}</strong></td>
                        <td>${value}</td>
                    </tr>
                `).join('')}
            </table>
        `;
    } else if (detailsTable) {
        detailsTable.innerHTML = '<p>No specifications available for this product.</p>';
    }
}



function addToCart() {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.isLoggedIn) {
        alert("Please log in to add products to your cart.");
        window.location.href = '/E-commerce/pages/loginPage.html';
        return;
    }

    const qty = parseInt(document.getElementById('qty').value);
    if (!product || !product.id) {
        alert('Could not add to cart. Product details are missing.');
        return;
    }

    fetch('/E-commerce/backend/orderManagement/cart/addCart.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, quantity: qty })
    })
    .then(res => res.json())
    
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert(`Added ${qty} item(s) to cart!`);
            window.location.href = '/E-commerce/pages/ViewCartPage.html';
        }
    })
    .catch(error => {
        console.error('Error adding to cart:', error);
        alert('Failed to add product to cart.');
    });
}

function attachEventListeners() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    const wishlistBtn = document.getElementById('wishlistBtn');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', addToCart);
    }

    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => {
            alert('Added to wishlist!');
            wishlistBtn.style.color = 'var(--danger)';
        });
    }
}

function selectPayment(method) {
    alert(`Selected payment method: ${method.replace('-', ' ').toUpperCase()}`);
}

