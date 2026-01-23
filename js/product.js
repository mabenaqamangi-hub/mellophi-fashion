// ========================================
// PRODUCT PAGE JAVASCRIPT
// ========================================

// MELLOPHI FASHION PRODUCTS (same as shop.js)
const products = [
  {id:"A1", title:"A1 — Casual Summer Dress", price:380, category:"dresses", sub:"casual",
    images:["images/PRODUCTS/A1 front.png","images/PRODUCTS/A1 back.png"], sizes:["S","M","L","XL"],
    colors:[{name:'Sand', value:'#d6c5b7', sizes:["S","M","L","XL"]},{name:'Olive', value:'#9aa27a', sizes:["S","M","L"]}],
    description:"Beautiful casual summer dress perfect for everyday wear. Made with premium quality fabric.", stock: 12,
    sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", hips: "90-94", length: "95"}, {size: "M", bust: "88-92", waist: "70-74", hips: "94-98", length: "96"}, {size: "L", bust: "92-96", waist: "74-78", hips: "98-102", length: "97"}, {size: "XL", bust: "96-100", waist: "78-82", hips: "102-106", length: "98"}], notes: "Measurements are approximate. Model is 175cm wearing size S."}},
  {id:"A2", title:"A2 — Casual Dress", price:420, category:"dresses", sub:"casual",
    images:["images/PRODUCTS/A2 front.png","images/PRODUCTS/A2 back.png"], sizes:["S","M","L","XL"],
    colors:[{name:'White', value:'#ffffff', sizes:["S","M","L","XL"]},{name:'Navy', value:'#2b3a67', sizes:["M","L"]}],
    description:"Elegant casual dress with a modern silhouette. Perfect for any occasion.", stock: 12,
    sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", hips: "90-94", length: "92"}, {size: "M", bust: "88-92", waist: "70-74", hips: "94-98", length: "93"}, {size: "L", bust: "92-96", waist: "74-78", hips: "98-102", length: "94"}, {size: "XL", bust: "96-100", waist: "78-82", hips: "102-106", length: "95"}], notes: "Relaxed fit. Model is 170cm wearing size M."}},
  {id:"A3", title:"A3 — Casual Dress", price:420, category:"dresses", sub:"casual",
    images:["images/PRODUCTS/A3 front.png","images/PRODUCTS/A3 back.png"], sizes:["S","M","L"],
    colors:[{name:'Beige', value:'#e6d9c9', sizes:["S","M","L"]}],
    description:"Comfortable and stylish casual dress in a beautiful beige tone.", stock: 12,
    sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "86-90", waist: "68-72", hips: "92-96", length: "88"}, {size: "M", bust: "90-94", waist: "72-76", hips: "96-100", length: "89"}, {size: "L", bust: "94-98", waist: "76-80", hips: "100-104", length: "90"}], notes: "True to size. Comfortable stretch fabric."}},
  {id:"A4", title:"A4 — Casual Dress", price:420, category:"dresses", sub:"casual",
   images:["images/PRODUCTS/A4 front.png","images/PRODUCTS/A4 back.png"], sizes:["S","M","L"],
   description:"Versatile casual dress that combines comfort with style.", stock: 12,
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", hips: "90-94", length: "94"}, {size: "M", bust: "88-92", waist: "70-74", hips: "94-98", length: "95"}, {size: "L", bust: "92-96", waist: "74-78", hips: "98-102", length: "96"}], notes: "Flowy fit. Model is 168cm wearing size S."}},
  {id:"A5", title:"A5 — Casual Dress", price:380, category:"dresses", sub:"casual",
   images:["images/PRODUCTS/A5 front.png","images/PRODUCTS/A5 back.png"], sizes:["S","M","L"],
   description:"Effortless casual dress perfect for everyday elegance.", stock: 12,
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "82-86", waist: "64-68", hips: "88-92", length: "90"}, {size: "M", bust: "86-90", waist: "68-72", hips: "92-96", length: "91"}, {size: "L", bust: "90-94", waist: "72-76", hips: "96-100", length: "92"}], notes: "Fitted at waist, flowy at bottom."}},
  {id:"A6", title:"A6 — Casual Dress", price:380, category:"dresses", sub:"casual",
   images:["images/PRODUCTS/A6 front.png","images/PRODUCTS/A6 back.png"], sizes:["S","M","L"],
   description:"Chic casual dress with a relaxed fit.", stock: 0,
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", hips: "90-94", length: "93"}, {size: "M", bust: "88-92", waist: "70-74", hips: "94-98", length: "94"}, {size: "L", bust: "92-96", waist: "74-78", hips: "98-102", length: "95"}], notes: "Relaxed fit throughout."}},
  {id:"A7", title:"A7 — Casual Dress", price:430, category:"dresses", sub:"summer",
   images:["images/PRODUCTS/A7 front.png","images/PRODUCTS/A7 back.png"], sizes:["S","M","L"],
   description:"Light summer dress perfect for warm days.", stock: 12,
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "86-90", waist: "68-72", hips: "92-96", length: "98"}, {size: "M", bust: "90-94", waist: "72-76", hips: "96-100", length: "99"}, {size: "L", bust: "94-98", waist: "76-80", hips: "100-104", length: "100"}], notes: "Breathable summer fabric. Model is 172cm wearing size M."}},
  {id:"A8", title:"A8 — Casual Dress", price:380, category:"dresses", sub:"summer",
   images:["images/PRODUCTS/A8 front.png","images/PRODUCTS/A8 back.png"], sizes:["S","M","L"],
   description:"Breezy summer dress with beautiful detailing.", stock: 12,
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", hips: "90-94", length: "96"}, {size: "M", bust: "88-92", waist: "70-74", hips: "94-98", length: "97"}, {size: "L", bust: "92-96", waist: "74-78", hips: "98-102", length: "98"}], notes: "Lightweight and airy. Perfect for hot days."}},
  {id:"A9", title:"A9 — Casual Dress", price:380, category:"dresses", sub:"summer",
   images:["images/PRODUCTS/A9 front.png"], sizes:["S","M","L"],
   description:"Elegant summer dress for special occasions.", stock: 12,
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "82-86", waist: "64-68", hips: "88-92", length: "100"}, {size: "M", bust: "86-90", waist: "68-72", hips: "92-96", length: "101"}, {size: "L", bust: "90-94", waist: "72-76", hips: "96-100", length: "102"}], notes: "Maxi length. Model is 175cm wearing size S."}},
  {id:"B1", title:"B1 — Elegant Linen Dress", price:380, category:"dresses", sub:"elegant",
   images:["images/PRODUCTS/B1 front.png","images/PRODUCTS/B1 back.png"], sizes:["XS","S","M","L"],
   description:"Sophisticated linen dress with timeless elegance.", stock: 12,
   sizeGuide: {unit: "cm", measurements: [{size: "XS", bust: "80-84", waist: "62-66", hips: "86-90", length: "105"}, {size: "S", bust: "84-88", waist: "66-70", hips: "90-94", length: "106"}, {size: "M", bust: "88-92", waist: "70-74", hips: "94-98", length: "107"}, {size: "L", bust: "92-96", waist: "74-78", hips: "98-102", length: "108"}], notes: "Natural linen fabric. Model is 178cm wearing size S."}},
  {id:"B2", title:"B2 — Elegant Dress", price:380, category:"dresses", sub:"elegant",
   images:["images/PRODUCTS/B2 front.png","images/PRODUCTS/B2 back.png"], sizes:["XS","S","M"],
   description:"Refined elegant dress for special events.", stock: 12,
   sizeGuide: {unit: "cm", measurements: [{size: "XS", bust: "80-84", waist: "62-66", hips: "86-90", length: "102"}, {size: "S", bust: "84-88", waist: "66-70", hips: "90-94", length: "103"}, {size: "M", bust: "88-92", waist: "70-74", hips: "94-98", length: "104"}], notes: "Fitted silhouette. Dry clean only."}},
  {id:"B3", title:"B3 — Evening Dress", price:380, category:"dresses", sub:"elegant",
   images:["images/PRODUCTS/B3 front.png","images/PRODUCTS/B3 back.png"], sizes:["S","M","L"],
   colors:["Brown", "Blue", "Yellow"],
   description:"Stunning evening dress that makes a statement. Available in Brown, Blue, and Yellow.", stock: 12,
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", hips: "90-94", length: "110"}, {size: "M", bust: "88-92", waist: "70-74", hips: "94-98", length: "111"}, {size: "L", bust: "92-96", waist: "74-78", hips: "98-102", length: "112"}], notes: "Floor-length gown. Model is 175cm wearing size S."}},
  {id:"B4", title:"B4 — Formal Dress", price:380, category:"dresses", sub:"elegant",
   images:["images/PRODUCTS/B4.png"], sizes:["S","M","L"],
   description:"Classic formal dress with elegant lines.", stock: 12,
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", hips: "90-94", length: "108"}, {size: "M", bust: "88-92", waist: "70-74", hips: "94-98", length: "109"}, {size: "L", bust: "92-96", waist: "74-78", hips: "98-102", length: "110"}], notes: "Elegant fit. Professional dry clean recommended."}},
  {id:"C1", title:"C1 — Everyday Top", price:220, category:"tops", sub:"casual",
   images:["images/PRODUCTS/C1 front.png"], sizes:["S","M","L","XL"],
   description:"Versatile everyday top that pairs with everything.", stock: 12,
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", length: "60"}, {size: "M", bust: "88-92", waist: "70-74", length: "61"}, {size: "L", bust: "92-96", waist: "74-78", length: "62"}, {size: "XL", bust: "96-100", waist: "78-82", length: "63"}], notes: "Relaxed fit. Model is 170cm wearing size M."}},
  {id:"C2", title:"C2 — Slouch Top", price:150, category:"tops", sub:"casual",
   images:["images/PRODUCTS/C2 front.png","images/PRODUCTS/C2 back.png"], sizes:["S","M","L"],
   description:"Relaxed slouch top for casual comfort.", stock: 12,
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "86-90", waist: "68-72", length: "58"}, {size: "M", bust: "90-94", waist: "72-76", length: "59"}, {size: "L", bust: "94-98", waist: "76-80", length: "60"}], notes: "Oversized fit. Size down for fitted look."}},
  {id:"C3", title:"C3 — Knit Top", price:220, category:"tops", sub:"casual",
   images:["images/PRODUCTS/C3 front.png","images/PRODUCTS/C3 back.png"], sizes:["S","M","L"],
   description:"Cozy knit top perfect for layering.", stock: 12,
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", length: "62"}, {size: "M", bust: "88-92", waist: "70-74", length: "63"}, {size: "L", bust: "92-96", waist: "74-78", length: "64"}], notes: "Stretchy knit fabric. True to size."}},
  {id:"C4", title:"C4 — Modern Top", price:200, category:"tops", sub:"casual",
   images:["images/PRODUCTS/C4 front.jpg"], sizes:["S","M","L"],
   description:"Contemporary top with modern styling.", stock: 0,
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", length: "61"}, {size: "M", bust: "88-92", waist: "70-74", length: "62"}, {size: "L", bust: "92-96", waist: "74-78", length: "63"}], notes: "Fitted style. Model is 168cm wearing size S."}},
  {id:"C5", title:"C5 — Minimal Top", price:150, category:"tops", sub:"casual",
   images:["images/PRODUCTS/C5 front.jpg"], sizes:["S","M","L"],
   description:"Minimalist top for effortless style.", stock: 12,
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", length: "59"}, {size: "M", bust: "88-92", waist: "70-74", length: "60"}, {size: "L", bust: "92-96", waist: "74-78", length: "61"}], notes: "Classic fit. Great for layering."}},
  {id:"C6", title:"C6 — Statement Top", price:200, category:"tops", sub:"casual",
   images:["images/PRODUCTS/C6 front.jpg"], sizes:["S","M","L"],
   description:"Bold statement top that stands out.", stock: 12,
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "86-90", waist: "68-72", length: "60"}, {size: "M", bust: "90-94", waist: "72-76", length: "61"}, {size: "L", bust: "94-98", waist: "76-80", length: "62"}], notes: "Loose fit. Model is 172cm wearing size M."}},
  {id:"D1", title:"D1 — Chic Co-ord Set", price:300, category:"shorts-top-set", sub:"set",
   images:["images/PRODUCTS/D1 front.png","images/PRODUCTS/D1 back.png"], sizes:["S","M","L"],
   description:"Stylish coordinated set for a complete look.", stock: 12,
   sizeGuide: {unit: "cm", measurements: [{size: "S", bust: "84-88", waist: "66-70", hips: "90-94", length: "55"}, {size: "M", bust: "88-92", waist: "70-74", hips: "94-98", length: "56"}, {size: "L", bust: "92-96", waist: "74-78", hips: "98-102", length: "57"}], notes: "Top and shorts set. Model is 170cm wearing size S."}},
  {id:"E1", title:"E1 — Skirt (Blue)", price:250, category:"skirts", sub:"midi",
   images:["images/PRODUCTS/E1 blue.jpg"], sizes:["S","M","L"],
   description:"Elegant midi skirt in beautiful blue.", stock: 12,
   sizeGuide: {unit: "cm", measurements: [{size: "S", waist: "66-70", hips: "90-94", length: "75"}, {size: "M", waist: "70-74", hips: "94-98", length: "76"}, {size: "L", waist: "74-78", hips: "98-102", length: "77"}], notes: "Midi length. Model is 168cm wearing size S."}},
  {id:"E2", title:"E2 — Skirt (Gold)", price:250, category:"skirts", sub:"midi",
   images:["images/PRODUCTS/E1 gold.jpg"], sizes:["S","M","L"],
   description:"Luxurious gold midi skirt.", stock: 12,
   sizeGuide: {unit: "cm", measurements: [{size: "S", waist: "66-70", hips: "90-94", length: "75"}, {size: "M", waist: "70-74", hips: "94-98", length: "76"}, {size: "L", waist: "74-78", hips: "98-102", length: "77"}], notes: "Midi length. Model is 168cm wearing size S."}}
];

