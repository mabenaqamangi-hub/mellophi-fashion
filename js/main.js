// ========================================
// MELLOPHI FASHION - MAIN JAVASCRIPT
// ========================================

// === GLOBAL STATE ===
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// === INITIALIZE ON PAGE LOAD ===
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateCartCount();
    updateWishlistCount();
    initMobileMenu();
    initHeroSlideshow();
    initCarousel();
    initNewsletterPopup();
    initWishlistButtons();
    initNewsletterForms();
}

// === HERO SLIDESHOW ===
function initHeroSlideshow() {
    const carousel = document.querySelector('.carousel-3d');
    const prevBtn = document.querySelector('.slide-controls .prev');
    const nextBtn = document.querySelector('.slide-controls .next');
    
    if (!carousel || !prevBtn || !nextBtn) return;

    const items = carousel.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    let currentRotation = 0;
    let autoRotateInterval;

    function rotateCarousel(direction) {
        const angleStep = 360 / totalItems;
        currentRotation += direction * angleStep;
        
        items.forEach((item, index) => {
            const angle = (index * angleStep) - currentRotation;
            item.style.transform = `rotateY(${angle}deg) translateZ(600px)`;
            
            // Calculate opacity based on position
            const normalizedAngle = ((angle % 360) + 360) % 360;
            if (normalizedAngle < 45 || normalizedAngle > 315) {
                item.style.opacity = '1';
                item.style.zIndex = '10';
            } else if (normalizedAngle < 90 || normalizedAngle > 270) {
                item.style.opacity = '0.5';
                item.style.zIndex = '5';
            } else {
                item.style.opacity = '0.2';
                item.style.zIndex = '1';
            }
        });
    }

    function startAutoRotate() {
        autoRotateInterval = setInterval(() => {
            rotateCarousel(1);
        }, 4000);
    }

    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }

    prevBtn.addEventListener('click', () => {
        stopAutoRotate();
        rotateCarousel(-1);
        startAutoRotate();
    });

    nextBtn.addEventListener('click', () => {
        stopAutoRotate();
        rotateCarousel(1);
        startAutoRotate();
    });

    startAutoRotate();
}

// === MOBILE MENU ===
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
}

// === CAROUSEL FUNCTIONALITY ===
function initCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    const cards = track.children;
    const totalCards = cards.length;
    const cardWidth = cards[0].offsetWidth + 32; // including gap
    
    function updateCarousel() {
        const maxIndex = totalCards - getVisibleCards();
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
    
    function getVisibleCards() {
        const containerWidth = track.parentElement.offsetWidth;
        return Math.floor(containerWidth / cardWidth);
    }
    
    prevBtn.addEventListener('click', () => {
        currentIndex--;
        updateCarousel();
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex++;
        updateCarousel();
    });
    
    window.addEventListener('resize', updateCarousel);
}

// === NEWSLETTER POPUP ===
function initNewsletterPopup() {
    const popup = document.getElementById('newsletter-popup');
    const closeBtn = document.getElementById('popup-close');
    
    if (!popup) return;
    
    // Show popup after 5 seconds
    const hasSeenPopup = sessionStorage.getItem('newsletterPopupSeen');
    if (!hasSeenPopup) {
        setTimeout(() => {
            popup.classList.add('active');
        }, 5000);
    }
    
    // Close popup
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            popup.classList.remove('active');
            sessionStorage.setItem('newsletterPopupSeen', 'true');
        });
    }
    
    // Close on outside click
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('active');
            sessionStorage.setItem('newsletterPopupSeen', 'true');
        }
    });
}

// === NEWSLETTER FORMS ===
function initNewsletterForms() {
    const forms = document.querySelectorAll('#newsletter-form, #popup-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            
            // Simulate newsletter subscription
            alert(`Thank you for subscribing! Check ${email} for your 10% discount code.`);
            form.reset();
            
            // Close popup if it's the popup form
            const popup = document.getElementById('newsletter-popup');
            if (popup && form.id === 'popup-form') {
                popup.classList.remove('active');
                sessionStorage.setItem('newsletterPopupSeen', 'true');
            }
        });
    });
}

// === WISHLIST FUNCTIONALITY ===
function initWishlistButtons() {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    
    wishlistBtns.forEach(btn => {
        const productCard = btn.closest('.product-card');
        if (!productCard) return;
        
        const productId = productCard.dataset.productId || Math.random().toString(36).substr(2, 9);
        
        // Check if already in wishlist
        if (wishlist.includes(productId)) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(productId, btn);
        });
    });
}

