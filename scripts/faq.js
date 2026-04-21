// ===================== FAQ ACCORDION FUNCTIONALITY =====================

document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(button => {
        button.addEventListener('click', function() {
            const faqItem = this.parentElement;
            
            // Toggle the active class on the current item
            faqItem.classList.toggle('active');
            
            //Close other items when opening a new one 
            faqQuestions.forEach(otherButton => {
                if (otherButton !== button) {
                    otherButton.parentElement.classList.remove('active');
                }
            });
        });
    });
    
    // Smooth scroll to FAQ section if there's a hash
    if (window.location.hash === '#faq') {
        const faqContainer = document.querySelector('.faq-container');
        if (faqContainer) {
            setTimeout(() => {
                faqContainer.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
    
    // Add keyboard support 
    faqQuestions.forEach(button => {
        button.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    });
});

// Function to open a specific FAQ item by section index and item index
function openFaqItem(sectionIndex, itemIndex) {
    const sections = document.querySelectorAll('.faq-section');
    if (sectionIndex < sections.length) {
        const items = sections[sectionIndex].querySelectorAll('.faq-item');
        if (itemIndex < items.length) {
            items[itemIndex].classList.add('active');
            items[itemIndex].querySelector('.faq-question').focus();
        }
    }
}

// Function to close all FAQ items
function closeAllFaqItems() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.classList.remove('active');
    });
}

// Function to open all FAQ items
function openAllFaqItems() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.classList.add('active');
    });
}

// Search functionality for FAQ
function searchFaq(searchTerm) {
    const faqItems = document.querySelectorAll('.faq-item');
    const searchTermLower = searchTerm.toLowerCase();
    let visibleCount = 0;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question span:first-child').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
        
        if (question.includes(searchTermLower) || answer.includes(searchTermLower)) {
            item.style.display = 'block';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    return visibleCount;
}

// Export functions for external use
window.faqFunctions = {
    openItem: openFaqItem,
    closeAll: closeAllFaqItems,
    openAll: openAllFaqItems,
    search: searchFaq
};
