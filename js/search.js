// ===== SEARCH & FILTER MODULE =====

class PropertySearch {
    constructor() {
        this.properties = [];
        this.filters = {
            city: '',
            type: '',
            minPrice: 0,
            maxPrice: 5000,
            rooms: '',
            features: []
        };
        this.init();
    }
    
    init() {
        this.loadProperties();
        this.setupSearchEvents();
    }
    
    // تحميل العقارات (مؤقت - يمكن استبدالها بـ API)
    loadProperties() {
        this.properties = [
            {
                id: 1,
                title: 'شقة طلابية - الدار البيضاء',
                city: 'الدار البيضاء',
                type: 'apartment',
                price: 1800,
                rooms: 2,
                bathrooms: 1,
                features: ['wifi', 'furnished', 'kitchen'],
                rating: 4.8,
                image: 'assets/images/property1.jpg',
                location: 'حي المعاريف، قرب الجامعة',
                description: 'شقة طلابية مفروشة بالكامل، قريبة من الجامعة، تتوفر على جميع المرافق'
            },
            {
                id: 2,
                title: 'استوديو - الرباط',
                city: 'الرباط',
                type: 'studio',
                price: 1200,
                rooms: 1,
                bathrooms: 1,
                features: ['wifi', 'furnished', 'parking'],
                rating: 4.5,
                image: 'assets/images/property2.jpg',
                location: 'حي أكدال، قرب المترو',
                description: 'استوديو جديد مجهز بالكامل، موقع ممتاز بالقرب من المواصلات'
            },
            {
                id: 3,
                title: 'غرفة - مراكش',
                city: 'مراكش',
                type: 'room',
                price: 900,
                rooms: 1,
                bathrooms: 0, // مشترك
                features: ['wifi', 'shared'],
                rating: 4.2,
                image: 'assets/images/property3.jpg',
                location: 'وسط المدينة، قرب المواصلات',
                description: 'غرفة في سكن مشترك، بيئة آمنة للطلاب'
            },
            {
                id: 4,
                title: 'شقة - فاس',
                city: 'فاس',
                type: 'apartment',
                price: 1500,
                rooms: 3,
                bathrooms: 2,
                features: ['wifi', 'furnished', 'kitchen', 'parking'],
                rating: 4.7,
                image: 'assets/images/property4.jpg',
                location: 'حي السلام، قرب الجامعة',
                description: 'شقة عائلية مناسبة لمجموعة طلاب، مساحة واسعة'
            },
            {
                id: 5,
                title: 'استوديو - طنجة',
                city: 'طنجة',
                type: 'studio',
                price: 1100,
                rooms: 1,
                bathrooms: 1,
                features: ['wifi', 'furnished', 'sea-view'],
                rating: 4.4,
                image: 'assets/images/property5.jpg',
                location: 'وسط المدينة، قرب البحر',
                description: 'استوديو مع إطلالة على البحر، موقع مميز'
            },
            {
                id: 6,
                title: 'غرفة - الدار البيضاء',
                city: 'الدار البيضاء',
                type: 'room',
                price: 800,
                rooms: 1,
                bathrooms: 0,
                features: ['wifi', 'furnished', 'shared-kitchen'],
                rating: 4.0,
                image: 'assets/images/property6.jpg',
                location: 'حي القدس، منطقة هادئة',
                description: 'غرفة في فيلا، بيئة هادئة ومناسبة للدراسة'
            }
        ];
    }
    