function toggleWishlist(productId, btn) {
    const index = wishlist.indexOf(productId);
    
    if (index === -1) {
        wishlist.push(productId);
        btn.classList.add('active');
        showNotification('Added to wishlist ♡');
    } else {
        wishlist.splice(index, 1);
        btn.classList.remove('active');
        showNotification('Removed from wishlist');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

function updateWishlistCount() {
    const wishlistCount = document.getElementById('wishlist-count');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
}

// === CART FUNCTIONALITY ===
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id && item.size === product.size);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification(`✓ Updated quantity in cart (${existingItem.quantity})`);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            size: product.size,
            color: product.color,
            image: product.image,
            quantity: 1
        });
        showNotification('✓ Added to your shopping bag!');
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    animateCartBadge();
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Add visual feedback when count changes
        if (totalItems > 0) {
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

function animateCartBadge() {
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartBtn.style.transform = 'scale(1)';
        }, 200);
    }
}

function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartItemQuantity(productId, size, newQuantity) {
    const item = cart.find(item => item.id === productId && item.size === size);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId, size);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
        }
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// === NOTIFICATION SYSTEM ===
function showNotification(message) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, var(--champagne), var(--nude-dark));
        color: var(--off-white);
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: var(--shadow-lg);
        z-index: 10001;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// === SCROLL EFFECTS ===
let lastScroll = 0;
const header = document.querySelector('.sticky-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Hide/show header on scroll
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// === ANIMATION UTILITIES ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.querySelectorAll('.product-card, .look-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// === MAKE PRODUCT CARDS CLICKABLE ===
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function(e) {
        // Don't navigate if clicking on wishlist button or quick view link
        if (e.target.closest('.wishlist-btn') || e.target.closest('.quick-view')) {
            return;
        }
        
        const productId = this.dataset.productId;
        if (productId) {
            window.location.href = `product.html?id=${productId}`;
        }
    });
    
    // Add pointer cursor to indicate clickability
    card.style.cursor = 'pointer';
});

// === EXPORT FUNCTIONS FOR OTHER PAGES ===
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        getCartTotal,
        toggleWishlist,
        showNotification
    };
}
// ========================================
// QUICK VIEW MODAL FUNCTIONS
// ========================================

let currentQuickViewProduct = null;
let selectedQVSize = null;
let selectedQVColor = null;

function openQuickView(productId) {
    const apiUrl = window.API_URL || 'http://localhost:5000/api';
    const backendUrl = apiUrl.replace('/api', '');
    
    // Fetch product from API first
    fetch(`${apiUrl}/products/${productId}`)
        .then(response => response.json())
        .then(result => {
            if (result.success && result.data) {
                showQuickViewModal(result.data, backendUrl);
            }
        })
        .catch(error => {
            console.error('Error fetching product:', error);
            alert('Unable to load product details. Please try again.');
        });
}

