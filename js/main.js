// ===== MULTI-LANGUAGE & PAYMENT INTEGRATION =====

// ===== تهيئة الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 StudentStay - تم تحميل المنصة');
    
    // 0. تهيئة نظام اللغات والدفع أولاً
    initLanguageSystem();
    
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
    
    // 6. تهيئة نظام الدفع
    initPaymentSystem();
});

// ===== 0. نظام اللغات =====
let languageManager = null;

function initLanguageSystem() {
    // إنشاء مدير اللغة إذا لم يكن موجوداً
    if (typeof LanguageManager !== 'undefined') {
        languageManager = new LanguageManager();
        console.log('🌍 نظام اللغات جاهز');
        
        // جعل الدوال متاحة عالمياً
        window.translate = (key, defaultValue = '') => languageManager.translate(key, defaultValue);
        window.changeLanguage = (lang) => languageManager.changeLanguage(lang);
    }
}

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
    localStorage.setItem('userTypeSelected', 'true');
    
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
    
    // إذا كان صاحب عقار، عرض خيارات الاشتراك
    if (type === 'owner') {
        setTimeout(() => {
            showSubscriptionOptions();
        }, 1000);
    }
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
    
    // إضافة شارة الباقة إذا كان صاحب عقار
    if (type === 'owner') {
        const plan = localStorage.getItem('userSubscription');
        if (plan && plan !== 'none') {
            const planBadge = document.createElement('span');
            planBadge.className = 'plan-badge';
            planBadge.textContent = plan === 'basic' ? 'بسيط' : 
                                   plan === 'premium' ? 'متميز' : 'محترف';
            planBadge.style.cssText = `
                background: ${plan === 'basic' ? '#06d6a0' : 
                            plan === 'premium' ? '#4361ee' : '#7209b7'};
                color: white;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 11px;
                margin-right: 8px;
                font-weight: bold;
            `;
            display.insertBefore(planBadge, display.firstChild);
        }
    }
    
    // إضافة حدث النقر لتغيير الوضع
    display.onclick = function() {
        localStorage.removeItem('userType');
        localStorage.removeItem('userTypeSelected');
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
            
            // تغيير اللغة باستخدام مدير اللغة
            if (window.changeLanguage) {
                window.changeLanguage(lang);
            } else {
                localStorage.setItem('language', lang);
                showNotification(getLanguageMessage(lang), 'info');
            }
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
            budgetValue.textContent = `${this.value} ${translate('payment.pricePerMonth').replace('/', '')}`;
        });
    }
    
    // حدث البحث
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
}

function performSearch() {
    const city = document.querySelector('input[placeholder*="المدينة"]')?.value || 
                 document.querySelector('input[placeholder*="City"]')?.value || 
                 document.querySelector('input[placeholder*="Ville"]')?.value || '';
    const type = document.querySelector('select')?.value || '';
    const budget = document.getElementById('budgetSlider')?.value || '1500';
    
    const searchMessage = translate('message.loading') + 
                         ` ${city || translate('text.city')} ` +
                         `${translate('text.budget')}: ${budget} ${translate('payment.pricePerMonth').replace('/', '')}`;
    
    showNotification(searchMessage);
    
    // محاكاة البحث
    setTimeout(() => {
        showNotification('✅ ' + translate('message.success'), 'success');
    }, 1000);
}

// ===== 4. الأحداث العامة =====
function setupGlobalEvents() {
    // جميع أزرار "عرض التفاصيل"
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const userType = localStorage.getItem('userType');
            
            if (userType === 'student') {
                // عرض تفاصيل الحجز مع العمولة
                showBookingDetails(this.closest('.property-card'));
            } else {
                showNotification('🔍 ' + translate('message.loading'));
            }
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
            handlePropertySubmission();
        });
    }
    
    // أزرار الاشتراك في الباقات
    document.addEventListener('click', function(e) {
        const subscribeBtn = e.target.closest('.subscribe-btn');
        if (subscribeBtn) {
            const plan = subscribeBtn.dataset.plan;
            handleSubscription(plan);
        }
    });
    
    // زر "حجز الآن" على العقارات
    document.addEventListener('click', function(e) {
        const bookBtn = e.target.closest('.book-now-btn');
        if (bookBtn) {
            const propertyCard = bookBtn.closest('.property-card');
            handleBooking(propertyCard);
        }
    });
}

