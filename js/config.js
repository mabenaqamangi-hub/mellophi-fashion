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

// Production API candidates. The app will auto-select a healthy one.
const PRODUCTION_API_CANDIDATES = [
    'https://mellophi-fashion.onrender.com/api',
    'https://mellophi-fashion-api.onrender.com/api'
];

const PRODUCTION_API_URL = PRODUCTION_API_CANDIDATES[0];

// Automatically detect environment
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '';

// Export the API URL
const API_URL = isDevelopment
    ? 'http://localhost:5000/api'
    : PRODUCTION_API_URL;

// Log current environment only in development
if (isDevelopment) {
    console.log('🌐 Environment: Development');
    console.log('🔗 API URL:', API_URL);
}

// Export for use in other files
window.API_URL = API_URL;

// Cache resolved API so future calls are instant in this session.
let resolvedApiUrl = API_URL;

async function isApiHealthy(apiBase) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const response = await fetch(`${apiBase}/health`, {
            method: 'GET',
            signal: controller.signal,
            cache: 'no-store'
        });
        clearTimeout(timeoutId);

        if (!response.ok) return false;
        const data = await response.json();
        return data && data.status === 'OK';
    } catch (error) {
        return false;
    }
}

// Public async resolver for pages that perform critical requests (checkout/payment).
window.getApiUrl = async function getApiUrl() {
    if (isDevelopment) {
        return 'http://localhost:5000/api';
    }

    // If already resolved to a healthy API, reuse it.
    if (resolvedApiUrl !== PRODUCTION_API_URL && await isApiHealthy(resolvedApiUrl)) {
        window.API_URL = resolvedApiUrl;
        return resolvedApiUrl;
    }

    for (const candidate of PRODUCTION_API_CANDIDATES) {
        if (await isApiHealthy(candidate)) {
            resolvedApiUrl = candidate;
            window.API_URL = candidate;
            return candidate;
        }
    }

    // Fallback to primary candidate if health checks fail.
    window.API_URL = PRODUCTION_API_URL;
    return PRODUCTION_API_URL;
};

// Warm up API resolution in background after initial load.
if (!isDevelopment) {
    window.getApiUrl().catch(() => {
        // Keep default API_URL on failure.
    });
}

// HTTPS enforcement for production
if (!isDevelopment && window.location.protocol !== 'https:') {
    console.warn('⚠️ Redirecting to HTTPS...');
    window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}