function showQuickViewModal(product, backendUrl) {
    currentQuickViewProduct = product;
    selectedQVSize = null;
    selectedQVColor = null;
    
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;
    
    // Update product image
    const imagePath = product.images && product.images.length > 0 
        ? (product.images[0].startsWith('http') 
            ? product.images[0] 
            : product.images[0].startsWith('images/') 
                ? `${backendUrl}/${product.images[0]}`
                : product.images[0])
        : 'images/PRODUCTS/A1 front.png';
    
    document.getElementById('qv-product-image').src = imagePath;
    document.getElementById('qv-product-image').alt = product.name || product.title;
    
    // Update product details
    document.getElementById('qv-product-title').textContent = product.name || product.title;
    document.getElementById('qv-product-price').textContent = `R ${parseFloat(product.price).toFixed(2)}`;
    document.getElementById('qv-product-description').textContent = product.description || '';
    
    // Update colors
    const colorsSection = document.getElementById('qv-colors-section');
    const colorOptions = document.getElementById('qv-color-options');
    if (product.colors && product.colors.length > 0) {
        colorsSection.style.display = 'block';
        colorOptions.innerHTML = '';
        
        product.colors.forEach((color, index) => {
            const colorName = typeof color === 'string' ? color : color.name;
            const colorValue = typeof color === 'string' ? getColorValue(color) : (color.value || getColorValue(color.name));
            
            const btn = document.createElement('button');
            btn.className = 'qv-color-btn';
            btn.style.cssText = `width: 40px; height: 40px; border-radius: 50%; border: 2px solid ${index === 0 ? '#d4a574' : '#ddd'}; background: ${colorValue}; cursor: pointer; transition: all 0.3s;`;
            btn.title = colorName;
            btn.onclick = () => selectQVColor(colorName, btn);
            
            if (index === 0) {
                selectedQVColor = colorName;
            }
            
            colorOptions.appendChild(btn);
        });
    } else {
        colorsSection.style.display = 'none';
    }
    
    // Update sizes
    const sizeOptions = document.getElementById('qv-size-options');
    sizeOptions.innerHTML = '';
    const sizes = product.sizes || ['S', 'M', 'L'];
    
    sizes.forEach(size => {
        const btn = document.createElement('button');
        btn.className = 'qv-size-btn';
        btn.textContent = size;
        btn.style.cssText = 'padding: 10px 20px; border: 2px solid #ddd; background: white; cursor: pointer; border-radius: 5px; font-weight: 500; transition: all 0.3s;';
        btn.onclick = () => selectQVSize(size, btn);
        sizeOptions.appendChild(btn);
    });
    
    // Update size guide
    updateQuickViewSizeGuide(product);
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function updateQuickViewSizeGuide(product) {
    const sizeGuideBtn = document.getElementById('qv-size-guide-btn');
    const sizeGuideTable = document.getElementById('qv-size-guide-table');
    
    if (!product.sizeGuide) {
        sizeGuideBtn.style.display = 'none';
        sizeGuideTable.style.display = 'none';
        return;
    }
    
    sizeGuideBtn.style.display = 'block';
    
    let sizeGuideData = product.sizeGuide;
    
    // Parse if string
    if (typeof sizeGuideData === 'string') {
        try {
            sizeGuideData = JSON.parse(sizeGuideData);
        } catch (e) {
            sizeGuideBtn.style.display = 'none';
            return;
        }
    }
    
    // Build size guide table
    if (sizeGuideData.measurements && sizeGuideData.measurements.length > 0) {
        const tableContent = document.getElementById('qv-size-guide-content');
        let html = '<thead><tr style="background: var(--table-header-bg, #3d3020);">';
        html += '<th style="padding: 12px 10px; text-align: left; border: 1px solid var(--table-header-border, #5a4a35); font-weight: 700; color: var(--table-header-text, #ffffff); letter-spacing: 0.5px; text-transform: uppercase; font-size: 0.85rem;">Size</th>';
        html += '<th style="padding: 12px 10px; text-align: left; border: 1px solid var(--table-header-border, #5a4a35); font-weight: 700; color: var(--table-header-text, #ffffff); letter-spacing: 0.5px; text-transform: uppercase; font-size: 0.85rem;">Bust</th>';
        html += '<th style="padding: 12px 10px; text-align: left; border: 1px solid var(--table-header-border, #5a4a35); font-weight: 700; color: var(--table-header-text, #ffffff); letter-spacing: 0.5px; text-transform: uppercase; font-size: 0.85rem;">Waist</th>';
        html += '<th style="padding: 12px 10px; text-align: left; border: 1px solid var(--table-header-border, #5a4a35); font-weight: 700; color: var(--table-header-text, #ffffff); letter-spacing: 0.5px; text-transform: uppercase; font-size: 0.85rem;">Hips</th>';
        html += '<th style="padding: 12px 10px; text-align: left; border: 1px solid var(--table-header-border, #5a4a35); font-weight: 700; color: var(--table-header-text, #ffffff); letter-spacing: 0.5px; text-transform: uppercase; font-size: 0.85rem;">Length</th>';
        html += '</tr></thead><tbody>';
        
        sizeGuideData.measurements.forEach((m, index) => {
            html += `<tr style="background: ${index % 2 === 0 ? 'white' : '#faf8f5'};">`;
            html += `<td style="padding: 10px; border: 1px solid #d0c4b0; font-weight: 600;">${m.size}</td>`;
            html += `<td style="padding: 10px; border: 1px solid #d0c4b0;">${m.bust || '-'}</td>`;
            html += `<td style="padding: 10px; border: 1px solid #d0c4b0;">${m.waist || '-'}</td>`;
            html += `<td style="padding: 10px; border: 1px solid #d0c4b0;">${m.hips || '-'}</td>`;
            html += `<td style="padding: 10px; border: 1px solid #d0c4b0;">${m.length || '-'}</td>`;
            html += '</tr>';
        });
        
        html += '</tbody>';
        tableContent.innerHTML = html;
        
        // Update notes
        const notesEl = document.getElementById('qv-size-guide-notes');
        if (sizeGuideData.notes) {
            notesEl.textContent = `📌 ${sizeGuideData.notes} (All measurements in ${sizeGuideData.unit || 'cm'})`;
            notesEl.style.display = 'block';
        } else {
            notesEl.textContent = `All measurements in ${sizeGuideData.unit || 'cm'}`;
            notesEl.style.display = 'block';
        }
    }
}

function toggleSizeGuide() {
    const table = document.getElementById('qv-size-guide-table');
    const btn = document.getElementById('qv-size-guide-btn');
    
    if (table.style.display === 'none') {
        table.style.display = 'block';
        btn.textContent = '📏 Hide Size Guide';
    } else {
        table.style.display = 'none';
        btn.textContent = '📏 View Size Guide';
    }
}

function selectQVSize(size, btn) {
    selectedQVSize = size;
    
    // Update button styles
    const allBtns = document.querySelectorAll('.qv-size-btn');
    allBtns.forEach(b => {
        b.style.borderColor = '#ddd';
        b.style.background = 'white';
        b.style.color = '#333';
    });
    
    btn.style.borderColor = '#d4a574';
    btn.style.background = '#d4a574';
    btn.style.color = 'white';
}

function selectQVColor(color, btn) {
    selectedQVColor = color;
    
    // Update button styles
    const allBtns = document.querySelectorAll('.qv-color-btn');
    allBtns.forEach(b => {
        b.style.borderColor = '#ddd';
    });
    
    btn.style.borderColor = '#d4a574';
}

function getColorValue(colorName) {
    const colorMap = {
        'Brown': '#8B4513',
        'Blue': '#4169E1',
        'Yellow': '#FFD700',
        'Nude': '#E8D5C4',
        'Beige': '#D4BBA8',
        'Cream': '#F5EBE0',
        'Sand': '#C9B39C',
        'White': '#FFFFFF',
        'Black': '#000000',
        'Red': '#DC143C',
        'Green': '#228B22',
        'Pink': '#FFB6C1',
        'Purple': '#9370DB',
        'Navy': '#000080',
        'Gray': '#808080',
        'Grey': '#808080'
    };
    return colorMap[colorName] || '#CCCCCC';
}

function decreaseQty() {
    const qtyInput = document.getElementById('qv-quantity');
    const currentVal = parseInt(qtyInput.value) || 1;
    if (currentVal > 1) {
        qtyInput.value = currentVal - 1;
    }
}

function increaseQty() {
    const qtyInput = document.getElementById('qv-quantity');
    const currentVal = parseInt(qtyInput.value) || 1;
    qtyInput.value = currentVal + 1;
}

function addToCartFromQV() {
    if (!currentQuickViewProduct) return;
    
    if (!selectedQVSize) {
        alert('Please select a size');
        return;
    }
    
    const quantity = parseInt(document.getElementById('qv-quantity').value) || 1;
    
    const cartItem = {
        id: currentQuickViewProduct.id || currentQuickViewProduct.productId,
        name: currentQuickViewProduct.name || currentQuickViewProduct.title,
        price: currentQuickViewProduct.price,
        size: selectedQVSize,
        color: selectedQVColor || 'Default',
        quantity: quantity,
        image: currentQuickViewProduct.images ? currentQuickViewProduct.images[0] : 'images/PRODUCTS/A1 front.png'
    };
    
    // Add to cart (using localStorage)
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists
    const existingItemIndex = cart.findIndex(item => 
        item.id === cartItem.id && 
        item.size === cartItem.size && 
        item.color === cartItem.color
    );
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    showNotification(`✅ Added ${quantity} × ${cartItem.name} (${cartItem.size}) to cart!`);
}

function viewFullProduct() {
    if (!currentQuickViewProduct) return;
    const productId = currentQuickViewProduct.id || currentQuickViewProduct.productId;
    window.location.href = `product.html?id=${productId}`;
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;
    
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset size guide visibility
    const table = document.getElementById('qv-size-guide-table');
    const btn = document.getElementById('qv-size-guide-btn');
    if (table && btn) {
        table.style.display = 'none';
        btn.textContent = '📏 View Size Guide';
    }
    
    currentQuickViewProduct = null;
    selectedQVSize = null;
    selectedQVColor = null;
}

// Close modal on outside click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('quickViewModal');
    if (modal && e.target === modal) {
        closeQuickView();
    }
});