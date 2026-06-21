// ========================================
// CONTACT PAGE JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
});

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Simulate form submission
        // In a real application, you would send this to a server
        console.log('Form submitted:', formData);
        
        // Show success message
        if (typeof showNotification === 'function') {
            showNotification('Thank you! We\'ll get back to you within 24 hours.');
        } else {
            alert('Thank you! We\'ll get back to you within 24 hours.');
        }
        
        // Reset form
        contactForm.reset();
        
        // Optional: Send email via mailto (opens user's email client)
        // window.location.href = `mailto:mellophifashion@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(formData.message)}`;
    });
}
