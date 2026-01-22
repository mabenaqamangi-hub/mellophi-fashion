// ========================================
// CHECKOUT PAGE JAVASCRIPT
// ========================================

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let shippingCost = 80;
let discountAmount = 0;

document.addEventListener('DOMContentLoaded', function() {
    initCheckout();
});

function initCheckout() {
    console.log('=== INITIALIZING CHECKOUT ===');
    console.log('Cart from localStorage:', localStorage.getItem('cart'));
    console.log('Parsed cart:', cart);
    console.log('Cart length:', cart.length);
    
    // Initialize cart count in header
    updateCartCount();
    
    // Load cart items first
    loadCartItems();
    
    // Force initial total update even if cart is empty
    updateOrderTotals();
    
    // Initialize all functionality
    initShippingOptions();
    initPromoCode();
    initCheckoutForm();
    initPaymentOptions();
    loadBankDetailsFromSettings();
    
    console.log('=== CHECKOUT INITIALIZED SUCCESSFULLY ===');
}

// === LOAD BANK DETAILS FROM ADMIN SETTINGS ===
function loadBankDetailsFromSettings() {
    const savedBankDetails = localStorage.getItem('mellophiBankDetails');
    
    if (savedBankDetails) {
        const details = JSON.parse(savedBankDetails);
        
        // Update banking details section with saved data
        const bankingDetailsSection = document.getElementById('banking-details');
        if (bankingDetailsSection) {
            const bankItems = bankingDetailsSection.querySelectorAll('.bank-detail-item');
            
            // Update Bank Name
            if (bankItems[0]) {
                bankItems[0].querySelector('span').textContent = details.bankName;
            }
            
            // Update Account Name
            if (bankItems[1]) {
                bankItems[1].querySelector('span').textContent = details.accountHolder;
            }
            
            // Update Account Number
            if (bankItems[2]) {
                const accountSpan = bankItems[2].querySelector('.copy-text');
                accountSpan.textContent = details.accountNumber;
                const copyBtn = bankItems[2].querySelector('.btn-copy');
                copyBtn.onclick = () => copyToClipboard(details.accountNumber);
            }
            
            // Update Branch Code
            if (bankItems[3]) {
                const branchSpan = bankItems[3].querySelector('.copy-text');
                branchSpan.textContent = details.branchCode;
                const copyBtn = bankItems[3].querySelector('.btn-copy');
                copyBtn.onclick = () => copyToClipboard(details.branchCode);
            }
            
            // Update Account Type
            if (bankItems[4]) {
                bankItems[4].querySelector('span').textContent = details.accountType + ' Account';
            }
        }
    }
}

// === PAYMENT OPTIONS ===
function initPaymentOptions() {
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const bankingDetails = document.getElementById('banking-details');
    const cardPaymentForm = document.getElementById('card-payment-form');
    
    if (!bankingDetails || !cardPaymentForm) {
        console.error('Payment form elements not found');
        return;
    }
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            console.log('Payment method changed to:', this.value);
            
            // Hide all payment forms first
            bankingDetails.style.display = 'none';
            cardPaymentForm.style.display = 'none';
            
            // Show the selected payment form
            if (this.value === 'eft') {
                bankingDetails.style.display = 'block';
                // Generate a reference number based on timestamp
                const reference = 'MELL' + Date.now().toString().slice(-8);
                const refElement = document.getElementById('payment-reference');
                if (refElement) {
                    refElement.textContent = reference;
                }
            } else if (this.value === 'card') {
                cardPaymentForm.style.display = 'block';
            }
            // PayFast doesn't need additional form fields
        });
    });
    
    // Add card number formatting
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    // Add expiry date formatting
    const cardExpiryInput = document.getElementById('card-expiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // CVV only numbers
    const cardCvvInput = document.getElementById('card-cvv');
    if (cardCvvInput) {
        cardCvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

// Copy to clipboard function - Make it global
window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show temporary success message
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy. Please copy manually.');
    });
}

// Copy reference number - Make it global
window.copyReference = function() {
    const reference = document.getElementById('payment-reference').textContent;
    window.copyToClipboard(reference);
}

