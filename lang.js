// كود بسيط للمنصة المختصرة
document.addEventListener('DOMContentLoaded', function() {
    console.log('منصة سكن الطلاب جاهزة!');
    
    // 1. زر البحث الكبير
    const searchBtn = document.querySelector('.big-search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const cityInput = document.querySelector('input[placeholder*="المدينة"]');
            const typeSelect = document.querySelector('select');
            
            if (cityInput && cityInput.value.trim() === '') {
                alert('الرجاء إدخال المدينة للبحث');
                cityInput.focus();
                return;
            }
            
            const city = cityInput ? cityInput.value : 'الدار البيضاء';
            const type = typeSelect ? typeSelect.value : 'أي نوع';
            
            alert(`جاري البحث في ${city} - ${type}`);
            
            // إضافة سكن وهمي
            setTimeout(() => {
                const propertiesGrid = document.querySelector('.properties-grid');
                if (propertiesGrid) {
                    propertiesGrid.innerHTML += `
                        <div class="property-card">
                            <div class="card-image" style="background: linear-gradient(135deg, #ffd166, #ffb347);"></div>
                            <div class="card-content">
                                <h3>نتيجة بحث: ${city}</h3>
                                <p class="location">
                                    <i class="fas fa-map-marker-alt"></i>
                                    ${city}
                                </p>
                                <div class="details">
                                    <span><i class="fas fa-bed"></i> 2 غرف</span>
                                    <span><i class="fas fa-bath"></i> 1 حمام</span>
                                </div>
                                <div class="price">
                                    <strong>1,500 درهم</strong>
                                    <button class="view-btn">عرض</button>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }, 1000);
        });
    }
    
    // 2. أزرار العرض
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.property-card');
            const title = card.querySelector('h3').textContent;
            const price = card.querySelector('strong').textContent;
            
            alert(`تفاصيل السكن:\n\n${title}\n${price}\n\nللحجز: 0522-123456`);
        });
    });
    
    // 3. زر عرض المزيد
    const moreBtn = document.querySelector('.more-btn');
    if (moreBtn) {
        moreBtn.addEventListener('click', function() {
            alert('جاري تحميل المزيد من السكن...');
            setTimeout(() => {
                alert('تم تحميل 3 سكن إضافي!');
            }, 1500);
        });
    }
    
    // 4. نشر إعلان
    const publishBtn = document.querySelector('.publish-btn');
    if (publishBtn) {
        publishBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const inputs = document.querySelectorAll('.simple-form input');
            let filled = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    filled = false;
                    input.style.borderColor = '#ff6b6b';
                } else {
                    input.style.borderColor = '#43e97b';
                }
            });
            
            if (!filled) {
                alert('الرجاء ملء جميع الحقول');
                return;
            }
            
            alert('🎉 تم نشر إعلانك بنجاح! سيتم مراجعته قريباً.');
            
            // إعادة تعيين النموذج
            inputs.forEach(input => {
                input.value = '';
                input.style.borderColor = '#ddd';
            });
        });
    }
    
    // 5. أزرار الطالب/صاحب العقار
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.quick-btn').forEach(b => {
                b.classList.remove('active');
                if (b.classList.contains('owner-btn')) {
                    b.style.background = '#f8f9fa';
                    b.style.color = '#333';
                }
            });
            
            this.classList.add('active');
            
            if (this.classList.contains('student-btn')) {
                document.querySelector('.page-title').innerHTML = `
                    ابحث عن <span class="highlight">سكن طلابي</span> يناسبك
                `;
                document.querySelector('.big-search-btn').innerHTML = `
                    <i class="fas fa-search"></i>
                    ابحث عن سكن
                `;
            } else {
                this.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                this.style.color = 'white';
                document.querySelector('.page-title').innerHTML = `
                    عُرض <span class="highlight">سكنك</span> للطلاب
                `;
                document.querySelector('.big-search-btn').innerHTML = `
                    <i class="fas fa-home"></i>
                    عرض سكني
                `;
            }
        });
    });
    
    // 6. إضافة صورة
    const addPhotoBtn = document.querySelector('.add-photo');
    if (addPhotoBtn) {
        addPhotoBtn.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.multiple = true;
            
            input.addEventListener('change', function() {
                if (this.files.length > 0) {
                    addPhotoBtn.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        ${this.files.length} صورة
                    `;
                    addPhotoBtn.style.borderColor = '#43e97b';
                    addPhotoBtn.style.color = '#43e97b';
                    addPhotoBtn.style.background = 'rgba(67, 233, 123, 0.1)';
                }
            });
            
            input.click();
        });
    }
});
