// ===== تهيئة الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 StudentStay - تم تحميل المنصة');
    
    // 1. التحكم بصندوق اختيار المستخدم
    initUserChoice();
    
    // 2. إعداد شريط اللغة
    initLanguageSwitcher();
    
    // 3. إعداد شريط البحث
    initSearch();
    
    // 4. إعداد الأحداث العامة
    setupGlobalEvents();
    
    // 5. تحميل البيانات الأولية
    loadInitialData();
});

// ===== 1. إدارة صندوق اختيار المستخدم =====
function initUserChoice() {
    const modal = document.getElementById('userChoiceModal');
    const userChoice = localStorage.getItem('userType');
    
    // إذا لم يختر المستخدم مسبقاً، عرض الصندوق
    if (!userChoice && modal) {
        modal.classList.remove('hidden');
        modal.classList.add('show');
    } else {
        // تحديث العرض حسب الاختيار السابق
        updateUserTypeDisplay(userChoice);
    }
    
    // ربط أحداث الاختيار
    setupChoiceEvents();
}

function setupChoiceEvents() {
    // اختيار الطالب
    const studentCard = document.querySelector('.choice-card.student');
    if (studentCard) {
        studentCard.addEventListener('click', function() {
            selectUserType('student');
        });
    }
    
    // اختيار صاحب العقار
    const ownerCard = document.querySelector('.choice-card.owner');
    if (ownerCard) {
        ownerCard.addEventListener('click', function() {
            selectUserType('owner');
        });
    }
    
    // تخطي (زائر)
    const skipBtn = document.querySelector('.skip-choice');
    if (skipBtn) {
        skipBtn.addEventListener('click', function(e) {
            e.preventDefault();
            selectUserType('visitor');
        });
    }
}

function selectUserType(type) {
    // حفظ الاختيار
    localStorage.setItem('userType', type);
    
    // إخفاء الصندوق
    const modal = document.getElementById('userChoiceModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('show');
    }
    
    // تحديث العرض في الشريط
    updateUserTypeDisplay(type);
    
    // إشعار ترحيبي
    showNotification(getWelcomeMessage(type), 'success');
}

function updateUserTypeDisplay(type) {
    const display = document.getElementById('currentUserType');
    if (!display) return;
    
    // إزالة الأنماط القديمة
    display.classList.remove('student-mode', 'owner-mode', 'visitor-mode');
    
    // إضافة النمط الجديد
    display.classList.add(`${type}-mode`);
    
    // تحديث المحتوى
    const content = {
        student: '<i class="fas fa-graduation-cap"></i> وضع الطالب',
        owner: '<i class="fas fa-user-tie"></i> وضع صاحب العقار',
        visitor: '<i class="fas fa-user"></i> زائر'
    };
    
    display.innerHTML = content[type] || content.visitor;
    
    // إضافة حدث النقر لتغيير الوضع
    display.onclick = function() {
        localStorage.removeItem('userType');
        const modal = document.getElementById('userChoiceModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('show');
        }
    };
}

function getWelcomeMessage(type) {
    const messages = {
        student: '🎓 مرحباً بك كطالب! يمكنك الآن البحث عن سكن يناسبك.',
        owner: '👔 مرحباً بك كصاحب عقار! يمكنك الآن إضافة سكنك للطلاب.',
        visitor: '👋 مرحباً بك كزائر! يمكنك تصفح المنصة.'
    };
    return messages[type] || messages.visitor;
}

// ===== 2. شريط اللغة =====
function initLanguageSwitcher() {
    const langBtns = document.querySelectorAll('.lang-btn');
    const savedLang = localStorage.getItem('language') || 'ar';
    
    // تحديث الزر النشط
    langBtns.forEach(btn => {
        if (btn.textContent.includes(savedLang === 'ar' ? 'عربي' : 
                                   savedLang === 'fr' ? 'Français' : 'English')) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', function() {
            // إزالة النشط من الجميع
            langBtns.forEach(b => b.classList.remove('active'));
            // إضافة النشط للزر المضغوط
            this.classList.add('active');
            
            // تحديد اللغة
            let lang = 'ar';
            if (this.textContent.includes('Français')) lang = 'fr';
            if (this.textContent.includes('English')) lang = 'en';
            
            // حفظ اللغة
            localStorage.setItem('language', lang);
            
            // إشعار
            showNotification(getLanguageMessage(lang), 'info');
        });
    });
}