document.addEventListener('DOMContentLoaded', function() {
    loadProductData();
    initProductPage();
});

// === LOAD PRODUCT DATA ===
function loadProductData() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        console.warn('No product ID provided - redirecting to shop');
        // Redirect to shop page if no product ID
        window.location.href = 'shop.html';
        return;
    }
    
    console.log('Loading product:', productId);
    
    // Try to fetch from API first
    const apiUrl = window.API_URL || 'http://localhost:5000/api';
    // URL encode the product ID to handle special characters like /
    const encodedProductId = encodeURIComponent(productId);
    fetch(`${apiUrl}/products/${encodedProductId}`)
        .then(response => response.json())
        .then(result => {
            if (result.success && result.data) {
                console.log('Found product from API:', result.data);
                updateProductDisplay(result.data);
            } else {
                // Fallback to local array
                const product = products.find(p => p.id === productId);
                if (product) {
                    console.log('Found product from local array:', product);
                    updateProductDisplay(product);
                } else {
                    console.error('Product not found:', productId);
                    showProductNotFound();
                }
            }
        })
        .catch(error => {
            console.error('Error fetching product:', error);
            // Fallback to local array
            const product = products.find(p => p.id === productId);
            if (product) {
                console.log('Found product from local array (fallback):', product);
                updateProductDisplay(product);
            } else {
                console.error('Product not found:', productId);
                showProductNotFound();
            }
        });
}

