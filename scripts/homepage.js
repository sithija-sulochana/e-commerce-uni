// 1. Fixed the missing bracket in the array
const products = [
    {
        id: 1,
        name: "iPhone 15 Pro Max",
        description: "Titanium design with advanced camera system",
        price: "LKR 285,000",
        image: "/assets/image-removebg-preview (1).png"
    }, // Added } and ,
    {
        id: 2,
        name: "Samsung Galaxy S24",
        description: "AI-powered flagship with incredible performance",
        price: "LKR 165,000",
        image: "/assets/download-removebg-preview (1).png"
    }
];

const specs = [
    { id: 1, productId: 1, specName: "Display", specValue: "6.7 inches" },
    { id: 2, productId: 1, specName: "Processor", specValue: "A17 Pro Chip" },
    { id: 3, productId: 1, specName: "Camera", specValue: "48MP" },
    { id: 4, productId: 2, specName: "Display", specValue: "6.2 inches" },
    { id: 5, productId: 2, specName: "Processor", specValue: "Snapdragon 8 Gen 3" },
    { id: 6, productId: 2, specName: "Camera", specValue: "50MP" }
];

const container = document.getElementById("product-container");

// Best Practice: Generate the full HTML string first, then update DOM ONCE
let productHTML = "";

products.forEach(product => {
    // Filter the specs for this specific product
    const productSpecs = specs
        .filter(spec => spec.productId === product.id)
        .map(spec => `<div class="spec-item">${spec.specValue}</div>`)
        .join("");

    productHTML += `
    <div class="card">
      <button class="wishlist-btn">♡</button>

      <div class="card-image-wrapper">
        <img src="${product.image}" alt="${product.name}">
      </div>

      <div class="card-content">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-description">${product.description}</p>

        <div class="specs">
          ${productSpecs}
        </div>

        <div class="price-section">
          <span class="product-price">${product.price}</span>
        </div>

        <div class="add-to-cart">
          <button class="btn-add-to-cart">Add to Cart</button>
        </div>
      </div>
    </div>
    `;
});

// Update the DOM only once
container.innerHTML = productHTML;