let cartCount = 0;
const productsItems = {
  id: 1,
  name: "ASUS TUF A16 FA607M Ryzen 7 RTX 4050",
  price: 389000,
  reviews: 248,
  category: "Gaming Laptop",
  brand: "ASUS",

  description: "Experience ultimate gaming performance with the ASUS TUF A16. Featuring an AMD Ryzen 7 processor, NVIDIA RTX 4050 graphics, and a lightning-fast 144Hz display.",
  image: "https://laptopcare.lk/wp-content/uploads/2025/10/victus-70.jpg",
  specs: {
    
    processor: "AMD Ryzen 7 5800H3",
    gpu: "NVIDIA GeForce RTX 4050",
    ram: "16GB DDR4",
    storage: "512GB NVMe SSD",
    display: "15.6\" FHD 144Hz",
    keyboard: "RGB Backlit",
    battery: "48Wh",
    weight: "2.3 kg",
    operatingSystem: "Windows 11 Home",
    

  }
};

// mention device informations

document.addEventListener("DOMContentLoaded",()=>{
   const productDetails = document.getElementById('product-section');
   if(productDetails){
         productDetails.innerHTML=`

          <div>
        <img 
          id="productImage"
          class="product-image" 
          ${productsItems.image ? `src="${productsItems.image}"` : ''}
          alt="${productsItems.name}"
          loading="lazy"
        />
      </div>
      
      <div class="product-info">
      ${!productsItems.image ? `<div class="image-placeholder">No Image</div>` : ''}
        <h1 id="productName">${productsItems.name}</h1>
        
        <div class="product-rating">
          <span class="stars">★★★★★</span>
          <span>${productsItems.reviews} reviews</span>
        </div>
        
        <p class="product-desc" id="productDesc">
            ${productsItems.description}
        </p>

        <div class="price-section">
          <span class="price" id="productPrice">Rs.${productsItems.price.toLocaleString()}</span>
          <span class="discount">Save 15% Today</span>
        </div>

        <h3 class="features-heading">Key Features</h3>
        <ul class="features">
           
            <li> ${productsItems.specs.operatingSystem} </li>
            <li> ${productsItems.specs.processor} </li>
            <li> ${productsItems.specs.gpu} </li>
          
        </ul>

        <div class="buy-section">
          <div class="qty-group">
            <label for="qty" class="qty-label">Qty:</label>
            <input type="number" id="qty" class="qty-input" min="1" max="10" value="1" />
          </div>
          <button class="btn btn-primary" id="addToCartBtn" onclick="addToCart()">Add to Cart</button>
          <button class="btn btn-secondary" id="wishlistBtn">❤ Wishlist</button>
        </div>
      </div>
         
         
         `;
   }
})



document.addEventListener("DOMContentLoaded", () => {

  const detailsTable = document.getElementById('table-section');

  detailsTable.innerHTML = `
    <table class="specs-table">
      <tr>
        <th>Component</th>
        <th>Specification</th>
      </tr>
      ${Object.entries(productsItems.specs).map(([key, value]) => `
        <tr>
          <td><strong>${key.charAt(0).toUpperCase() + key.slice(1)}</strong></td>
          <td>${value}</td>
        </tr>
      `).join('')}
    </table>
  `;

});
function addToCart(){
    const qty = parseInt(document.getElementById('qty').value);
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    console.log("Current cart items before adding:", cartItems);
    
    const existingItem = cartItems.find(item => item.id === productsItems.id);
    
    if (existingItem) {
        existingItem.quantity += qty;
        
    } else {
        cartItems.push({
            id: productsItems.id,
            name: productsItems.name,
            image: productsItems.image,
            price: productsItems.price,
            category: productsItems.category,
            quantity: qty,
            discount: 15,
        });

    }


    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    cartCount += qty;

    alert(`Added ${qty} item(s) to cart!`);
    window.location.href = '/pages/ViewCartPage.html';
}
function selectPayment(method){
    alert(`Selected payment method: ${method.replace('-',' ').toUpperCase()}`);
}
document.getElementById('addToCartBtn').addEventListener('click',addToCart);
document.getElementById('cartIcon').addEventListener('click',()=>{alert(`Cart has ${cartCount} items`);});
document.getElementById('wishlistBtn').addEventListener('click',()=>{alert('Added to wishlist!');
    document.getElementById('wishlistBtn').style.color='var(--danger)';
});
document.addEventListener('DOMContentLoaded',()=>{console.log("[v0] Product Details Page Loaded",products);

});

// Add details specification table by using the mapped objects


