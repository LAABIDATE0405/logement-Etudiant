// ===== PAYMENT SYSTEM =====

class PaymentManager {
    constructor() {
        this.subscriptionPlans = {
            basic: {
                name: 'basic',
                price: 99,
                maxProperties: 3,
                features: ['3 عقارات كحد أقصى', 'لوحة تحكم أساسية', 'دعم عبر البريد'],
                color: '#06d6a0'
            },
            premium: {
                name: 'premium',
                price: 199,
                maxProperties: 10,
                features: ['10 عقارات كحد أقصى', 'عقارات مميزة', 'دعم فوري', 'إحصائيات متقدمة'],
                color: '#4361ee'
            },
            professional: {
                name: 'professional',
                price: 299,
                maxProperties: 'unlimited',
                features: ['عقارات غير محدودة', 'أولوية في البحث', 'دعم 24/7', 'تقرير شهري', 'مدير عقارات شخصي'],
                color: '#7209b7'
            }
        };
        
        this.commissionRate = 0.02; // 2% عمولة على الطالب
        this.currentUserPlan = null;
        
        this.init();
    }
    
    async init() {
        await this.loadUserSubscription();
        this.setupPaymentListeners();
    }
    
    // تحميل اشتراك المستخدم
    async loadUserSubscription() {
        // محاكاة جلب بيانات من API
        const savedPlan = localStorage.getItem('userSubscription') || 'none';
        
        if (savedPlan !== 'none') {
            this.currentUserPlan = this.subscriptionPlans[savedPlan];
            this.updateUIForPlan();
        }
        
        return this.currentUserPlan;
    }
    
    // تحديث واجهة المستخدم حسب الباقة
    updateUIForPlan() {
        const userTypeDisplay = document.getElementById('currentUserType');
        const addPropertyBtn = document.querySelector('[href="#add-property"]');
        
        if (userTypeDisplay && this.currentUserPlan) {
            userTypeDisplay.innerHTML += ` <span class="plan-badge" style="background: ${this.currentUserPlan.color}">${this.currentUserPlan.name === 'basic' ? 'بسيط' : this.currentUserPlan.name === 'premium' ? 'متميز' : 'محترف'}</span>`;
        }
        
        if (addPropertyBtn && this.currentUserPlan) {
            const propertiesCount = this.getUserPropertiesCount();
            if (propertiesCount >= this.currentUserPlan.maxProperties && this.currentUserPlan.maxProperties !== 'unlimited') {
                addPropertyBtn.innerHTML = '<i class="fas fa-lock"></i><span>الحد الأقصى</span>';
                addPropertyBtn.style.opacity = '0.6';
                addPropertyBtn.onclick = (e) => {
                    e.preventDefault();
                    this.showUpgradeModal();
                };
            }
        }
    }
    
    // عرض نافذة الترقية
    showUpgradeModal() {
        const modal = document.createElement('div');
        modal.className = 'upgrade-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div class="upgrade-content" style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #333;">${translate('payment.upgradePlan')}</h3>
                    <button class="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
                </div>
                
                <p style="color: #666; margin-bottom: 25px;">
                    لقد وصلت إلى الحد الأقصى للعقارات في باقتك الحالية. ترقية إلى باقة أعلى لإضافة المزيد من العقارات.
                </p>
                
                <div class="upgrade-options" style="display: flex; flex-direction: column; gap: 15px;">
                    ${this.generatePlanCards()}
                </div>
                
                <div style="margin-top: 25px; text-align: center;">
                    <button class="btn-secondary" style="padding: 10px 20px; background: #f8f9fa; border: none; border-radius: 8px; cursor: pointer;">
                        ${translate('btn.cancel')}
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // إغلاق النافذة
        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.querySelector('.btn-secondary').onclick = () => modal.remove();
        
        // أحداث الأزرار
        modal.querySelectorAll('.plan-card').forEach(card => {
            card.onclick = () => {
                const planName = card.dataset.plan;
                this.selectPlan(planName);
                modal.remove();
            };
        });
    }
    
