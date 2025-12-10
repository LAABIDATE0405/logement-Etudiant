// ===== UTILITY FUNCTIONS =====

class Utils {
    // تنسيق التاريخ
    static formatDate(date, format = 'ar-SA') {
        const d = new Date(date);
        return d.toLocaleDateString(format, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // تنسيق المبلغ
    static formatCurrency(amount, currency = 'MAD') {
        return new Intl.NumberFormat('ar-SA', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0
        }).format(amount);
    }
    
    // تقصير النص
    static truncateText(text, length = 100) {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    }
    
    // إنشاء معرف فريد
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // نسخ للنصوص
    static copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('تم النسخ إلى الحافظة', 'success');
        }).catch(err => {
            console.error('فشل النسخ: ', err);
        });
    }
    
    // تحميل الصور بكسل
    static lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // تحديد موقع المستخدم
    static getLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject('المتصفح لا يدعم تحديد الموقع');
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                error => {
                    reject('فشل في الحصول على الموقع: ' + error.message);
                }
            );
        });
    }
    
    // التحقق من الاتصال بالإنترنت
    static checkOnlineStatus() {
        return navigator.onLine;
    }
    
    // تخزين البيانات محلياً
    static saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('فشل الحفظ في التخزين المحلي:', e);
            return false;
        }
    }
    
    // استرجاع البيانات من التخزين المحلي
    static loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('فشل قراءة التخزين المحلي:', e);
            return null;
        }
    }
    
    // إزالة البيانات من التخزين المحلي
    static removeFromStorage(key) {
        localStorage.removeItem(key);
    }
    
    // التمرير السلس
    static smoothScroll(target, offset = 0) {
        const element = typeof target === 'string' ? 
            document.querySelector(target) : target;
        
        if (element) {
            window.scrollTo({
                top: element.offsetTop - offset,
                behavior: 'smooth'
            });
        }
    }
    
    // الفتح في نافذة جديدة
    static openInNewTab(url) {
        window.open(url, '_blank');
    }
    
    // تحميل JSON
    static async fetchJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('فشل في جلب البيانات');
            return await response.json();
        } catch (error) {
            console.error('خطأ في تحميل JSON:', error);
            return null;
        }
    }
    
    // إرسال POST
    static async postJSON(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) throw new Error('فشل في إرسال البيانات');
            return await response.json();
        } catch (error) {
            console.error('خطأ في إرسال POST:', error);
            return null;
        }
    }
    
    // إخفاء/إظهار العنصر
    static toggleElement(element, show = null) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (element) {
            if (show === null) {
                element.classList.toggle('hidden');
            } else if (show) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        }
    }
    
    // إضافة فئة مع وقت انتهاء
    static addClassTemporary(element, className, duration = 3000) {
        element.classList.add(className);
        setTimeout(() => {
            element.classList.remove(className);
        }, duration);
    }
    
    // إزالة الأحرف الخاصة
    static sanitizeInput(input) {
        return input.replace(/[<>]/g, '');
    }
    
    // التحقق من صحة الرابط
    static isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    // تنسيق المدة الزمنية
    static timeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + ' سنة';
        
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + ' شهر';
        
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + ' يوم';
        
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + ' ساعة';
        
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + ' دقيقة';
        
        return Math.floor(seconds) + ' ثانية';
    }
}

// جعل الأدوات متاحة عالمياً
window.Utils = Utils;
