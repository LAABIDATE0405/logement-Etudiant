// ===== API COMMUNICATION SYSTEM =====

class APIService {
    constructor() {
        this.baseURL = 'https://api.studentstay.ma'; // أو URL محلي للتطوير
        this.token = null;
        this.init();
    }
    
    init() {
        this.loadToken();
        this.setupInterceptors();
    }
    
    // تحميل التوكن من التخزين المحلي
    loadToken() {
        this.token = localStorage.getItem('auth_token');
    }
    
    // حفظ التوكن
    saveToken(token) {
        this.token = token;
        localStorage.setItem('auth_token', token);
    }
    
    // حذف التوكن
    removeToken() {
        this.token = null;
        localStorage.removeItem('auth_token');
    }
    
    // إعداد المقطعات (Interceptors)
    setupInterceptors() {
        // يمكنك إضافة interceptors هنا للتحكم في الطلبات والردود
    }
    
    // إنشاء رؤوس الطلبات
    getHeaders(additionalHeaders = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-Language': localStorage.getItem('language') || 'ar',
            ...additionalHeaders
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }
    
    // معالجة الاستجابة
    async handleResponse(response) {
        if (!response.ok) {
            const error = await this.parseError(response);
            throw error;
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        
        return await response.text();
    }
    
    // تحليل الخطأ
    async parseError(response) {
        try {
            const errorData = await response.json();
            return {
                status: response.status,
                message: errorData.message || 'حدث خطأ في الخادم',
                errors: errorData.errors,
                code: errorData.code
            };
        } catch {
            return {
                status: response.status,
                message: this.getErrorMessage(response.status),
                errors: null,
                code: 'UNKNOWN_ERROR'
            };
        }
    }
    
    // رسائل الخطأ حسب الحالة
    getErrorMessage(status) {
        const messages = {
            400: 'طلب غير صالح',
            401: 'غير مصرح بالدخول',
            403: 'ممنوع الوصول',
            404: 'لم يتم العثور على المورد',
            422: 'بيانات غير صالحة',
            429: 'طلبات كثيرة جداً',
            500: 'خطأ في الخادم',
            502: 'خطأ في البوابة',
            503: 'الخدمة غير متاحة',
            504: 'مهلة البوابة'
        };
        
        return messages[status] || 'حدث خطأ غير معروف';
    }
    
    // GET Request
    async get(endpoint, params = {}) {
        try {
            const url = new URL(`${this.baseURL}${endpoint}`);
            
            // إضافة المعاملات
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    url.searchParams.append(key, params[key]);
                }
            });
            
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: this.getHeaders(),
                credentials: 'include'
            });
            
            return await this.handleResponse(response);
            
        } catch (error) {
            console.error('GET Error:', error);
            throw error;
        }
    }
    
    // POST Request
    async post(endpoint, data = {}, additionalHeaders = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(additionalHeaders),
                body: JSON.stringify(data),
                credentials: 'include'
            });
            
            return await this.handleResponse(response);
            
        } catch (error) {
            console.error('POST Error:', error);
            throw error;
        }
    }
    
    // PUT Request
    async put(endpoint, data = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
                credentials: 'include'
            });
            
            return await this.handleResponse(response);
            
        } catch (error) {
            console.error('PUT Error:', error);
            throw error;
        }
    }
    
    // PATCH Request
    async patch(endpoint, data = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PATCH',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
                credentials: 'include'
            });
            
            return await this.handleResponse(response);
            
        } catch (error) {
            console.error('PATCH Error:', error);
            throw error;
        }
    }
    
    // DELETE Request
    async delete(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
                credentials: 'include'
            });
            
            return await this.handleResponse(response);
            
        } catch (error) {
            console.error('DELETE Error:', error);
            throw error;
        }
    }
    
    // Upload ملفات
    async upload(endpoint, formData) {
        try {
            const headers = {
                'Authorization': this.token ? `Bearer ${this.token}` : ''
            };
            
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: headers,
                body: formData,
                credentials: 'include'
            });
            
            return await this.handleResponse(response);
            
        } catch (error) {
            console.error('Upload Error:', error);
            throw error;
        }
    }
    
    // ===== API ENDPOINTS =====
    
    // المصادقة
    async login(email, password) {
        const data = await this.post('/auth/login', { email, password });
        
        if (data.token) {
            this.saveToken(data.token);
        }
        
        return data;
    }
    
    async register(userData) {
        return await this.post('/auth/register', userData);
    }
    
    async logout() {
        try {
            await this.post('/auth/logout');
        } finally {
            this.removeToken();
        }
    }
    
    async refreshToken() {
        const data = await this.post('/auth/refresh');
        
        if (data.token) {
            this.saveToken(data.token);
        }
        
        return data;
    }
    
    // المستخدمون
    async getCurrentUser() {
        return await this.get('/user/me');
    }
    
    async updateProfile(userData) {
        return await this.put('/user/profile', userData);
    }
    
    async changePassword(oldPassword, newPassword) {
        return await this.post('/user/change-password', { oldPassword, newPassword });
    }
    
    // العقارات
    async getProperties(filters = {}) {
        return await this.get('/properties', filters);
    }
    
    async getProperty(id) {
        return await this.get(`/properties/${id}`);
    }
    
    async createProperty(propertyData) {
        return await this.post('/properties', propertyData);
    }
    
    async updateProperty(id, propertyData) {
        return await this.put(`/properties/${id}`, propertyData);
    }
    
    async deleteProperty(id) {
        return await this.delete(`/properties/${id}`);
    }
    
    async getMyProperties() {
        return await this.get('/user/properties');
    }
    
    async uploadPropertyImages(propertyId, images) {
        const formData = new FormData();
        images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
        });
        
        return await this.upload(`/properties/${propertyId}/images`, formData);
    }
    
    // الحجوزات
    async getBookings(filters = {}) {
        return await this.get('/bookings', filters);
    }
    
    async createBooking(bookingData) {
        return await this.post('/bookings', bookingData);
    }
    
    async cancelBooking(id) {
        return await this.post(`/bookings/${id}/cancel`);
    }
    
    async getMyBookings() {
        return await this.get('/user/bookings');
    }
    
    // الرسائل
    async getConversations() {
        return await this.get('/messages/conversations');
    }
    
    async getMessages(conversationId) {
        return await this.get(`/messages/conversations/${conversationId}`);
    }
    
    async sendMessage(conversationId, message) {
        return await this.post(`/messages/conversations/${conversationId}`, { message });
    }
    
    async startConversation(userId, message) {
        return await this.post('/messages/conversations', { userId, message });
    }
    
    // المراجعات
    async createReview(propertyId, reviewData) {
        return await this.post(`/properties/${propertyId}/reviews`, reviewData);
    }
    
    async getPropertyReviews(propertyId) {
        return await this.get(`/properties/${propertyId}/reviews`);
    }
    
    // المفضلة
    async getFavorites() {
        return await this.get('/user/favorites');
    }
    
    async addFavorite(propertyId) {
        return await this.post('/user/favorites', { propertyId });
    }
    
    async removeFavorite(propertyId) {
        return await this.delete(`/user/favorites/${propertyId}`);
    }
    
    // الإحصائيات
    async getDashboardStats() {
        return await this.get('/user/dashboard/stats');
    }
    
    async getAnalytics(startDate, endDate) {
        return await this.get('/user/analytics', { startDate, endDate });
    }
    
    // البحث
    async searchProperties(query, filters = {}) {
        return await this.get('/search/properties', { q: query, ...filters });
    }
    
    async searchCities(query) {
        return await this.get('/search/cities', { q: query });
    }
    
    // الإشعارات
    async getNotifications() {
        return await this.get('/user/notifications');
    }
    
    async markNotificationAsRead(id) {
        return await this.post(`/user/notifications/${id}/read`);
    }
    
    async markAllNotificationsAsRead() {
        return await this.post('/user/notifications/read-all');
    }
    
    // الدفع
    async createPayment(bookingId, paymentMethod) {
        return await this.post('/payments/create', { bookingId, paymentMethod });
    }
    
    async verifyPayment(paymentId) {
        return await this.post('/payments/verify', { paymentId });
    }
    
    // ===== UTILITIES =====
    
    // التحقق من حالة التوكن
    isAuthenticated() {
        return this.token !== null;
    }
    
    // إعادة المحاولة مع تحديث التوكن
    async retryWithRefresh(requestFn) {
        try {
            return await requestFn();
        } catch (error) {
            if (error.status === 401 && this.token) {
                // محاولة تحديث التوكن
                await this.refreshToken();
                // إعادة المحاولة
                return await requestFn();
            }
            throw error;
        }
    }
    
    // إلغاء الطلبات
    createCancelToken() {
        const controller = new AbortController();
        return {
            signal: controller.signal,
            cancel: () => controller.abort()
        };
    }
    
    // ذاكرة التخزين المؤقت
    async cachedGet(endpoint, params = {}, cacheTime = 300000) { // 5 دقائق افتراضياً
        const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
        const cached = this.getFromCache(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < cacheTime) {
            return cached.data;
        }
        
        const data = await this.get(endpoint, params);
        this.saveToCache(cacheKey, data);
        
        return data;
    }
    
    getFromCache(key) {
        try {
            const cached = localStorage.getItem(`cache_${key}`);
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    }
    
    saveToCache(key, data) {
        try {
            const cacheItem = {
                data: data,
                timestamp: Date.now()
            };
            localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
        } catch (error) {
            console.warn('فشل حفظ الذاكرة المؤقتة:', error);
        }
    }
    
    clearCache(pattern = '') {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('cache_') && key.includes(pattern)) {
                localStorage.removeItem(key);
            }
        });
    }
    
    // التعامل مع الاتصال
    async checkConnection() {
        try {
            const response = await fetch(`${this.baseURL}/health`, {
                method: 'HEAD',
                timeout: 5000
            });
            
            return response.ok;
        } catch {
            return false;
        }
    }
    
    // وضع عدم الاتصال
    async queueRequest(method, endpoint, data) {
        const queue = this.getRequestQueue();
        const request = {
            id: Date.now().toString(),
            method,
            endpoint,
            data,
            timestamp: new Date().toISOString(),
            retries: 0
        };
        
        queue.push(request);
        this.saveRequestQueue(queue);
        
        // محاولة المزامنة إذا كان هناك اتصال
        if (await this.checkConnection()) {
            this.processQueue();
        }
    }
    
    getRequestQueue() {
        try {
            return JSON.parse(localStorage.getItem('request_queue') || '[]');
        } catch {
            return [];
        }
    }
    
    saveRequestQueue(queue) {
        localStorage.setItem('request_queue', JSON.stringify(queue));
    }
    
    async processQueue() {
        const queue = this.getRequestQueue();
        const successful = [];
        
        for (const request of queue) {
            try {
                await this.executeQueuedRequest(request);
                successful.push(request.id);
            } catch (error) {
                request.retries++;
                if (request.retries >= 3) {
                    // إزالة الطلبات الفاشلة بعد 3 محاولات
                    successful.push(request.id);
                }
            }
        }
        
        // إزالة الطلبات الناجحة
        const newQueue = queue.filter(req => !successful.includes(req.id));
        this.saveRequestQueue(newQueue);
    }
    
    async executeQueuedRequest(request) {
        switch (request.method) {
            case 'POST':
                return await this.post(request.endpoint, request.data);
            case 'PUT':
                return await this.put(request.endpoint, request.data);
            case 'DELETE':
                return await this.delete(request.endpoint);
            default:
                throw new Error(`Method ${request.method} not supported in queue`);
        }
    }
}

// إنشاء نسخة واحدة من خدمة API
const apiService = new APIService();

// جعل الدوال متاحة عالمياً
window.api = apiService;
window.API = APIService;