    // إعداد أحداث البحث
    setupSearchEvents() {
        // زر البحث الرئيسي
        const searchBtn = document.querySelector('.search-button');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.performSearch());
        }
        
        // البحث أثناء الكتابة
        const cityInput = document.querySelector('input[placeholder*="المدينة"]');
        if (cityInput) {
            cityInput.addEventListener('input', (e) => {
                this.filters.city = e.target.value;
                this.debouncedSearch();
            });
        }
        
        // تصفية النوع
        const typeSelect = document.querySelector('select');
        if (typeSelect) {
            typeSelect.addEventListener('change', (e) => {
                this.filters.type = e.target.value;
                this.performSearch();
            });
        }
        
        // شريط الميزانية
        const budgetSlider = document.getElementById('budgetSlider');
        if (budgetSlider) {
            budgetSlider.addEventListener('input', (e) => {
                this.filters.maxPrice = parseInt(e.target.value);
                this.debouncedSearch();
            });
        }
        
        // أزرار التصفية الإضافية
        this.setupFilterButtons();
    }
    
    // إعداد أزرار التصفية
    setupFilterButtons() {
        // تصفية حسب المدينة
        const cityFilters = document.querySelectorAll('.city-filter');
        cityFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filters.city = btn.dataset.city;
                this.performSearch();
            });
        });
        
        // تصفية حسب الميزات
        const featureFilters = document.querySelectorAll('.feature-filter');
        featureFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                const feature = btn.dataset.feature;
                const index = this.filters.features.indexOf(feature);
                
                if (index > -1) {
                    this.filters.features.splice(index, 1);
                    btn.classList.remove('active');
                } else {
                    this.filters.features.push(feature);
                    btn.classList.add('active');
                }
                
                this.performSearch();
            });
        });
        
        // زر إعادة التعيين
        const resetBtn = document.querySelector('.reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilters());
        }
    }
    
    // تنفيذ البحث
    performSearch() {
        const filtered = this.filterProperties();
        this.displayResults(filtered);
        this.updateResultCount(filtered.length);
    }
    
    // تصفية العقارات
    filterProperties() {
        return this.properties.filter(property => {
            // تصفية المدينة
            if (this.filters.city && !property.city.includes(this.filters.city)) {
                return false;
            }
            
            // تصفية النوع
            if (this.filters.type && property.type !== this.filters.type) {
                return false;
            }
            
            // تصفية السعر
            if (property.price > this.filters.maxPrice) {
                return false;
            }
            
            // تصفية عدد الغرف
            if (this.filters.rooms && property.rooms < parseInt(this.filters.rooms)) {
                return false;
            }
            
            // تصفية الميزات
            if (this.filters.features.length > 0) {
                const hasAllFeatures = this.filters.features.every(feature => 
                    property.features.includes(feature)
                );
                if (!hasAllFeatures) return false;
            }
            
            return true;
        });
    }
    
    // عرض النتائج
    displayResults(properties) {
        const grid = document.querySelector('.properties-grid');
        if (!grid) return;
        
        // تفريغ النتائج القديمة
        grid.innerHTML = '';
        
        if (properties.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>لم يتم العثور على نتائج</h3>
                    <p>جرب تغيير معايير البحث</p>
                    <button class="btn reset-filters">إعادة التعيين</button>
                </div>
            `;
            return;
        }
        
        // عرض العقارات
        properties.forEach(property => {
            const card = this.createPropertyCard(property);
            grid.appendChild(card);
        });
    }
    
    // إنشاء بطاقة عقار
    createPropertyCard(property) {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = `
            <div class="property-image">
                <span class="property-badge ${property.price < 1000 ? 'discount' : 'premium'}">
                    ${property.price < 1000 ? 'سعر مناسب' : 'مميز'}
                </span>
                <div class="property-rating">
                    <i class="fas fa-star"></i> ${property.rating}
                </div>
            </div>
            <div class="property-info">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.location}
                </p>
                <div class="property-features">
                    <span><i class="fas fa-bed"></i> ${property.rooms} غرف</span>
                    <span><i class="fas fa-bath"></i> ${property.bathrooms} حمام</span>
                    ${property.features.includes('wifi') ? '<span><i class="fas fa-wifi"></i> واي فاي</span>' : ''}
                </div>
                <div class="property-footer">
                    <div class="property-price">
                        <strong>${property.price.toLocaleString()}</strong>
                        <span>درهم/شهر</span>
                    </div>
                    <button class="property-btn view-btn" data-id="${property.id}">
                        <i class="fas fa-eye"></i>
                        عرض التفاصيل
                    </button>
                </div>
            </div>
        `;
        
        // إضافة حدث الزر
        const viewBtn = card.querySelector('.view-btn');
        viewBtn.addEventListener('click', () => this.viewProperty(property.id));
        
        return card;
    }
    
    // عرض تفاصيل العقار
    viewProperty(id) {
        // يمكنك هنا توجيه المستخدم لصفحة التفاصيل
        window.location.href = `listing.html?id=${id}`;
    }
    
    // تحديث عدد النتائج
    updateResultCount(count) {
        const countElement = document.getElementById('resultCount');
        if (countElement) {
            countElement.textContent = count;
        }
        
        // إشعار بعدد النتائج
        if (count === 0) {
            showNotification('لم يتم العثور على عقارات', 'warning');
        } else {
            showNotification(`تم العثور على ${count} عقار`, 'success');
        }
    }
    
    // إعادة تعيين الفلاتر
    resetFilters() {
        this.filters = {
            city: '',
            type: '',
            minPrice: 0,
            maxPrice: 5000,
            rooms: '',
            features: []
        };
        
        // إعادة تعيين واجهة المستخدم
        const cityInput = document.querySelector('input[placeholder*="المدينة"]');
        if (cityInput) cityInput.value = '';
        
        const typeSelect = document.querySelector('select');
        if (typeSelect) typeSelect.selectedIndex = 0;
        
        const budgetSlider = document.getElementById('budgetSlider');
        const budgetValue = document.getElementById('budgetValue');
        if (budgetSlider && budgetValue) {
            budgetSlider.value = 1500;
            budgetValue.textContent = '1500 درهم';
        }
        
        // إزالة النشط من أزرار الميزات
        document.querySelectorAll('.feature-filter.active').forEach(btn => {
            btn.classList.remove('active');
        });
        
        this.performSearch();
    }
    
    // البحث بعد تأخير (Debounce)
    debouncedSearch() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.performSearch(), 300);
    }
    
    // البحث المتقدم
    advancedSearch(criteria) {
        this.filters = { ...this.filters, ...criteria };
        this.performSearch();
    }
    
    // الحصول على العقارات المميزة
    getFeaturedProperties(limit = 3) {
        return this.properties
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }
    
    // الحصول على العقارات حسب المدينة
    getPropertiesByCity(city) {
        return this.properties.filter(p => p.city === city);
    }
}

// إنشاء نسخة واحدة من PropertySearch
const propertySearch = new PropertySearch();

// جعل الدوال متاحة عالمياً
window.propertySearch = propertySearch;
