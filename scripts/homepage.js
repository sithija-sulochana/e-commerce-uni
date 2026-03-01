 //  NAVIGATION TOGGLE
        function toggleMenu() {
            const navCenter = document.querySelector('.nav-center');
            navCenter.classList.toggle('active');
        }

        // Close menu when clicking on links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                document.querySelector('.nav-center').classList.remove('active');
            });
        });

        //  PRODUCTS DATA 
        const products = [
            {
                id: 1,
                name: "iPhone 15 Pro Max",
                category: "Phone",
                description: "6.7-inch Super Retina XDR display with ProMotion and Titanium build.",
                price: "Rs.285,000",
                image: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=400&fit=crop"
            },
            {
                id: 2,
                name: "MacBook Pro 14\" M3",
                category: "Laptop",
                description: "The most advanced chips ever built for a personal computer.",
                price: "Rs.450,000",
                image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop"
            },
            {
                id: 3,
                name: "ASUS ROG Strix G16",
                category: "Computer",
                description: "High-performance gaming desktop replacement with liquid cooling.",
                price: "Rs.380,000",
                image: "https://images.unsplash.com/photo-1588872657840-790ff3bde08c?w=400&h=400&fit=crop"
            }
        ];

        const specs = [
            { id: 1, productId: 1, specName: "Display", specValue: "6.7 inch OLED" },
            { id: 2, productId: 1, specName: "Camera", specValue: "48MP Main" },
            { id: 3, productId: 1, specName: "Battery", specValue: "95% Health" },

            { id: 4, productId: 2, specName: "Display", specValue: "14.2 inch Liquid Retina" },
            { id: 5, productId: 2, specName: "Processor", specValue: "Apple M3 Chip" },
            { id: 6, productId: 2, specName: "RAM", specValue: "16GB Unified" },

            { id: 8, productId: 3, specName: "Processor", specValue: "Intel i9-14900K" },
            { id: 9, productId: 3, specName: "GPU", specValue: "NVIDIA RTX 4080" },
            { id: 10, productId: 3, specName: "Cooling", specValue: "Liquid Cooling" }
        ];

        //  RENDER PRODUCTS 
        function renderProducts() {
            const container = document.getElementById('product-container');
            let productHTML = '';

            products.forEach(product => {
                const productSpecs = specs
                    .filter(spec => 
                        spec.productId === product.id &&
                        ["Display", "Processor", "Camera"].includes(spec.specName)
                    )
                    .map(spec => `<div class="spec-item">${spec.specValue}</div>`)
                    .join('');

                productHTML += `
                    <div class="product-card">
                        <div class="product-image-wrapper">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="product-content">
                            <div class="product-category">${product.category}</div>
                            <h3 class="product-title">${product.name}</h3>
                            <p class="product-description">${product.description}</p>
                            <div class="specs">
                                ${productSpecs}
                            </div>
                            <div class="product-footer">
                                <span class="product-price">${product.price}</span>
                                <button class="btn-add-to-cart">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = productHTML;
        }

        //  CHANGING TEXT IN HERO
        document.addEventListener('DOMContentLoaded', () => {
            renderProducts();

            // Add smooth scroll for buttons
            // document.querySelectorAll('.cta-btn, .btn-add-to-cart').forEach(btn => {
            //     btn.addEventListener('click', function() {
            //         if (this.classList.contains('cta-btn')) {
            //             document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            //         }
            //     });
            // });

            // Add dropdown toggle for mobile
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                const link = dropdown.querySelector('a');
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                    }
                });
            });
        });

        // SCROLL ANIMATIONS 
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            } else {
                navbar.style.boxShadow = 'var(--shadow-sm)';
            }
        });