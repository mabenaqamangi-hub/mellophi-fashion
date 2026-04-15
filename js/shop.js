// ========================================
// SHOP PAGE JAVASCRIPT
// =============================
// MOBILE CATEGORY BAR LOGIC
// =============================
document.addEventListener('DOMContentLoaded', function() {
    const catBar = document.querySelector('.mobile-category-bar');
    if (!catBar) return;
    const catBtns = catBar.querySelectorAll('.cat-btn');
    catBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            catBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Set category filter (simulate sidebar)
            const val = btn.getAttribute('data-category');
            // Uncheck all sidebar checkboxes
            document.querySelectorAll('.filters-sidebar input[name="category"]').forEach(cb => {
                cb.checked = false;
                if (cb.value === val || (val === 'all' && cb.value === 'all')) cb.checked = true;
            });
            // Trigger filter
            if (typeof applyFilters === 'function') applyFilters();
        });
    });
    // Set initial active
    catBtns[0].classList.add('active');
});
// =============================
// WISHLIST & CART PANEL LOGIC
// =============================

// Open Wishlist Panel
document.getElementById('wishlist-btn').addEventListener('click', function() {
    renderWishlistPanel();
    document.getElementById('wishlist-panel').style.display = 'block';
    document.body.style.overflow = 'hidden';
});

// Open Cart Panel
document.getElementById('cart-btn').addEventListener('click', function() {
    renderCartPanel();
    document.getElementById('cart-panel').style.display = 'block';
    document.body.style.overflow = 'hidden';
});

// Close Wishlist Panel
function closeWishlistPanel() {
    document.getElementById('wishlist-panel').style.display = 'none';
    document.body.style.overflow = '';
}

// Close Cart Panel
function closeCartPanel() {
    document.getElementById('cart-panel').style.display = 'none';
    document.body.style.overflow = '';
}

// Render Wishlist Panel
function renderWishlistPanel() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const container = document.getElementById('wishlist-items');
    if (!container) return;
    if (wishlist.length === 0) {
        container.innerHTML = '<p style="color:#888;">Your wishlist is empty.</p>';
        return;
    }
    container.innerHTML = wishlist.map(item => {
        let imgSrc = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : (item.image || 'images/PRODUCTS/A1 front.png');
        return `
        <div style="display:flex;align-items:center;gap:15px;margin-bottom:20px;border-bottom:1px solid #eee;padding-bottom:15px;">
            <img src="${imgSrc}" alt="${item.name}" style="width:70px;height:70px;object-fit:cover;border-radius:8px;">
            <div style="flex:1;">
                <div style="font-weight:600;">${item.name}</div>
                ${item.size ? `<div style='font-size:0.95em;color:#666;'>Size: ${item.size}</div>` : ''}
                ${item.color ? `<div style='font-size:0.95em;color:#666;'>Color: ${item.color}</div>` : ''}
                <div style="font-size:0.95em;color:#666;">${item.quantity ? 'Quantity: ' + item.quantity : ''}</div>
            </div>
            <button onclick="removeFromWishlist('${item.id}','${item.size||''}','${item.color||''}')" style="background:none;border:none;color:#d9534f;font-size:1.3rem;cursor:pointer;">&times;</button>
            <button onclick="addWishlistToCart('${item.id}','${item.size||''}','${item.color||''}')" style="background:#d4a574;color:#fff;border:none;padding:7px 14px;border-radius:5px;cursor:pointer;font-weight:600;">Add to Cart</button>
        </div>
        `;
    }).join('');
}

