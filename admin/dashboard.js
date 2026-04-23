// ===================================
// ADMIN DASHBOARD - JAVASCRIPT
// ===================================

// Configuration
const API_URL = window.API_URL || 'http://localhost:5000/api';
const CLOUDINARY_CLOUD_NAME = 'dtawfedbd';
const CLOUDINARY_UPLOAD_PRESET = 'mellophi_products';

// State Management
let products = [];
let filteredProducts = [];
let currentEditingProductId = null;
let pendingConfirmAction = null;

// DOM Elements Cache
const sections = {
    dashboard: document.getElementById('dashboard'),
    products: document.getElementById('products'),
    orders: document.getElementById('orders'),
    customers: document.getElementById('customers')
};

const navLinks = document.querySelectorAll('.nav-link');
const productForm = document.getElementById('productForm');
const editForm = document.getElementById('editProductForm');
const editModal = document.getElementById('editModal');
const confirmModal = document.getElementById('confirmModal');
const closeModalBtn = editModal.querySelector('.close');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
const confirmBtn = document.getElementById('confirmBtn');
const logoutBtn = document.getElementById('logoutBtn');

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
    loadMockData();
    updateDashboard();
});

// ===================================
// EVENT LISTENERS
// ===================================
function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionName = link.dataset.section;
            switchSection(sectionName);
        });
    });

    // Product Form
    productForm.addEventListener('submit', handleAddProduct);
    document.getElementById('productImages').addEventListener('change', handleImagePreview);

    // Image upload trigger
    document.querySelector('.image-upload').addEventListener('click', () => {
        document.getElementById('productImages').click();
    });

    // Edit Form
    editForm.addEventListener('submit', handleEditProduct);
    closeModalBtn.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);
    window.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
    });

    // Confirmation Modal
    cancelConfirmBtn.addEventListener('click', closeConfirmModal);
    confirmBtn.addEventListener('click', confirmAction);

    // Search and Filter
    document.getElementById('searchProducts').addEventListener('input', filterProducts);
    document.getElementById('filterCategory').addEventListener('change', filterProducts);

    // Logout
    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('adminToken');
            window.location.href = 'login.html';
        }
    });
}

// ===================================
// NAVIGATION
// ===================================
function switchSection(sectionName) {
    // Hide all sections
    Object.values(sections).forEach(section => {
        section.classList.remove('active');
    });

    // Remove active from all nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Show selected section
    if (sections[sectionName]) {
        sections[sectionName].classList.add('active');
    }

    // Mark nav link as active
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
}

