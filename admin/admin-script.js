const API_URL = window.API_URL || 'http://localhost:5000/api';
let token = localStorage.getItem('adminToken');
let currentEditingOrder = null;

// Check authentication
function checkAuth() {
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    if (!user.isAdmin) {
        window.location.href = 'login.html';
        return;
    }
    
    document.getElementById('adminName').textContent = `${user.firstName} ${user.lastName}`;
}

// API call helper
async function apiCall(endpoint, method = 'GET', body = null, isFormData = false) {
    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    
    // Don't set Content-Type for FormData - browser will set it with boundary
    if (!isFormData) {
        options.headers['Content-Type'] = 'application/json';
    }
    
    if (body) {
        options.body = isFormData ? body : JSON.stringify(body);
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();
    
    if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = 'login.html';
    }
    
    return data;
}

// Navigation
document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        
        // Update active nav
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        
        // Show page
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`${page}Page`).classList.add('active');
        
        // Update title
        document.getElementById('pageTitle').textContent = page.charAt(0).toUpperCase() + page.slice(1);
        
        // Load data
        if (page === 'dashboard') loadDashboard();
        else if (page === 'products') loadProducts();
        else if (page === 'orders') loadOrders();
        else if (page === 'customers') loadCustomers();
    });
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = 'login.html';
});

