// ===== AUTHENTICATION MODULE =====

class Auth {
    constructor() {
        this.currentUser = null;
        this.init();
    }
    
    init() {
        this.loadUser();
        this.setupAuthForms();
    }
    
    // تحميل بيانات المستخدم من localStorage
    loadUser() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUI();
        }
    }
    
    // حفظ بيانات المستخدم
    saveUser(user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.updateUI();
    }
    
    // تحديث واجهة المستخدم
    updateUI() {
        const loginBtn = document.querySelector('.login-btn');
        const userMenu = document.getElementById('userMenu');
        
        if (this.currentUser && loginBtn) {
            loginBtn.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <span>${this.currentUser.name}</span>
                <i class="fas fa-chevron-down"></i>
            `;
            loginBtn.href = "dashboard.html";
            
            // إضافة قائمة المستخدم
            if (userMenu) {
                userMenu.style.display = 'block';
            }
        }
    }
    
    // إعداد نماذج المصادقة
    setupAuthForms() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }
    
    // معالجة تسجيل الدخول
    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const remember = document.getElementById('rememberMe').checked;
        
        // التحقق من الحقول
        if (!this.validateEmail(email)) {
            this.showError('loginError', 'البريد الإلكتروني غير صالح');
            return;
        }
        
        if (password.length < 6) {
            this.showError('loginError', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }
        
        // محاكاة تسجيل الدخول (في الواقع ستتصل بالخادم)
        this.showLoading('loginBtn');
        
        setTimeout(() => {
            const user = {
                id: 1,
                name: 'أحمد محمد',
                email: email,
                type: localStorage.getItem('userType') || 'student',
                avatar: 'assets/images/avatar.png'
            };
            
            this.saveUser(user);
            this.hideLoading('loginBtn');
            
            // إشعار النجاح
            showNotification('🎉 تم تسجيل الدخول بنجاح!', 'success');
            
            // إعادة التوجيه
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        }, 2000);
    }
    
    // معالجة التسجيل
    handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const userType = document.getElementById('registerType').value;
        
        // التحقق من الحقول
        if (!name || name.length < 3) {
            this.showError('registerError', 'الاسم يجب أن يكون 3 أحرف على الأقل');
            return;
        }
        
        if (!this.validateEmail(email)) {
            this.showError('registerError', 'البريد الإلكتروني غير صالح');
            return;
        }
        
        if (!this.validatePhone(phone)) {
            this.showError('registerError', 'رقم الهاتف غير صالح');
            return;
        }
        
        if (password.length < 6) {
            this.showError('registerError', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showError('registerError', 'كلمات المرور غير متطابقة');
            return;
        }
        
        // محاكاة التسجيل
        this.showLoading('registerBtn');
        
        setTimeout(() => {
            const user = {
                id: Date.now(),
                name: name,
                email: email,
                phone: phone,
                type: userType,
                avatar: 'assets/images/avatar.png',
                joined: new Date().toISOString()
            };
            
            this.saveUser(user);
            this.hideLoading('registerBtn');
            
            // حفظ نوع المستخدم
            localStorage.setItem('userType', userType);
            
            showNotification('🎉 تم إنشاء الحساب بنجاح!', 'success');
            
            // إعادة التوجيه
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        }, 2000);
    }
    
    // تسجيل الخروج
    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-user"></i><span>دخول</span>';
            loginBtn.href = "login.html";
        }
        
        showNotification('تم تسجيل الخروج بنجاح', 'info');
        
        // إعادة التوجيه للصفحة الرئيسية
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
    
    // التحقق من البريد الإلكتروني
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // التحقق من رقم الهاتف
    validatePhone(phone) {
        const re = /^[0-9]{10}$/;
        return re.test(phone);
    }
    
    // عرض خطأ
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        }
    }
    
    // عرض حالة التحميل
    showLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.innerHTML = '<div class="loading"></div> جاري المعالجة...';
            button.disabled = true;
        }
    }
    
    // إخفاء حالة التحميل
    hideLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            const originalText = buttonId === 'loginBtn' ? 'تسجيل الدخول' : 'إنشاء حساب';
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }
    
    // التحقق إذا كان المستخدم مسجل الدخول
    isAuthenticated() {
        return this.currentUser !== null;
    }
    
    // الحصول على بيانات المستخدم
    getUser() {
        return this.currentUser;
    }
}

// إنشاء نسخة واحدة من Auth
const auth = new Auth();

// جعل الدوال متاحة عالمياً
window.auth = auth;
window.logout = () => auth.logout();