// ===================================
// PRODUCT MANAGEMENT
// ===================================
async function loadProducts() {
    const localProducts = getLocalProducts();
    if (localProducts.length > 0) {
        products = localProducts;
        displayProducts();
        updateDashboard();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products`);
        const result = await response.json();

        if (result.success && result.data) {
            products = result.data.map(p => ({
                id: p.productId || p.id,
                name: p.name,
                price: parseFloat(p.price),
                category: p.category,
                stock: p.stock || 0,
                images: Array.isArray(p.images) ? p.images : [p.images],
                image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : (p.image || 'images/PRODUCTS/A1 front.png'),
                colors: p.colors || [],
                sizes: p.sizes || [],
                description: p.description || ''
            }));
            saveProductsLocal();
        } else {
            products = [];
        }
    } catch (error) {
        console.log('Loading from local storage:', error.message);
        products = localProducts;
    }

    displayProducts();
    updateDashboard();
}

function getLocalProducts() {
    const stored = localStorage.getItem('mellophiProducts');
    if (!stored) return [];
    return JSON.parse(stored).map(product => {
        const firstImage = product.image || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'images/PRODUCTS/A1 front.png');
        return {
            ...product,
            image: firstImage,
            images: Array.isArray(product.images) && product.images.length > 0 ? product.images : [firstImage]
        };
    });
}

function saveProductsLocal() {
    const normalizedProducts = products.map(product => {
        const firstImage = product.image || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'images/PRODUCTS/A1 front.png');
        return {
            ...product,
            image: firstImage,
            images: Array.isArray(product.images) && product.images.length > 0 ? product.images : [firstImage]
        };
    });
    products = normalizedProducts;
    localStorage.setItem('mellophiProducts', JSON.stringify(normalizedProducts));
}

function resolveDashboardImagePath(imagePath) {
    if (!imagePath) return '../images/PRODUCTS/A1 front.png';
    if (imagePath.startsWith('data:')) {
        return imagePath;
    }

    const stripTimestamp = (value) => {
        const fileName = value.split('/').pop();
        return fileName ? fileName.replace(/^\d+-/, '') : value;
    };

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        // Keep remote CDN links unchanged, but normalize local server image URLs with timestamped names.
        if (imagePath.includes('/images/PRODUCTS/')) {
            return `../images/PRODUCTS/${stripTimestamp(imagePath)}`;
        }
        return imagePath;
    }
    if (imagePath.startsWith('../')) {
        return imagePath.includes('/images/PRODUCTS/')
            ? `../images/PRODUCTS/${stripTimestamp(imagePath)}`
            : imagePath;
    }
    if (imagePath.startsWith('/')) {
        if (imagePath.includes('/images/PRODUCTS/')) {
            return `../images/PRODUCTS/${stripTimestamp(imagePath)}`;
        }
        return imagePath;
    }
    if (imagePath.startsWith('images/')) {
        if (imagePath.includes('images/PRODUCTS/')) {
            return `../images/PRODUCTS/${stripTimestamp(imagePath)}`;
        }
        return `../${imagePath}`;
    }
    return `../images/PRODUCTS/${stripTimestamp(imagePath)}`;
}

async function handleAddProduct(e) {
    e.preventDefault();

    const productData = {
        id: `P${Date.now()}`,
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        stock: parseInt(document.getElementById('productStock').value),
        colors: document.getElementById('productColors').value
            .split(',')
            .map(c => c.trim())
            .filter(c => c),
        sizes: document.getElementById('productSizes').value
            .split(',')
            .map(s => s.trim().toUpperCase())
            .filter(s => s),
        images: [],
        image: ''
    };

    // Convert selected image to Base64 and persist directly in localStorage.
    const imageFiles = document.getElementById('productImages').files;
    if (imageFiles.length > 0) {
        try {
            const imageBase64 = await fileToDataUrl(imageFiles[0]);
            productData.image = imageBase64;
            productData.images = [imageBase64];
        } catch (error) {
            alert('Image upload failed: ' + error.message);
            return;
        }
    } else {
        // Use default image if none provided
        productData.images = ['../images/PRODUCTS/A1 front.png'];
        productData.image = '../images/PRODUCTS/A1 front.png';
    }

    // Ensure a single image field is always available for shared rendering.
    productData.image = productData.image || productData.images[0] || '../images/PRODUCTS/A1 front.png';

    // Add to products array
    products.push(productData);
    saveProductsLocal();

    // Try to save to API
    try {
        await fetch(`${API_URL}/admin/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify(productData)
        });
    } catch (error) {
        console.log('Could not save to API (saved to local storage)');
    }

    // Reset form
    productForm.reset();
    document.getElementById('imagePreview').innerHTML = '';

    // Refresh display
    displayProducts();
    updateDashboard();
    alert('✅ Product added successfully!');
}

async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: 'POST',
            body: formData
        }
    );

    if (!response.ok) {
        throw new Error('Cloudinary upload failed');
    }

    const data = await response.json();
    return data.secure_url;
}

function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Could not read file for local preview fallback'));
        reader.readAsDataURL(file);
    });
}

