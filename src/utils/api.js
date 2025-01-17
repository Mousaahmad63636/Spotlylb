<<<<<<< HEAD
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
=======
// src/api/api.js
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
>>>>>>> c9c4a30ae3d2abfe03fe6d980bbc6ea7a48c01e0
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(request => {
    console.log('Request:', request);
    return request;
});
<<<<<<< HEAD

const getFullUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    
    const baseUrl = process.env.NODE_ENV === 'production'
        ? 'https://spotlybackend.onrender.com'
        : 'http://localhost:5000';
        
    return `${baseUrl}${path}`;
};
=======
const getFullUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${BASE_URL}${path}`;
  };
// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        console.error('Response Error:', error.response?.data);
        throw error;
    }
);

// Response interceptor for error handling

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Don't retry auth failures
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);
const getSettings = async () => {
    try {
      const response = await axiosInstance.get('/settings');
      if (response.data?.heroSection) {
        response.data.heroSection.mediaUrl = getFullUrl(response.data.heroSection.mediaUrl);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };
// Initialize token from localStorage
const token = localStorage.getItem('token');
if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
axiosInstance.interceptors.request.use(request => {
    console.log('Request:', request);
    return request;
});
>>>>>>> c9c4a30ae3d2abfe03fe6d980bbc6ea7a48c01e0

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        console.error('Response Error:', error.response?.data);
        throw error;
    }
);

<<<<<<< HEAD
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
=======
const api = {

    getSettings: async () => {
        try {
            const response = await axiosInstance.get('/settings');
>>>>>>> c9c4a30ae3d2abfe03fe6d980bbc6ea7a48c01e0
            return response.data;
        } catch (error) {
            throw error;
        }
    },
<<<<<<< HEAD

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
=======
    // Promo Code Methods
    getPromoCodes: async () => {
        try {
            const response = await axiosInstance.get('/promo-codes');
            return response.data;
        } catch (error) {
            console.error('Error fetching promo codes:', error);
            throw error;
        }
    },
    validatePromoCode: async (code, cartTotal) => {
        try {
            const response = await axiosInstance.post('/promo-codes/validate', {
                code,
                cartTotal
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 400) {
                throw new Error(error.response.data.message || 'Invalid promo code');
            }
            console.error('Error validating promo code:', error);
            throw new Error('Error validating promo code');
        }
    },
    createPromoCode: async (promoData) => {
        try {
            const response = await axiosInstance.post('/promo-codes', promoData);
            return response.data;
        } catch (error) {
            console.error('Error creating promo code:', error);
            throw error;
        }
    },

    updatePromoCode: async (id, promoData) => {
        try {
            const response = await axiosInstance.put(`/promo-codes/${id}`, promoData);
            return response.data;
        } catch (error) {
            console.error('Error updating promo code:', error);
            throw error;
        }
    },

    deletePromoCode: async (id) => {
        try {
            const response = await axiosInstance.delete(`/promo-codes/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting promo code:', error);
>>>>>>> c9c4a30ae3d2abfe03fe6d980bbc6ea7a48c01e0
            throw error;
        }
    },

<<<<<<< HEAD
    // Authentication
=======
>>>>>>> c9c4a30ae3d2abfe03fe6d980bbc6ea7a48c01e0
    setAuthToken: (token) => {
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axiosInstance.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    },
<<<<<<< HEAD

