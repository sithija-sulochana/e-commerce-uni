// Initialize Icons
lucide.createIcons();

const products = [
    { id: 'LAP-101', name: 'ASUS Vivobook 16', price: '$1,299', date: 'Feb 15, 2026', img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=400' },
    { id: 'LAP-102', name: 'Dell XPS 13', price: '$1,499', date: 'Jan 20, 2026', img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=400' },
    { id: 'LAP-103', name: 'MacBook Pro M3', price: '$1,999', date: 'Feb 01, 2026', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400' },
    { id: 'LAP-104', name: 'Lenovo Legion', price: '$1,650', date: 'Dec 12, 2025', img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=400' },
    { id: 'LAP-105', name: 'HP Spectre x360', price: '$1,350', date: 'Feb 10, 2026', img: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?q=80&w=400' },
    { id: 'LAP-106', name: 'Asus Zenbook', price: '$1,100', date: 'Feb 18, 2026', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=400' }
];

const grid = document.getElementById('productGrid');
const filterToggle = document.getElementById('filterToggle');
const sidebar = document.getElementById('sidebar');

// Render Cards
function render() {
    grid.innerHTML = products.map(p => `
        <div class="card">
            <div class="card-image-wrapper">
                <img src="${p.img}" alt="${p.name}">
            </div>
            <div class="card-content">
                <span class="status-badge">In Stock</span>
                <h3 class="product-title">${p.name}</h3>
                <p style="font-size: 0.8rem; color: #64748b">Added: ${p.date}</p>
                <div class="product-price">${p.price}</div>
                <p style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 10px;">ID: ${p.id}</p>
                <button class="btn-add-to-cart">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Intersection Observer for Scroll Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('reveal');
            }, index * 100); // Staggered reveal
        }
    });
}, { threshold: 0.1 });

// Sidebar Toggle Logic
filterToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Init
render();
document.querySelectorAll('.card').forEach(card => observer.observe(card));