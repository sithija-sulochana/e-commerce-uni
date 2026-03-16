const products = [
    {
        id: 8,
        name: 'MacBook Pro 14"',
        category: 'Laptop',
        price: 599000,
        brand: 'Apple',
        description: 'Powerful M3 chip and all-day battery life.',
        specs: ['16GB RAM', '512GB SSD'],
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900'
    },
    {
        id: 7,
        name: 'Dell XPS 13',
        category: 'Laptop',
        price: 389000,
        brand: 'Dell',
        description: 'Slim premium ultrabook for daily productivity.',
        specs: ['8GB RAM', '256GB SSD'],
        image: 'https://images.unsplash.com/photo-1588872657840-218e412ee914?w=900'
    },
    {
        id: 6,
        name: 'ASUS TUF Gaming PC',
        category: 'Computer',
        price: 449000,
        brand: 'ASUS',
        description: 'High performance gaming desktop with RTX graphics.',
        specs: ['32GB RAM', '1TB SSD'],
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=900'
    },
    {
        id: 5,
        name: 'Galaxy S24',
        category: 'Phone',
        price: 299000,
        brand: 'Samsung',
        description: 'Flagship Android phone with pro-level camera.',
        specs: ['120Hz', '5G'],
        image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=900'
    },
    {
        id: 4,
        name: 'iPhone 15 Pro',
        category: 'Phone',
        price: 359000,
        brand: 'Apple',
        description: 'Titanium design and lightning-fast performance.',
        specs: ['A17 Pro', '256GB'],
        image: 'https://images.unsplash.com/photo-1695639470555-57f4f7be0086?w=900'
    },
    {
        id: 3,
        name: 'HP Pavilion Desktop',
        category: 'Computer',
        price: 254000,
        brand: 'HP',
        description: 'Reliable home and office desktop setup.',
        specs: ['16GB RAM', '512GB SSD'],
        image: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=900'
    },

];

const priceRanges = [
    { label: 'Under Rs.150,000', min: 0, max: 150000 },
    { label: 'Rs.150,000 - Rs.300,000', min: 150000, max: 300000 },
    { label: 'Rs.300,000 - Rs.450,000', min: 300000, max: 450000 },
    { label: 'Over Rs.450,000', min: 450000, max: Infinity }
];

const brandImages = [
    { brand: 'Apple', image: '/assets/brandsLogos/phones/apple.png' },
    { brand: 'Dell', image: '/assets/brandsLogos/laptopsComputer/Dell_Logo.svg-removebg-preview.png' },
    { brand: 'ASUS', image: '/assets/brandsLogos/laptopsComputer/asus.png' },
    { brand: 'Samsung', image: '/assets/brandsLogos/phones/samsung.png' },
    { brand: 'HP', image: '/assets/brandsLogos/laptopsComputer/hp.png' },

];

//set - remove duplicates and get unique brands from products data
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

    const IsPremium = filteredProducts.filter(product =>product.price > 400000);

    

    productsGridEl.innerHTML = filteredProducts.map((product) => `

   
            <article class="product-card">

                
                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                ${IsPremium? `<div id="premiumIcon" style="color: #ff6b35; font-size: 24px; position: absolute; top: 5px; right: 10px; padding: 4px; background-color: #fff; border-radius: 10px;display:flex; justify-content: center; align-items: center;">🔥<span style="margin-left: 5px; font-size: 14px;">Premium</span></div>` : ''}
                
                <div class="product-content">
                    <p class="product-category">${product.category}</p>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>

                    <div class="specs">
                        ${product.specs.map((spec) => `<span class="spec-item">${spec}</span>`).join('')}
                    </div>
                 

                    
                    <div class="product-footer" id="productFooter">
                        <span class="product-price">Rs.${product.price.toLocaleString()}</span>
                       <button type="button" onclick="addToWishlist(${product.id})" class="btn-wishlist" data-product-id="${product.id}" aria-label="Add to wishlist" title="Add to wishlist">
                           <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWhlYXJ0LWljb24gbHVjaWRlLWhlYXJ0Ij48cGF0aCBkPSJNMiA5LjVhNS41IDUuNSAwIDAgMSA5LjU5MS0zLjY3Ni41Ni41NiAwIDAgMCAuODE4IDBBNS40OSA1LjQ5IDAgMCAxIDIyIDkuNWMwIDIuMjktMS41IDQtMyA1LjVsLTUuNDkyIDUuMzEzYTIgMiAwIDAgMS0zIC4wMTlMNSAxNWMtMS41LTEuNS0zLTMuMi0zLTUuNSIvPjwvc3ZnPg==" class="wishlist-icon" alt="Wishlist icon">
                       </button>
                        
                    </div>
                    <button class="btn-add" type="button" data-product-id="${product.id}" onclick="addToCart(${product.id}, '${product.name}', '${product.image}', ${product.price}, '${product.category}')" style="margin-top: 10px;">Add to Cart</button>
                        
                </div>
            </article>
   
        `).join('');
}



productsGridEl.addEventListener('click', function (e) {
    const addToCartBtn = e.target.closest('.btn-add');
    const wishlistBtn = e.target.closest('.btn-wishlist');
    const card = e.target.closest('.product-card');

    if (addToCartBtn) {
        e.stopPropagation();
        const productId = Number(addToCartBtn.dataset.productId);
        const product = products.find(p => p.id === productId);
        addToCart(product.id, product.name, product.image, product.price, product.category);
        return;
    }

    if (wishlistBtn) {
        e.stopPropagation();
        e.preventDefault();
        return;
    }

    if (card) {
        const productId = card.dataset.id || card.querySelector('.btn-add').dataset.productId;
        window.location.href = `/pages/productDetailPage.html?productId=${productId}`;
    }
});

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

        const { productName, productImage, productPrice } = button.dataset;
        addToCart(productName, productImage, productPrice);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    attachEvents();
    applySorting();
    filterByCategory();
});