// Load Dashboard
async function loadDashboard() {
    try {
        const data = await apiCall('/admin/stats');
        
        if (data.success) {
            document.getElementById('totalOrders').textContent = data.data.totalOrders;
            document.getElementById('totalRevenue').textContent = `R ${data.data.totalRevenue.toFixed(2)}`;
            document.getElementById('totalProducts').textContent = data.data.totalProducts;
            document.getElementById('totalCustomers').textContent = data.data.totalUsers;
            
            // Recent orders
            const ordersHtml = data.data.recentOrders.map(order => `
                <div style="padding: 10px; border-bottom: 1px solid #F0F0F0;">
                    <strong>${order.orderNumber}</strong> - ${order.customerInfo.firstName} ${order.customerInfo.lastName}
                    <br><small>R ${order.total} - ${new Date(order.createdAt).toLocaleDateString()}</small>
                    <span class="status-badge status-${order.orderStatus}">${order.orderStatus}</span>
                </div>
            `).join('');
            document.getElementById('recentOrders').innerHTML = ordersHtml || '<p>No recent orders</p>';
            
            // Low stock
            const stockHtml = data.data.lowStockProducts.map(product => `
                <div style="padding: 10px; border-bottom: 1px solid #F0F0F0;">
                    <strong>${product.productId}</strong> - ${product.name}
                    <br><small>Stock: ${product.stock} units</small>
                </div>
            `).join('');
            document.getElementById('lowStock').innerHTML = stockHtml || '<p>All products well stocked</p>';
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Load Products
async function loadProducts() {
    try {
        const data = await apiCall('/admin/products');
        
        if (data.success) {
            const tbody = document.getElementById('productsTableBody');
            tbody.innerHTML = data.data.map(product => `
                <tr>
                    <td>${product.productId}</td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>R ${product.price}</td>
                    <td>${product.stock}</td>
                    <td>
                        ${product.isFeatured ? '<span class="status-badge status-processing">Featured</span>' : ''}
                        ${product.isNewArrival ? '<span class="status-badge status-shipped">New</span>' : ''}
                        ${product.isBestSeller ? '<span class="status-badge status-delivered">Best Seller</span>' : ''}
                    </td>
                    <td>
                        <button class="btn-primary btn-small btn-edit" onclick="editProduct('${product.productId}')">Edit</button>
                        <button class="btn-primary btn-small btn-delete" onclick="deleteProduct('${product.productId}')">Delete</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Add Product Modal
document.getElementById('addProductBtn').addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Add New Product';
    document.getElementById('productForm').reset();
    document.getElementById('productModal').classList.add('show');
});

// Product Form Submit
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Convert arrays to JSON strings for FormData
    formData.append('sizes', JSON.stringify(['XS', 'S', 'M', 'L', 'XL']));
    formData.append('colors', JSON.stringify(['Black', 'White', 'Red']));
    
    // Convert checkboxes to boolean values (0 or 1)
    formData.set('isFeatured', formData.get('isFeatured') === 'on' ? '1' : '0');
    formData.set('isNewArrival', formData.get('isNewArrival') === 'on' ? '1' : '0');
    formData.set('isBestSeller', formData.get('isBestSeller') === 'on' ? '1' : '0');
    
    // Remove the hidden existingImages field if it's empty
    if (!formData.get('existingImages')) {
        formData.delete('existingImages');
    }
    
    try {
        const result = await apiCall('/admin/products', 'POST', formData, true);
        
        if (result.success) {
            alert('Product added successfully!');
            document.getElementById('productModal').classList.remove('show');
            loadProducts();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Error adding product');
    }
});

// Delete Product
async function deleteProduct(productId) {
    if (!confirm(`Delete product ${productId}?`)) return;
    
    try {
        const result = await apiCall(`/admin/products/${productId}`, 'DELETE');
        
        if (result.success) {
            alert('Product deleted');
            loadProducts();
        }
    } catch (error) {
        alert('Error deleting product');
    }
}

// Load Orders
async function loadOrders(status = '') {
    try {
        const endpoint = status ? `/admin/orders?status=${status}` : '/admin/orders';
        const data = await apiCall(endpoint);
        
        if (data.success) {
            const tbody = document.getElementById('ordersTableBody');
            tbody.innerHTML = data.data.map(order => `
                <tr>
                    <td><strong>${order.orderNumber}</strong></td>
                    <td>${order.customerInfo.firstName} ${order.customerInfo.lastName}<br><small>${order.customerInfo.email}</small></td>
                    <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                    <td><strong>R ${order.total}</strong></td>
                    <td><span class="status-badge status-${order.orderStatus}">${order.orderStatus}</span></td>
                    <td>
                        <button class="btn-primary btn-small btn-view" onclick="viewOrder('${order.orderNumber}')">View</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Order Status Filter
document.getElementById('orderStatusFilter').addEventListener('change', (e) => {
    loadOrders(e.target.value);
});

// View Order
async function viewOrder(orderNumber) {
    try {
        const data = await apiCall(`/orders/${orderNumber}`);
        
        if (data.success) {
            const order = data.data;
            currentEditingOrder = orderNumber;
            
            const detailsHtml = `
                <div style="margin-bottom: 20px;">
                    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                    <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                    <p><strong>Customer:</strong> ${order.customerInfo.firstName} ${order.customerInfo.lastName}</p>
                    <p><strong>Email:</strong> ${order.customerInfo.email}</p>
                    <p><strong>Phone:</strong> ${order.customerInfo.phone}</p>
                    <p><strong>Address:</strong> ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.province}</p>
                    <hr style="margin: 20px 0;">
                    <h4>Items:</h4>
                    ${order.items.map(item => `
                        <p>• ${item.name} (${item.size || 'N/A'}) - Qty: ${item.quantity} - R ${item.price}</p>
                    `).join('')}
                    <hr style="margin: 20px 0;">
                    <p><strong>Subtotal:</strong> R ${order.subtotal}</p>
                    <p><strong>Shipping:</strong> R ${order.shippingCost}</p>
                    <p><strong>Total:</strong> R ${order.total}</p>
                </div>
            `;
            
            document.getElementById('orderDetails').innerHTML = detailsHtml;
            document.querySelector('[name="orderStatus"]').value = order.orderStatus;
            document.querySelector('[name="paymentStatus"]').value = order.paymentStatus;
            document.querySelector('[name="trackingNumber"]').value = order.trackingNumber || '';
            
            document.getElementById('orderModal').classList.add('show');
        }
    } catch (error) {
        alert('Error loading order');
    }
}

// Update Order
document.getElementById('orderUpdateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const updateData = {
        orderStatus: formData.get('orderStatus'),
        paymentStatus: formData.get('paymentStatus'),
        trackingNumber: formData.get('trackingNumber')
    };
    
    try {
        const result = await apiCall(`/admin/orders/${currentEditingOrder}`, 'PUT', updateData);
        
        if (result.success) {
            alert('Order updated successfully!');
            document.getElementById('orderModal').classList.remove('show');
            loadOrders();
        }
    } catch (error) {
        alert('Error updating order');
    }
});

// Load Customers
async function loadCustomers() {
    try {
        const data = await apiCall('/admin/users');
        
        if (data.success) {
            const tbody = document.getElementById('customersTableBody');
            tbody.innerHTML = data.data.map(user => `
                <tr>
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${user.email}</td>
                    <td>${user.phone || 'N/A'}</td>
                    <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>${user.orders?.length || 0}</td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

// Close modals
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        closeBtn.closest('.modal').classList.remove('show');
    });
});

// Initialize
checkAuth();
loadDashboard();
