// ==========================================
// MELLOPHI FASHION - API Configuration
// ==========================================

/**
 * API URL Configuration
 * 
 * DEVELOPMENT: Uses localhost:5000
 * PRODUCTION: Update PRODUCTION_API_URL with your deployed backend URL
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Deploy backend to Render/Heroku
 * 2. Get your backend URL (e.g., https://mellophi-api.onrender.com)
 * 3. Update PRODUCTION_API_URL below
 * 4. Deploy frontend
 */

// 🚨 UPDATE THIS BEFORE DEPLOYING TO PRODUCTION 🚨
// Replace with your actual backend URL after deployment
const PRODUCTION_API_URL = 'https://mellophi-api.onrender.com/api';

// Automatically detect environment
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '';

// Export the API URL
const API_URL = isDevelopment 
    ? 'http://localhost:5000/api'
    : PRODUCTION_API_URL;

// Log current environment (helpful for debugging)
console.log('🌐 Environment:', isDevelopment ? 'Development' : 'Production');
console.log('🔗 API URL:', API_URL);

// Export for use in other files
window.API_URL = API_URL;

// HTTPS enforcement for production
if (!isDevelopment && window.location.protocol !== 'https:') {
    console.warn('⚠️ Redirecting to HTTPS...');
    window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}
