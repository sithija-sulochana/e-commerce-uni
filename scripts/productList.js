const products = [
    {
        id: 8,
        name: 'MacBook Pro 14"',
        category: 'Laptop',
        price: 1999,
        brand: 'Apple',
        description: 'Powerful M3 chip and all-day battery life.',
        specs: ['16GB RAM', '512GB SSD'],
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900'
    },
    {
        id: 7,
        name: 'Dell XPS 13',
        category: 'Laptop',
        price: 1299,
        brand: 'Dell',
        description: 'Slim premium ultrabook for daily productivity.',
        specs: ['8GB RAM', '256GB SSD'],
        image: 'https://images.unsplash.com/photo-1588872657840-218e412ee914?w=900'
    },
    {
        id: 6,
        name: 'ASUS TUF Gaming PC',
        category: 'Computer',
        price: 1499,
        brand: 'ASUS',
        description: 'High performance gaming desktop with RTX graphics.',
        specs: ['32GB RAM', '1TB SSD'],
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=900'
    },
    {
        id: 5,
        name: 'Galaxy S24',
        category: 'Phone',
        price: 999,
        brand: 'Samsung',
        description: 'Flagship Android phone with pro-level camera.',
        specs: ['120Hz', '5G'],
        image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=900'
    },
    {
        id: 4,
        name: 'iPhone 15 Pro',
        category: 'Phone',
        price: 1199,
        brand: 'Apple',
        description: 'Titanium design and lightning-fast performance.',
        specs: ['A17 Pro', '256GB'],
        image: 'https://images.unsplash.com/photo-1695639470555-57f4f7be0086?w=900'
    },
    {
        id: 3,
        name: 'HP Pavilion Desktop',
        category: 'Computer',
        price: 849,
        brand: 'HP',
        description: 'Reliable home and office desktop setup.',
        specs: ['16GB RAM', '512GB SSD'],
        image: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=900'
    },
  
];

const priceRanges = [
    { label: 'Under $500', min: 0, max: 500 },
    { label: '$500 - $1000', min: 500, max: 1000 },
    { label: '$1000 - $1500', min: 1000, max: 1500 },
    { label: 'Over $1500', min: 1500, max: Infinity }
];

const brandImages = [
    { brand: 'Apple', image: '/assets/brandsLogos/phones/apple.png' },
    { brand: 'Dell', image: '/assets/brandsLogos/laptopsComputer/Dell_Logo.svg-removebg-preview.png' },
    { brand: 'ASUS', image: '/assets/brandsLogos/laptopsComputer/asus.png' },
    { brand: 'Samsung', image: '/assets/brandsLogos/phones/samsung.png' },
    { brand: 'HP', image: '/assets/brandsLogos/laptopsComputer/hp.png' },
    
];
const brands = [...new Set(products.map((product) => product.brand))];


let filteredProducts = [...products];

const byId = (id) => document.getElementById(id);
const categoryFiltersEl = document.getElementById('categoryFilters');
const priceFiltersEl = document.getElementById('priceFilters');
const productsGridEl = document.getElementById('productsGrid');
const sortSelectEl = document.getElementById('sortSelect');
const clearFiltersBtnEl = document.getElementById('clearFiltersBtn');
const resultsCountEl = document.getElementById('resultsCount');
const brandFiltersEl = byId('brandFilters');

function getBrandImage(brand) {
   console.log(brand, brandImages.find((item) => item.brand === brand)?.image || '');
   return brandImages.find((item) => item.brand === brand)?.image || '';
    
    
}

