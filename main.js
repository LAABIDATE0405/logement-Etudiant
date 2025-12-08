// ===== MAIN SCRIPT =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 StudentStay - منصة سكن الطلاب جاهزة!');
    
    // 1. تفعيل أزرار اختيار المستخدم
    const userTypeButtons = document.querySelectorAll('.user-type-btn');
    userTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // إزالة النشاط من جميع الأزرار
            userTypeButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.background = 'transparent';
                btn.style.color = 'white';
            });
            
            // تفعيل الزر المختار
            this.classList.add('active');
            const userType = this.getAttribute('data-type');
            
            // تغيير الألوان حسب النوع
            if (userType === 'student') {
                this.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                this.style.color = 'white';
                
                // تغيير لون الشريط
                document.querySelector('.navbar').style.background = 
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                
                // تغيير نص البحث
                document.querySelector('.hero-title').innerHTML = 
                    'ابحث عن <span class="highlight">سكن طلابي</span> يناسبك';
                
                showNotification('🎓 تم تفعيل واجهة الطالب', 'student');
                
            } else if (userType === 'owner') {
                this.style.background = 'linear-gradient(135deg, #43e97b, #38f9d7)';
                this.style.color = 'white';
                
                // تغيير لون الشريط
                document.querySelector('.navbar').style.background = 
                    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
                
                // تغيير نص البحث
                document.querySelector('.hero-title').innerHTML = 
                    'عُرض <span class="highlight">سكنك</span> للطلاب';
                
                showNotification('🏠 تم تفعيل واجهة صاحب العقار', 'owner');
            }
        });
    });
    
    // 2. شريط الميزانية التفاعلي
    const budgetSlider = document.getElementById('budgetSlider');
    const budgetValue = document.getElementById('budgetValue');
    
    if (budgetSlider && budgetValue) {
        budgetSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            budgetValue.textContent = `${value} درهم`;
            
            // تغيير لون الشريط
            const min = parseInt(this.min);
            const max = parseInt(this.max);
            const percentage = ((value - min) / (max - min)) * 100;
            
            this.style.background = `linear-gradient(to right, 
                #6a11cb 0%, 
                #2575fc ${percentage}%, 
                #e9ecef ${percentage}%, 
                #e9ecef 100%)`;
            
            // تأثير بسيط
            budgetValue.style.transform = 'scale(1.1)';
            setTimeout(() => {
                budgetValue.style.transform = 'scale(1)';
            }, 150);
        });
        
        // تشغيل الحدث الأولي
        budgetSlider.dispatchEvent(new Event('input'));
    }
    
    // 3. زر البحث الرئيسي
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            // تأثير الضغط
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // جمع بيانات البحث
            const cityInput = document.querySelector('input[placeholder="المدينة أو الجامعة"]');
            const budget = budgetSlider ? budgetSlider.value : '1500';
            
            if (!cityInput || cityInput.value.trim() === '') {
                showNotification('📍 الرجاء إدخال المدينة للبحث', 'error');
                if (cityInput) cityInput.focus();
                return;
            }
            
            const city = cityInput.value;
            
            showNotification(`🔎 جاري البحث عن سكن في ${city}...`, 'search');
            
            // محاكاة البحث وإضافة نتائج
            setTimeout(() => {
                addSearchResult(city, budget);
                showNotification(`✅ تم العثور على 5 سكن في ${city}`, 'success');
            }, 1500);
        });
    }
    
    // 4. أزرار عرض التفاصيل
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.property-card');
            const title = card.querySelector('.property-title').textContent;
            const price = card.querySelector('.property-price strong').textContent;
            const location = card.querySelector('.property-location').textContent;
            
            showPropertyDetails(title, price, location);
        });
    });
    
    // 5. زر عرض المزيد
    const showMoreBtn = document.querySelector('.show-more-btn');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function() {
            showNotification('📦 جاري تحميل المزيد من السكن...', 'info');
            
            // تأثير الضغط
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // إضافة 3 سكن إضافية
            setTimeout(() => {
                addMoreProperties();
                showNotification('✅ تم تحميل 3 سكن إضافية', 'success');
            }, 1000);
        });
    }
    
    // 6. نموذج إضافة سكن
    const addForm = document.querySelector('.add-form');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // التحقق من الحقول
            const inputs = this.querySelectorAll('input[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ff6b6b';
                    input.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.1)';
                } else {
                    input.style.borderColor = '#43e97b';
                    input.style.boxShadow = '0 0 0 3px rgba(67, 233, 123, 0.1)';
                }
            });
            
            if (!isValid) {
                showNotification('⚠️ الرجاء ملء جميع الحقول المطلوبة', 'error');
                return;
            }
            
            // جمع البيانات
            const address = this.querySelector('input[placeholder*="العنوان"]').value;
            const price = this.querySelector('input[placeholder*="السعر"]').value;
            
            showNotification('📤 جاري نشر إعلانك...', 'info');
            
            // محاكاة النشر
            setTimeout(() => {
                showNotification(`🎉 تم نشر إعلانك بنجاح! السعر: ${price} درهم`, 'success');
                
                // إعادة تعيين النموذج
                this.reset();
                
                // إعادة ألوان الحدود
                inputs.forEach(input => {
                    input.style.borderColor = '#e9ecef';
                    input.style.boxShadow = 'none';
                });
                
                // إعادة تعيين رفع الملفات
                const fileArea = document.querySelector('.file-upload-area');
                if (fileArea) {
                    fileArea.innerHTML = `
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>اسحب وأفلت الصور هنا أو <span>انقر للاختيار</span></p>
                        <input type="file" multiple accept="image/*">
                    `;
                }
            }, 2000);
        });
    }
    
    // 7. رفع الملفات
    const fileUploadArea = document.querySelector('.file-upload-area');
    if (fileUploadArea) {
        const fileInput = fileUploadArea.querySelector('input[type="file"]');
        
        fileUploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileUploadArea.innerHTML = `
                    <i class="fas fa-check-circle" style="color: #43e97b; font-size: 3rem;"></i>
                    <p style="color: #43e97b; font-weight: 600;">تم اختيار ${this.files.length} صورة</p>
                    <input type="file" multiple accept="image/*">
                `;
                fileUploadArea.style.borderColor = '#43e97b';
                fileUploadArea.style.background = 'rgba(67, 233, 123, 0.05)';
            }
        });
    }
    
    // 8. وظيفة إضافة نتيجة بحث
    function addSearchResult(city, budget) {
        const propertiesGrid = document.querySelector('.properties-grid');
        if (!propertiesGrid) return;
        
        const newProperty = document.createElement('div');
        newProperty.className = 'property-card';
        newProperty.innerHTML = `
            <div class="property-image" style="background: linear-gradient(135deg, #ffd166, #ffb347);">
                <span class="property-badge" style="background: linear-gradient(135deg, #ffd166, #ffb347);">نتيجة بحث</span>
            </div>
            <div class="property-info">
                <h3 class="property-title">سكن في ${city}</h3>
                <p class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${city} - قرب الجامعة
                </p>
                <div class="property-features">
                    <span><i class="fas fa-bed"></i> 2 غرف</span>
                    <span><i class="fas fa-bath"></i> 1 حمام</span>
                    <span><i class="fas fa-wifi"></i> واي فاي مجاني</span>
                </div>
                <div class="property-footer">
                    <div class="property-price">
                        <strong>${budget} درهم</strong>
                        <span>/شهر</span>
                    </div>
                    <button class="property-btn view-btn">
                        <i class="fas fa-eye"></i>
                        عرض التفاصيل
                    </button>
                </div>
            </div>
        `;
        
        propertiesGrid.prepend(newProperty);
        
        // إضافة حدث للزر الجديد
        newProperty.querySelector('.view-btn').addEventListener('click', function() {
            showPropertyDetails(`سكن في ${city}`, `${budget} درهم`, city);
        });
    }
    
    // 9. وظيفة إضافة سكن إضافي
    function addMoreProperties() {
        const propertiesGrid = document.querySelector('.properties-grid');
        if (!propertiesGrid) return;
        
        const additionalProperties = [
            {
                title: 'شقة فاخرة - طنجة',
                location: 'طنجة، حي الميناء',
                price: '2,200',
                gradient: 'linear-gradient(135deg, #ff9a9e, #fad0c4)'
            },
            {
                title: 'استوديو - فاس',
                location: 'فاس، المدينة القديمة',
                price: '1,100',
                gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)'
            },
            {
                title: 'غرفة - أكادير',
                location: 'أكادير، شاطئ تاغازوت',
                price: '950',
                gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)'
            }
        ];
        
        additionalProperties.forEach(prop => {
            const newProperty = document.createElement('div');
            newProperty.className = 'property-card';
            newProperty.innerHTML = `
                <div class="property-image" style="background: ${prop.gradient};">
                    <span class="property-badge new">جديد</span>
                </div>
                <div class="property-info">
                    <h3 class="property-title">${prop.title}</h3>
                    <p class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${prop.location}
                    </p>
                    <div class="property-features">
                        <span><i class="fas fa-bed"></i> ${prop.title.includes('استوديو') ? '1' : '2'} غرف</span>
                        <span><i class="fas fa-bath"></i> 1 حمام</span>
                        <span><i class="fas fa-car"></i> موقف سيارات</span>
                    </div>
                    <div class="property-footer">
                        <div class="property-price">
                            <strong>${prop.price} درهم</strong>
                            <span>/شهر</span>
                        </div>
                        <button class="property-btn view-btn">
                            <i class="fas fa-eye"></i>
                            عرض التفاصيل
                        </button>
                    </div>
                </div>
            `;
            
            propertiesGrid.appendChild(newProperty);
            
            // إضافة حدث للزر الجديد
            newProperty.querySelector('.view-btn').addEventListener('click', function() {
                showPropertyDetails(prop.title, `${prop.price} درهم`, prop.location);
            });
        });
    }
    
    // 10. وظيفة عرض تفاصيل العقار
    function showPropertyDetails(title, price, location) {
        const modal = document.createElement('div');
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
            z-index: 2000;
            animation: fadeIn 0.3s;
        `;
        
        modal.innerHTML = `
            <div style="background: white; width: 90%; max-width: 500px; 
                        border-radius: 20px; padding: 30px; animation: slideUp 0.3s;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="color: #6a11cb; font-size: 1.8rem;">
                        <i class="fas fa-home"></i> تفاصيل السكن
                    </h3>
                    <button class="close-modal" style="background: none; border: none; 
                            font-size: 1.5rem; color: #666; cursor: pointer;">×</button>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <p style="font-size: 1.4rem; color: #333; margin-bottom: 15px; font-weight: 600;">
                        ${title}
                    </p>
                    <p style="color: #666; margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-map-marker-alt" style="color: #6a11cb;"></i>
                        ${location}
                    </p>
                    <p style="color: #666; margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-tag" style="color: #ff9a9e;"></i>
                        السعر: <strong style="color: #6a11cb; font-size: 1.3rem;">${price}</strong>
                    </p>
                    <p style="color: #666; margin-bottom: 20px;">
                        <i class="fas fa-info-circle" style="color: #4facfe;"></i>
                        يشمل السكن جميع الخدمات الأساسية والأثاث والمرافق
                    </p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <button class="modal-action-btn" 
                            style="background: linear-gradient(135deg, #6a11cb, #2575fc); 
                                   color: white; padding: 15px; border: none; 
                                   border-radius: 10px; font-size: 1.1rem; cursor: pointer;">
                        <i class="fas fa-phone"></i> اتصل
                    </button>
                    <button class="modal-action-btn" 
                            style="background: linear-gradient(135deg, #43e97b, #38f9d7); 
                                   color: white; padding: 15px; border: none; 
                                   border-radius: 10px; font-size: 1.1rem; cursor: pointer;">
                        <i class="fas fa-calendar-check"></i> احجز زيارة
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // أحداث الأزرار
        modal.querySelector('.close-modal').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        modal.querySelectorAll('.modal-action-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.textContent.includes('اتصل')) {
                    showNotification('📞 جاري الاتصال... سنتصل بك خلال دقائق', 'success');
                } else {
                    showNotification('📅 تم حجز موعد الزيارة! ستتلقى تأكيداً بالبريد', 'success');
                }
                document.body.removeChild(modal);
            });
        });
        
        // إغلاق بالنقر خارج الصندوق
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // 11. نظام الإشعارات
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
        
        // إنشاء الإشعار
        const notification = document.createElement('div');
        notification.className = 'notification';
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
            <button class="close-notification" style="background: none; border: none; 
                    color: white; font-size: 1.5rem; cursor: pointer; margin-right: auto;">×</button>
        `;
        
        document.body.appendChild(notification);
        
        // زر الإغلاق
        notification.querySelector('.close-notification').addEventListener('click', function() {
            notification.style.animation = 'slideOutRight 0.3s';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 250);
        });
        
        // إزالة تلقائية بعد 4 ثوان
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
    
    // 12. إضافة أنماط CSS للحركات
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
        
        .property-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .user-type-btn {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .search-button, .publish-btn, .view-btn {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .nav-link {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
    `;
    
    document.head.appendChild(style);
    
    // 13. تهيئة أولية
    setTimeout(() => {
        showNotification('مرحباً بك في StudentStay! 🎨', 'info');
    }, 1000);
});
