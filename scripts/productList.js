let products = [];
let filteredProducts = [];

// DOM Elements
const byId = (id) => document.getElementById(id);
const categoryFiltersEl = byId('categoryFilters');
const priceFiltersEl = byId('priceFilters');
const productsGridEl = byId('productsGrid');
const sortSelectEl = byId('sortSelect');
const clearFiltersBtnEl = byId('clearFiltersBtn');
const resultsCountEl = byId('resultsCount');
const brandFiltersEl = byId('brandFilters');
const extraFilterSectionEl = byId('filter-section');
let processorFiltersEl;
let ramFiltersEl;

async function fetchProducts() {
    try {
        const response = await fetch('/E-commerce/backend/products/fetchProducts.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
 
        let fetchedProducts = await response.json();

        
      
        products = fetchedProducts.map(p => ({
    ...p,
    brand: (p.name.split(" ")[0] || '').trim(),
    category: (p.category || '').trim(),
    specs: Array.isArray(p.specs)
        ? p.specs
        : (typeof p.specs === 'string' ? p.specs.split(',') : [])
}));
        
        filteredProducts = [...products];

  
        initFilters();
        attachEvents();
        checkSearchQuery();
        filterByCategory();
        applySorting();

    } catch (error) {
        console.error('Failed to fetch products:', error);
        if (productsGridEl) {
            productsGridEl.innerHTML = '<div class="error-state">Failed to load products. Please try again later.</div>';
        }
    }
}

function getProcessorFromSpecs(specs) {
    if (!Array.isArray(specs)) return '';
    return specs.find(spec => {
        const value = spec.toLowerCase();
        return value.includes('intel') || value.includes('amd') || value.includes('apple m') || value.includes('snapdragon');
    }) || '';
}

function getRamFromSpecs(specs) {
    if (!Array.isArray(specs)) return '';
    return specs.find(spec => spec.toLowerCase().includes('gb ram')) || '';
}

function getBrandImage(brand) {
    const brandImages = {
        'Apple': '/E-commerce/assets/brandsLogos/phones/apple.png',
        'Dell': '/E-commerce/assets/brandsLogos/laptopsComputer/Dell_Logo.svg-removebg-preview.png',
        'Asus': '/E-commerce/assets/brandsLogos/laptopsComputer/asus.png',
        'Samsung': '/E-commerce/assets/brandsLogos/phones/samsung.png',
        'HP': '/E-commerce/assets/brandsLogos/laptopsComputer/hp.png',
    };
    return brandImages[brand] || '';
}

function initFilters() {
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
    const processors = [...new Set(products.map(p => getProcessorFromSpecs(p.specs)).filter(Boolean))];
    const ramCapacities = [...new Set(products.map(p => getRamFromSpecs(p.specs)).filter(Boolean))];

    const priceRanges = [
        { label: 'Under Rs.150,000', min: 0, max: 150000 },
        { label: 'Rs.150,000 - Rs.300,000', min: 150000, max: 300000 },
        { label: 'Rs.300,000 - Rs.450,000', min: 300000, max: 450000 },
        { label: 'Over Rs.450,000', min: 450000, max: Infinity }
    ];

    categoryFiltersEl.innerHTML = categories.map(category => `
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

    brandFiltersEl.innerHTML = brands.map(brand => {
        const src = getBrandImage(brand);
        return `
            <button class="brand-logo" type="button" data-brand="${brand}" aria-label="${brand}">
                ${src ? `<img src="${src}" alt="${brand}">` : `<span>${brand.slice(0, 2).toUpperCase()}</span>`}
            </button>
        `;
    }).join('');

    if (processors.length > 0 || ramCapacities.length > 0) {
        extraFilterSectionEl.innerHTML = `
            ${processors.length > 0 ? `
            <div class="filter-section">
                <h4>Processor</h4>
                <div id="processorFilters" class="filter-group"></div>
            </div>` : ''}
            ${ramCapacities.length > 0 ? `
            <div class="filter-section">
                <h4>RAM Capacity</h4>
                <div id="ramFilters" class="filter-group"></div>
            </div>` : ''}
        `;

        processorFiltersEl = byId('processorFilters');
        ramFiltersEl = byId('ramFilters');

        if (processorFiltersEl) {
            processorFiltersEl.innerHTML = processors.map(processor => `
                <label class="filter-item">
                    <input type="checkbox" value="${processor}" data-type="processor">
                    <span>${processor}</span>
                </label>
            `).join('');
        }

        if (ramFiltersEl) {
            ramFiltersEl.innerHTML = ramCapacities.map(ram => `
                <label class="filter-item">
                    <input type="checkbox" value="${ram}" data-type="ram">
                    <span>${ram}</span>
                </label>
            `).join('');
        }
    } else {
        extraFilterSectionEl.innerHTML = '';
    }
}

function applyFilters() {
    const selectedCategories = Array.from(document.querySelectorAll('#categoryFilters input:checked')).map(input => input.value);
    const selectedPriceIndexes = Array.from(document.querySelectorAll('#priceFilters input:checked')).map(input => Number(input.value));
    const selectedProcessors = processorFiltersEl ? Array.from(processorFiltersEl.querySelectorAll('input:checked')).map(input => input.value) : [];
    const selectedRamCapacities = ramFiltersEl ? Array.from(ramFiltersEl.querySelectorAll('input:checked')).map(input => input.value) : [];
    const selectedBrands = Array.from(document.querySelectorAll('#brandFilters .brand-logo.active')).map(button => button.dataset.brand);

    const priceRanges = [
        { min: 0, max: 150000 },
        { min: 150000, max: 300000 },
        { min: 300000, max: 450000 },
        { min: 450000, max: Infinity }
    ];
    const selectedPriceRanges = selectedPriceIndexes.map(index => priceRanges[index]);

    filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
        const priceMatch = selectedPriceRanges.length === 0 || selectedPriceRanges.some(range => product.price >= range.min && product.price < range.max);
        const processorMatch = selectedProcessors.length === 0 || selectedProcessors.includes(getProcessorFromSpecs(product.specs));
        const ramMatch = selectedRamCapacities.length === 0 || selectedRamCapacities.includes(getRamFromSpecs(product.specs));

        return categoryMatch && brandMatch && priceMatch && processorMatch && ramMatch;
    });

    applySorting();
}

function applySorting() {
    const sortType = sortSelectEl.value;
    const sorters = {
        'price-low': (a, b) => a.price - b.price,
        'price-high': (a, b) => b.price - a.price,
        'name-az': (a, b) => a.name.localeCompare(b.name),
        'newest': (a, b) => b.id - a.id,
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

    productsGridEl.innerHTML = filteredProducts.map(product => {
        const IsPremium = product.price > 400000;
        const specsHTML = Array.isArray(product.specs) ? product.specs.map(spec => `<span class="spec-item">${spec}</span>`).join('') : '';

        return `
            <article class="product-card" data-id="${product.id}">
                
                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                
                ${IsPremium? `<div id="premiumIcon" style="color: #ff6b35; font-size: 24px; position: absolute; top: 5px; right: 10px; padding: 4px; background-color: #fff; border-radius: 10px;display:flex; justify-content: center; align-items: center;">🔥<span style="margin-left: 5px; font-size: 14px;">Premium</span></div>` : ' '}
                
                <div class="product-content">
                    <p class="product-category">${product.category}</p>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description || ''}</p>

                    <div class="specs">
                        ${specsHTML}
                    </div>
                
                    <div class="product-footer" id="productFooter">
                        <span class="product-price">Rs.${product.price.toLocaleString()}</span>
                        <button type="button" onclick="addToWishlist(${product.id})" class="btn-wishlist" data-product-id="${product.id}" aria-label="Add to wishlist" title="Add to wishlist">
                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWhlYXJ0LWljb24gbHVjaWRlLWhlYXJ0Ij48cGF0aCBkPSJNMiA5LjVhNS41IDUuNSAwIDAgMSA5LjU5MS0zLjY3Ni41Ni41NiAwIDAgMCAuODE4IDBBNS40OSA1LjQ5IDAgMCAxIDIyIDkuNWMwIDIuMjktMS41IDQtMyA1LjVsLTUuNDkyIDUuMzEzYTIgMiAwIDAgMS0zIC4wMTlMNSAxNWMtMS41LTEuNS0zLTMuMi0zLTUuNSIvPjwvc3ZnPg==" class="wishlist-icon" alt="Wishlist icon">
                        </button>
                    </div>
                    
                    <button class="btn-add" type="button" data-product-id="${product.id}" onclick="addToCart(${product.id})" style="margin-top: 10px; display:flex; justify-content: center; align-items: center; gap: 10px;">Add to Cart <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXNob3BwaW5nLWNhcnQtaWNvbiBsdWNpZGUtc2hvcHBpbmctY2FydCI+PGNpcmNsZSBjeD0iOCIgY3k9IjIxIiByPSIxIi8+PGNpcmNsZSBjeD0iMTkiIGN5PSIyMSIgcj0iMSIvPjxwYXRoIGQ9Ik0yLjA1IDIuMDVoMmwyLjY2IDEyLjQyYTIgMiAwIDAgMCAyIDEuNThoOS43OGEyIDIgMCAwIDAgMS45NS0xLjU3bDEuNjUtNy40M0g1LjEyIi8+PC9zdmc+" style="width: 20px; height: 20px; filter:invert(1);"></button>
                </div>
            </article>
        `;
    }).join('');
}

function clearAllFilters() {
    document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
    document.querySelectorAll('.brand-logo.active').forEach(b => b.classList.remove('active'));
    sortSelectEl.value = 'newest';
    applyFilters();
}

function attachEvents() {
    categoryFiltersEl.addEventListener('change', applyFilters);
    priceFiltersEl.addEventListener('change', applyFilters);
    extraFilterSectionEl.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            applyFilters();
        }
    });
    sortSelectEl.addEventListener('change', applySorting);
    clearFiltersBtnEl.addEventListener('click', clearAllFilters);

    brandFiltersEl.addEventListener('click', (event) => {
        const button = event.target.closest('.brand-logo');
        if (button) {
            button.classList.toggle('active');
            applyFilters();
        }
    });

    productsGridEl.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        const addButton = e.target.closest('.btn-add');
        if (addButton) {
            return; 
        }
        if (card) {
            window.location.href = `/E-commerce/pages/productDetailPage.html?productId=${card.dataset.id}`;
        }
    });

    const searchInputEl = byId('searchInput');
    if (searchInputEl) {
        searchInputEl.addEventListener('input', searchProducts);
    }
}

function searchProducts() {
    const input = byId('searchInput').value.toLowerCase();
    filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(input) ||
        p.brand.toLowerCase().includes(input) ||
        p.category.toLowerCase().includes(input)
    );
    applySorting();
}

function checkSearchQuery() {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
        byId('searchInput').value = searchQuery;
        searchProducts();
    }
}

function filterByCategory() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    if (category) {
        const categoryCheckbox = document.querySelector(`#categoryFilters input[value="${category}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
            applyFilters();
        }
    }
}

function addToCart(productId) {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.isLoggedIn) {
        alert("Please log in to add products to your cart.");
        window.location.href = '/E-commerce/pages/loginPage.html';
        return;
    }

    fetch('/E-commerce/backend/orderManagement/cart/addCart.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('Product added to cart!');
            window.location.href = '/E-commerce/pages/ViewCartPage.html';
        }
    })
    .catch(error => {
        console.error('Error adding to cart:', error);
        alert('Failed to add product to cart.');
    });
}

document.addEventListener('DOMContentLoaded', fetchProducts);