// Render Cart Panel
function renderCartPanel() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items');
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = '<p style="color:#888;">Your cart is empty.</p>';
        return;
    }
    container.innerHTML = cart.map(item => {
        let imgSrc = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : (item.image || 'images/PRODUCTS/A1 front.png');
        return `
        <div style="display:flex;align-items:center;gap:15px;margin-bottom:20px;border-bottom:1px solid #eee;padding-bottom:15px;">
            <img src="${imgSrc}" alt="${item.name}" style="width:70px;height:70px;object-fit:cover;border-radius:8px;">
            <div style="flex:1;">
                <div style="font-weight:600;">${item.name}</div>
                ${item.size ? `<div style='font-size:0.95em;color:#666;'>Size: ${item.size}</div>` : ''}
                ${item.color ? `<div style='font-size:0.95em;color:#666;'>Color: ${item.color}</div>` : ''}
                <div style="font-size:0.95em;color:#666;">Quantity: ${item.quantity}</div>
                <div style="font-size:0.95em;color:#666;">Price: R ${item.price.toFixed(2)}</div>
            </div>
            <button onclick="removeFromCart('${item.id}','${item.size||''}','${item.color||''}')" style="background:none;border:none;color:#d9534f;font-size:1.3rem;cursor:pointer;">&times;</button>
        </div>
        `;
    }).join('');
}

// Remove from Wishlist
function removeFromWishlist(id, size, color) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => !(item.id === id && item.size === size && item.color === color));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    renderWishlistPanel();
    updateWishlistCount();
}

// Remove from Cart
function removeFromCart(id, size, color) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => !(item.id === id && item.size === size && item.color === color));
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartPanel();
    updateCartCount();
}

