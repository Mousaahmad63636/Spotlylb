// src/api/api.js
import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://spotlybackend.onrender.com/api'
    : 'http://localhost:5000/api';

    const axiosInstance = axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        timeout: 70000 // 70 second timeout
    });


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

// Keep this single request interceptor at the top after axiosInstance creation
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log('Request headers:', config.headers); // Debug log
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Keep this single response interceptor
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            updateAuthToken(null);
            window.location.href = '/login';
        }
        console.error('Response Error:', error.response?.data);
        return Promise.reject(error);
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

  const updateAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem('token');
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};



// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            // Clear token and redirect to login if needed
            updateAuthToken(null);
            
            // You might want to redirect to login here
            window.location.href = '/login';
            
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

// Add this before sending the request
console.log('FormData contents:');
for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
        console.log(key, ':', {
            name: value.name,
            size: value.size,
            type: value.type
        });
    } else {
        console.log(key, ':', value);
    }
}

const api = {

    getSettings: async () => {
        try {
            const response = await axiosInstance.get('/settings');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
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
            throw error;
        }
    },

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
        try {
            const response = await axiosInstance.post('/users/login', credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                console.log('Token stored:', response.data.token); // Debug log
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
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
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required - please login again');
            }
    
            // Log for debugging
            console.log('Token:', token);
            console.log('FormData contents:');
            for (let pair of formData.entries()) {
                console.log(pair[0] + ':', pair[1] instanceof File ? 
                    `File: ${pair[1].name} (${pair[1].size} bytes)` : 
                    pair[1]
                );
            }
    
            const response = await axiosInstance.post('/products/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                onUploadProgress: progressEvent => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    console.log('Upload progress:', percentCompleted + '%');
                }
            });
            
            console.log('Upload successful:', response.data);
            return response.data;
        } catch (error) {
            console.error('Product add error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                headers: error.response?.headers,
                request: error.config
            });
            
            if (error.response?.status === 401) {
                updateAuthToken(null);
                throw new Error('Session expired. Please login again.');
            }
            throw new Error(error.response?.data?.message || 'Failed to add product');
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
        const response = await axiosInstance.post('/orders/guest', orderData);
        return response.data;
    },
    getGuestOrder: async (orderId, email) => {
        const response = await axiosInstance.get(`/orders/guest/${orderId}?email=${email}`);
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
        });
        return response.data;
    },

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

<<<<<<< HEAD
export default api;
=======
export default api;
>>>>>>> c9c4a30ae3d2abfe03fe6d980bbc6ea7a48c01e0