function getLanguageMessage(lang) {
    const messages = {
        ar: '✅ تم التبديل إلى اللغة العربية',
        fr: '✅ Langue changée en français',
        en: '✅ Language switched to English'
    };
    return messages[lang] || messages.ar;
}

// ===== 3. البحث =====
function initSearch() {
    const searchBtn = document.querySelector('.search-button');
    const budgetSlider = document.getElementById('budgetSlider');
    const budgetValue = document.getElementById('budgetValue');
    
    // تحديث قيمة الميزانية
    if (budgetSlider && budgetValue) {
        budgetSlider.addEventListener('input', function() {
            budgetValue.textContent = `${this.value} درهم`;
        });
    }
    
    // حدث البحث
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
}

function performSearch() {
    const city = document.querySelector('input[placeholder*="المدينة"]').value;
    const type = document.querySelector('select').value;
    const budget = document.getElementById('budgetSlider').value;
    
    showNotification(`🔍 جاري البحث عن سكن في ${city || 'كل المدن'} بميزانية ${budget} درهم`);
    
    // هنا يمكنك إضافة البحث الفعلي
    setTimeout(() => {
        showNotification('✅ تم العثور على 15 سكن', 'success');
    }, 1000);
}

// ===== 4. الأحداث العامة =====
function setupGlobalEvents() {
    // جميع أزرار "عرض التفاصيل"
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('🔍 جاري تحميل تفاصيل السكن...');
            // هنا يمكنك توجيه المستخدم لصفحة التفاصيل
        });
    });
    
    // زر "عرض المزيد"
    const showMoreBtn = document.querySelector('.show-more-btn');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', loadMoreProperties);
    }
    
    // زر "نشر الإعلان"
    const publishBtn = document.querySelector('.publish-btn');
    if (publishBtn) {
        publishBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('📤 جاري نشر إعلانك...', 'info');
            // هنا يمكنك إرسال النموذج
        });
    }
}

// ===== 5. تحميل البيانات =====
function loadInitialData() {
    // يمكنك هنا جلب بيانات من API
    console.log('جاري تحميل البيانات الأولية...');
}

function loadMoreProperties() {
    showNotification('🔄 جاري تحميل المزيد من السكن...');
    
    setTimeout(() => {
        showNotification('✅ تم تحميل 3 عقارات إضافية', 'success');
    }, 1500);
}

// ===== دالة الإشعارات المساعدة =====
function showNotification(message, type = 'info') {
    // إنشاء العنصر
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // الألوان حسب النوع
    const colors = {
        info: '#4361ee',
        success: '#06d6a0',
        warning: '#ffd166',
        error: '#ef233c'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // التصميم
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 350px;
        font-weight: 500;
    `;
    
    // زر الإغلاق
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1.5rem;
        margin-right: 10px;
        padding: 0;
    `;
    
    closeBtn.addEventListener('click', function() {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // إضافة للصفحة
    document.body.appendChild(notification);
    
    // إزالة تلقائية
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== إضافة أنيميشن CSS ديناميكي =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .hidden {
        display: none !important;
    }
    
    .show {
        display: flex !important;
    }
`;
document.head.appendChild(style);

// ===== جعل الدوال متاحة عالمياً =====
window.selectUserType = selectUserType;
window.skipChoice = function() { selectUserType('visitor'); };
window.changeLanguage = function(lang) {
    // يمكنك توسيع هذه الدالة لتحميل الترجمة
    localStorage.setItem('language', lang);
    showNotification(getLanguageMessage(lang), 'success');
};
