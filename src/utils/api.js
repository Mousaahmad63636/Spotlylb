import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://spotlybackend.onrender.com/api'
    : 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(request => {
    console.log('Request:', request);
    return request;
});

const getFullUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    
    const baseUrl = process.env.NODE_ENV === 'production'
        ? 'https://spotlybackend.onrender.com'
        : 'http://localhost:5000';
        
    return `${baseUrl}${path}`;
};

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        console.error('Response Error:', error.response?.data);
        throw error;
    }
);

// Initialize token from localStorage
const token = localStorage.getItem('token');
if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const api = {
    // Settings
    getSettings: async () => {
        try {
            const response = await axiosInstance.get('/settings');
            if (response.data?.heroSection) {
                response.data.heroSection.mediaUrl = getFullUrl(response.data.heroSection.mediaUrl);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateSettings: async (settingsData) => {
        try {
            const response = await axiosInstance.put('/settings', settingsData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Hero Settings
    getHeroSettings: async () => {
        try {
            const response = await axiosInstance.get('/settings/hero');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateHeroSettings: async (formData) => {
        try {
            const response = await axiosInstance.put('/settings/hero', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Authentication
    setAuthToken: (token) => {
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axiosInstance.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    },

    register: async (userData) => {
        const response = await axiosInstance.post('/users/register', userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await axiosInstance.post('/users/login', credentials);
        return response.data;
    },

    logout: async () => {
        try {
            const response = await axiosInstance.post('/users/logout');
            return response.data;
        } finally {
            localStorage.removeItem('token');
            delete axiosInstance.defaults.headers.common['Authorization'];
        }
    },

    // User Profile
    getUserProfile: async () => {
        const response = await axiosInstance.get('/users/profile');
        return response.data;
    },

    updateProfile: async (userData) => {
        const response = await axiosInstance.put('/users/profile', userData);
        return response.data;
    },

    updatePassword: async (currentPassword, newPassword) => {
        const response = await axiosInstance.post('/users/update-password', {
            currentPassword,
            newPassword
        });
        return response.data;
    },

    deleteAccount: async () => {
        const response = await axiosInstance.delete('/users/account');
        return response.data;
    },

    // Products
    getProducts: async () => {
        const response = await axiosInstance.get('/products');
        return response.data;
    },

    getProductById: async (id) => {
        const response = await axiosInstance.get(`/products/${id}`);
        return response.data;
    },

    getBestSelling: async () => {
        const response = await axiosInstance.get('/products/best-selling');
        return response.data;
    },

    addProduct: async (formData) => {
        const response = await axiosInstance.post('/products/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    updateProduct: async (id, formData) => {
        const response = await axiosInstance.put(`/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    deleteProduct: async (id) => {
        const response = await axiosInstance.delete(`/products/${id}`);
        return response.data;
    },

    toggleProductSoldOut: async (productId, soldOut) => {
        const response = await axiosInstance.put(`/products/${productId}/toggle-sold-out`, {
            soldOut: Boolean(soldOut)
        });
        return response.data;
    },

    // Orders
    getOrders: async () => {
        const response = await axiosInstance.get('/orders');
        return response.data;
    },

    getUserOrders: async () => {
        const response = await axiosInstance.get('/orders/my-orders');
        return response.data;
    },

    getOrder: async (orderId) => {
        const response = await axiosInstance.get(`/orders/${orderId}`);
        return response.data;
    },

    createOrder: async (orderData) => {
        const response = await axiosInstance.post('/orders', orderData);
        return response.data;
    },

    createGuestOrder: async (orderData) => {
        const response = await axiosInstance.post('/orders/guest', orderData);
        return response.data;
    },

    updateOrderStatus: async (orderId, status) => {
        const response = await axiosInstance.put(`/orders/${orderId}`, { status });
        return response.data;
    },

    deleteOrder: async (orderId) => {
        const response = await axiosInstance.delete(`/orders/${orderId}`);
        return response.data;
    },

    // Promo Codes
    getPromoCodes: async () => {
        const response = await axiosInstance.get('/promo-codes');
        return response.data;
    },

    validatePromoCode: async (code, cartTotal) => {
        const response = await axiosInstance.post('/promo-codes/validate', {
            code,
            cartTotal
        });
        return response.data;
    },

    createPromoCode: async (promoData) => {
        const response = await axiosInstance.post('/promo-codes', promoData);
        return response.data;
    },

    updatePromoCode: async (id, promoData) => {
        const response = await axiosInstance.put(`/promo-codes/${id}`, promoData);
        return response.data;
    },

    deletePromoCode: async (id) => {
        const response = await axiosInstance.delete(`/promo-codes/${id}`);
        return response.data;
    },

    // Timer
    getTimer: async () => {
        const response = await axiosInstance.get('/timer');
        return response.data;
    },

    createTimer: async (timerData) => {
        const response = await axiosInstance.post('/timer', timerData);
        return response.data;
    },

    deleteTimer: async (timerId) => {
        const response = await axiosInstance.delete(`/timer/${timerId}`);
        return response.data;
    },

    // Wishlist
    getUserWishlist: async () => {
        const response = await axiosInstance.get('/users/wishlist');
        return response.data;
    },

    addToWishlist: async (productId) => {
        const response = await axiosInstance.post('/users/wishlist/add', { productId });
        return response.data;
    },

    removeFromWishlist: async (productId) => {
        const response = await axiosInstance.delete(`/users/wishlist/${productId}`);
        return response.data;
    },

    // Discounts
    applyDiscount: async (discountData) => {
        const response = await axiosInstance.post('/products/discount', discountData);
        return response.data;
    },

    resetDiscount: async (productId = null) => {
        const response = await axiosInstance.post('/products/reset-discount', {
            productId: productId
        });
        return response.data;
    },

    // Black Friday
    getBlackFridayData: async () => {
        const response = await axiosInstance.get('/products/black-friday');
        return response.data;
    },

    applyBlackFridayDiscount: async (discountData) => {
        const response = await axiosInstance.post('/products/black-friday', discountData);
        return response.data;
    }
};

export default api;