// Add Wishlist Item to Cart
function addWishlistToCart(id, size, color) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const item = wishlist.find(i => i.id === id && i.size === size && i.color === color);
    if (!item) return;
    // Remove from wishlist
    wishlist = wishlist.filter(i => !(i.id === id && i.size === size && i.color === color));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    // Add to cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(i => i.id === id && i.size === size && i.color === color);
    if (existing) {
        existing.quantity += item.quantity || 1;
    } else {
        cart.push({ ...item, quantity: item.quantity || 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderWishlistPanel();
    updateWishlistCount();
    updateCartCount();
    alert('Added to cart!');
}

// Update Wishlist Count
function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const count = wishlist.length;
    const countEl = document.getElementById('wishlist-count');
    if (countEl) countEl.textContent = count;
}

// Call on page load
updateWishlistCount();
updateCartCount();
// ========================================

// Get API_URL from config.js (loaded in HTML)
// Falls back to localhost if config.js not loaded
const shopApiUrl = window.API_URL || 'http://localhost:5000/api';

// MELLOPHI FASHION PRODUCTS (Fallback if API fails)
let products = [
  {id:"A1", title:"A1 — Casual Summer Dress", price:380, category:"dresses", sub:"casual",
    images:["images/PRODUCTS/A1 front.png","images/PRODUCTS/A1 back.png"], sizes:["S","M","L","XL"],
    colors:[{name:'Sand', value:'#d6c5b7', sizes:["S","M","L","XL"]},{name:'Olive', value:'#9aa27a', sizes:["S","M","L"]}],
    fabricImages:["images/A1-fabric2.jpg","images/A1-fabric zip.jpg"], stock: 12, reviews:[4.5],
    sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", hips: "90-94", length: "95"}, {size: "M", bust: "88-92", waist: "70-74", hips: "94-98", length: "96"}, {size: "L", bust: "92-96", waist: "74-78", hips: "98-102", length: "97"}, {size: "XL", bust: "96-100", waist: "78-82", hips: "102-106", length: "98"}], notes: "Measurements are approximate. Model is 175cm wearing size S."} },

  {id:"A2", title:"A2 — Casual Dress", price:420, category:"dresses", sub:"casual",
    images:["images/PRODUCTS/A2 front.png","images/PRODUCTS/A2 back.png"], sizes:["S","M","L","XL"],
    colors:[{name:'White', value:'#ffffff', sizes:["S","M","L","XL"]},{name:'Navy', value:'#2b3a67', sizes:["M","L"]}],
    fabricImages:["images/fabric_A2_1.jpg","images/fabric_A2_2.jpg"], stock: 12, reviews: [4.5],
    sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", hips: "90-94", length: "92"}, {size: "M", bust: "88-92", waist: "70-74", hips: "94-98", length: "93"}, {size: "L", bust: "92-96", waist: "74-78", hips: "98-102", length: "94"}, {size: "XL", bust: "96-100", waist: "78-82", hips: "102-106", length: "95"}], notes: "Relaxed fit. Model is 170cm wearing size M."} },

  {id:"A3", title:"A3 — Casual Dress", price:420, category:"dresses", sub:"casual",
    images:["images/PRODUCTS/A3 front.png","images/PRODUCTS/A3 back.png"], sizes:["S","M","L"],
    colors:[{name:'Beige', value:'#e6d9c9', sizes:["S","M","L"]}],
    fabricImages:["images/fabric_A3_1.jpg"], stock: 12, reviews: [4.5],
    sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "86-90", waist: "68-72", hips: "92-96", length: "88"}, {size: "M", bust: "90-94", waist: "72-76", hips: "96-100", length: "89"}, {size: "L", bust: "94-98", waist: "76-80", hips: "100-104", length: "90"}], notes: "True to size. Comfortable stretch fabric."} },

  {id:"A4", title:"A4 — Casual Dress", price:420, category:"dresses", sub:"casual",
   images:["images/PRODUCTS/A4 front.png","images/PRODUCTS/A4 back.png"], sizes:["S","M","L"],
   fabricImages:["images/fabric_A4_1.jpg"], stock: 12, reviews: [4.5],
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", hips: "90-94", length: "94"}, {size: "M", bust: "88-92", waist: "70-74", hips: "94-98", length: "95"}, {size: "L", bust: "92-96", waist: "74-78", hips: "98-102", length: "96"}], notes: "Flowy fit. Model is 168cm wearing size S."} },

  {id:"A5", title:"A5 — Casual Dress", price:380, category:"dresses", sub:"casual",
   images:["images/PRODUCTS/A5 front.png","images/PRODUCTS/A5 back.png"], sizes:["S","M","L"],
   fabricImages:["images/fabric_A5_1.jpg"], stock: 12, reviews: [4.5],
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "82-86", waist: "64-68", hips: "88-92", length: "90"}, {size: "M", bust: "86-90", waist: "68-72", hips: "92-96", length: "91"}, {size: "L", bust: "90-94", waist: "72-76", hips: "96-100", length: "92"}], notes: "Fitted at waist, flowy at bottom."} },

  {id:"A6", title:"A6 — Casual Dress", price:380, category:"dresses", sub:"casual",
   images:["images/PRODUCTS/A6 front.png","images/PRODUCTS/A6 back.png"], sizes:["S","M","L"],
   fabricImages:["images/fabric_A6_1.jpg"], stock: 0, reviews: [4.5],
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", hips: "90-94", length: "93"}, {size: "M", bust: "88-92", waist: "70-74", hips: "94-98", length: "94"}, {size: "L", bust: "92-96", waist: "74-78", hips: "98-102", length: "95"}], notes: "Relaxed fit throughout."} },

  {id:"A7", title:"A7 — Casual Dress", price:430, category:"dresses", sub:"summer",
   images:["images/PRODUCTS/A7 front.png","images/PRODUCTS/A7 back.png"], sizes:["S","M","L"],
   fabricImages:["images/fabric_A7_1.jpg"], stock: 12, reviews: [4.5],
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "86-90", waist: "68-72", hips: "92-96", length: "98"}, {size: "M", bust: "90-94", waist: "72-76", hips: "96-100", length: "99"}, {size: "L", bust: "94-98", waist: "76-80", hips: "100-104", length: "100"}], notes: "Breathable summer fabric. Model is 172cm wearing size M."} },

  {id:"A8", title:"A8 — Casual Dress", price:380, category:"dresses", sub:"summer",
   images:["images/PRODUCTS/A8 front.png","images/PRODUCTS/A8 back.png"], sizes:["S","M","L"],
   fabricImages:["images/fabric_A8_1.jpg"], stock: 12, reviews: [4.5],
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", hips: "90-94", length: "96"}, {size: "M", bust: "88-92", waist: "70-74", hips: "94-98", length: "97"}, {size: "L", bust: "92-96", waist: "74-78", hips: "98-102", length: "98"}], notes: "Lightweight and airy. Perfect for hot days."} },

  {id:"A9", title:"A9 — Casual Dress", price:380, category:"dresses", sub:"summer",
   images:["images/PRODUCTS/A9 front.png"], sizes:["S","M","L"],
   fabricImages:["images/fabric_A9_1.jpg"], stock: 12, reviews: [4.5],
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "82-86", waist: "64-68", hips: "88-92", length: "100"}, {size: "M", bust: "86-90", waist: "68-72", hips: "92-96", length: "101"}, {size: "L", bust: "90-94", waist: "72-76", hips: "96-100", length: "102"}], notes: "Maxi length. Model is 175cm wearing size S."} },

  {id:"B1", title:"B1 — Elegant Linen Dress", price:380, category:"dresses", sub:"elegant",
   images:["images/PRODUCTS/B1 front.png","images/PRODUCTS/B1 back.png"], sizes:["XS","S","M","L"],
   fabricImages:["images/fabric_B1_1.jpg"], stock: 12, reviews: [4.5],
   sizeGuide: {unit: "cm", measurements: [{size: "XS", bust: "80-84", waist: "62-66", hips: "86-90", length: "105"}, {size: "S", bust: "84-88", waist: "66-70", hips: "90-94", length: "106"}, {size: "M", bust: "88-92", waist: "70-74", hips: "94-98", length: "107"}, {size: "L", bust: "92-96", waist: "74-78", hips: "98-102", length: "108"}], notes: "Natural linen fabric. Model is 178cm wearing size S."} },

  {id:"B2", title:"B2 — Elegant Dress", price:380, category:"dresses", sub:"elegant",
   images:["images/PRODUCTS/B2 front.png","images/PRODUCTS/B2 back.png"], sizes:["XS","S","M"],
   fabricImages:["images/fabric_B2_1.jpg"], stock: 12, reviews: [4.5],
   sizeGuide: {unit: "cm", measurements: [{size: "XS", bust: "80-84", waist: "62-66", hips: "86-90", length: "102"}, {size: "S", bust: "84-88", waist: "66-70", hips: "90-94", length: "103"}, {size: "M", bust: "88-92", waist: "70-74", hips: "94-98", length: "104"}], notes: "Fitted silhouette. Dry clean only."}},

  {id:"B3", title:"B3 — Evening Dress", price:380, category:"dresses", sub:"elegant",
   images:["images/PRODUCTS/B3 front.png","images/PRODUCTS/B3 back.png"], sizes:["S","M","L"],
   colors:["Brown", "Blue", "Yellow"],
   fabricImages:["images/fabric_B3_1.jpg"], stock: 12, reviews: [4.5],
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", hips: "90-94", length: "110"}, {size: "M", bust: "88-92", waist: "70-74", hips: "94-98", length: "111"}, {size: "L", bust: "92-96", waist: "74-78", hips: "98-102", length: "112"}], notes: "Floor-length gown. Model is 175cm wearing size S."} },

  {id:"B4", title:"B4 — Formal Dress", price:380, category:"dresses", sub:"elegant",
   images:["images/PRODUCTS/B4.png"], sizes:["S","M","L"],
   fabricImages:["images/fabric_B4_1.jpg"], stock: 12, reviews: [4.5],
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", hips: "90-94", length: "108"}, {size: "M", bust: "88-92", waist: "70-74", hips: "94-98", length: "109"}, {size: "L", bust: "92-96", waist: "74-78", hips: "98-102", length: "110"}], notes: "Elegant fit. Professional dry clean recommended."} },

  {id:"C1", title:"C1 — Everyday Top", price:220, category:"tops", sub:"casual",
   images:["images/PRODUCTS/C1 front.png","images/C1 back.png"], sizes:["S","M","L","XL"],
   fabricImages:["images/fabric_C1_1.jpg"], stock: 12, reviews: [4.5],
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", length: "60"}, {size: "M", bust: "88-92", waist: "70-74", length: "61"}, {size: "L", bust: "92-96", waist: "74-78", length: "62"}, {size: "XL", bust: "96-100", waist: "78-82", length: "63"}], notes: "Relaxed fit. Model is 170cm wearing size M."} },

  {id:"C2", title:"C2 — Slouch Top", price:150, category:"tops", sub:"casual",
   images:["images/PRODUCTS/C2 front.png","images/PRODUCTS/C2 back.png"], sizes:["S","M","L"],
   fabricImages:["images/fabric_C2_1.jpg"], stock: 12, reviews: [4.5],
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "86-90", waist: "68-72", length: "58"}, {size: "M", bust: "90-94", waist: "72-76", length: "59"}, {size: "L", bust: "94-98", waist: "76-80", length: "60"}], notes: "Oversized fit. Size down for fitted look."} },

  {id:"C3", title:"C3 — Knit Top", price:220, category:"tops", sub:"casual",
   images:["images/PRODUCTS/C3 front.png","images/PRODUCTS/C3 back.png"], sizes:["S","M","L"],
   fabricImages:["images/fabric_C3_1.png"], stock: 12, reviews: [4.5],
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", length: "62"}, {size: "M", bust: "88-92", waist: "70-74", length: "63"}, {size: "L", bust: "92-96", waist: "74-78", length: "64"}], notes: "Stretchy knit fabric. True to size."} },

  {id:"C4", title:"C4 — Modern Top", price:200, category:"tops", sub:"casual",
   images:["images/PRODUCTS/C4 front.jpg","images/PRODUCTS/C4 back.jpg"], sizes:["S","M","L"],
   fabricImages:["images/fabric_C4_1.jpg"], stock: 0, reviews: [4.5],
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", length: "61"}, {size: "M", bust: "88-92", waist: "70-74", length: "62"}, {size: "L", bust: "92-96", waist: "74-78", length: "63"}], notes: "Fitted style. Model is 168cm wearing size S."} },

  {id:"C5", title:"C5 — Minimal Top", price:150, category:"tops", sub:"casual",
   images:["images/PRODUCTS/C5 front.jpg"], sizes:["S","M","L"],
   fabricImages:["images/fabric_C5_1.jpg"], stock: 12, reviews: [4.5],
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", length: "59"}, {size: "M", bust: "88-92", waist: "70-74", length: "60"}, {size: "L", bust: "92-96", waist: "74-78", length: "61"}], notes: "Classic fit. Great for layering."} },

  {id:"C6", title:"C6 — Statement Top", price:200, category:"tops", sub:"casual",
   images:["images/PRODUCTS/C6 front.jpg"], sizes:["S","M","L"],
   fabricImages:["images/fabric_C6_1.jpg"], stock: 12, reviews: [4.5],
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "86-90", waist: "68-72", length: "60"}, {size: "M", bust: "90-94", waist: "72-76", length: "61"}, {size: "L", bust: "94-98", waist: "76-80", length: "62"}], notes: "Loose fit. Model is 172cm wearing size M."} },

  {id:"D1", title:"D1 — Chic Co-ord Set", price:300, category:"shorts-top-set", sub:"set",
   images:["images/PRODUCTS/D1 front.png","images/PRODUCTS/D1 back.png"], sizes:["S","M","L"],
   fabricImages:["images/fabric_D1_1.jpg"], stock: 12, reviews: [4.5],
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", hips: "90-94", length: "55"}, {size: "M", bust: "88-92", waist: "70-74", hips: "94-98", length: "56"}, {size: "L", bust: "92-96", waist: "74-78", hips: "98-102", length: "57"}], notes: "Top and shorts set. Model is 170cm wearing size S."} },

  {id:"E1", title:"E1 — Skirt (Blue)", price:250, category:"skirts", sub:"midi",
   images:["images/PRODUCTS/E1 blue.jpg"], sizes:["S","M","L"],
   fabricImages:["images/fabric_E1_1.jpg"], stock: 12, reviews: [4.5],
   sizeGuide: {unit: "cm", measurements: [{size: "S", waist: "66-70", hips: "90-94", length: "75"}, {size: "M", waist: "70-74", hips: "94-98", length: "76"}, {size: "L", waist: "74-78", hips: "98-102", length: "77"}], notes: "Midi length. Model is 168cm wearing size S."} },

  {id:"E2", title:"E2 — Skirt (Gold)", price:250, category:"skirts", sub:"midi",
   images:["images/PRODUCTS/E1 gold.jpg"], sizes:["S","M","L"],
   fabricImages:["images/fabric_E2_1.jpg"], stock: 12, reviews: [4.5],
   sizeGuide: {unit: "cm", measurements: [{size: "S", waist: "66-70", hips: "90-94", length: "75"}, {size: "M", waist: "70-74", hips: "94-98", length: "76"}, {size: "L", waist: "74-78", hips: "98-102", length: "77"}], notes: "Midi length. Model is 168cm wearing size S."} }
];