// ===== 5. تحميل البيانات =====
function loadInitialData() {
    console.log('جاري تحميل البيانات الأولية...');
    
    // تحميل عدد العقارات للمستخدم إذا كان صاحب عقار
    const userType = localStorage.getItem('userType');
    if (userType === 'owner') {
        loadUserProperties();
    }
}

function loadUserProperties() {
    const propertiesCount = localStorage.getItem('userPropertiesCount') || '0';
    console.log(`عدد عقارات المستخدم: ${propertiesCount}`);
    
    // تحديث واجهة المستخدم إذا وصل للحد
    const plan = localStorage.getItem('userSubscription');
    if (plan && plan !== 'none') {
        checkPropertiesLimit(plan, parseInt(propertiesCount));
    }
}

function checkPropertiesLimit(plan, count) {
    const limits = {
        basic: 3,
        premium: 10,
        professional: Infinity
    };
    
    if (count >= limits[plan] && limits[plan] !== Infinity) {
        const addBtn = document.querySelector('[href="#add-property"]');
        if (addBtn) {
            addBtn.innerHTML = '<i class="fas fa-lock"></i><span>' + translate('btn.add') + '</span>';
            addBtn.style.opacity = '0.6';
            addBtn.onclick = function(e) {
                e.preventDefault();
                showUpgradeModal();
            };
        }
    }
}

function loadMoreProperties() {
    showNotification('🔄 ' + translate('message.loading'));
    
    setTimeout(() => {
        showNotification('✅ ' + translate('message.success'), 'success');
    }, 1500);
}

// ===== 6. نظام الدفع والاشتراكات =====
let paymentManager = null;

function initPaymentSystem() {
    if (typeof PaymentManager !== 'undefined') {
        paymentManager = new PaymentManager();
        console.log('💳 نظام الدفع جاهز');
        
        // ربط الأحداث
        setupPaymentEvents();
        
        // تحديث عرض المستخدم
        updatePaymentDisplay();
    }
}

function setupPaymentEvents() {
    // زر عرض الاشتراكات
    const subscriptionLink = document.querySelector('[data-action="show-subscriptions"]');
    if (subscriptionLink) {
        subscriptionLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSubscriptionOptions();
        });
    }
    
    // زر عرض سجل المعاملات
    const transactionsLink = document.querySelector('[data-action="show-transactions"]');
    if (transactionsLink) {
        transactionsLink.addEventListener('click', function(e) {
            e.preventDefault();
            showTransactionHistory();
        });
    }
}

function updatePaymentDisplay() {
    const userType = localStorage.getItem('userType');
    const plan = localStorage.getItem('userSubscription');
    
    if (userType === 'owner' && plan && plan !== 'none') {
        // تحديث شارة الباقة
        updateUserTypeDisplay(userType);
        
        // إضافة رابط الدفع في التنقل
        addPaymentToNavigation();
    }
}

function addPaymentToNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    // التحقق إذا كان الرابط موجود مسبقاً
    if (document.querySelector('.payment-link')) return;
    
    const paymentLink = document.createElement('a');
    paymentLink.className = 'nav-link payment-link';
    paymentLink.href = '#payment';
    paymentLink.innerHTML = '<i class="fas fa-credit-card"></i><span>' + translate('payment.title') + '</span>';
    
    // إضافة قبل زر الدخول
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        navMenu.insertBefore(paymentLink, loginBtn);
    } else {
        navMenu.appendChild(paymentLink);
    }
}

