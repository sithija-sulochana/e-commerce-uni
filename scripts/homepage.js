// 1. Fixed the missing bracket in the array
const products = [
    {
        id: 1,
        name: "iPhone 15 Pro Max",
        category: "Phone",
        description: "6.7-inch Super Retina XDR display with ProMotion and Titanium build.",
        price: "LKR 285,000",
        image: "/assets/apple15promax.png"
    },
    {
        id: 2,
        name: "MacBook Pro 14\" M3",
        category: "Laptop",
        description: "The most advanced chips ever built for a personal computer.",
        price: "LKR 450,000",
        image: "https://www.notebookcheck.net/fileadmin/Notebooks/News/_nc4/Apple-MacBook-Pro-14-M3-Pro-sale.jpg"
    },
    {
        id: 3,
        name: "ASUS ROG Strix G16",
        category: "Computer",
        description: "High-performance gaming desktop replacement with liquid cooling.",
        price: "LKR 380,000",
        image: "https://dlcdnwebimgs.asus.com/gain/494A9D35-0219-4623-8E5A-A6D90C0B0C46/w717/h538"
    }
];
const specs = [
    // --- iPhone Specs ---
    { id: 1, productId: 1, specName: "Display", specValue: "6.7 inch OLED" },
    { id: 2, productId: 1, specName: "Camera", specValue: "48MP Main" },
    { id: 3, productId: 1, specName: "Battery", specValue: "95% Health" },

    // --- MacBook Specs ---
    { id: 4, productId: 4, specName: "Display", specValue: "14.2 inch Liquid Retina" },
    { id: 5, productId: 4, specName: "Processor", specValue: "Apple M3 Chip" },
    { id: 6, productId: 4, specName: "RAM", specValue: "16GB Unified" },
    { id: 7, productId: 4, specName: "Storage", specValue: "512GB SSD" },

    // --- Desktop PC Specs ---
    { id: 8, productId: 5, specName: "Processor", specValue: "Intel i9-14900K" },
    { id: 9, productId: 5, specName: "GPU", specValue: "NVIDIA RTX 4080" },
    { id: 10, productId: 5, specName: "Cooling", specValue: "Liquid Cooling" },
    { id: 11, productId: 5, specName: "PSU", specValue: "850W Gold" }
];

const container = document.getElementById("product-container");

// Best Practice: Generate the full HTML string first, then update DOM ONCE
let productHTML = "";

products.forEach(product => {
    // Filter the specs for this specific product
    // Filter the specs for this specific product AND specific categories
    const productSpecs = specs
        .filter(spec =>
            spec.productId === product.id &&
            ["Display", "Processor", "Camera"].includes(spec.specName)
        )
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