let filteredProducts = [...products];
let currentPage = 1;
const productsPerPage = 12;

// Load products from API
async function loadProductsFromAPI() {
    try {
        const response = await fetch(`${shopApiUrl}/products`);
        
        if (!response.ok) {
            throw new Error('API not responding');
        }
        
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
            // Convert API products to shop format
            const backendBaseURL = shopApiUrl.replace('/api', '');
            const apiProducts = result.data.map(p => ({
                id: p.productId || p.id,
                title: p.name,
                name: p.name,
                price: parseFloat(p.price),
                category: p.category === 'dress' ? 'dresses' 
                        : p.category === 'top' ? 'tops' 
                        : p.category === 'bottom' ? 'skirts' 
                        : p.category === 'set' ? 'shorts-top-set'
                        : p.category + 's',
                sub: 'casual',
                images: p.images && p.images.length > 0 
                    ? p.images.map(img => img.startsWith('http') ? img : `${backendBaseURL}/${img}`)
                    : ['images/PRODUCTS/A1 front.png'],
                sizes: p.sizes || ['S', 'M', 'L'],
                colors: p.colors || [],
                stock: p.stock !== undefined ? p.stock : 12,
                reviews: [4.5],
                isFeatured: p.isFeatured || false,
                isNewArrival: p.isNewArrival || false,
                isBestSeller: p.isBestSeller || false
            }));
            
            // Only use API products if they have valid data
            if (apiProducts.length > 0) {
                products = apiProducts;
                filteredProducts = [...products];
                console.log('✅ Loaded', products.length, 'products from API');
                removeFallbackWarning();
                return;
            }
        }
        
        // If we get here, use fallback
        console.log('⚠️ API returned no products, using local fallback products');
        showFallbackWarning('API returned no products, using local fallback products');
        filteredProducts = [...products];
        
    } catch (error) {
        console.log('⚠️ Using fallback products, API not available:', error.message);
        showFallbackWarning('API not available, using local fallback products');
        // Keep using hardcoded products as fallback
        filteredProducts = [...products];
    }
}