// === LOAD CART ITEMS ===
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart" style="text-align: center; padding: 40px 20px;">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#d4af7a" stroke-width="1.5" style="margin-bottom: 20px;">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <h3 style="color: #2c3e50; margin-bottom: 10px; font-size: 1.5em;">Your Shopping Bag is Empty</h3>
                <p style="color: #7f8c8d; margin-bottom: 25px;">Looks like you haven't added anything yet</p>
                <a href="shop.html" class="btn-primary" style="display: inline-block; background: #d4af7a; color: white; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-weight: 600; transition: all 0.3s ease;">
                    Start Shopping
                </a>
            </div>
        `;
        
        // Hide checkout form when cart is empty
        const checkoutForm = document.querySelector('.checkout-form-container');
        if (checkoutForm) {
            checkoutForm.style.display = 'none';
        }
        
        return;
    }
    
    // Show checkout form when cart has items
    const checkoutForm = document.querySelector('.checkout-form-container');
    if (checkoutForm) {
        checkoutForm.style.display = 'block';
    }
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItem = createCartItemElement(item, index);
        cartItemsContainer.appendChild(cartItem);
    });
}

function createCartItemElement(item, index) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
        <div class="item-image">
            <img src="${item.image || 'images/product1.jpg'}" alt="${item.name}">
        </div>
        <div class="item-details">
            <div class="item-name" style="font-weight: 600; color: #2c3e50; margin-bottom: 5px;">${item.name}</div>
            <div class="item-variant" style="color: #7f8c8d; font-size: 0.9em; margin-bottom: 8px;">
                Size: ${item.size || 'N/A'}${item.color ? ' | Color: ' + item.color : ''}
            </div>
            <div class="item-pricing" style="display: flex; flex-direction: column; gap: 5px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #7f8c8d; font-size: 0.9em;">Price per item:</span>
                    <span style="font-weight: 500;">R ${item.price.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #7f8c8d; font-size: 0.9em;">Quantity:</span>
                    <span style="font-weight: 500;">× ${item.quantity}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 5px; border-top: 1px solid #eee; margin-top: 5px;">
                    <span style="color: #2c3e50; font-weight: 600;">Item Subtotal:</span>
                    <span style="color: #27ae60; font-weight: 700; font-size: 1.1em;">R ${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>
        </div>
        <button class="remove-item" data-index="${index}" title="Remove item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;
    
    // Add remove functionality
    const removeBtn = div.querySelector('.remove-item');
    removeBtn.addEventListener('click', () => {
        removeCartItem(index);
    });
    
    return div;
}

function removeCartItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
    updateOrderTotals();
    updateCartCount();
}

// === UPDATE ORDER TOTALS ===
function updateOrderTotals() {
    // Calculate subtotal from cart
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + shippingCost - discountAmount;
    
    console.log('=== UPDATING TOTALS ===');
    console.log('Cart items:', cart.length);
    console.log('Subtotal:', subtotal);
    console.log('Shipping:', shippingCost);
    console.log('Discount:', discountAmount);
    console.log('Total:', total);
    
    // Update item count
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update all display elements with error handling
    updateElementText('subtotal', `R ${subtotal.toFixed(2)}`);
    
    // Update shipping cost display with descriptive text
    const shippingEl = document.getElementById('shipping-cost');
    if (shippingEl) {
        if (shippingCost === 0) {
            shippingEl.textContent = 'FREE (Pickup)';
            shippingEl.style.color = '#27ae60';
            shippingEl.style.fontWeight = '600';
        } else {
            shippingEl.textContent = `R ${shippingCost.toFixed(2)}`;
            shippingEl.style.color = '';
            shippingEl.style.fontWeight = '';
        }
    } else {
        console.warn('Shipping cost element not found');
    }
    
    updateElementText('total', `R ${total.toFixed(2)}`);
    
    // Update button total
    updateElementText('btn-total', `R ${total.toFixed(2)}`);
    
    // Update order summary heading with item count
    const orderSummaryHeading = document.querySelector('.order-summary h2');
    if (orderSummaryHeading) {
        orderSummaryHeading.textContent = `Order Summary (${itemCount} item${itemCount !== 1 ? 's' : ''})`;
    }
    
    // Handle discount display
    const discountRow = document.getElementById('discount-row');
    if (discountRow) {
        if (discountAmount > 0) {
            discountRow.style.display = 'flex';
            updateElementText('discount-amount', `-R ${discountAmount.toFixed(2)}`);
        } else {
            discountRow.style.display = 'none';
        }
    }
    
    console.log('=== TOTALS UPDATED SUCCESSFULLY ===');
}

// Helper function to safely update element text
function updateElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
        console.log(`Updated ${elementId}:`, text);
    } else {
        console.warn(`Element not found: ${elementId}`);
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// === SHIPPING OPTIONS ===
function initShippingOptions() {
    const shippingRadios = document.querySelectorAll('input[name="shipping"]');
    
    shippingRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'standard') {
                shippingCost = 80;
            } else if (this.value === 'express') {
                shippingCost = 150;
            } else if (this.value === 'pickup') {
                shippingCost = 0;
            }
            console.log(`Shipping method changed to: ${this.value}, Cost: R${shippingCost}`);
            updateOrderTotals();
        });
    });
}

// === PROMO CODE ===
function initPromoCode() {
    const applyPromoBtn = document.getElementById('apply-promo');
    const promoInput = document.getElementById('promo-input');
    
    if (!applyPromoBtn || !promoInput) return;
    
    applyPromoBtn.addEventListener('click', function() {
        const code = promoInput.value.trim().toUpperCase();
        
        // Check if user is a first-time customer
        const customerEmail = document.getElementById('email').value.trim();
        if (!customerEmail) {
            showErrorModal('Email Required', 'Please enter your email address first to apply promo code.');
            return;
        }
        
        // Check if email has been used before (stored in localStorage)
        const previousOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
        const isFirstTime = !previousOrders.some(order => order.email === customerEmail);
        
        // Promo code for first-time customers only
        const firstTimePromo = 'WELCOME10'; // 10% off for first order
        
        if (code === firstTimePromo) {
            if (!isFirstTime) {
                showErrorModal('Promo Not Valid', 'This promo code is only valid for first-time customers. You have previously ordered from us.');
                return;
            }
            
            // Apply 10% discount
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            discountAmount = subtotal * 0.10;
            updateOrderTotals();
            
            // Store that this promo was used
            localStorage.setItem('promoCodeUsed', JSON.stringify({
                code: code,
                email: customerEmail,
                date: new Date().toISOString()
            }));
            
            showSuccessMessage(`🎉 Welcome! Promo code applied! You saved R ${discountAmount.toFixed(2)}`);
            promoInput.value = '';
        } else {
            showErrorModal('Invalid Promo Code', 'Please check your promo code and try again. First-time customers can use code: WELCOME10');
        }
    });
    
    // Allow Enter key to apply promo
    promoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyPromoBtn.click();
        }
    });
}

// === CHECKOUT FORM ===
function initCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    
    if (!checkoutForm) return;
    
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate cart
        if (cart.length === 0) {
            showErrorModal('Your cart is empty!', 'Please add some items to your cart before checking out.');
            return;
        }
        
        // Validate form fields
        const formData = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            province: document.getElementById('province').value,
            postalCode: document.getElementById('postal-code').value,
            shipping: document.querySelector('input[name="shipping"]:checked')?.value,
            payment: document.querySelector('input[name="payment"]:checked')?.value
        };
        
        // Validate required fields
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
            showErrorModal('Missing Information', 'Please fill in all required personal information fields.');
            return;
        }
        
        if (!formData.address || !formData.city || !formData.province || !formData.postalCode) {
            showErrorModal('Missing Address', 'Please fill in your complete shipping address.');
            return;
        }
        
        if (!formData.shipping) {
            showErrorModal('Shipping Method Required', 'Please select a shipping method.');
            return;
        }
        
        if (!formData.payment) {
            showErrorModal('Payment Method Required', 'Please select a payment method.');
            return;
        }
        
        // Calculate order details
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal + shippingCost - discountAmount;
        
        const orderData = {
            customer: formData,
            items: cart,
            subtotal: subtotal,
            shipping: shippingCost,
            discount: discountAmount,
            total: total,
            orderDate: new Date().toISOString()
        };
        
        // Show order confirmation modal
        showOrderConfirmation(orderData);
    });
}

// === SHOW ORDER CONFIRMATION ===
function showOrderConfirmation(orderData) {
    const modal = document.createElement('div');
    modal.className = 'confirmation-modal';
    modal.innerHTML = `
        <div class="confirmation-content">
            <h2>📋 Confirm Your Order</h2>
            
            <div class="order-summary-modal">
                <h3 style="background: #f8f9fa; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                    📦 Your Order (${orderData.items.length} product${orderData.items.length !== 1 ? 's' : ''})
                </h3>
                <div class="items-list" style="max-height: 300px; overflow-y: auto; margin-bottom: 20px;">
                    ${orderData.items.map(item => `
                        <div class="item-row" style="display: flex; gap: 12px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 10px; background: #fafafa;">
                            <div style="width: 70px; height: 70px; flex-shrink: 0;">
                                <img src="${item.image || 'images/product1.jpg'}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 700; color: #2c3e50; margin-bottom: 6px; font-size: 1.05em;">${item.name}</div>
                                <div style="font-size: 0.9em; color: #7f8c8d; margin-bottom: 4px;">
                                    Size: <strong>${item.size || 'N/A'}</strong> | Color: <strong>${item.color || 'N/A'}</strong> | Qty: <strong>${item.quantity}</strong>
                                </div>
                                <div style="font-size: 0.95em; color: #555; margin-top: 6px;">
                                    <span style="background: #fff3cd; padding: 2px 8px; border-radius: 4px;">R ${item.price.toFixed(2)} each</span>
                                    <span style="margin: 0 8px;">×</span>
                                    <span>${item.quantity}</span>
                                    <span style="margin: 0 8px;">=</span>
                                    <span style="font-weight: bold; color: #27ae60; font-size: 1.1em;">R ${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="totals-section" style="background: #fff; border: 2px solid #2c3e50; border-radius: 10px; padding: 20px; margin: 20px 0;">
                    <div class="total-line" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                        <span style="font-size: 1.05em;">Subtotal (${orderData.items.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                        <span style="font-size: 1.05em; font-weight: 600;">R ${orderData.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="total-line" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                        <span style="font-size: 1.05em;">Shipping (${orderData.customer.shipping === 'standard' ? 'Standard 3-5 days' : 'Express 1-2 days'}):</span>
                        <span style="font-size: 1.05em; font-weight: 600;">R ${orderData.shipping.toFixed(2)}</span>
                    </div>
                    ${orderData.discount > 0 ? `
                        <div class="total-line discount" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                            <span style="font-size: 1.05em;">💰 Discount Applied:</span>
                            <span style="color: #27ae60; font-size: 1.05em; font-weight: 600;">-R ${orderData.discount.toFixed(2)}</span>
                        </div>
                    ` : ''}
                    <div class="total-line final" style="display: flex; justify-content: space-between; padding: 15px 0; margin-top: 10px; border-top: 3px solid #2c3e50;">
                        <span style="font-size: 1.2em; font-weight: bold;">TOTAL AMOUNT TO PAY:</span>
                        <span style="font-size: 1.8em; color: #e74c3c; font-weight: bold;">R ${orderData.total.toFixed(2)}</span>
                    </div>
                </div>
                
                <div class="shipping-info">
                    <h4>Shipping To:</h4>
                    <p>${orderData.customer.firstName} ${orderData.customer.lastName}</p>
                    <p>${orderData.customer.address}</p>
                    <p>${orderData.customer.city}, ${orderData.customer.province} ${orderData.customer.postalCode}</p>
                    <p>📞 ${orderData.customer.phone}</p>
                    <p>📧 ${orderData.customer.email}</p>
                </div>
                
                <div class="payment-info">
                    <h4>Payment Method:</h4>
                    <p>${getPaymentMethodName(orderData.customer.payment)}</p>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn-cancel" onclick="closeConfirmationModal()">❌ Cancel</button>
                <button class="btn-confirm" onclick="confirmOrder(${JSON.stringify(orderData).replace(/"/g, '&quot;')})">
                    ✅ Confirm & Pay R ${orderData.total.toFixed(2)}
                </button>
            </div>
            <p style="text-align: center; color: #7f8c8d; font-size: 0.9em; margin-top: 10px;">
                Please review your order carefully before confirming
            </p>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

// Helper function to get payment method name
function getPaymentMethodName(method) {
    const names = {
        'payfast': 'PayGate (Card Payment)',
        'card': 'Credit/Debit Card via PayGate',
        'eft': 'Bank Transfer (EFT)'
    };
    return names[method] || method;
}

// Global function to close confirmation modal
window.closeConfirmationModal = function() {
    const modal = document.querySelector('.confirmation-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Global function to confirm order
window.confirmOrder = function(orderData) {
    closeConfirmationModal();
    processPayment(orderData);
}

// === SHOW ERROR MODAL ===
function showErrorModal(title, message) {
    const modal = document.createElement('div');
    modal.className = 'error-modal';
    modal.innerHTML = `
        <div class="error-content">
            <div class="error-icon">⚠️</div>
            <h2>${title}</h2>
            <p>${message}</p>
            <button class="btn-ok" onclick="this.closest('.error-modal').remove()">OK</button>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

function processPayment(orderData) {
    // Show loading state
    const submitBtn = document.querySelector('.btn-checkout');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    const paymentMethod = orderData.customer.payment;
    
    // Handle PayGate payment
    if (paymentMethod === 'card' || paymentMethod === 'payfast') {
        processPayGatePayment(orderData, submitBtn, originalText);
    } else if (paymentMethod === 'eft') {
        // EFT - Show banking details and instructions
        processEFTPayment(orderData, submitBtn, originalText);
    } else {
        // Default handling
        completeOrder(orderData, submitBtn, originalText);
    }
}

async function processPayGatePayment(orderData, submitBtn, originalText) {
    try {
        const checkoutJsApiUrl = window.API_URL || 'http://localhost:5000/api';
        
        // Generate unique reference
        const reference = 'MELL' + Date.now();
        
        // Prepare payment data
        const paymentData = {
            amount: orderData.total,
            reference: reference,
            email: orderData.customer.email,
            firstName: orderData.customer.firstName,
            lastName: orderData.customer.lastName,
            orderDetails: {
                items: orderData.items,
                shippingAddress: {
                    address: orderData.customer.address,
                    city: orderData.customer.city,
                    province: orderData.customer.province,
                    postalCode: orderData.customer.postalCode
                },
                subtotal: orderData.subtotal,
                shipping: orderData.shipping,
                discount: orderData.discount
            }
        };
        
        // Initiate PayGate payment
        const response = await fetch(`${checkoutJsApiUrl}/paygate/initiate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });
        
        const result = await response.json();
        
        if (result.success && result.paymentUrl) {
            // Store order data temporarily
            sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));
            
            // Redirect to PayGate
            window.location.href = result.paymentUrl;
        } else {
            throw new Error(result.message || 'Payment initiation failed');
        }
        
    } catch (error) {
        console.error('PayGate error:', error);
        alert('Payment processing failed. Please try again or contact support.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function processEFTPayment(orderData, submitBtn, originalText) {
    // Show EFT confirmation with order details
    const reference = 'MELL' + Date.now().toString().slice(-8);
    
    const modal = document.createElement('div');
    modal.className = 'payment-success-modal';
    modal.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p class="order-ref">Order Reference: <strong>${reference}</strong></p>
            
            <div class="order-details-box">
                <h3>💳 Payment Required - Bank Transfer (EFT)</h3>
                <p class="total-amount">Total Amount to Pay: <strong>R ${orderData.total.toFixed(2)}</strong></p>
                
                <div class="bank-details-box">
                    <h4>Banking Details:</h4>
                    ${getBankDetailsHTML()}
                </div>
                
                <div class="payment-instructions">
                    <h4>📝 Important Instructions:</h4>
                    <ol>
                        <li>Use reference: <strong>${reference}</strong></li>
                        <li>Transfer exactly: <strong>R ${orderData.total.toFixed(2)}</strong></li>
                        <li>Email proof of payment to: <strong>${getBusinessEmail()}</strong></li>
                        <li>Include your order reference in the email</li>
                        <li>Order will be processed within 24 hours of payment confirmation</li>
                    </ol>
                </div>
                
                <div class="order-breakdown">
                    <h4>Order Summary:</h4>
                    <div class="breakdown-item">
                        <span>Subtotal:</span>
                        <span>R ${orderData.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Shipping:</span>
                        <span>R ${orderData.shipping.toFixed(2)}</span>
                    </div>
                    ${orderData.discount > 0 ? `
                        <div class="breakdown-item discount">
                            <span>Discount:</span>
                            <span>-R ${orderData.discount.toFixed(2)}</span>
                        </div>
                    ` : ''}
                    <div class="breakdown-item total">
                        <span><strong>Total:</strong></span>
                        <span><strong>R ${orderData.total.toFixed(2)}</strong></span>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn-primary" onclick="copyEFTDetails('${reference}')">Copy Reference Number</button>
                <button class="btn-primary" onclick="printOrderDetails()">Print Order Details</button>
                <button class="btn-secondary" onclick="window.location.href='index.html'">Go to Home</button>
            </div>
            
            <p class="note">A confirmation email has been sent to ${orderData.customer.email}</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Store customer order for first-time tracking
    storeCustomerOrder(orderData, reference);
    
    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
}

// === STORE CUSTOMER ORDER FOR TRACKING ===
function storeCustomerOrder(orderData, reference) {
    const customerOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    
    // Add new order
    customerOrders.push({
        email: orderData.customer.email,
        reference: reference,
        date: new Date().toISOString(),
        total: orderData.total,
        items: orderData.items.length
    });
    
    localStorage.setItem('customerOrders', JSON.stringify(customerOrders));
}

// Helper function to get bank details HTML
function getBankDetailsHTML() {
    const savedBankDetails = localStorage.getItem('mellophiBankDetails');
    
    if (savedBankDetails) {
        const details = JSON.parse(savedBankDetails);
        return `
            <div class="detail-row">
                <span>Bank:</span>
                <strong>${details.bankName}</strong>
            </div>
            <div class="detail-row">
                <span>Account Holder:</span>
                <strong>${details.accountHolder}</strong>
            </div>
            <div class="detail-row">
                <span>Account Number:</span>
                <strong>${details.accountNumber}</strong>
                <button class="copy-mini-btn" onclick="copyToClipboard('${details.accountNumber}')">Copy</button>
            </div>
            <div class="detail-row">
                <span>Branch Code:</span>
                <strong>${details.branchCode}</strong>
                <button class="copy-mini-btn" onclick="copyToClipboard('${details.branchCode}')">Copy</button>
            </div>
            <div class="detail-row">
                <span>Account Type:</span>
                <strong>${details.accountType} Account</strong>
            </div>
        `;
    } else {
        return `
            <div class="detail-row">
                <span>Bank:</span>
                <strong>FNB</strong>
            </div>
            <div class="detail-row">
                <span>Account Holder:</span>
                <strong>MELLOPHI FASHION</strong>
            </div>
            <div class="detail-row">
                <span>Account Number:</span>
                <strong>[Set in Admin Settings]</strong>
            </div>
            <div class="detail-row">
                <span>Branch Code:</span>
                <strong>[Set in Admin Settings]</strong>
            </div>
        `;
    }
}

// Helper function to get business email
function getBusinessEmail() {
    const savedBusinessInfo = localStorage.getItem('mellophiBusinessInfo');
    if (savedBusinessInfo) {
        const info = JSON.parse(savedBusinessInfo);
        return info.businessEmail || 'mellophifashion@gmail.com';
    }
    return 'mellophifashion@gmail.com';
}

// Global function to copy EFT details
window.copyEFTDetails = function(reference) {
    const text = `Order Reference: ${reference}\nPlease use this reference when making your payment.`;
    navigator.clipboard.writeText(text).then(() => {
        alert('✓ Reference copied to clipboard!');
    });
}

// Global function to print order details
window.printOrderDetails = function() {
    window.print();
}

function completeOrder(orderData, submitBtn, originalText) {
    // Simulate payment processing
    setTimeout(() => {
        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Show success message
        if (typeof showNotification === 'function') {
            showNotification('Order placed successfully! Check your email for confirmation.');
        } else {
            alert('Order placed successfully! Check your email for confirmation.');
        }
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
    }, 2000);
}

// Initialize cart count on page load
updateCartCount();

// === SUCCESS MESSAGE HELPER ===
function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <span>${message}</span>
        </div>
    `;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Add CSS animation for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// TEST FUNCTIONS (for debugging)
// ========================================

// Add test products to cart - call from browser console if needed
window.addTestProducts = function() {
    const testCart = [
        {
            id: "A1",
            name: "A1 — Casual Summer Dress",
            price: 380,
            size: "M",
            color: "Sand",
            quantity: 2,
            image: "images/PRODUCTS/A1 front.png"
        },
        {
            id: "C1",
            name: "C1 — Everyday Top",
            price: 220,
            size: "L",
            color: "White",
            quantity: 1,
            image: "images/PRODUCTS/C1 front.png"
        }
    ];
    
    localStorage.setItem('cart', JSON.stringify(testCart));
    console.log('✅ Test products added to cart!');
    console.log('Reload the page to see them.');
    location.reload();
};

// Clear cart - call from browser console if needed
window.clearCart = function() {
    localStorage.removeItem('cart');
    console.log('✅ Cart cleared!');
    location.reload();
};

// Debug cart state
window.debugCart = function() {
    console.log('=== CART DEBUG INFO ===');
    console.log('Cart:', cart);
    console.log('Cart length:', cart.length);
    console.log('Shipping cost:', shippingCost);
    console.log('Discount:', discountAmount);
    console.log('LocalStorage cart:', localStorage.getItem('cart'));
    updateOrderTotals();
};