=======
>>>>>>> c9c4a30ae3d2abfe03fe6d980bbc6ea7a48c01e0
    register: async (userData) => {
        const response = await axiosInstance.post('/users/register', userData);
        return response.data;
    },

    login: async (credentials) => {
<<<<<<< HEAD
        const response = await axiosInstance.post('/users/login', credentials);
        return response.data;
=======
        try {
            const response = await axiosInstance.post('/users/login', credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }
            return response.data;
        } catch (error) {
            throw error;
        }
>>>>>>> c9c4a30ae3d2abfe03fe6d980bbc6ea7a48c01e0
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

<<<<<<< HEAD
    addProduct: async (formData) => {
        const response = await axiosInstance.post('/products/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

=======
    updateProduct: async (id, formData) => {
        try {
            const response = await axiosInstance.put(`/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    addProduct: async (formData) => {
        try {
            // Get current token
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }
    
            const response = await axiosInstance.post('/products/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                // Handle unauthorized error
                localStorage.removeItem('token'); // Clear invalid token
                throw new Error('Session expired. Please login again.');
            }
            throw error;
        }
    },

    updateProduct: async (id, formData) => {
        try {
            const response = await axiosInstance.put(`/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
>>>>>>> c9c4a30ae3d2abfe03fe6d980bbc6ea7a48c01e0
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

<<<<<<< HEAD
    toggleProductSoldOut: async (productId, soldOut) => {
        const response = await axiosInstance.put(`/products/${productId}/toggle-sold-out`, {
            soldOut: Boolean(soldOut)
        });
=======
    // Black Friday
    getBlackFridayData: async () => {
        try {
            const response = await axiosInstance.get('/products/black-friday');
            return response.data;
        } catch (error) {
            console.error('Black Friday data error:', error);
            return { isActive: false };
        }
    },

    applyBlackFridayDiscount: async (discountData) => {
        const response = await axiosInstance.post('/products/black-friday', discountData);
>>>>>>> c9c4a30ae3d2abfe03fe6d980bbc6ea7a48c01e0
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
<<<<<<< HEAD
        const response = await axiosInstance.post('/orders', orderData);
        return response.data;
    },

    createGuestOrder: async (orderData) => {
        const response = await axiosInstance.post('/orders/guest', orderData);
=======
        const response = await axiosInstance.post('/orders/guest', orderData);
        return response.data;
    },
    getGuestOrder: async (orderId, email) => {
        const response = await axiosInstance.get(`/orders/guest/${orderId}?email=${email}`);
>>>>>>> c9c4a30ae3d2abfe03fe6d980bbc6ea7a48c01e0
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

<<<<<<< HEAD
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
=======
    cancelOrder: async (orderId) => {
        const response = await axiosInstance.put(`/orders/${orderId}/cancel`);
        return response.data;
    },

    // Address Management
    getAddresses: async () => {
        const response = await axiosInstance.get('/users/addresses');
        return response.data;
    },

    addAddress: async (addressData) => {
        const response = await axiosInstance.post('/users/addresses', addressData);
        return response.data;
    },

    updateAddress: async (addressId, addressData) => {
        const response = await axiosInstance.put(`/users/addresses/${addressId}`, addressData);
        return response.data;
    },

    deleteAddress: async (addressId) => {
        const response = await axiosInstance.delete(`/users/addresses/${addressId}`);
        return response.data;
    },

    setDefaultAddress: async (addressId) => {
        const response = await axiosInstance.put(`/users/addresses/${addressId}/default`);
>>>>>>> c9c4a30ae3d2abfe03fe6d980bbc6ea7a48c01e0
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
<<<<<<< HEAD

=======
>>>>>>> c9c4a30ae3d2abfe03fe6d980bbc6ea7a48c01e0
    removeFromWishlist: async (productId) => {
        const response = await axiosInstance.delete(`/users/wishlist/${productId}`);
        return response.data;
    },
<<<<<<< HEAD

    // Discounts
    applyDiscount: async (discountData) => {
        const response = await axiosInstance.post('/products/discount', discountData);
        return response.data;
    },

    resetDiscount: async (productId = null) => {
        const response = await axiosInstance.post('/products/reset-discount', {
            productId: productId
=======
    createGuestOrder: async (orderData) => {
        try {
            console.log('Creating guest order with data:', orderData); // Debug log
            const response = await axiosInstance.post('/orders/guest', orderData);
            return response.data;
        } catch (error) {
            console.error('Guest order creation error:', error.response?.data);
            throw error;
        }
    },
    createOrder: async (orderData) => {
        try {
            const response = await axiosInstance.post('/orders', orderData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // Discounts
    applyDiscount: async (discountData) => {
        try {
            const response = await axiosInstance.post('/products/discount', discountData);
            return response.data;
        } catch (error) {
            console.error('Apply discount error:', error);
            throw error;
        }
    },

    resetDiscount: async (productId = null) => {
        try {
            const response = await axiosInstance.post('/products/reset-discount', {
                productId: productId
            });
            return response.data;
        } catch (error) {
            console.error('Reset discount error:', error);
            throw error;
        }
    },
    toggleProductSoldOut: async (productId, soldOut) => {
        try {
            const response = await axiosInstance.put(`/products/${productId}/toggle-sold-out`, {
                soldOut: Boolean(soldOut)
            });
            return response.data;
        } catch (error) {
            console.error('Toggle sold out error:', error);
            throw error;
        }
    },
    getTimer: async () => {
        try {
            const response = await axiosInstance.get('/timer', {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Timer fetch error:', error);
            throw error;
        }
    },
  
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
    createTimer: async (timerData) => {
        try {
            const response = await axiosInstance.post('/timer', timerData, {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Timer creation error:', error);
            throw error;
        }
    },
    deleteTimer: async (timerId) => {
        try {
            const response = await axiosInstance.delete(`/timer/${timerId}`);
            return response.data;
        } catch (error) {
            console.error('Timer deletion error:', error);
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

    // Admin Dashboard
    getAllOrders: async () => {
        const response = await axiosInstance.get('/admin/orders');
        return response.data;
    },

    getDashboardStats: async () => {
        const response = await axiosInstance.get('/admin/dashboard/stats');
        return response.data;
    },

    // Reviews
    getProductReviews: async (productId) => {
        const response = await axiosInstance.get(`/products/${productId}/reviews`);
        return response.data;
    },

    addProductReview: async (productId, reviewData) => {
        const response = await axiosInstance.post(`/products/${productId}/reviews`, reviewData);
        return response.data;
    },

    // Search and Categories
    searchProducts: async (query) => {
        const response = await axiosInstance.get(`/products/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    getCategories: async () => {
        const response = await axiosInstance.get('/products/categories');
        return response.data;
    },

    // File Upload
    uploadImage: async (file, type = 'product') => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', type);

        const response = await axiosInstance.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
>>>>>>> c9c4a30ae3d2abfe03fe6d980bbc6ea7a48c01e0
        });
        return response.data;
    },

<<<<<<< HEAD
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
=======
    // User Preferences
    updateUserPreferences: async (preferences) => {
        const response = await axiosInstance.put('/users/preferences', preferences);
        return response.data;
    },

    // Error Handler (utility method)
    handleError: (error) => {
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
        throw new Error(errorMessage);
    }
};

export default api;
>>>>>>> c9c4a30ae3d2abfe03fe6d980bbc6ea7a48c01e0