// Initialize shop page
document.addEventListener('DOMContentLoaded', function() {
    loadProductsFromAPI().then(() => {
        initShop();
    }).catch(() => {
        // Even if API fails, initialize with fallback products
        filteredProducts = [...products];
        showFallbackWarning('API not available, using local fallback products');
        initShop();
    });
});

function initShop() {
    renderProducts();
    initFilters();
    initSort();
    initPriceSlider();
    initLoadMore();
    initMobileFilters();
}

// Render products
function renderProducts() {
    const grid = document.getElementById('products-grid');
    const productCount = document.getElementById('product-count');
    
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const startIndex = 0;
    const endIndex = currentPage * productsPerPage;
    const displayProducts = filteredProducts.slice(startIndex, endIndex);
    
    displayProducts.forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    });
    
    // Update product count
    if (productCount) {
        productCount.textContent = filteredProducts.length;
    }
    
    // Show/hide load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        if (endIndex >= filteredProducts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
        }
    }
    
    // Reinitialize wishlist buttons
    if (typeof initWishlistButtons === 'function') {
        initWishlistButtons();
    }
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;
    // Get first image
    const productImage = product.images && product.images.length > 0 ? product.images[0] : 'images/PRODUCTS/A1 front.png';
    const productName = product.title || product.name || 'Product';
    // Get color swatches
    const colors = getColorSwatches(product);
    // Check stock status
    const stockClass = product.stock === 0 ? 'out-of-stock' : '';
    const stockBadge = product.stock === 0 ? '<span class="stock-badge">Out of Stock</span>' : '';
    card.innerHTML = `
        <a href="product.html?id=${product.id}" class="product-link">
            <div class="product-image ${stockClass}">
                <img src="${productImage}" alt="${productName}" onerror="this.src='images/PRODUCTS/A1 front.png'">
                ${stockBadge}
                <button class="wishlist-btn" onclick="event.preventDefault(); event.stopPropagation(); addToWishlistFromCard('${product.id}', '${productName.replace(/'/g, "\'")}', '${product.price}', '${productImage}', '${product.sizes ? product.sizes[0] : ''}', '${product.colors && product.colors[0] ? product.colors[0].name : ''}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-name">${productName}</h3>
                <p class="product-price">R ${product.price.toFixed(2)}</p>
                <div class="product-colors">
                    ${colors}
                </div>
            </div>
        </a>
    `;
    return card;
}

