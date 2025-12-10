// ===== DASHBOARD MODULE =====

class Dashboard {
    constructor() {
        this.currentUser = null;
        this.properties = [];
        this.init();
    }
    
    init() {
        this.checkAuth();
        this.loadUserData();
        this.setupDashboard();
        this.loadDashboardData();
    }
    
    // التحقق من المصادقة
    checkAuth() {
        const userData = localStorage.getItem('currentUser');
        if (!userData) {
            window.location.href = 'login.html';
            return;
        }
        
        this.currentUser = JSON.parse(userData);
    }
    
    // تحميل بيانات المستخدم
    loadUserData() {
        // تحديث واجهة المستخدم
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userAvatar = document.getElementById('userAvatar');
        
        if (userName) userName.textContent = this.currentUser.name;
        if (userEmail) userEmail.textContent = this.currentUser.email;
        if (userAvatar && this.currentUser.avatar) {
            userAvatar.src = this.currentUser.avatar;
        }
    }
    
    // إعداد لوحة التحكم
    setupDashboard() {
        this.setupSidebar();
        this.setupCharts();
        this.setupNotifications();
        this.setupQuickActions();
    }
    
    // إعداد الشريط الجانبي
    setupSidebar() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        
        // حدث النقر على روابط الشريط
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // تحميل المحتوى المناسب
                const section = link.dataset.section;
                if (section) {
                    this.loadSection(section);
                }
            });
        });
        
        // زر فتح/إغلاق الشريط (للجوال)
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                document.querySelector('.dashboard-sidebar').classList.toggle('active');
            });
        }
    }
    
    // إعداد الرسوم البيانية
    setupCharts() {
        // يمكنك استخدام مكتبة مثل Chart.js هنا
        // هذا مثال مبسط
        this.createStatsChart();
        this.createIncomeChart();
    }
    
    // إنشاء مخطط الإحصائيات
    createStatsChart() {
        const ctx = document.getElementById('statsChart');
        if (!ctx) return;
        
        // سيتم استبدال هذا بـ Chart.js
        console.log('تهيئة مخطط الإحصائيات...');
    }
    
    // إنشاء مخطط الدخل
    createIncomeChart() {
        const ctx = document.getElementById('incomeChart');
        if (!ctx) return;
        
        // سيتم استبدال هذا بـ Chart.js
        console.log('تهيئة مخطط الدخل...');
    }
    
    // إعداد الإشعارات
    setupNotifications() {
        const notificationBtn = document.querySelector('.notifications');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => this.showNotifications());
        }
        
        // تحميل الإشعارات
        this.loadNotifications();
    }
    
    // تحميل الإشعارات
    loadNotifications() {
        const notifications = [
            {
                id: 1,
                type: 'booking',
                title: 'حجز جديد',
                message: 'طلب حجز جديد لشقتك في الدار البيضاء',
                time: 'منذ 5 دقائق',
                read: false
            },
            {
                id: 2,
                type: 'message',
                title: 'رسالة جديدة',
                message: 'لديك رسالة من أحمد',
                time: 'منذ ساعة',
                read: false
            },
            {
                id: 3,
                type: 'payment',
                title: 'دفع مستلم',
                message: 'تم استلام دفعة شهرية بقيمة 1800 درهم',
                time: 'منذ يوم',
                read: true
            }
        ];
        
        // تحديث العداد
        const unreadCount = notifications.filter(n => !n.read).length;
        this.updateNotificationCount(unreadCount);
        
        // عرض الإشعارات
        this.displayNotifications(notifications);
    }
    
    // تحديث عداد الإشعارات
    updateNotificationCount(count) {
        const counter = document.querySelector('.notification-count');
        if (counter) {
            counter.textContent = count;
            counter.style.display = count > 0 ? 'flex' : 'none';
        }
    }
    
    // عرض الإشعارات
    displayNotifications(notifications) {
        const container = document.getElementById('notificationsList');
        if (!container) return;
        
        container.innerHTML = notifications.map(notif => `
            <div class="notification-item ${notif.read ? 'read' : 'unread'}">
                <div class="notification-icon ${notif.type}">
                    <i class="fas fa-${this.getNotificationIcon(notif.type)}"></i>
                </div>
                <div class="notification-content">
                    <h4>${notif.title}</h4>
                    <p>${notif.message}</p>
                    <span class="notification-time">${notif.time}</span>
                </div>
                ${!notif.read ? '<div class="notification-dot"></div>' : ''}
            </div>
        `).join('');
    }
    
    // الحصول على أيقونة الإشعار
    getNotificationIcon(type) {
        const icons = {
            booking: 'calendar-check',
            message: 'envelope',
            payment: 'money-bill-wave',
            warning: 'exclamation-triangle',
            success: 'check-circle'
        };
        return icons[type] || 'bell';
    }
    
    // عرض نافذة الإشعارات
    showNotifications() {
        const modal = document.getElementById('notificationsModal');
        if (modal) {
            modal.style.display = 'block';
            
            // قراءة جميع الإشعارات
            this.markAllAsRead();
        }
    }
    
    // تعليم جميع الإشعارات كمقروءة
    markAllAsRead() {
        this.updateNotificationCount(0);
    }
    
    // إعداد الإجراءات السريعة
    setupQuickActions() {
        const actions = document.querySelectorAll('.quick-action-btn');
        actions.forEach(action => {
            action.addEventListener('click', () => {
                const actionType = action.dataset.action;
                this.handleQuickAction(actionType);
            });
        });
    }
    
    // معالجة الإجراءات السريعة
    handleQuickAction(action) {
        switch (action) {
            case 'add-property':
                window.location.href = 'add-property.html';
                break;
                
            case 'view-bookings':
                this.loadSection('bookings');
                break;
                
            case 'edit-profile':
                this.showEditProfile();
                break;
                
            case 'settings':
                this.showSettings();
                break;
        }
    }
    
    // تحميل قسم معين
    loadSection(section) {
        // إخفاء جميع الأقسام
        document.querySelectorAll('.dashboard-section').forEach(sec => {
            sec.style.display = 'none';
        });
        
        // إظهار القسم المطلوب
        const targetSection = document.getElementById(`${section}Section`);
        if (targetSection) {
            targetSection.style.display = 'block';
            
            // تحميل بيانات القسم
            this.loadSectionData(section);
        }
    }
    
    // تحميل بيانات القسم
    loadSectionData(section) {
        switch (section) {
            case 'properties':
                this.loadUserProperties();
                break;
                
            case 'bookings':
                this.loadBookings();
                break;
                
            case 'messages':
                this.loadMessages();
                break;
                
            case 'analytics':
                this.loadAnalytics();
                break;
        }
    }
    
    // تحميل عقارات المستخدم
    loadUserProperties() {
        // هنا ستجلب البيانات من API
        this.properties = [
            { id: 1, title: 'شقة طلابية - الدار البيضاء', status: 'active', price: 1800 },
            { id: 2, title: 'استوديو - الرباط', status: 'pending', price: 1200 },
            { id: 3, title: 'غرفة - مراكش', status: 'active', price: 900 }
        ];
        
        this.displayProperties();
    }
    
    // عرض العقارات
    displayProperties() {
        const container = document.getElementById('propertiesList');
        if (!container) return;
        
        container.innerHTML = this.properties.map(prop => `
            <tr>
                <td>
                    <div class="property-info-cell">
                        <div class="property-thumb">
                            <img src="assets/images/property${prop.id}.jpg" alt="${prop.title}">
                        </div>
                        <div class="property-details">
                            <h4>${prop.title}</h4>
                            <p>${prop.price.toLocaleString()} درهم/شهر</p>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${prop.status}">
                        ${prop.status === 'active' ? 'نشط' : 
                          prop.status === 'pending' ? 'قيد المراجعة' : 'غير نشط'}
                    </span>
                </td>
                <td>${prop.price.toLocaleString()} درهم</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn btn-view" data-id="${prop.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn btn-edit" data-id="${prop.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn btn-delete" data-id="${prop.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // إضافة أحداث للأزرار
        this.setupPropertyActions();
    }
    
    // إعداد أحداث العقارات
    setupPropertyActions() {
        // أزرار العرض
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').dataset.id;
                this.viewProperty(id);
            });
        });
        
        // أزرار التعديل
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').dataset.id;
                this.editProperty(id);
            });
        });
        
        // أزرار الحذف
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').dataset.id;
                this.deleteProperty(id);
            });
        });
    }
    
    // عرض عقار
    viewProperty(id) {
        window.location.href = `listing.html?id=${id}&owner=view`;
    }
    
    // تعديل عقار
    editProperty(id) {
        window.location.href = `add-property.html?edit=${id}`;
    }
    
    // حذف عقار
    deleteProperty(id) {
        if (confirm('هل أنت متأكد من حذف هذا العقار؟')) {
            // حذف من المصفوفة
            this.properties = this.properties.filter(p => p.id != id);
            
            // تحديث العرض
            this.displayProperties();
            
            showNotification('تم حذف العقار بنجاح', 'success');
        }
    }
    
    // تحميل الحجوزات
    loadBookings() {
        // ستجلب البيانات من API
        console.log('جاري تحميل الحجوزات...');
    }
    
    // تحميل الرسائل
    loadMessages() {
        // ستجلب البيانات من API
        console.log('جاري تحميل الرسائل...');
    }
    
    // تحميل التحليلات
    loadAnalytics() {
        // ستجلب البيانات من API
        console.log('جاري تحميل التحليلات...');
    }
    
    // تحميل بيانات لوحة التحكم
    loadDashboardData() {
        // تحديث الإحصائيات
        this.updateStats();
        
        // تحميل النشاط الأخير
        this.loadRecentActivity();
    }
    
    // تحديث الإحصائيات
    updateStats() {
        const stats = {
            properties: this.properties.length,
            bookings: 5, // سيتم جلبها من API
            messages: 12,
            income: this.properties.reduce((sum, p) => sum + p.price, 0)
        };
        
        // تحديث القيم في الواجهة
        document.querySelectorAll('.stat-number').forEach(stat => {
            const type = stat.closest('.stat-card').classList[1];
            if (stats[type]) {
                stat.textContent = type === 'income' ? 
                    `${stats[type].toLocaleString()} درهم` : 
                    stats[type];
            }
        });
    }
    
    // تحميل النشاط الأخير
    loadRecentActivity() {
        const activity = [
            {
                type: 'new-property',
                title: 'عقار جديد',
                message: 'تم إضافة شقة في الرباط',
                time: 'منذ 2 ساعة'
            },
            {
                type: 'booking',
                title: 'حجز جديد',
                message: 'تم حجز استوديو في الدار البيضاء',
                time: 'منذ 5 ساعات'
            },
            {
                type: 'message',
                title: 'رسالة جديدة',
                message: 'رسالة من طالب',
                time: 'منذ يوم'
            }
        ];
        
        this.displayRecentActivity(activity);
    }
    
    // عرض النشاط الأخير
    displayRecentActivity(activity) {
        const container = document.getElementById('recentActivity');
        if (!container) return;
        
        container.innerHTML = activity.map(item => `
            <div class="activity-item">
                <div class="activity-icon ${item.type}">
                    <i class="fas fa-${this.getActivityIcon(item.type)}"></i>
                </div>
                <div class="activity-content">
                    <h4>${item.title}</h4>
                    <p>${item.message}</p>
                    <span class="activity-time">${item.time}</span>
                </div>
            </div>
        `).join('');
    }
    
    // الحصول على أيقونة النشاط
    getActivityIcon(type) {
        const icons = {
            'new-property': 'home',
            'booking': 'calendar-check',
            'message': 'envelope',
            'payment': 'money-bill'
        };
        return icons[type] || 'bell';
    }
    
    // عرض نموذج تعديل الملف الشخصي
    showEditProfile() {
        // يمكنك فتح نافذة منبثقة أو توجيه لصفحة التعديل
        window.location.href = 'edit-profile.html';
    }
    
    // عرض الإعدادات
    showSettings() {
        // يمكنك فتح نافذة منبثقة أو توجيه لصفحة الإعدادات
        window.location.href = 'settings.html';
    }
    
    // تصدير البيانات
    exportData(type) {
        let data, filename;
        
        switch (type) {
            case 'properties':
                data = JSON.stringify(this.properties, null, 2);
                filename = 'عقاراتي.json';
                break;
                
            case 'bookings':
                data = JSON.stringify([], null, 2);
                filename = 'حجوزاتي.json';
                break;
                
            case 'income':
                data = 'التاريخ,المبلغ\n2024-01,1800\n2024-02,1800';
                filename = 'دخلي.csv';
                break;
        }
        
        if (data) {
            this.downloadFile(data, filename);
            showNotification('تم تصدير البيانات بنجاح', 'success');
        }
    }
    
    // تحميل الملف
    downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// تهيئة لوحة التحكم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تحقق إذا كنا في صفحة لوحة التحكم
    if (document.body.classList.contains('dashboard')) {
        const dashboard = new Dashboard();
        window.dashboard = dashboard;
    }
});