// === UPDATE PRODUCT DISPLAY ===
function updateProductDisplay(product) {
    const backendUrl = window.API_URL ? window.API_URL.replace('/api', '') : 'http://localhost:5000';
    
    console.log('🔍 Full Product Data Received:', product);
    console.log('🔍 Size Guide Raw Value:', product.sizeGuide);
    console.log('🔍 Size Guide Type:', typeof product.sizeGuide);
    
    // Update title and breadcrumb
    document.getElementById('product-title').textContent = product.title || product.name;
    document.getElementById('product-breadcrumb').textContent = product.title || product.name;
    document.title = `${product.title || product.name} - Mellophi Fashion`;
    
    // Update price
    document.getElementById('product-price').textContent = `R ${parseFloat(product.price).toFixed(2)}`;
    
    // Update main image (use backend URL for API products)
    const mainImage = document.getElementById('main-product-image');
    if (product.images && product.images.length > 0) {
        // Always show front image first (index 0)
        const imagePath = product.images[0].startsWith('http') 
            ? product.images[0] 
            : product.images[0].startsWith('images/') 
                ? `${backendUrl}/${product.images[0]}`
                : product.images[0];
        mainImage.src = imagePath;
        mainImage.alt = product.title || product.name;
        
        // Add click handler to main image to show product details
        mainImage.style.cursor = 'pointer';
        mainImage.addEventListener('click', function() {
            showProductDetails();
        });
    }
    
    // Update thumbnails - show front, back, and other-colours as simple thumbnails
    const thumbnailsContainer = document.querySelector('.product-thumbnails');
    if (thumbnailsContainer && product.images && product.images.length > 0) {
        console.log('📸 Displaying product images:', product.images.length);
        
        // Clear existing thumbnails
        thumbnailsContainer.innerHTML = '';
        
        // Display all images as clickable thumbnails
        product.images.forEach((imgPath, index) => {
            const imagePath = imgPath.startsWith('http') 
                ? imgPath 
                : imgPath.startsWith('images/') 
                    ? `${backendUrl}/${imgPath}`
                    : imgPath;
            
            const thumbnail = document.createElement('img');
            thumbnail.src = imagePath;
            thumbnail.alt = `${product.title || product.name} - View ${index + 1}`;
            thumbnail.classList.add('thumbnail');
            if (index === 0) {
                thumbnail.classList.add('active');
            }
            
            thumbnail.addEventListener('click', function() {
                mainImage.src = this.src;
                // Update active thumbnail
                thumbnailsContainer.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Smooth scroll to product details and show with fade-in effect
                showProductDetails();
            });
            
            thumbnailsContainer.appendChild(thumbnail);
        });
        
        console.log('📸 Thumbnails created:', product.images.length);
    }
    
    // Update description
    const descContainer = document.getElementById('product-desc');
    if (descContainer && product.description) {
        descContainer.textContent = product.description;
    }
    
    // Update size guide if available
    const sizeGuideSection = document.getElementById('product-size-guide-section');
    const sizeGuideContent = document.getElementById('product-size-guide-content');
    const toggleButton = document.getElementById('toggleSizeGuide');
    
    console.log('📏 Size Guide Debug:', {
        hasSizeGuide: !!product.sizeGuide,
        sizeGuideType: typeof product.sizeGuide,
        sizeGuideRaw: product.sizeGuide,
        sizeGuideLength: product.sizeGuide ? product.sizeGuide.length : 0
    });
    
    // Check if size guide exists and is not empty
    if (product.sizeGuide && product.sizeGuide !== '' && product.sizeGuide !== 'null') {
        let sizeGuideData = product.sizeGuide;
        
        // Parse if it's a string
        if (typeof sizeGuideData === 'string') {
            try {
                sizeGuideData = JSON.parse(sizeGuideData);
                console.log('✅ Parsed size guide:', sizeGuideData);
            } catch (e) {
                console.warn('⚠️ Could not parse size guide as JSON:', e);
                // Old format - plain text
                if (sizeGuideContent) {
                    sizeGuideContent.innerHTML = `<p style="padding: 10px; background: #f9f9f9; border-left: 3px solid #d4a574;">${product.sizeGuide.replace(/\n/g, '<br>')}</p>`;
                }
                if (sizeGuideSection && toggleButton) {
                    sizeGuideSection.style.display = 'block';
                    toggleButton.style.display = 'inline';
                    toggleButton.textContent = 'Hide Size Guide';
                    toggleButton.onclick = () => {
                        const isVisible = sizeGuideSection.style.display !== 'none';
                        sizeGuideSection.style.display = isVisible ? 'none' : 'block';
                        toggleButton.textContent = isVisible ? 'View Size Guide' : 'Hide Size Guide';
                    };
                }
                return;
            }
        }
        
        // New structured format - check if measurements exist
        if (sizeGuideData && sizeGuideData.measurements && Array.isArray(sizeGuideData.measurements) && sizeGuideData.measurements.length > 0) {
            console.log('✅ Building size guide table with', sizeGuideData.measurements.length, 'measurements');
            
            let html = '<div style="overflow-x: auto; margin-top: 15px;">';
            html += '<table style="width: 100%; border-collapse: collapse; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">';
            html += '<thead><tr style="background: var(--table-header-bg, #3d3020);">';
            html += '<th style="padding: 12px 10px; text-align: left; border: 1px solid var(--table-header-border, #5a4a35); font-weight: 700; color: var(--table-header-text, #ffffff); letter-spacing: 0.5px; text-transform: uppercase; font-size: 0.85rem;">Size</th>';
            html += '<th style="padding: 12px 10px; text-align: left; border: 1px solid var(--table-header-border, #5a4a35); font-weight: 700; color: var(--table-header-text, #ffffff); letter-spacing: 0.5px; text-transform: uppercase; font-size: 0.85rem;">Bust</th>';
            html += '<th style="padding: 12px 10px; text-align: left; border: 1px solid var(--table-header-border, #5a4a35); font-weight: 700; color: var(--table-header-text, #ffffff); letter-spacing: 0.5px; text-transform: uppercase; font-size: 0.85rem;">Waist</th>';
            html += '<th style="padding: 12px 10px; text-align: left; border: 1px solid var(--table-header-border, #5a4a35); font-weight: 700; color: var(--table-header-text, #ffffff); letter-spacing: 0.5px; text-transform: uppercase; font-size: 0.85rem;">Hips</th>';
            html += '<th style="padding: 12px 10px; text-align: left; border: 1px solid var(--table-header-border, #5a4a35); font-weight: 700; color: var(--table-header-text, #ffffff); letter-spacing: 0.5px; text-transform: uppercase; font-size: 0.85rem;">Length</th>';
            html += '</tr></thead><tbody>';
            
            sizeGuideData.measurements.forEach((m, index) => {
                const bgColor = index % 2 === 0 ? '#ffffff' : '#f9f9f9';
                html += `<tr style="background: ${bgColor};">`;
                html += `<td style="padding: 10px; border: 1px solid #ddd; font-weight: 600;">${m.size}</td>`;
                html += `<td style="padding: 10px; border: 1px solid #ddd;">${m.bust || '-'}</td>`;
                html += `<td style="padding: 10px; border: 1px solid #ddd;">${m.waist || '-'}</td>`;
                html += `<td style="padding: 10px; border: 1px solid #ddd;">${m.hips || '-'}</td>`;
                html += `<td style="padding: 10px; border: 1px solid #ddd;">${m.length || '-'}</td>`;
                html += '</tr>';
            });
            
            html += '</tbody></table></div>';
            html += `<p style="margin: 10px 0; font-size: 0.9em; color: #666; padding: 8px; background: #f9f6f3; border-radius: 4px;"><strong>📐 Unit:</strong> ${sizeGuideData.unit || 'cm'}</p>`;
            if (sizeGuideData.notes) {
                html += `<p style="margin: 10px 0; font-size: 0.9em; color: #666; padding: 10px; background: #fffbf0; border-left: 3px solid #d4a574; border-radius: 4px;"><strong>💡 Note:</strong> ${sizeGuideData.notes}</p>`;
            }
            
            if (sizeGuideContent) {
                sizeGuideContent.innerHTML = html;
                console.log('✅ Size guide HTML inserted into page');
            }
            
            // Show size guide by default and set up toggle functionality
            if (sizeGuideSection && toggleButton) {
                sizeGuideSection.style.display = 'block';
                toggleButton.style.display = 'inline';
                toggleButton.textContent = 'Hide Size Guide';
                toggleButton.onclick = () => {
                    const isVisible = sizeGuideSection.style.display !== 'none';
                    sizeGuideSection.style.display = isVisible ? 'none' : 'block';
                    toggleButton.textContent = isVisible ? 'View Size Guide' : 'Hide Size Guide';
                };
                console.log('✅ Size guide section is now visible');
            }
        } else {
            console.warn('⚠️ Size guide data exists but has no measurements:', sizeGuideData);
            // Hide if no measurements
            if (toggleButton) {
                toggleButton.style.display = 'none';
            }
            if (sizeGuideSection) {
                sizeGuideSection.style.display = 'none';
            }
        }
    } else {
        console.log('ℹ️ No size guide available for this product');
        // No size guide available - hide the section
        if (toggleButton) {
            toggleButton.style.display = 'none';
        }
        if (sizeGuideSection) {
            sizeGuideSection.style.display = 'none';
        }
    }
    
    // Update colors if available
    const colorOptions = document.querySelector('.color-options');
    const selectedColorSpan = document.getElementById('selected-color');
    if (colorOptions && product.colors && product.colors.length > 0) {
        // Color mapping for common color names
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
        
        colorOptions.innerHTML = '';
        product.colors.forEach((color, index) => {
            const colorBtn = document.createElement('button');
            colorBtn.type = 'button';
            colorBtn.className = `color-option-btn ${index === 0 ? 'active' : ''}`;
            
            // Handle both string colors and object colors
            if (typeof color === 'string') {
                colorBtn.dataset.color = color;
                colorBtn.title = color;
                colorBtn.style.backgroundColor = colorMap[color] || '#CCCCCC';
                // Add text label for clarity
                colorBtn.textContent = color;
                colorBtn.style.padding = '0.5rem 1rem';
                colorBtn.style.border = '2px solid #ddd';
                colorBtn.style.borderRadius = '8px';
                colorBtn.style.cursor = 'pointer';
                colorBtn.style.fontSize = '0.9rem';
                colorBtn.style.fontWeight = '500';
                colorBtn.style.color = (color === 'Yellow' || color === 'White' || color === 'Cream') ? '#333' : '#fff';
            } else if (color.name && color.value) {
                colorBtn.dataset.color = color.name;
                colorBtn.title = color.name;
                colorBtn.style.backgroundColor = color.value;
            }
            
            colorOptions.appendChild(colorBtn);
        });
        
        // Set initial selected color
        if (selectedColorSpan) {
            const firstColor = typeof product.colors[0] === 'string' ? product.colors[0] : product.colors[0].name;
            selectedColorSpan.textContent = firstColor;
        }
        
        // Re-initialize color selection after creating buttons
        initColorSelection();
    } else if (colorOptions) {
        // Hide color section if no colors
        colorOptions.closest('.product-option').style.display = 'none';
    }
    
    // Update sizes
    const sizeOptions = document.querySelector('.size-options');
    if (sizeOptions && product.sizes && product.sizes.length > 0) {
        sizeOptions.innerHTML = '';
        product.sizes.forEach(size => {
            const sizeBtn = document.createElement('button');
            sizeBtn.type = 'button';
            sizeBtn.className = 'size-option-btn';
            sizeBtn.dataset.size = size;
            sizeBtn.textContent = size;
            sizeOptions.appendChild(sizeBtn);
        });
        // Re-initialize size selection after creating new buttons
        initSizeSelection();
    }
    
    // Update stock status
    const stockStatus = document.querySelector('.stock-status');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const buyNowBtn = document.getElementById('buy-now-btn');
    
    if (product.stock > 0) {
        if (stockStatus) {
            stockStatus.innerHTML = '<span class="in-stock">✓ In Stock</span>';
        }
        if (addToCartBtn) addToCartBtn.disabled = false;
        if (buyNowBtn) buyNowBtn.disabled = false;
    } else {
        if (stockStatus) {
            stockStatus.innerHTML = '<span class="out-of-stock">✗ Out of Stock</span>';
        }
        if (addToCartBtn) {
            addToCartBtn.disabled = true;
            addToCartBtn.textContent = 'Out of Stock';
        }
        if (buyNowBtn) {
            buyNowBtn.disabled = true;
            buyNowBtn.textContent = 'Out of Stock';
        }
    }
    
    // Store product data globally for add to cart
    window.currentProduct = product;
}