// Add to Wishlist from Card
function addToWishlistFromCard(id, name, price, image, size, color) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    // Prevent duplicates (same id, size, color)
    if (wishlist.some(item => item.id === id && item.size === size && item.color === color)) {
        alert('Already in wishlist!');
        return;
    }
    wishlist.push({ id, name, price: parseFloat(price), image, size, color, quantity: 1 });
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    alert('Added to wishlist!');
}
    `;
    
    return card;
}

function getColorSwatches(product) {
    // If product has colors array (new format)
    if (product.colors && product.colors.length > 0) {
        return product.colors.map(function(color) {
            return '<span class="color-dot" style="background: ' + color.value + '" title="' + color.name + '"></span>';
        }).join('');
    }
    // Fallback for old format with single color
    if (product.color) {
        var colorMap = {
            'beige': '#D4BBA8',
            'cream': '#F5EBE0',
            'sand': '#d6c5b7',
            'taupe': '#B8A08E',
            'champagne': '#D4AF7A'
        };
        return '<span class="color-dot" style="background: ' + (colorMap[product.color] || product.color) + '"></span>';
    }
    return '';
}

// Initialize filters
function initFilters() {
    const filterInputs = document.querySelectorAll('.filter-option input, .color-option input, .size-option input');
    
    filterInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
    });
    
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}

function applyFilters() {
    const categoryFilters = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(el => el.value);
    const colorFilters = Array.from(document.querySelectorAll('input[name="color"]:checked')).map(el => el.value.toLowerCase());
    const sizeFilters = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(el => el.value.toUpperCase());
    const maxPrice = parseInt(document.getElementById('price-slider').value);
    
    filteredProducts = products.filter(function(product) {
        // Category filter
        var categoryMatch = categoryFilters.length === 0 || 
                             categoryFilters.includes('all') || 
                             categoryFilters.includes(product.category);
        // Color filter - check both old format (color string) and new format (colors array)
        var colorMatch = colorFilters.length === 0;
        if (!colorMatch && product.colors && product.colors.length > 0) {
            colorMatch = product.colors.some(function(color) {
                return colorFilters.includes(color.name.toLowerCase());
            });
        } else if (!colorMatch && product.color) {
            colorMatch = colorFilters.includes(product.color.toLowerCase());
        } else if (colorFilters.length === 0) {
            colorMatch = true;
        }
        // Size filter - check both 'size' and 'sizes' properties
        var productSizes = product.sizes || product.size || [];
        var sizeMatch = sizeFilters.length === 0 || 
                         productSizes.some(function(size) { return sizeFilters.includes(size); });
        // Price filter
        var priceMatch = !isNaN(maxPrice) ? (parseFloat(product.price) <= maxPrice) : true;
        return categoryMatch && colorMatch && sizeMatch && priceMatch;
    });
    renderProducts();
}

// Initialize price slider
function initPriceSlider() {
    const priceSlider = document.getElementById('price-slider');
    const maxPriceDisplay = document.getElementById('max-price');
    
    if (!priceSlider || !maxPriceDisplay) return;
    
    priceSlider.addEventListener('input', function() {
        maxPriceDisplay.textContent = `R ${this.value}`;
    });
    
    priceSlider.addEventListener('change', applyFilters);
}

// Initialize load more
function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', function() {
        currentPage++;
        renderProducts();
        
        // Scroll to new products
        const grid = document.getElementById('products-grid');
        if (grid) {
            const newProductIndex = (currentPage - 1) * productsPerPage;
            const productCards = grid.children;
            if (productCards[newProductIndex]) {
                productCards[newProductIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    });
}

// Initialize mobile filters
function initMobileFilters() {
    const filterToggle = document.getElementById('mobile-filter-toggle');
    const sidebar = document.querySelector('.filters-sidebar');
    
    if (!filterToggle || !sidebar) return;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'filter-overlay';
    document.body.appendChild(overlay);
    
    filterToggle.addEventListener('click', function() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    });
    
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
}
// ========================================
// QUICK VIEW MODAL FUNCTIONS
// ========================================
// Note: Quick View variables are declared in main.js
// (currentQuickViewProduct, selectedQVSize, selectedQVColor)

function openQuickView(productId) {
    const apiUrl = window.API_URL || 'http://localhost:5000/api';
    const backendUrl = apiUrl.replace('/api', '');
    
    // Fetch product from API first, fallback to local array
    fetch(`${apiUrl}/products/${productId}`)
        .then(response => response.json())
        .then(result => {
            if (result.success && result.data) {
                showQuickViewModal(result.data, backendUrl);
            } else {
                // Fallback to local array
                const product = products.find(p => p.id === productId);
                if (product) {
                    showQuickViewModal(product, backendUrl);
                }
            }
        })
        .catch(error => {
            console.error('Error fetching product:', error);
            // Fallback to local array
            const product = products.find(p => p.id === productId);
            if (product) {
                showQuickViewModal(product, backendUrl);
            }
        });
}

function showQuickViewModal(product, backendUrl) {
    currentQuickViewProduct = product;
    selectedQVSize = null;
    selectedQVColor = null;
    
    const modal = document.getElementById('quickViewModal');
    
    // Update product image
    const imagePath = product.images && product.images.length > 0 
        ? (product.images[0].startsWith('http') 
            ? product.images[0] 
            : product.images[0].startsWith('images/') 
                ? `${backendUrl}/${product.images[0]}`
                : `images/PRODUCTS/${product.images[0]}`)
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
            // Old format - just hide the size guide
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
    
    alert(`✅ Added ${quantity} × ${cartItem.name} (${cartItem.size}) to cart!`);
}

function viewFullProduct() {
    if (!currentQuickViewProduct) return;
    const productId = currentQuickViewProduct.id || currentQuickViewProduct.productId;
    window.location.href = `product.html?id=${productId}`;
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset size guide visibility
    const table = document.getElementById('qv-size-guide-table');
    const btn = document.getElementById('qv-size-guide-btn');
    table.style.display = 'none';
    btn.textContent = '📏 View Size Guide';
    
    currentQuickViewProduct = null;
    selectedQVSize = null;
    selectedQVColor = null;
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        countEl.textContent = count;
    }
}

// Close modal on outside click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('quickViewModal');
    if (e.target === modal) {
        closeQuickView();
    }
});