// ===== معالجة الاشتراكات =====
function showSubscriptionOptions() {
    const userType = localStorage.getItem('userType');
    if (userType !== 'owner') {
        showNotification('يجب أن تكون صاحب عقار لرؤية خيارات الاشتراك', 'warning');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div class="payment-modal-content" style="
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="margin: 0; color: #333;">
                    <i class="fas fa-crown"></i> ${translate('payment.selectPlan')}
                </h2>
                <button class="close-modal" style="
                    background: none;
                    border: none;
                    font-size: 28px;
                    cursor: pointer;
                    color: #666;
                ">&times;</button>
            </div>
            
            <div class="plans-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
                ${generateSubscriptionPlans()}
            </div>
            
            <div style="text-align: center;">
                <button class="btn-cancel" style="
                    padding: 12px 30px;
                    background: #f8f9fa;
                    color: #666;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                ">${translate('btn.cancel')}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // إغلاق النافذة
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.querySelector('.btn-cancel').onclick = () => modal.remove();
    
    // أحداث أزرار الاشتراك
    modal.querySelectorAll('.subscribe-plan-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const plan = this.dataset.plan;
            modal.remove();
            handleSubscription(plan);
        });
    });
}

function generateSubscriptionPlans() {
    const plans = {
        basic: {
            price: 99,
            features: [
                '3 عقارات كحد أقصى',
                'لوحة تحكم أساسية',
                'دعم عبر البريد',
                'إشعارات بالبريد'
            ],
            color: '#06d6a0'
        },
        premium: {
            price: 199,
            features: [
                '10 عقارات كحد أقصى',
                'عقارات مميزة',
                'دعم فوري',
                'إحصائيات متقدمة',
                'أولوية في البحث'
            ],
            color: '#4361ee'
        },
        professional: {
            price: 299,
            features: [
                'عقارات غير محدودة',
                'دعم 24/7',
                'تقرير شهري',
                'مدير عقارات شخصي',
                'أعلى ظهور في البحث'
            ],
            color: '#7209b7'
        }
    };
    
    let html = '';
    
    for (const [planId, plan] of Object.entries(plans)) {
        const isCurrent = localStorage.getItem('userSubscription') === planId;
        
        html += `
            <div class="plan-card" style="
                border: 3px solid ${plan.color};
                border-radius: 12px;
                padding: 25px;
                background: white;
                position: relative;
                ${isCurrent ? 'box-shadow: 0 0 0 3px ' + plan.color + ';' : ''}
            ">
                ${planId === 'premium' ? `
                    <div class="plan-badge" style="
                        position: absolute;
                        top: -12px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: #4361ee;
                        color: white;
                        padding: 6px 20px;
                        border-radius: 20px;
                        font-size: 14px;
                        font-weight: bold;
                    ">${translate('payment.mostPopular')}</div>
                ` : ''}
                
                <h3 style="color: ${plan.color}; margin-top: ${planId === 'premium' ? '15px' : '0'};">
                    ${translate(`payment.${planId}Plan`)}
                </h3>
                
                <div class="plan-price" style="margin: 20px 0; font-size: 32px; color: #333; font-weight: bold;">
                    ${plan.price} <small style="font-size: 16px; color: #666;">${translate('payment.pricePerMonth')}</small>
                </div>
                
                <ul style="margin: 25px 0; padding-left: 20px; color: #555; list-style: none;">
                    ${plan.features.map(feature => `
                        <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                            <i class="fas fa-check" style="color: ${plan.color}; margin-left: 10px;"></i>
                            ${feature}
                        </li>
                    `).join('')}
                </ul>
                
                <button class="subscribe-plan-btn" data-plan="${planId}" style="
                    width: 100%;
                    padding: 15px;
                    background: ${plan.color};
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: opacity 0.3s;
                " ${isCurrent ? 'disabled style="opacity: 0.6;"' : ''}>
                    ${isCurrent ? 'الباقة الحالية' : translate('payment.subscribeNow')}
                </button>
            </div>
        `;
    }
    
    return html;
}