// When clicking on a particular product, show the related filters and sorting options, and hide them when navigating away from the product list page. This can be achieved by checking the current URL and conditionally rendering the filters and sorting elements based on whether the user is on the product list page or not.

// document.addEventListener("DOMContentLoaded", function () {

//     categoryFiltersEl.addEventListener('click', function (e) {
//         const productContainer = document.getElementById('product-container');
//         const filterSidebar = document.getElementById('filterSidebar');
//         if (e.target.tagName === 'Laptop'.toLocaleLowerCase()) {
//             // If the user clicks on the "Laptop" category, show the filters and sorting options
//             filterSidebar.innerHTML = `
//             <div class="filter-section">
// 				<h4>Category</h4>
// 				<div id="categoryFilters" class="filter-group"></div>
// 			</div>
//             `;


//         }
// // });


// });


// When click add to card button send the product name , image, price to the ViewCardPage and show the added product in the cart page. This can be done by storing the product details in localStorage when the "Add to Cart" button is clicked, and then retrieving and displaying those details on the ViewCartPage.

function addToCart(id, name, image, price, category = 'Product') {

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (!id || !name || !price) {
        console.error("Invalid product data:", { id, name, image, price });
        return; // STOP execution
    }

    console.log(cartItems, { id, name, image, price, category });
    // Check if product already exists
    const existingItem = cartItems.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            id: id,
            name: name,
            image: image,
            price: price,
            category: category,
            quantity: 1,
            discount: 15,
        });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Redirect to cart page
    window.location.href = '/pages/ViewCartPage.html';
}



// search product and display product 

function searchProducts() {
    const input = document.getElementById('searchInput').value.toLowerCase();

    if (!input) {
        filteredProducts = [...products];
        renderProducts();
        return;
    }

    filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(input) ||
            product.category.toLowerCase().includes(input) ||
            product.brand.toLowerCase().includes(input);
    });

    renderProducts();
}

document.getElementById('searchInput').addEventListener('input', searchProducts);


// Check whether there is a search query in the URL and filter products accordingly

function checkSearchQuery() {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
        console.log('Search query found in URL:', searchQuery);
        document.getElementById('searchInput').value = searchQuery;
        searchProducts();
    }
}

checkSearchQuery();


//function for Wishlist

const WISHLIST_OUTLINE_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWhlYXJ0LWljb24gbHVjaWRlLWhlYXJ0Ij48cGF0aCBkPSJNMiA5LjVhNS41IDUuNSAwIDAgMSA5LjU5MS0zLjY3Ni41Ni41NiAwIDAgMCAuODE4IDBBNS40OSA1LjQ5IDAgMCAxIDIyIDkuNWMwIDIuMjktMS41IDQtMyA1LjVsLTUuNDkyIDUuMzEzYTIgMiAwIDAgMS0zIC4wMTlMNSAxNWMtMS41LTEuNS0zLTMuMi0zLTUuNSIvPjwvc3ZnPg==';
const WISHLIST_FILLED_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJyZWQiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWhlYXJ0LWljb24gbHVjaWRlLWhlYXJ0Ij48cGF0aCBkPSJNMiA5LjVhNS41IDUuNSAwIDAgMSA5LjU5MS0zLjY3Ni41Ni41NiAwIDAgMCAuODE4IDBBNS40OSA1LjQ5IDAgMCAxIDIyIDkuNWMwIDIuMjktMS41IDQtMyA1LjVsLTUuNDkyIDUuMzEzYTIgMiAwIDAgMS0zIC4wMTlMNSAxNWMtMS41LTEuNS0zLTMuMi0zLTUuNSIvPjwvc3ZnPg==';

function addToWishlist(productId) {


    
    const product = products.find(p => p.id === productId);
    const wishListBtn = document.querySelector(`.btn-wishlist[data-product-id="${productId}"]`);
    const wishListIcon = wishListBtn ? wishListBtn.querySelector('.wishlist-icon') : null;
    console.log("Product to add to wishlist:", wishListIcon);
    console.log("Adding to wishlist:", product);

    if (!product) {
        console.error("Product not found for wishlist:", productId);
        return;
    }

    if (!wishListBtn || !wishListIcon) {
        return;
    }

    if (wishListBtn.classList.contains('active')) {
        removeFromWishlist(productId);
        return;
    }

    if (product && wishListIcon) {
        // change the wishlist icon to filled heart in red
        wishListIcon.src = WISHLIST_FILLED_ICON;
        wishListBtn.classList.add('active');
    }


}


function removeFromWishlist(productId) {
    const wishListBtn = document.querySelector(`.btn-wishlist[data-product-id="${productId}"]`);
    if (wishListBtn) {
        const wishListIcon = wishListBtn.querySelector('.wishlist-icon');
        if (wishListIcon) {
            wishListIcon.src = WISHLIST_OUTLINE_ICON;
            wishListBtn.classList.remove('active');
        }
    }
}




function filterByCategory(){
  
const urlParams = new URLSearchParams(window.location.search);
const categoryFilter = urlParams.get('category');
const checkboxInput = document.getElementById('checkbox-fiter');
if(categoryFilter){
    categoryFiltersEl.innerHTML = `
            <label class="filter-item">
                <input type="checkbox" value="${categoryFilter}" data-type="category" checked>
                <span>${categoryFilter}</span>
            </label>
        `;

    filteredProducts = products.filter((product) => product.category.toLowerCase() === categoryFilter.toLowerCase());
    renderProducts();
}

}

filterByCategory();