async function uploadProductImage(file) {
    // Primary path: backend upload route (signed Cloudinary upload)
    const formData = new FormData();
    formData.append('images', file);

    try {
        const response = await fetch(`${API_URL}/admin/upload`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json().catch(() => null);
        if (response.ok && result && result.success && result.imagePaths && result.imagePaths.length > 0) {
            return result.imagePaths[0];
        }
    } catch (error) {
        console.log('Backend upload failed, trying direct Cloudinary upload...');
    }

    // Fallback path: unsigned Cloudinary upload (requires valid upload preset)
    try {
        return await uploadToCloudinary(file);
    } catch (error) {
        console.log('Cloudinary upload failed, using local data URL fallback...');
    }

    // Final fallback: keep image locally so product creation never fails.
    return fileToDataUrl(file);
}

function handleImagePreview(e) {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';

    Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const div = document.createElement('div');
            div.className = 'preview-item';
            const img = document.createElement('img');
            img.src = event.target.result;
            div.appendChild(img);
            preview.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

function displayProducts() {
    const productsList = document.getElementById('productsList');
    filteredProducts = products;

    if (products.length === 0) {
        productsList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No products found. Add your first product!</p>';
        return;
    }

    productsList.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${resolveDashboardImagePath(product.image || (product.images && product.images[0]))}" 
                     alt="${product.name}"
                     onerror="this.src='../images/PRODUCTS/A1 front.png'">
            </div>
            <div class="product-info">
                <h4>${product.name}</h4>
                <p class="product-price">R ${product.price.toFixed(2)}</p>
                <p>${product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'N/A'}</p>
                <div class="product-stock ${product.stock <= 5 ? 'low' : ''}">
                    Stock: ${product.stock}
                </div>
                <div class="product-actions">
                    <button class="edit-btn" onclick="openEditModal('${product.id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteProduct('${product.id}')">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts() {
    const searchTerm = document.getElementById('searchProducts').value.toLowerCase();
    const categoryFilter = document.getElementById('filterCategory').value;

    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                             product.category.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const productsList = document.getElementById('productsList');
    if (filteredProducts.length === 0) {
        productsList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No products match your filters.</p>';
        return;
    }

    productsList.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${resolveDashboardImagePath(product.image || (product.images && product.images[0]))}" 
                     alt="${product.name}"
                     onerror="this.src='../images/PRODUCTS/A1 front.png'">
            </div>
            <div class="product-info">
                <h4>${product.name}</h4>
                <p class="product-price">R ${product.price.toFixed(2)}</p>
                <p>${product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'N/A'}</p>
                <div class="product-stock ${product.stock <= 5 ? 'low' : ''}">
                    Stock: ${product.stock}
                </div>
                <div class="product-actions">
                    <button class="edit-btn" onclick="openEditModal('${product.id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteProduct('${product.id}')">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function openEditModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentEditingProductId = productId;
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductStock').value = product.stock;
    document.getElementById('editProductColors').value = product.colors.join(', ');
    document.getElementById('editProductSizes').value = product.sizes.join(', ');

    editModal.classList.add('show');
}

function closeEditModal() {
    editModal.classList.remove('show');
    currentEditingProductId = null;
}

function handleEditProduct(e) {
    e.preventDefault();

    const product = products.find(p => p.id === currentEditingProductId);
    if (!product) return;

    product.name = document.getElementById('editProductName').value;
    product.price = parseFloat(document.getElementById('editProductPrice').value);
    product.category = document.getElementById('editProductCategory').value;
    product.stock = parseInt(document.getElementById('editProductStock').value);
    product.colors = document.getElementById('editProductColors').value
        .split(',')
        .map(c => c.trim())
        .filter(c => c);
    product.sizes = document.getElementById('editProductSizes').value
        .split(',')
        .map(s => s.trim().toUpperCase())
        .filter(s => s);

    saveProductsLocal();
    displayProducts();
    updateDashboard();
    closeEditModal();
    alert('✅ Product updated successfully!');
}

function deleteProduct(productId) {
    pendingConfirmAction = () => {
        products = products.filter(p => p.id !== productId);
        saveProductsLocal();
        displayProducts();
        updateDashboard();
        closeConfirmModal();
        alert('✅ Product deleted!');
    };

    document.getElementById('confirmMessage').textContent = 'Are you sure you want to delete this product?';
    confirmModal.classList.add('show');
}

function closeConfirmModal() {
    confirmModal.classList.remove('show');
}

function confirmAction() {
    if (pendingConfirmAction) {
        pendingConfirmAction();
        pendingConfirmAction = null;
    }
}

// ===================================
// DASHBOARD UPDATES
// ===================================
function updateDashboard() {
    // Update total products count
    document.getElementById('totalProducts').textContent = products.length;

    // Update low stock alert
    const lowStock = products.filter(p => p.stock <= 5);
    const lowStockAlert = document.getElementById('lowStockAlert');

    if (lowStock.length === 0) {
        lowStockAlert.innerHTML = '<p style="color: #27ae60; padding: 20px; text-align: center;">✅ All products have sufficient stock!</p>';
    } else {
        lowStockAlert.innerHTML = lowStock.map(product => `
            <div class="low-stock-item">
                <p><strong>${product.name}</strong></p>
                <p>Stock Level: <strong style="color: #e74c3c;">${product.stock} units</strong></p>
                <p>Price: R ${product.price.toFixed(2)}</p>
            </div>
        `).join('');
    }
}

// ===================================
// MOCK DATA
// ===================================
function loadMockData() {
    // New dashboard state: no seeded orders/customers.
    const recentOrdersTable = document.getElementById('recentOrdersTable');
    recentOrdersTable.innerHTML = `
        <tr>
            <td colspan="5" style="text-align:center;color:#777;padding:18px;">No orders yet.</td>
        </tr>
    `;

    const ordersTable = document.getElementById('ordersTable');
    ordersTable.innerHTML = `
        <tr>
            <td colspan="8" style="text-align:center;color:#777;padding:18px;">No orders yet.</td>
        </tr>
    `;

    const customersTable = document.getElementById('customersTable');
    customersTable.innerHTML = `
        <tr>
            <td colspan="7" style="text-align:center;color:#777;padding:18px;">No customers yet.</td>
        </tr>
    `;
}

// ===================================
// UTILITY FUNCTIONS
// ===================================
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR'
    }).format(amount);
}

// ===================================
// PAGE VISIBILITY HANDLING
// ===================================
window.addEventListener('beforeunload', () => {
    saveProductsLocal();
});