    // توليد بطاقات الباقات
    generatePlanCards() {
        let html = '';
        
        for (const [key, plan] of Object.entries(this.subscriptionPlans)) {
            if (this.currentUserPlan && plan.name === this.currentUserPlan.name) continue;
            
            html += `
                <div class="plan-card" data-plan="${plan.name}" style="
                    border: 2px solid ${plan.color};
                    border-radius: 10px;
                    padding: 20px;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h4 style="margin: 0; color: ${plan.color};">${translate(`payment.${plan.name}Plan`)}</h4>
                        <div style="font-size: 24px; font-weight: bold; color: ${plan.color};">
                            ${plan.price} درهم
                            <small style="font-size: 14px; color: #666;">${translate('payment.pricePerMonth')}</small>
                        </div>
                    </div>
                    
                    <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #555;">
                        ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    
                    <button class="upgrade-btn" style="
                        width: 100%;
                        padding: 12px;
                        background: ${plan.color};
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: bold;
                        cursor: pointer;
                    ">
                        ${translate('payment.subscribeNow')}
                    </button>
                </div>
            `;
        }
        
        return html;
    }
    
    // اختيار باقة
    async selectPlan(planName) {
        const plan = this.subscriptionPlans[planName];
        
        if (!plan) {
            showNotification(translate('message.error'), 'الباقة غير موجودة', 'error');
            return;
        }
        
        // محاكاة عملية الدفع
        showNotification(translate('message.loading'), 'جاري تحويلك لصفحة الدفع...', 'info');
        
        // محاكاة انتظار الدفع
        setTimeout(async () => {
            // محاكاة نجاح الدفع
            this.currentUserPlan = plan;
            localStorage.setItem('userSubscription', planName);
            
            showNotification(
                translate('message.success'),
                `تم الاشتراك في الباقة ${translate(`payment.${planName}Plan`)} بنجاح!`,
                'success'
            );
            
            this.updateUIForPlan();
            
            // إرسال إشعار للطالب
            if (window.userType === 'owner') {
                showNotification(
                    '🎉 تهانينا!',
                    `يمكنك الآن إضافة حتى ${plan.maxProperties === 'unlimited' ? 'عدد غير محدود' : plan.maxProperties} من العقارات`,
                    'success'
                );
            }
        }, 2000);
    }
    
    // حساب عمولة الطالب
    calculateCommission(rentAmount) {
        return rentAmount * this.commissionRate;
    }
    
    // محاكاة حجز طالب
    async simulateStudentBooking(propertyId, rentAmount) {
        const commission = this.calculateCommission(rentAmount);
        const totalAmount = rentAmount + commission;
        
        // عرض تفاصيل الدفع للطالب
        const confirmPayment = confirm(`
            تفاصيل الحجز:
            - سعر الإيجار: ${rentAmount} درهم
            - عمولة المنصة (2%): ${commission} درهم
            - المبلغ الإجمالي: ${totalAmount} درهم
            
            هل تريد متابعة الدفع؟
        `);
        
        if (!confirmPayment) return false;
        
        // محاكاة عملية الدفع
        showNotification('جاري معالجة الدفع...', 'الرجاء الانتظار', 'info');
        
        return new Promise((resolve) => {
            setTimeout(() => {
                // محاكاة نجاح الدفع
                this.saveTransaction({
                    type: 'student_booking',
                    amount: totalAmount,
                    commission: commission,
                    propertyId: propertyId,
                    date: new Date().toISOString(),
                    status: 'completed'
                });
                
                showNotification('تم الدفع بنجاح!', 'سيتم التواصل معك قريباً', 'success');
                resolve(true);
            }, 3000);
        });
    }
    
    // حفظ المعاملة
    saveTransaction(transaction) {
        const transactions = JSON.parse(localStorage.getItem('paymentTransactions') || '[]');
        transactions.push(transaction);
        localStorage.setItem('paymentTransactions', JSON.stringify(transactions));
    }
    
    // الحصول على سجل المعاملات
    getTransactionHistory() {
        return JSON.parse(localStorage.getItem('paymentTransactions') || '[]');
    }
    