// === SHOW PRODUCT NOT FOUND ===
function showProductNotFound() {
    const productSection = document.querySelector('.product-section');
    if (productSection) {
        productSection.innerHTML = `
            <div class="container">
                <div style="text-align: center; padding: 4rem 0;">
                    <h2>Product Not Found</h2>
                    <p>Sorry, we couldn't find the product you're looking for.</p>
                    <a href="shop.html" class="btn-primary" style="display: inline-block; margin-top: 2rem;">Back to Shop</a>
                </div>
            </div>
        `;
    }
}

// === SHOW PRODUCT DETAILS WITH SMOOTH ANIMATION ===
function showProductDetails() {
    const productDetails = document.querySelector('.product-details');
    if (!productDetails) return;
    
    // Add fade-in animation class
    productDetails.classList.remove('details-visible');
    // Force reflow to restart animation
    void productDetails.offsetWidth;
    productDetails.classList.add('details-visible');
    
    // Smooth scroll to product details section
    // Using 'start' alignment to show details at the top of viewport
    productDetails.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
    });
}

function initProductPage() {
    initColorSelection();
    // Note: initSizeSelection() is now called in updateProductDisplay() after buttons are created
    initQuantitySelector();
    initAddToCart();
    initBuyNow();
    initProductTabs();
    initWishlistProduct();
}