function handleSubscription(plan) {
    const userType = localStorage.getItem('userType');
    
    if (userType !== 'owner') {
        showNotification('يجب أن تكون صاحب عقار للاشتراك', 'error');
        return;
    }
    
    // عرض نافذة تأكيد الدفع
    const confirmPayment = confirm(`
        ${translate('payment.selectPlan')}: ${translate(`payment.${plan}Plan`)}
        
        ${translate('payment.pricePerMonth')}: ${getPlanPrice(plan)} درهم
        
        هل تريد متابعة الدفع؟
    `);
    
    if (!confirmPayment) return;
    
    // محاكاة عملية الدفع
    showNotification('جاري معالجة الدفع...', 'info');
    
    setTimeout(() => {
        // حفظ الاشتراك
        localStorage.setItem('userSubscription', plan);
        
        // حفظ المعاملة
        saveTransaction({
            type: 'subscription',
            plan: plan,
            amount: getPlanPrice(plan),
            date: new Date().toISOString(),
            status: 'completed'
        });
        
        // تحديث العرض
        updateUserTypeDisplay('owner');
        
        showNotification(
            `تم الاشتراك في ${translate(`payment.${plan}Plan`)} بنجاح!`,
            'success'
        );
        
        // إضافة رابط الدفع في التنقل
        addPaymentToNavigation();
    }, 2000);
}

function getPlanPrice(plan) {
    const prices = {
        basic: 99,
        premium: 199,
        professional: 299
    };
    return prices[plan] || 0;
}

function saveTransaction(transaction) {
    const transactions = JSON.parse(localStorage.getItem('paymentTransactions') || '[]');
    transactions.push(transaction);
    localStorage.setItem('paymentTransactions', JSON.stringify(transactions));
}

