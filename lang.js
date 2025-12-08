// الكود الرئيسي للمنصة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 StudentStay - منصة سكن الطلاب الملونة تعمل بنجاح!');
    
    // 1. البحث عن سكن
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const cityInput = document.querySelector('input[placeholder*="المدينة"]') || 
                             document.querySelector('input[placeholder*="Ville"]');
            const budgetInput = document.querySelector('input[type="range"]');
            
            if (cityInput && cityInput.value.trim() === '') {
                showNotification('⚠️ الرجاء إدخال اسم المدينة للبحث', 'warning');
                cityInput.focus();
                return;
            }
            
            const city = cityInput ? cityInput.value : 'الدار البيضاء';
            const budget = budgetInput ? budgetInput.value : '1500';
            
            showNotification(`🔎 جاري البحث عن سكن في ${city} بميزانية ${budget} درهم...`, 'info');
            
            // إضافة سكن وهمي كنتيجة
            setTimeout(() => {
                addSampleProperty(city, budget);
                showNotification(`✅ تم العثور على 12 سكن في ${city}`, 'success');
            }, 1500);
        });
    }
    
    // 2. زر عرض السكن لصاحب العقار
    const offerBtn = document.querySelector('.owner-btn');
    if (offerBtn) {
        offerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const addressInput = document.querySelector('input[placeholder*="عنوان"]') || 
                                document.querySelector('input[placeholder*="Adresse"]');
            const priceInput = document.querySelector('input[placeholder*="السعر"]') || 
                              document.querySelector('input[placeholder*="Prix"]');
            
            if (!addressInput.value || !priceInput.value) {
                showNotification('⚠️ الرجاء ملء جميع الحقول المطلوبة', 'warning');
                return;
            }
            
            showNotification(`🏡 جاري نشر إعلانك للعقار في ${addressInput.value}...`, 'info');
            
            setTimeout(() => {
                showNotification(`✅ تم نشر إعلانك بنجاح! السعر: ${priceInput.value} درهم`, 'success');
                
                // إعادة تعيين النموذج
                document.querySelector('#offer-form').reset();
            }, 2000);
        });
    }
    
    // 3. نظام الإشعارات
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                ${message}
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // إغلاق الإشعار
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.remove();
        });
        
        // إزالة تلقائية بعد 5 ثواني
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    // 4. إضافة سكن نموذجي
    function addSampleProperty(city, budget) {
        const propertiesGrid = document.querySelector('.properties-grid');
        if (!propertiesGrid) return;
        
        const sampleProperties = [
            {
                title: `شقة طلابية جديدة في ${city}`,
                location: city,
                price: budget,
                rooms: 2,
                rating: 4.5
            },
            {
                title: `استوديو مريح قرب الجامعة`,
                location: city,
                price: Math.floor(budget * 0.7),
                rooms: 1,
                rating: 4.2
            }
        ];
        
        sampleProperties.forEach(property => {
            const propertyHTML = `
                <div class="property-card">
                    <div class="property-image gradient-blue">
                        <div class="property-tag discount">جديد</div>
                        <div class="property-rating">
                            <i class="fas fa-star"></i> ${property.rating}
                        </div>
                    </div>
                    <div class="property-content">
                        <h3 class="property-title">${property.title}</h3>
                        <p class="property-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${property.location}
                        </p>
                        <div class="property-features">
                            <span><i class="fas fa-bed"></i> ${property.rooms} ${property.rooms === 1 ? 'غرفة' : 'غرف'}</span>
                            <span><i class="fas fa-bath"></i> 1 حمام</span>
                            <span><i class="fas fa-wifi"></i> واي فاي</span>
                        </div>
                        <div class="property-footer">
                            <div class="property-price">
                                <strong>${property.price} درهم</strong>
                                <span>/شهر</span>
                            </div>
                            <button class="btn-book">
                                <i class="fas fa-calendar-check"></i>
                                احجز الآن
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            propertiesGrid.insertAdjacentHTML('beforeend', propertyHTML);
        });
    }
    
    // 5. تفعيل الأيقونات الاجتماعية
    document.querySelectorAll('.social-icons a').forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('i').className.split(' ')[1].replace('fa-', '');
            showNotification(`تابعنا على ${platform} قريباً!`, 'info');
        });
    });
    
    // 6. تأثيرات مرئية
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate__animated', 'animate__fadeInUp');
    });
    
    // 7. تتبع النقرات
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 8. تأثيرات CSS إضافية
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 10px;
            padding: 15px 20px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideIn 0.3s ease;
            border-left: 4px solid;
        }
        
        .notification-info { border-color: #667eea; }
        .notification-success { border-color: #43e97b; }
        .notification-warning { border-color: #ffd166; }
        .notification-error { border-color: #ff6b6b; }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .animate__animated {
            animation-duration: 0.6s;
            animation-fill-mode: both;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate__fadeInUp {
            animation-name: fadeInUp;
        }
    `;
    
    document.head.appendChild(style);
    
    // 9. تفعيل اختيار المدينة
    document.querySelectorAll('.city-card').forEach(card => {
        card.addEventListener('click', function() {
            const cityName = this.querySelector('h3').textContent;
            const cityPrice = this.querySelector('.city-price').textContent;
            
            showNotification(`🏙️ تم اختيار مدينة ${cityName} ${cityPrice}`, 'info');
            
            // تعبئة حقل البحث بالمدينة المختارة
            const cityInput = document.querySelector('input[placeholder*="المدينة"]') || 
                             document.querySelector('input[placeholder*="Ville"]');
            if (cityInput) {
                cityInput.value = cityName;
            }
        });
    });
    
    // 10. تحميل البيانات الوهمية
    setTimeout(() => {
        console.log('📊 جارٍ تحميل البيانات...');
        showNotification('مرحباً بك في StudentStay! 🎉', 'success');
    }, 1000);
});