// === THUMBNAIL IMAGES ===
function initThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    
    if (!thumbnails.length || !mainImage) return;
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            mainImage.src = this.src;
        });
    });
}

// === COLOR SELECTION ===
function initColorSelection() {
    const colorBtns = document.querySelectorAll('.color-option-btn');
    const selectedColorSpan = document.getElementById('selected-color');
    const mainImage = document.getElementById('main-product-image');
    const thumbnailsContainer = document.querySelector('.product-thumbnails');
    
    if (!colorBtns.length) return;
    
    colorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const selectedColor = this.dataset.color;
            const currentProduct = window.currentProduct;
            
            // Remove active class from all color buttons
            colorBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update selected color text
            if (selectedColorSpan) {
                selectedColorSpan.textContent = selectedColor;
            }
            
            // Update images based on selected color if product has color-specific images
            if (currentProduct && currentProduct.id) {
                const productId = currentProduct.id;
                const colorLower = selectedColor.toLowerCase();
                const backendUrl = window.API_URL ? window.API_URL.replace('/api', '') : 'http://localhost:5000';
                
                // Try to find color-specific images
                // Example: A1 front.png, A1 back.png, A1 olive.jpg (for Olive color)
                const colorImages = [];
                
                // Check if we have specific color images in the product data
                if (currentProduct.images && currentProduct.images.length > 0) {
                    // Look for images that match the color name
                    const colorSpecificImages = currentProduct.images.filter(img => 
                        img.toLowerCase().includes(colorLower) || 
                        img.toLowerCase().includes(selectedColor.toLowerCase())
                    );
                    
                    if (colorSpecificImages.length > 0) {
                        // Use color-specific images
                        colorImages.push(...colorSpecificImages);
                    } else {
                        // Try standard naming: productId-color.jpg or productId color.jpg
                        const possibleColorImages = [
                            `images/PRODUCTS/${productId} ${colorLower}.jpg`,
                            `images/PRODUCTS/${productId}-${colorLower}.jpg`,
                            `images/PRODUCTS/${productId} ${colorLower}.png`,
                            `images/PRODUCTS/${productId}-${colorLower}.png`
                        ];
                        
                        // Also add front/back with color if they exist
                        possibleColorImages.push(
                            `images/PRODUCTS/${productId} ${colorLower} front.jpg`,
                            `images/PRODUCTS/${productId} ${colorLower} back.jpg`,
                            `images/PRODUCTS/${productId}-${colorLower}-front.jpg`,
                            `images/PRODUCTS/${productId}-${colorLower}-back.jpg`
                        );
                        
                        // Use default images if no color-specific ones found
                        if (colorImages.length === 0) {
                            colorImages.push(...(currentProduct.images || []));
                        }
                    }
                }
                
                // If we found color images or have default images, update the display
                if (colorImages.length > 0) {
                    const firstImage = colorImages[0].startsWith('http') 
                        ? colorImages[0] 
                        : colorImages[0].startsWith('images/') 
                            ? `${backendUrl}/${colorImages[0]}`
                            : colorImages[0];
                    
                    if (mainImage) {
                        mainImage.src = firstImage;
                    }
                    
                    // Update thumbnails
                    if (thumbnailsContainer) {
                        thumbnailsContainer.innerHTML = '';
                        
                        colorImages.forEach((imgPath, index) => {
                            const imagePath = imgPath.startsWith('http') 
                                ? imgPath 
                                : imgPath.startsWith('images/') 
                                    ? `${backendUrl}/${imgPath}`
                                    : imgPath;
                            
                            const thumbnail = document.createElement('img');
                            thumbnail.src = imagePath;
                            thumbnail.alt = `${currentProduct.title || currentProduct.name} - ${selectedColor} - View ${index + 1}`;
                            thumbnail.classList.add('thumbnail');
                            if (index === 0) {
                                thumbnail.classList.add('active');
                            }
                            
                            thumbnail.addEventListener('click', function() {
                                mainImage.src = this.src;
                                thumbnailsContainer.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                                this.classList.add('active');
                            });
                            
                            thumbnailsContainer.appendChild(thumbnail);
                        });
                    }
                }
            }
        });
    });
}