    // إعداد مستمعي الأحداث
    setupPaymentListeners() {
        // زر الدفع في لوحة التحكم
        const paymentButtons = document.querySelectorAll('[data-payment-action]');
        paymentButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.paymentAction;
                this.handlePaymentAction(action);
            });
        });
        
        // أزرار الاشتراك في الباقات
        document.addEventListener('click', (e) => {
            if (e.target.closest('.subscribe-btn')) {
                const planName = e.target.closest('.subscribe-btn').dataset.plan;
                this.selectPlan(planName);
            }
        });
    }
    
    // معالجة إجراءات الدفع
    handlePaymentAction(action) {
        switch(action) {
            case 'view_subscriptions':
                this.showUpgradeModal();
                break;
            case 'view_transactions':
                this.showTransactionHistory();
                break;
            case 'renew_subscription':
                this.renewSubscription();
                break;
        }
    }
    
    // عرض سجل المعاملات
    showTransactionHistory() {
        const transactions = this.getTransactionHistory();
        
        if (transactions.length === 0) {
            showNotification('لا توجد معاملات سابقة', 'قمت بأي عمليات دفع بعد', 'info');
            return;
        }
        
        let html = `
            <div style="max-width: 800px; margin: 20px auto;">
                <h3 style="text-align: center; margin-bottom: 20px;">${translate('payment.transactionHistory')}</h3>
                <div style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead style="background: #4361ee; color: white;">
                            <tr>
                                <th style="padding: 15px; text-align: right;">${translate('payment.date')}</th>
                                <th style="padding: 15px; text-align: right;">${translate('payment.amount')}</th>
                                <th style="padding: 15px; text-align: right;">${translate('payment.status')}</th>
                                <th style="padding: 15px; text-align: right;">النوع</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        transactions.forEach(transaction => {
            const date = new Date(transaction.date).toLocaleDateString('ar-EG');
            const amount = transaction.amount.toFixed(2);
            const status = transaction.status === 'completed' ? 'مدفوع' : 
                          transaction.status === 'pending' ? 'قيد الانتظار' : 'فشل';
            
            html += `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 15px;">${date}</td>
                    <td style="padding: 15px; font-weight: bold;">${amount} درهم</td>
                    <td style="padding: 15px;">
                        <span style="
                            padding: 5px 10px;
                            border-radius: 20px;
                            font-size: 12px;
                            background: ${transaction.status === 'completed' ? '#06d6a0' : 
                                       transaction.status === 'pending' ? '#ffd166' : '#ef476f'};
                            color: white;
                        ">
                            ${status}
                        </span>
                    </td>
                    <td style="padding: 15px;">${transaction.type === 'subscription' ? 'اشتراك' : 'حجز طالب'}</td>
                </tr>
            `;
        });
        
        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // عرض في نافذة منبثقة
        const modal = document.createElement('div');
        modal.innerHTML = html;
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            padding: 20px;
        `;
        
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
        
        document.body.appendChild(modal);
    }
    
    // تجديد الاشتراك
    renewSubscription() {
        if (!this.currentUserPlan) {
            showNotification('عذراً', 'ليس لديك اشتراك فعال للتجديد', 'error');
            return;
        }
        
        if (confirm(`هل تريد تجديد اشتراك ${translate(`payment.${this.currentUserPlan.name}Plan`)} بقيمة ${this.currentUserPlan.price} درهم؟`)) {
            this.selectPlan(this.currentUserPlan.name);
        }
    }
    
    // الحصول على عدد عقارات المستخدم
    getUserPropertiesCount() {
        // محاكاة - في الواقع يجب جلب من قاعدة البيانات
        return parseInt(localStorage.getItem('userPropertiesCount') || '0');
    }
}

// إنشاء نسخة واحدة من مدير الدفع
const paymentManager = new PaymentManager();

// جعل الدوال متاحة عالمياً
window.paymentManager = paymentManager;
window.calculateCommission = (amount) => paymentManager.calculateCommission(amount);
