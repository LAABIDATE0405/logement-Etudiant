// ===== NOTIFICATION SYSTEM =====

class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.unreadCount = 0;
        this.init();
    }
    
    init() {
        this.loadNotifications();
        this.setupNotificationCenter();
        this.setupPushNotifications();
    }
    
    // تحميل الإشعارات من التخزين المحلي
    loadNotifications() {
        const saved = localStorage.getItem('notifications');
        if (saved) {
            this.notifications = JSON.parse(saved);
            this.updateUnreadCount();
        }
    }
    
    // حفظ الإشعارات
    saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }
    
    // إعداد مركز الإشعارات
    setupNotificationCenter() {
        // زر الإشعارات
        const notificationBtn = document.querySelector('.notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => this.toggleNotificationCenter());
        }
        
        // تحديث العداد
        this.updateBadge();
        
        // تحميل الإشعارات في الواجهة
        this.renderNotifications();
    }
    
    // إعداد الإشعارات الفورية (Push)
    setupPushNotifications() {
        // التحقق من دعم الإشعارات
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                this.requestNotificationPermission();
            }
        }
    }
    
    // طلب إذن الإشعارات
    requestNotificationPermission() {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showNotification('تم تفعيل الإشعارات!', 'سيتم إعلامك بالتحديثات الهامة.');
                }
            });
        }
    }
    
    // إنشاء إشعار جديد
    createNotification(title, message, type = 'info', data = {}) {
        const notification = {
            id: Date.now().toString(),
            title: title,
            message: message,
            type: type,
            data: data,
            timestamp: new Date().toISOString(),
            read: false,
            icon: this.getNotificationIcon(type)
        };
        
        // إضافة للإشعارات
        this.notifications.unshift(notification); // الأحدث أولاً
        this.unreadCount++;
        
        // حفظ
        this.saveNotifications();
        
        // تحديث الواجهة
        this.updateBadge();
        this.renderNotifications();
        
        // عرض إشعار فوري
        this.showPushNotification(notification);
        
        // لعب صوت الإشعار
        this.playNotificationSound();
        
        return notification.id;
    }
    
    // عرض إشعار فوري
    showPushNotification(notification) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const options = {
                body: notification.message,
                icon: notification.icon,
                badge: '/assets/icons/badge.png',
                tag: 'studentstay-notification',
                data: notification.data
            };
            
            new Notification(notification.title, options).onclick = () => {
                this.handleNotificationClick(notification);
            };
        }
        
        // عرض إشعار في الواجهة أيضاً
        this.showInAppNotification(notification);
    }
    
    // عرض إشعار في التطبيق
    showInAppNotification(notification) {
        const notificationElement = document.createElement('div');
        notificationElement.className = `in-app-notification ${notification.type}`;
        notificationElement.dataset.id = notification.id;
        
        notificationElement.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${this.getNotificationIconClass(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <span class="notification-time">الآن</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // التصميم
        notificationElement.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            padding: 15px;
            display: flex;
            align-items: center;
            gap: 15px;
            width: 350px;
            z-index: 9998;
            animation: slideInRight 0.3s ease;
            border-left: 4px solid ${this.getNotificationColor(notification.type)};
        `;
        
        // زر الإغلاق
        const closeBtn = notificationElement.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notificationElement.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notificationElement.remove(), 300);
        });
        
        // النقر على الإشعار
        notificationElement.addEventListener('click', (e) => {
            if (!e.target.closest('.notification-close')) {
                this.handleNotificationClick(notification);
            }
        });
        
        // إضافة للصفحة
        document.body.appendChild(notificationElement);
        
        // إزالة تلقائية بعد 8 ثواني
        setTimeout(() => {
            if (notificationElement.parentElement) {
                notificationElement.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notificationElement.remove(), 300);
            }
        }, 8000);
    }
    
    // تحديث شارة العداد
    updateBadge() {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = this.unreadCount;
            badge.style.display = this.unreadCount > 0 ? 'flex' : 'none';
        }
    }
    
    // عرض/إخفاء مركز الإشعارات
    toggleNotificationCenter() {
        const center = document.getElementById('notificationCenter');
        if (center) {
            center.classList.toggle('active');
            
            if (center.classList.contains('active')) {
                this.markAllAsRead();
            }
        }
    }
    
    // عرض جميع الإشعارات
    renderNotifications() {
        const container = document.getElementById('notificationsContainer');
        if (!container) return;
        
        if (this.notifications.length === 0) {
            container.innerHTML = `
                <div class="no-notifications">
                    <i class="fas fa-bell-slash"></i>
                    <p>لا توجد إشعارات</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.notifications.map(notif => `
            <div class="notification-item ${notif.read ? 'read' : 'unread'}" data-id="${notif.id}">
                <div class="notification-icon ${notif.type}">
                    <i class="fas fa-${this.getNotificationIconClass(notif.type)}"></i>
                </div>
                <div class="notification-content">
                    <h4>${notif.title}</h4>
                    <p>${notif.message}</p>
                    <div class="notification-meta">
                        <span class="notification-time">${Utils.timeAgo(notif.timestamp)}</span>
                        ${!notif.read ? '<span class="notification-new">جديد</span>' : ''}
                    </div>
                </div>
                <button class="notification-action" data-id="${notif.id}">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </div>
        `).join('');
        
        // إضافة الأحداث
        this.setupNotificationEvents();
    }
    
    // إعداد أحداث الإشعارات
    setupNotificationEvents() {
        // النقر على الإشعار
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.notification-action')) {
                    const id = item.dataset.id;
                    this.markAsRead(id);
                    this.handleNotificationClick(this.getNotificationById(id));
                }
            });
        });
        
        // زر الإجراءات
        document.querySelectorAll('.notification-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                this.showNotificationActions(id, btn);
            });
        });
        
        // زر حذف الكل
        const clearAllBtn = document.querySelector('.clear-all-notifications');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.clearAllNotifications());
        }
        
        // زر قراءة الكل
        const markAllReadBtn = document.querySelector('.mark-all-read');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => this.markAllAsRead());
        }
    }
    
    // التعامل مع نقر الإشعار
    handleNotificationClick(notification) {
        if (!notification || !notification.data) return;
        
        // إغلاق مركز الإشعارات
        const center = document.getElementById('notificationCenter');
        if (center) center.classList.remove('active');
        
        // التنقل حسب نوع الإشعار
        switch (notification.type) {
            case 'booking':
                if (notification.data.bookingId) {
                    window.location.href = `dashboard.html?section=bookings&id=${notification.data.bookingId}`;
                }
                break;
                
            case 'message':
                if (notification.data.messageId) {
                    window.location.href = `dashboard.html?section=messages&id=${notification.data.messageId}`;
                }
                break;
                
            case 'property':
                if (notification.data.propertyId) {
                    window.location.href = `listing.html?id=${notification.data.propertyId}`;
                }
                break;
                
            default:
                // التنقل العام
                if (notification.data.url) {
                    window.location.href = notification.data.url;
                }
        }
    }
    
    // عرض إجراءات الإشعار
    showNotificationActions(id, button) {
        // إخفاء أي قوائم مفتوحة
        document.querySelectorAll('.notification-actions-menu').forEach(menu => {
            menu.remove();
        });
        
        // إنشاء القائمة
        const menu = document.createElement('div');
        menu.className = 'notification-actions-menu';
        menu.innerHTML = `
            <button class="action-btn mark-read" data-id="${id}">
                <i class="fas fa-check"></i> تعليم كمقروء
            </button>
            <button class="action-btn delete-notification" data-id="${id}">
                <i class="fas fa-trash"></i> حذف
            </button>
        `;
        
        // التصميم
        const rect = button.getBoundingClientRect();
        menu.style.cssText = `
            position: absolute;
            top: ${rect.bottom + 5}px;
            right: ${rect.right - 150}px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            padding: 10px 0;
            min-width: 150px;
            z-index: 9999;
        `;
        
        // الأحداث
        menu.querySelector('.mark-read').addEventListener('click', (e) => {
            e.stopPropagation();
            this.markAsRead(id);
            menu.remove();
        });
        
        menu.querySelector('.delete-notification').addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteNotification(id);
            menu.remove();
        });
        
        // إضافة للصفحة
        document.body.appendChild(menu);
        
        // إغلاق عند النقر خارج القائمة
        setTimeout(() => {
            const closeMenu = (e) => {
                if (!menu.contains(e.target) && !button.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            };
            document.addEventListener('click', closeMenu);
        });
    }
    
    // تعليم إشعار كمقروء
    markAsRead(id) {
        const notification = this.getNotificationById(id);
        if (notification && !notification.read) {
            notification.read = true;
            this.unreadCount = Math.max(0, this.unreadCount - 1);
            this.saveNotifications();
            this.updateBadge();
            this.renderNotifications();
        }
    }
    
    // تعليم الكل كمقروء
    markAllAsRead() {
        this.notifications.forEach(notif => notif.read = true);
        this.unreadCount = 0;
        this.saveNotifications();
        this.updateBadge();
        this.renderNotifications();
    }
    
    // حذف إشعار
    deleteNotification(id) {
        this.notifications = this.notifications.filter(notif => notif.id !== id);
        this.updateUnreadCount();
        this.saveNotifications();
        this.renderNotifications();
    }
    
    // حذف جميع الإشعارات
    clearAllNotifications() {
        if (confirm('هل تريد حذف جميع الإشعارات؟')) {
            this.notifications = [];
            this.unreadCount = 0;
            this.saveNotifications();
            this.renderNotifications();
            showNotification('تم حذف جميع الإشعارات', 'success');
        }
    }
    
    // الحصول على إشعار بالمعرف
    getNotificationById(id) {
        return this.notifications.find(notif => notif.id === id);
    }
    
    // تحديث عدد غير المقروء
    updateUnreadCount() {
        this.unreadCount = this.notifications.filter(notif => !notif.read).length;
    }
    
    // الحصول على أيقونة الإشعار
    getNotificationIcon(type) {
        const icons = {
            info: '/assets/icons/info.png',
            success: '/assets/icons/success.png',
            warning: '/assets/icons/warning.png',
            error: '/assets/icons/error.png',
            booking: '/assets/icons/booking.png',
            message: '/assets/icons/message.png'
        };
        return icons[type] || icons.info;
    }
    
    // الحصول على فئة الأيقونة
    getNotificationIconClass(type) {
        const icons = {
            info: 'info-circle',
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle',
            booking: 'calendar-check',
            message: 'envelope'
        };
        return icons[type] || 'bell';
    }
    
    // الحصول على لون الإشعار
    getNotificationColor(type) {
        const colors = {
            info: '#4361ee',
            success: '#06d6a0',
            warning: '#ffd166',
            error: '#ef233c',
            booking: '#7209b7',
            message: '#3a86ff'
        };
        return colors[type] || '#4361ee';
    }
    
    // لعب صوت الإشعار
    playNotificationSound() {
        try {
            const audio = new Audio('/assets/sounds/notification.mp3');
            audio.volume = 0.3;
            audio.play().catch(e => console.log('لا يمكن تشغيل الصوت:', e));
        } catch (e) {
            // استخدم صوت افتراضي
            console.log('استخدم صوت الإشعار الافتراضي');
        }
    }
    
    // إشعارات افتراضية للتجربة
    createSampleNotifications() {
        if (this.notifications.length === 0) {
            this.createNotification(
                'مرحباً بك في StudentStay!',
                'يمكنك الآن البحث عن سكن طلابي يناسبك.',
                'info',
                { url: 'index.html#search' }
            );
            
            setTimeout(() => {
                this.createNotification(
                    'خصم خاص للطلاب',
                    'احصل على خصم 20% على أول حجز لك',
                    'success',
                    { url: 'offers.html' }
                );
            }, 2000);
            
            setTimeout(() => {
                this.createNotification(
                    'اكمل ملفك الشخصي',
                    'أكمل معلومات حسابك للحصول على تجربة أفضل',
                    'warning',
                    { url: 'dashboard.html?section=profile' }
                );
            }, 4000);
        }
    }
}

// إنشاء نسخة واحدة من نظام الإشعارات
const notificationSystem = new NotificationSystem();

// جعل الدوال متاحة عالمياً
window.notificationSystem = notificationSystem;
window.showNotification = (title, message, type = 'info', data = {}) => {
    return notificationSystem.createNotification(title, message, type, data);
};