// === SIZE SELECTION ===
function initSizeSelection() {
    console.log('🎯 initSizeSelection called');
    const sizeBtns = document.querySelectorAll('.size-option-btn');
    const selectedSizeSpan = document.getElementById('selected-size');
    
    console.log('📊 Found size buttons:', sizeBtns.length);
    console.log('📊 Selected size span exists:', !!selectedSizeSpan);
    
    if (!sizeBtns.length) {
        console.error('❌ No size buttons found!');
        return;
    }
    
    sizeBtns.forEach((btn, index) => {
        console.log(`🔘 Setting up button ${index}:`, btn.dataset.size);
        btn.addEventListener('click', function(e) {
            console.log('✅ Size button clicked:', this.dataset.size);
            
            if (this.disabled) {
                console.log('⚠️ Button is disabled');
                return;
            }
            
            // Remove active class from all size buttons
            sizeBtns.forEach(b => {
                b.classList.remove('active');
                console.log('🔄 Removed active from:', b.dataset.size);
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            console.log('✨ Added active to:', this.dataset.size);
            
            // Update selected size text
            if (selectedSizeSpan) {
                selectedSizeSpan.textContent = this.dataset.size;
                console.log('📝 Updated text to:', this.dataset.size);
            }
        });
    });
}

// === QUANTITY SELECTOR ===
function initQuantitySelector() {
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    const quantityInput = document.getElementById('quantity');
    
    if (!decreaseBtn || !increaseBtn || !quantityInput) return;
    
    decreaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        const max = parseInt(quantityInput.max);
        if (currentValue < max) {
            quantityInput.value = currentValue + 1;
        }
    });
    
    // Prevent invalid input
    quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        const min = parseInt(this.min);
        const max = parseInt(this.max);
        
        if (isNaN(value) || value < min) {
            this.value = min;
        } else if (value > max) {
            this.value = max;
        }
    });
}