function showTransactionHistory() {
    const transactions = JSON.parse(localStorage.getItem('paymentTransactions') || '[]');
    
    if (transactions.length === 0) {
        showNotification('لا توجد معاملات سابقة', 'info');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'transactions-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        padding: 20px;
    `;
    
    let transactionsHTML = '';
    transactions.forEach((t, index) => {
        const date = new Date(t.date).toLocaleDateString('ar-EG');
        const amount = t.amount.toFixed(2);
        const type = t.type === 'subscription' ? 'اشتراك' : 'حجز طالب';
        const plan = t.plan ? translate(`payment.${t.plan}Plan`) : '';
        
        transactionsHTML += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px;">${date}</td>
                <td style="padding: 12px; font-weight: bold;">${amount} درهم</td>
                <td style="padding: 12px;">${type}</td>
                <td style="padding: 12px;">${plan}</td>
                <td style="padding: 12px;">
                    <span style="
                        padding: 4px 12px;
                        border-radius: 15px;
                        font-size: 12px;
                        background: ${t.status === 'completed' ? '#06d6a0' : '#ffd166'};
                        color: white;
                    ">${t.status === 'completed' ? 'مكتمل' : 'قيد الانتظار'}</span>
                </td>
            </tr>
        `;
    });
    
    modal.innerHTML = `
        <div class="transactions-content" style="
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 900px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="margin: 0; color: #333;">
                    <i class="fas fa-history"></i> ${translate('payment.transactionHistory')}
                </h2>
                <button class="close-modal" style="
                    background: none;
                    border: none;
                    font-size: 28px;
                    cursor: pointer;
                    color: #666;
                ">&times;</button>
            </div>
            
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead style="background: #4361ee; color: white;">
                        <tr>
                            <th style="padding: 15px; text-align: right;">${translate('payment.date')}</th>
                            <th style="padding: 15px; text-align: right;">${translate('payment.amount')}</th>
                            <th style="padding: 15px; text-align: right;">النوع</th>
                            <th style="padding: 15px; text-align: right;">الباقة</th>
                            <th style="padding: 15px; text-align: right;">${translate('payment.status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${transactionsHTML}
                    </tbody>
                </table>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <button class="btn-close" style="
                    padding: 12px 30px;
                    background: #4361ee;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                ">إغلاق</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // إغلاق النافذة
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.querySelector('.btn-close').onclick = () => modal.remove();
}

// ===== معالجة إضافة العقار =====
function handlePropertySubmission() {
    const userType = localStorage.getItem('userType');
    
    if (userType !== 'owner') {
        showNotification('يجب أن تكون صاحب عقار لإضافة سكن', 'error');
        return;
    }
    
    const plan = localStorage.getItem('userSubscription');
    if (!plan || plan === 'none') {
        showNotification('يجب الاشتراك في باقة لإضافة سكن', 'warning');
        showSubscriptionOptions();
        return;
    }
    
    // التحقق من الحد الأقصى للعقارات
    const propertiesCount = parseInt(localStorage.getItem('userPropertiesCount') || '0');
    const maxProperties = getMaxProperties(plan);
    
    if (propertiesCount >= maxProperties && maxProperties !== Infinity) {
        showUpgradeModal();
        return;
    }
    
    // إضافة العقار
    addNewProperty();
}

function getMaxProperties(plan) {
    const limits = {
        basic: 3,
        premium: 10,
        professional: Infinity
    };
    return limits[plan] || 0;
}

function addNewProperty() {
    // محاكاة إضافة العقار
    showNotification('📤 جاري نشر إعلانك...', 'info');
    
    setTimeout(() => {
        // زيادة عدد العقارات
        const currentCount = parseInt(localStorage.getItem('userPropertiesCount') || '0');
        localStorage.setItem('userPropertiesCount', (currentCount + 1).toString());
        
        showNotification('✅ تم نشر الإعلان بنجاح!', 'success');
        
        // التحقق من الحد الأقصى
        const plan = localStorage.getItem('userSubscription');
        checkPropertiesLimit(plan, currentCount + 1);
    }, 1500);
}

function showUpgradeModal() {
    const plan = localStorage.getItem('userSubscription');
    const currentPlanName = translate(`payment.${plan}Plan`);
    
    const confirmUpgrade = confirm(`
        لقد وصلت إلى الحد الأقصى للعقارات في باقة ${currentPlanName}.
        
        هل تريد الترقية إلى باقة أعلى لإضافة المزيد من العقارات؟
    `);
    
    if (confirmUpgrade) {
        showSubscriptionOptions();
    }
}

// ===== معالجة الحجز للطلاب =====
function showBookingDetails(propertyCard) {
    const priceElement = propertyCard.querySelector('.property-price strong');
    const rentAmount = parseInt(priceElement?.textContent?.replace(/[^\d]/g, '') || '1500');
    const commission = rentAmount * 0.02;
    const totalAmount = rentAmount + commission;
    
    const confirmBooking = confirm(`
        تفاصيل الحجز:
        
        سعر الإيجار: ${rentAmount} درهم
        عمولة المنصة (2%): ${commission} درهم
        المبلغ الإجمالي: ${totalAmount} درهم
        
        هل تريد متابعة الحجز؟
    `);
    
    if (confirmBooking) {
        processStudentBooking(propertyCard, rentAmount, commission);
    }
}

function processStudentBooking(propertyCard, rentAmount, commission) {
    showNotification('جاري معالجة الحجز...', 'info');
    
    setTimeout(() => {
        // حفظ المعاملة
        saveTransaction({
            type: 'student_booking',
            amount: rentAmount + commission,
            commission: commission,
            rentAmount: rentAmount,
            date: new Date().toISOString(),
            status: 'completed',
            property: propertyCard.querySelector('.property-title')?.textContent || 'سكن طلابي'
        });
        
        showNotification('✅ تم الحجز بنجاح! سيتم التواصل معك قريباً.', 'success');
    }, 2000);
}

function handleBooking(propertyCard) {
    showBookingDetails(propertyCard);
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
    
    .student-mode {
        background: #e3f2fd !important;
        color: #1976d2 !important;
    }
    
    .owner-mode {
        background: #e8f5e9 !important;
        color: #388e3c !important;
    }
    
    .visitor-mode {
        background: #f5f5f5 !important;
        color: #757575 !important;
    }
`;
document.head.appendChild(style);

// ===== جعل الدوال متاحة عالمياً =====
window.selectUserType = selectUserType;
window.skipChoice = function() { selectUserType('visitor'); };
window.changeLanguage = function(lang) {
    if (window.languageManager) {
        window.languageManager.changeLanguage(lang);
    } else {
        localStorage.setItem('language', lang);
        showNotification(getLanguageMessage(lang), 'success');
    }
};

// دالة الترجمة المساعدة
function translate(key, defaultValue = '') {
    if (window.languageManager) {
        return window.languageManager.translate(key, defaultValue);
    }
    return defaultValue || key;
}
