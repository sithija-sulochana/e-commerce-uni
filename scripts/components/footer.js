// footer.js
const footerTemplate = `
<style>
    :root {
        --primary: #667eea;
        --primary-dark: #5a67d8;
        --text-dark: #1a202c;
        --accent: #6366f1;
        --border-light: rgba(255, 255, 255, 0.1);
        --radius-sm: 4px;
        --transition: all 0.3s ease;
    }

    .footer {
        background: linear-gradient(135deg, #1a202c, #0f172a);
        color: #cbd5e1;
        padding: 60px 6% 30px;
        font-family: 'Poppins', sans-serif;
        margin-top: 50px;
    }

    .footer-content {
        max-width: 1400px;
        margin: 0 auto 40px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 40px;
    }

    .footer h3 {
        color: white;
        margin-bottom: 20px;
        font-weight: 700;
        font-size: 1.2rem;
    }

    .footer p {
        font-size: 14px;
        line-height: 1.7;
        color: #94a3b8;
    }

    .footer a {
        display: block;
        text-decoration: none;
        color: #cbd5e1;
        margin-bottom: 12px;
        font-size: 14px;
        transition: var(--transition);
    }

    .footer a:hover {
        color: var(--accent);
        padding-left: 5px;
    }

    .newsletter-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .newsletter-input {
        padding: 12px 14px;
        width: 100%;
        border: 1px solid var(--border-light);
        border-radius: var(--radius-sm);
        background: rgba(255, 255, 255, 0.05);
        color: white;
        font-size: 14px;
        box-sizing: border-box;
    }

    .btn-subscribe {
        padding: 12px 16px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: var(--radius-sm);
        font-weight: 600;
        cursor: pointer;
        transition: var(--transition);
    }

    .btn-subscribe:hover {
        background: var(--primary-dark);
        transform: translateY(-2px);
    }

    .footer-bottom {
        max-width: 1400px;
        margin: 0 auto;
        text-align: center;
        border-top: 1px solid var(--border-light);
        padding-top: 25px;
        font-size: 13px;
        color: #64748b;
    }

    @media (max-width: 768px) {
        .footer { padding: 40px 4% 20px; }
        .footer-content { grid-template-columns: 1fr 1fr; }
    }

    @media (max-width: 480px) {
        .footer-content { grid-template-columns: 1fr; }
    }
</style>

<footer class="footer">
    <div class="footer-content">
        <div>
            <h3>🚀 TechHub</h3>
            <p>Your trusted destination for premium technology products. We deliver innovation and excellence to your doorstep.</p>
        </div>

        <div>
            <h3>Quick Links</h3>
            <a href="/index.html#home">Home</a>
            <a href="/index.html#products">Products</a>
            <a href="/index.html#categories">Categories</a>
            <a href="/index.html#promotions">Promotions</a>
        </div>

        <div>
            <h3>Support</h3>
            <a href="/pages/faq.html">FAQ</a>
            <a href="/pages/contact.html">Contact Us</a>
            <a href="/pages/shipping.html">Shipping Info</a>
            <a href="/pages/returns.html">Returns & Exchange</a>
        </div>

        <div>
            <h3>Newsletter</h3>
            <p>Subscribe to get exclusive offers and updates.</p>
            <div class="newsletter-container">
                <input type="email" class="newsletter-input" placeholder="Enter your email" id="footerEmail">
                <button class="btn-subscribe" onclick="handleSubscribe()">Subscribe</button>
            </div>
        </div>
    </div>

    <div class="footer-bottom">
        &copy; 2026 TechHub. All rights reserved. | 
        <a href="#" style="display:inline; margin:0;">Privacy Policy</a> | 
        <a href="#" style="display:inline; margin:0;">Terms of Service</a>
    </div>
</footer>
`;

document.body.insertAdjacentHTML('beforeend', footerTemplate);

function handleSubscribe() {
    const email = document.getElementById('footerEmail').value;
    if(email) {
        alert('Thanks for subscribing, ' + email + '!');
        document.getElementById('footerEmail').value = '';
    } else {
        alert('Please enter a valid email.');
    }
}