// === ADD TO CART ===
function initAddToCart() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    if (!addToCartBtn) return;
    
    addToCartBtn.addEventListener('click', function() {
        const product = getCurrentProduct();
        
        if (!product.size) {
            alert('Please select a size');
            return;
        }
        
        // Check if color selection is required (for products with multiple colors)
        const colorBtns = document.querySelectorAll('.color-option-btn');
        const selectedColor = document.querySelector('.color-option-btn.active');
        if (colorBtns.length > 0 && !selectedColor) {
            alert('Please select a color');
            return;
        }
        
        // Add to cart using the function from main.js
        if (typeof addToCart === 'function') {
            addToCart(product);
        } else {
            // Fallback if main.js isn't loaded
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => 
                item.id === product.id && item.size === product.size && item.color === product.color
            );
            
            if (existingItem) {
                existingItem.quantity += product.quantity;
            } else {
                cart.push(product);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count
            const cartCount = document.getElementById('cart-count');
            if (cartCount) {
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                cartCount.textContent = totalItems;
            }
            
            // Show notification
            if (typeof showNotification === 'function') {
                showNotification('Added to cart!');
            } else {
                alert('Added to cart!');
            }
        }
    });
}

// === BUY NOW ===
function initBuyNow() {
    const buyNowBtn = document.getElementById('buy-now-btn');
    
    if (!buyNowBtn) return;
    
    buyNowBtn.addEventListener('click', function() {
        const product = getCurrentProduct();
        
        if (!product.size) {
            alert('Please select a size');
            return;
        }
        
        // Check if color selection is required
        const colorBtns = document.querySelectorAll('.color-option-btn');
        const selectedColor = document.querySelector('.color-option-btn.active');
        if (colorBtns.length > 0 && !selectedColor) {
            alert('Please select a color');
            return;
        }
        
        // Add to cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => 
            item.id === product.id && item.size === product.size && item.color === product.color
        );
        
        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            cart.push(product);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Redirect to checkout
        window.location.href = 'checkout.html';
    });
}

// === GET CURRENT PRODUCT DATA ===
function getCurrentProduct() {
    const selectedColor = document.querySelector('.color-option-btn.active');
    const selectedSize = document.querySelector('.size-option-btn.active');
    const quantity = document.getElementById('quantity');
    
    // Use the globally stored product data
    if (!window.currentProduct) {
        console.error('No product data available');
        return null;
    }
    
    const product = window.currentProduct;
    
    // Get default color
    let defaultColor = 'Default';
    if (product.colors && product.colors.length > 0) {
        defaultColor = typeof product.colors[0] === 'string' ? product.colors[0] : product.colors[0].name;
    }
    
    return {
        id: product.id,
        name: product.title,
        price: product.price,
        color: selectedColor ? selectedColor.dataset.color : defaultColor,
        size: selectedSize ? selectedSize.dataset.size : null,
        quantity: quantity ? parseInt(quantity.value) : 1,
        image: product.images && product.images.length > 0 ? product.images[0] : 'images/product1.jpg'
    };
}

