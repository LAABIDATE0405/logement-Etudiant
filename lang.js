// كود تفاعلي مع ألوان
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 منصة سكن الطلاب الملونة جاهزة!');
    
    // 1. تفعيل صندوق الطالب
    const studentBox = document.querySelector('.student-box');
    const ownerBox = document.querySelector('.owner-box');
    
    if (studentBox) {
        studentBox.addEventListener('click', function() {
            // إضافة تأثير
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-10px)';
            }, 150);
            
            // تغيير لون الشريط
            document.querySelector('.navbar').style.background = 
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            
            // تغيير نص البحث
            document.querySelector('.search-title').innerHTML = `
                <i class="fas fa-graduation-cap"></i>
                ابحث عن سكن طلابي
            `;
            
            showNotification('🎓 تم تفعيل واجهة الطالب', 'student');
        });
    }
    
    if (ownerBox) {
        ownerBox.addEventListener('click', function() {
            // إضافة تأثير
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-10px)';
            }, 150);
            
            // تغيير لون الشريط
            document.querySelector('.navbar').style.background = 
                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
            
            // تغيير نص البحث
            document.querySelector('.search-title').innerHTML = `
                <i class="fas fa-user-tie"></i>
                عُرض سكنك للطلاب
            `;
            
            showNotification('🏠 تم تفعيل واجهة صاحب العقار', 'owner');
        });
    }
    
    // 2. شريط الميزانية التفاعلي
    const budgetSlider = document.querySelector('input[type="range"]');
    const budgetValue = document.querySelector('.range-container strong');
    
    if (budgetSlider && budgetValue) {
        budgetSlider.addEventListener('input', function() {
            const value = this.value;
            budgetValue.textContent = `${value} درهم`;
            
            // تغيير لون الشريط
            const percent = ((value - 500) / (3000 - 500)) * 100;
            this.style.background = `linear-gradient(to right, #ff9a9e ${percent}%, #ddd ${percent}%)`;
            
            // تأثير صوتي بسيط (فقط تغيير)
            this.style.transform = 'scale(1.02)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
        
        // بدء التشغيل
        budgetSlider.dispatchEvent(new Event('input'));
    }
    
    // 3. زر البحث
    const searchBtn = document.querySelector('.search-action-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            // تأثير الضغط
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            const cityInput = document.querySelector('input[placeholder*="أين تريد السكن"]');
            const budget = budgetSlider ? budgetSlider.value : '1500';
            
            if (cityInput && cityInput.value.trim() === '') {
                showNotification('📍 الرجاء إدخال المدينة', 'error');
                cityInput.focus();
                return;
            }
            
            const city = cityInput ? cityInput.value : 'الدار البيضاء';
            
            showNotification(`🔎 جاري البحث في ${city}...`, 'search');
            
            // إضافة سكن وهمي
            setTimeout(() => {
                const propertiesSection = document.querySelector('.properties-showcase');
                if (propertiesSection) {
                    const newProperty = document.createElement('div');
                    newProperty.className = 'property-showcase-card';
                    newProperty.innerHTML = `
                        <div class="property-showcase-img" 
                             style="background: linear-gradient(135deg, #ffd166, #ffb347); 
                                    border-radius: 15px 15px 0 0;">
                            <span class="property-tag" style="background: #ffd166;">نتيجة بحث</span>
                        </div>
                        <div class="property-showcase-content">
                            <h3 style="color: #333;">سكن في ${city}</h3>
                            <p style="color: #666;">
                                <i class="fas fa-map-marker-alt" style="color: #ffd166;"></i>
                                ${city} - قرب الجامعة
                            </p>
                            <div class="property-showcase-features">
                                <span style="background: rgba(255, 209, 102, 0.1); color: #ffd166;">
                                    <i class="fas fa-bed"></i> 2 غرف
                                </span>
                                <span style="background: rgba(255, 209, 102, 0.1); color: #ffd166;">
                                    <i class="fas fa-wifi"></i> واي فاي مجاني
                                </span>
                            </div>
                            <div class="property-showcase-footer">
                                <div class="price-tag" style="color: #ffd166;">
                                    <strong>${budget}</strong> درهم/شهر
                                </div>
                                <button class="action-btn" 
                                        style="background: #ffd166; color: #333;">
                                    عرض التفاصيل
                                </button>
                            </div>
                        </div>
                    `;
                    
                    propertiesSection.appendChild(newProperty);
                    
                    // إضافة حدث للزر الجديد
                    newProperty.querySelector('.action-btn').addEventListener('click', function() {
                        showPropertyDetails(city, budget);
                    });
                    
                    showNotification(`✅ تم العثور على سكن في ${city}`, 'success');
                }
            }, 1500);
        });
    }
    
    // 4. أزرار عرض التفاصيل
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.property-showcase-card');
            const title = card.querySelector('h3').textContent;
            const price = card.querySelector('.price-tag strong').textContent;
            
            showPropertyDetails(title, price);
        });
    });
    
    // 5. وظيفة عرض التفاصيل
    function showPropertyDetails(title, price) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            animation: fadeIn 0.3s;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 20px; 
                        max-width: 500px; width: 90%; animation: slideUp 0.3s;">
                <h3 style="color: #6a11cb; margin-bottom: 20px; font-size: 1.8rem;">
                    <i class="fas fa-home"></i> تفاصيل السكن
                </h3>
                <div style="margin-bottom: 25px;">
                    <p style="font-size: 1.2rem; color: #333; margin-bottom: 10px;">
                        <strong>${title}</strong>
                    </p>
                    <p style="color: #666; margin-bottom: 10px;">
                        <i class="fas fa-tag" style="color: #ff9a9e;"></i>
                        السعر: <strong style="color: #6a11cb;">${price} درهم/شهر</strong>
                    </p>
                    <p style="color: #666;">
                        <i class="fas fa-info-circle" style="color: #4facfe;"></i>
                        هذا السكن مؤهل للطلاب ويشمل جميع الخدمات الأساسية
                    </p>
                </div>
                <div style="display: flex; gap: 15px; margin-top: 30px;">
                    <button class="modal-btn" 
                            style="background: #6a11cb; color: white; padding: 15px; 
                                   border: none; border-radius: 10px; font-size: 1.1rem; 
                                   cursor: pointer; flex: 1;">
                        <i class="fas fa-phone"></i> اتصل الآن
                    </button>
                    <button class="modal-btn close-btn" 
                            style="background: #f8f9fa; color: #666; padding: 15px; 
                                   border: none; border-radius: 10px; font-size: 1.1rem; 
                                   cursor: pointer; flex: 1;">
                        <i class="fas fa-times"></i> إغلاق
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // أحداث الأزرار
        modal.querySelector('.close-btn').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.modal-btn:not(.close-btn)').addEventListener('click', function() {
            showNotification('📞 جاري الاتصال... سنتصل بك خلال دقائق', 'success');
            document.body.removeChild(modal);
        });
        
        // إغلاق بالنقر خارج الصندوق
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // 6. نظام الإشعارات الملون
    function showNotification(message, type = 'info') {
        const colors = {
            'student': { bg: '#667eea', icon: '🎓' },
            'owner': { bg: '#43e97b', icon: '🏠' },
            'search': { bg: '#ff9a9e', icon: '🔎' },
            'success': { bg: '#43e97b', icon: '✅' },
            'error': { bg: '#ff6b6b', icon: '⚠️' },
            'info': { bg: '#4facfe', icon: '💡' }
        };
        
        const config = colors[type] || colors.info;
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${config.bg};
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 3000;
            animation: slideInRight 0.3s;
            font-size: 1.1rem;
            max-width: 400px;
        `;
        
        notification.innerHTML = `
            <span style="font-size: 1.3rem;">${config.icon}</span>
            <span>${message}</span>
            <button style="background: none; border: none; color: white; 
                           font-size: 1.5rem; cursor: pointer; margin-right: auto;">
                ×
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // زر الإغلاق
        notification.querySelector('button').addEventListener('click', function() {
            notification.style.animation = 'slideOutRight 0.3s';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 250);
        });
        
        // إزالة تلقائية
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 250);
            }
        }, 4000);
    }
    
    // 7. إضافة أنماط CSS للحركات
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .property-showcase-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .box-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .nav-btn {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
    `;
    
    document.head.appendChild(style);
    
    // 8. أزرار CTA
    document.querySelectorAll('.cta-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent.includes('اشترك')) {
                showNotification('🎉 مرحباً بك! جاري تحويلك لصفحة التسجيل', 'success');
            } else {
                showNotification('▶️ جاري تشغيل الفيديو التعريفي', 'info');
            }
        });
    });
    
    // 9. تحميل أولي
    setTimeout(() => {
        showNotification('مرحباً بك في StudentStay! 🎨', 'info');
    }, 1000);
});