function initFilters() {
    const categories = [...new Set(products.map((product) => product.category))];

    categoryFiltersEl.innerHTML = categories.map((category) => `
            <label class="filter-item">
                <input type="checkbox" value="${category}" data-type="category">
                <span>${category}</span>
            </label>
        `).join('');

    

    priceFiltersEl.innerHTML = priceRanges.map((range, index) => `
            <label class="filter-item">
                <input type="checkbox" value="${index}" data-type="price">
                <span>${range.label}</span>
            </label>
        `).join('');

    brandFiltersEl.innerHTML = brands.map((brand) => {
        const src = getBrandImage(brand);
       
        return `
            <button class="brand-logo" type="button" data-brand="${brand}" aria-label="${brand}">
                ${src
                    ? `<img src="${src}" alt="${brand}" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';">`
                    : ''}
                <span class="brand-fallback" style="display:${src ? 'none' : 'grid'}">${brand.slice(0, 2).toUpperCase()}</span>
            </button>
        `;
    }).join('');
}

function getSelectedValues(selector) {
    const selected = [...document.querySelectorAll(selector)].map((input) => input.value);
    console.log('Selected values for selector', selector, selected);
    return selected;
}

function applyFilters() {
    const selectedCategories = getSelectedValues('#categoryFilters input:checked');
    const selectedPriceIndexes = getSelectedValues('#priceFilters input:checked').map(Number);
    const selectedPriceRanges = selectedPriceIndexes.map((index) => priceRanges[index]);
    const selectedBrands = [...document.querySelectorAll('#brandFilters .brand-logo.active')]
    .map(button => button.dataset.brand);

    filteredProducts = products.filter((product) => {
        const categoryMatch = !selectedCategories.length || selectedCategories.includes(product.category);
        const priceMatch =
            !selectedPriceRanges.length ||
            selectedPriceRanges.some((range) => product.price >= range.min && product.price < range.max);
           
            const brandMatch = !selectedBrands.length || selectedBrands.includes(product.brand);


        return categoryMatch && priceMatch && brandMatch;
    });

    applySorting();
}

function filterByBrand(brand) {
    filteredProducts = filteredProducts.filter((product) => product.brand === brand);
    console.log('Filtered by brand:', brand, filteredProducts);
    applySorting();
}

function applySorting() {
    const sortType = sortSelectEl.value;

    const sorters = {
        'price-low': (a, b) => a.price - b.price,
        'price-high': (a, b) => b.price - a.price,
        'name-az': (a, b) => a.name.localeCompare(b.name),
        newest: (a, b) => b.id - a.id
    };

    filteredProducts.sort(sorters[sortType] || sorters.newest);

    renderProducts();
}

function renderProducts() {
    resultsCountEl.textContent = `${filteredProducts.length} product(s) found`;

    if (filteredProducts.length === 0) {
        productsGridEl.innerHTML = `<div class="empty-state">No products match your selected filters.</div>`;
        return;
    }

    productsGridEl.innerHTML = filteredProducts.map((product) => `
            <article class="product-card">
                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${product.name}">
                </div>

                <div class="product-content">
                    <p class="product-category">${product.category}</p>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>

                    <div class="specs">
                        ${product.specs.map((spec) => `<span class="spec-item">${spec}</span>`).join('')}
                    </div>

                    <div class="product-footer">
                        <span class="product-price">$${product.price.toLocaleString()}</span>
                        <button class="btn-add" type="button" data-product-name="${product.name}">Add to Cart</button>
                    </div>
                </div>
            </article>
        `).join('');
}

function clearAllFilters() {
    document.querySelectorAll('#categoryFilters input:checked, #priceFilters input:checked').forEach((input) => {
        input.checked = false;
    });
    document.querySelectorAll('#brandFilters .brand-logo.active').forEach((button) => {
        button.classList.remove('active');
    });

    sortSelectEl.value = 'newest';
    filteredProducts = [...products];
    applySorting();
}

function attachEvents() {
    categoryFiltersEl.addEventListener('change', applyFilters);
    priceFiltersEl.addEventListener('change', applyFilters);
    sortSelectEl.addEventListener('change', applySorting);
    clearFiltersBtnEl.addEventListener('click', clearAllFilters);

    brandFiltersEl.addEventListener('click', (event) => {
        const button = event.target.closest('.brand-logo');
        if (!button) return;

        button.classList.toggle('active');
        applyFilters();
    });

    productsGridEl.addEventListener('click', (event) => {
        const button = event.target.closest('.btn-add');
        if (!button) return;

        const { productName } = button.dataset;
        alert(`${productName} added to cart`);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    attachEvents();
    applySorting();
});