// === PRODUCT TABS ===
function initProductTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (!tabBtns.length || !tabPanes.length) return;
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// === WISHLIST PRODUCT ===
function initWishlistProduct() {
    const wishlistBtn = document.getElementById('wishlist-product');
    
    if (!wishlistBtn) return;
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || '1';
    
    // Check if already in wishlist
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (wishlist.includes(productId)) {
        wishlistBtn.classList.add('active');
    }
    
    wishlistBtn.addEventListener('click', function() {
        if (typeof toggleWishlist === 'function') {
            toggleWishlist(productId, this);
        } else {
            // Fallback
            const index = wishlist.indexOf(productId);
            if (index === -1) {
                wishlist.push(productId);
                this.classList.add('active');
                alert('Added to wishlist ♡');
            } else {
                wishlist.splice(index, 1);
                this.classList.remove('active');
                alert('Removed from wishlist');
            }
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    });
}

// === LOAD PRODUCT DATA (if coming from URL parameter) ===
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        // You can add logic here to load specific product data based on ID
        // For now, we'll keep the static HTML content
        const breadcrumb = document.getElementById('product-breadcrumb');
        const productTitle = document.getElementById('product-title');
        if (breadcrumb && productTitle) {
            breadcrumb.textContent = productTitle.textContent;
        }
        
        // Load reviews for this product
        loadReviews(productId);
    }
});

// ========================================
// REVIEW SYSTEM
// ========================================

// Load reviews for a product
async function loadReviews(productId) {
    const apiUrl = window.API_URL || 'http://localhost:5000/api';
    const encodedProductId = encodeURIComponent(productId);
    
    try {
        const response = await fetch(`${apiUrl}/reviews/product/${encodedProductId}`);
        if (!response.ok) throw new Error('Failed to load reviews');
        
        const reviews = await response.json();
        displayReviews(reviews);
        
        // Load review stats
        const statsResponse = await fetch(`${apiUrl}/reviews/stats/${encodedProductId}`);
        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            updateReviewStats(stats);
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        document.getElementById('review-list').innerHTML = '<p style="padding: 2rem; text-align: center; color: #999;">No reviews yet. Be the first to review!</p>';
    }
}

// Display reviews
function displayReviews(reviews) {
    const reviewList = document.getElementById('review-list');
    
    if (!reviews || reviews.length === 0) {
        reviewList.innerHTML = '<p style="padding: 2rem; text-align: center; color: #999;">No reviews yet. Be the first to review!</p>';
        return;
    }
    
    reviewList.innerHTML = reviews.map(review => {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const date = new Date(review.createdAt);
        const timeAgo = getTimeAgo(date);
        
        return `
            <div class="review-item">
                <div class="review-header">
                    <strong>${escapeHtml(review.customerName)}</strong>
                    <div class="stars">${stars}</div>
                </div>
                <p class="review-text">${escapeHtml(review.comment)}</p>
                <span class="review-date">${timeAgo}</span>
            </div>
        `;
    }).join('');
}

// Update review statistics
function updateReviewStats(stats) {
    const avgRating = document.getElementById('avg-rating');
    const avgStars = document.getElementById('avg-stars');
    const reviewCountText = document.getElementById('review-count-text');
    
    if (avgRating) avgRating.textContent = stats.average || '0';
    if (avgStars) {
        const rating = parseFloat(stats.average) || 0;
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        avgStars.innerHTML = '★'.repeat(fullStars) + (hasHalfStar ? '⯨' : '') + '☆'.repeat(emptyStars);
    }
    if (reviewCountText) {
        reviewCountText.textContent = stats.total === 0 ? 'No reviews yet' : `Based on ${stats.total} review${stats.total !== 1 ? 's' : ''}`;
    }
    
    // Update tab button
    const reviewTabBtn = document.querySelector('[data-tab="reviews"]');
    if (reviewTabBtn && stats.total > 0) {
        reviewTabBtn.textContent = `Reviews (${stats.total})`;
    }
}

// Submit review form
const reviewForm = document.getElementById('review-form');
if (reviewForm) {
    reviewForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (!productId) {
            alert('Product ID not found');
            return;
        }
        
        const formData = new FormData(reviewForm);
        const reviewData = {
            productId: productId,
            customerName: formData.get('customerName'),
            customerEmail: formData.get('customerEmail'),
            rating: parseInt(formData.get('rating')),
            comment: formData.get('comment')
        };
        
        const submitBtn = reviewForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        const apiUrl = window.API_URL || 'http://localhost:5000/api';
        
        try {
            const response = await fetch(`${apiUrl}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert('✓ Thank you for your review!');
                reviewForm.reset();
                loadReviews(productId); // Reload reviews
            } else {
                alert('Error: ' + (result.message || 'Failed to submit review'));
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Review';
        }
    });
}

// Helper function to get time ago
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + ' year' + (interval > 1 ? 's' : '') + ' ago';
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + ' month' + (interval > 1 ? 's' : '') + ' ago';
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + ' day' + (interval > 1 ? 's' : '') + ' ago';
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + ' hour' + (interval > 1 ? 's' : '') + ' ago';
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + ' minute' + (interval > 1 ? 's' : '') + ' ago';
    
    return 'Just now';
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
