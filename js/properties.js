// ===== PROPERTIES MANAGEMENT SYSTEM =====

class PropertyManager {
    constructor() {
        this.properties = [];
        this.currentProperty = null;
        this.favorites = new Set();
        this.init();
    }
    
    init() {
        this.loadProperties();
        this.loadFavorites();
        this.setupPropertyEvents();
    }
    
    // تحميل العقارات
    loadProperties() {
        // محاولة تحميل من API أولاً
        this.fetchProperties().then(properties => {
            if (properties && properties.length > 0) {
                this.properties = properties;
            } else {
                // استخدام بيانات تجريبية إذا فشل API
                this.loadSampleProperties();
            }
            this.renderProperties();
        }).catch(() => {
            this.loadSampleProperties();
            this.renderProperties();
        });
    }
    
    // جلب العقارات من API
    async fetchProperties() {
        try {
            if (window.api && api.isAuthenticated()) {
                return await api.getProperties();
            } else {
                return await api.get('/properties/public');
            }
        } catch (error) {
            console.warn('فشل جلب العقارات من API، استخدام البيانات المحلية');
            return null;
        }
    }
    
    // تحميل بيانات تجريبية
    loadSampleProperties() {
        this.properties = [
            {
                id: 1,
                title: 'شقة طلابية - الدار البيضاء',
                description: 'شقة طلابية مفروشة بالكامل، قريبة من الجامعة، تتوفر على جميع المرافق',
                city: 'الدار البيضاء',
                neighborhood: 'حي المعاريف',
                type: 'apartment',
                price: 1800,
                rooms: 2,
                bathrooms: 1,
                area: 70,
                features: ['wifi', 'furnished', 'kitchen', 'heating', 'elevator'],
                amenities: ['جامعة قريبة', 'مواصلات عامة', 'سوبرماركت', 'صيدلية'],
                images: [
                    'assets/images/properties/1/1.jpg',
                    'assets/images/properties/1/2.jpg',
                    'assets/images/properties/1/3.jpg'
                ],
                owner: {
                    id: 1,
                    name: 'محمد أحمد',
                    phone: '0612345678',
                    email: 'owner1@example.com',
                    rating: 4.8,
                    verified: true
                },
                availability: 'available',
                rating: 4.8,
                reviews: 24,
                createdAt: '2024-01-15',
                location: {
                    lat: 33.5731,
                    lng: -7.5898
                }
            },
            {
                id: 2,
                title: 'استوديو - الرباط',
                description: 'استوديو جديد مجهز بالكامل، موقع ممتاز بالقرب من المواصلات',
                city: 'الرباط',
                neighborhood: 'حي أكدال',
                type: 'studio',
                price: 1200,
                rooms: 1,
                bathrooms: 1,
                area: 45,
                features: ['wifi', 'furnished', 'parking', 'ac'],
                amenities: ['قرب المترو', 'مركز تجاري', 'مطاعم', 'حديقة'],
                images: [
                    'assets/images/properties/2/1.jpg',
                    'assets/images/properties/2/2.jpg'
                ],
                owner: {
                    id: 2,
                    name: 'فاطمة الزهراء',
                    phone: '0623456789',
                    email: 'owner2@example.com',
                    rating: 4.5,
                    verified: true
                },
                availability: 'available',
                rating: 4.5,
                reviews: 18,
                createdAt: '2024-02-10',
                location: {
                    lat: 34.0209,
                    lng: -6.8416
                }
            },
            {
                id: 3,
                title: 'غرفة في سكن مشترك - مراكش',
                description: 'غرفة في سكن مشترك، بيئة آمنة للطلاب، قريبة من الجامعة',
                city: 'مراكش',
                neighborhood: 'وسط المدينة',
                type: 'shared',
                price: 900,
                rooms: 1,
                bathrooms: 0, // مشترك
                area: 25,
                features: ['wifi', 'furnished', 'shared-kitchen', 'shared-bathroom'],
                amenities: ['قرب الجامعة', 'وسط المدينة', 'أسواق', 'مكتبة'],
                images: [
                    'assets/images/properties/3/1.jpg'
                ],
                owner: {
                    id: 3,
                    name: 'عبد الله كريم',
                    phone: '0634567890',
                    email: 'owner3@example.com',
                    rating: 4.2,
                    verified: false
                },
                availability: 'available',
                rating: 4.2,
                reviews: 12,
                createdAt: '2024-03-05',
                location: {
                    lat: 31.6295,
                    lng: -7.9811
                }
            },
            {
                id: 4,
                title: 'شقة عائلية - فاس',
                description: 'شقة عائلية مناسبة لمجموعة طلاب، مساحة واسعة وهادئة',
                city: 'فاس',
                neighborhood: 'حي السلام',
                type: 'apartment',
                price: 1500,
                rooms: 3,
                bathrooms: 2,
                area: 90,
                features: ['wifi', 'furnished', 'kitchen', 'parking', 'garden', 'ac'],
                amenities: ['حي هادئ', 'قرب الجامعة', 'حديقة', 'ساحة أطفال'],
                images: [
                    'assets/images/properties/4/1.jpg',
                    'assets/images/properties/4/2.jpg',
                    'assets/images/properties/4/3.jpg',
                    'assets/images/properties/4/4.jpg'
                ],
                owner: {
                    id: 4,
                    name: 'سعيد المراكشي',
                    phone: '0645678901',
                    email: 'owner4@example.com',
                    rating: 4.7,
                    verified: true
                },
                availability: 'booked',
                rating: 4.7,
                reviews: 31,
                createdAt: '2024-01-20',
                location: {
                    lat: 34.0181,
                    lng: -5.0078
                }
            },
            {
                id: 5,
                title: 'استوديو مع إطلالة - طنجة',
                description: 'استوديو مع إطلالة على البحر، موقع مميز قرب وسط المدينة',
                city: 'طنجة',
                neighborhood: 'وسط المدينة',
                type: 'studio',
                price: 1100,
                rooms: 1,
                bathrooms: 1,
                area: 40,
                features: ['wifi', 'furnished', 'sea-view', 'balcony', 'ac'],
                amenities: ['إطلالة على البحر', 'وسط المدينة', 'ميناء قريب', 'مقاهي'],
                images: [
                    'assets/images/properties/5/1.jpg',
                    'assets/images/properties/5/2.jpg'
                ],
                owner: {
                    id: 5,
                    name: 'حسن التطواني',
                    phone: '0656789012',
                    email: 'owner5@example.com',
                    rating: 4.4,
                    verified: true
                },
                availability: 'available',
                rating: 4.4,
                reviews: 15,
                createdAt: '2024-02-28',
                location: {
                    lat: 35.7595,
                    lng: -5.8340
                }
            },
            {
                id: 6,
                title: 'غرفة في فيلا - الدار البيضاء',
                description: 'غرفة في فيلا فاخرة، بيئة هادئة ومناسبة للدراسة',
                city: 'الدار البيضاء',
                neighborhood: 'حي القدس',
                type: 'room',
                price: 800,
                rooms: 1,
                bathrooms: 0,
                area: 20,
                features: ['wifi', 'furnished', 'garden', 'security', 'shared-kitchen'],
                amenities: ['فيلا فاخرة', 'حديقة', 'أمن 24/7', 'صالة رياضية'],
                images: [
                    'assets/images/properties/6/1.jpg',
                    'assets/images/properties/6/2.jpg'
                ],
                owner: {
                    id: 6,
                    name: 'ليلى بنعبد الله',
                    phone: '0667890123',
                    email: 'owner6@example.com',
                    rating: 4.0,
                    verified: true
                },
                availability: 'available',
                rating: 4.0,
                reviews: 8,
                createdAt: '2024-03-15',
                location: {
                    lat: 33.5563,
                    lng: -7.6616
                }
            }
        ];
    }
    
    // تحميل المفضلة
    loadFavorites() {
        try {
            const saved = localStorage.getItem('favorites');
            if (saved) {
                this.favorites = new Set(JSON.parse(saved));
            }
        } catch (error) {
            console.warn('فشل تحميل المفضلة');
        }
    }
    
    // حفظ المفضلة
    saveFavorites() {
        try {
            localStorage.setItem('favorites', JSON.stringify([...this.favorites]));
        } catch (error) {
            console.warn('فشل حفظ المفضلة');
        }
    }
    
    // إعداد أحداث العقارات
    setupPropertyEvents() {
        // البحث في الوقت الحقيقي
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProperties(e.target.value);
            });
        }
        
        // تصفية حسب المدينة
        const cityFilters = document.querySelectorAll('.city-filter');
        cityFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                this.filterByCity(filter.dataset.city);
            });
        });
        
        // تصفية حسب النوع
        const typeFilters = document.querySelectorAll('.type-filter');
        typeFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                this.filterByType(filter.dataset.type);
            });
        });
        
        // تصفية حسب السعر
        const priceFilter = document.getElementById('priceFilter');
        if (priceFilter) {
            priceFilter.addEventListener('change', (e) => {
                this.filterByPrice(e.target.value);
            });
        }
        
        // زر عرض المزيد
        const loadMoreBtn = document.querySelector('.load-more-properties');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreProperties());
        }
    }
    
    // عرض العقارات
    renderProperties(properties = this.properties) {
        const container = document.querySelector('.properties-grid');
        if (!container) return;
        
        if (properties.length === 0) {
            container.innerHTML = `
                <div class="no-properties">
                    <i class="fas fa-home"></i>
                    <h3>لا توجد عقارات متاحة</h3>
                    <p>جرب تغيير معايير البحث</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = properties.map(property => this.createPropertyCard(property)).join('');
        
        // إضافة أحداث للبطاقات الجديدة
        this.attachPropertyCardEvents();
    }
    
    // إنشاء بطاقة عقار
    createPropertyCard(property) {
        const isFavorite = this.favorites.has(property.id);
        const isBooked = property.availability === 'booked';
        
        return `
            <div class="property-card ${isBooked ? 'booked' : ''}" data-id="${property.id}">
                <div class="property-image">
                    <img src="${property.images[0] || 'assets/images/default-property.jpg'}" 
                         alt="${property.title}" 
                         loading="lazy">
                    
                    ${isBooked ? '<span class="property-badge booked">محجوز</span>' : ''}
                    ${property.price < 1000 ? '<span class="property-badge discount">سعر مناسب</span>' : ''}
                    ${property.rating >= 4.5 ? '<span class="property-badge premium">مميز</span>' : ''}
                    
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                            data-id="${property.id}"
                            title="${isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}">
                        <i class="fas ${isFavorite ? 'fa-heart' : 'fa-heart'}"></i>
                    </button>
                </div>
                
                <div class="property-info">
                    <div class="property-header">
                        <h3 class="property-title">${property.title}</h3>
                        <div class="property-rating">
                            <i class="fas fa-star"></i>
                            <span>${property.rating}</span>
                            <small>(${property.reviews})</small>
                        </div>
                    </div>
                    
                    <p class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${property.neighborhood}، ${property.city}
                    </p>
                    
                    <div class="property-features">
                        <span><i class="fas fa-bed"></i> ${property.rooms} غرف</span>
                        <span><i class="fas fa-bath"></i> ${property.bathrooms === 0 ? 'مشترك' : property.bathrooms + ' حمام'}</span>
                        <span><i class="fas fa-ruler-combined"></i> ${property.area} م²</span>
                    </div>
                    
                    <div class="property-footer">
                        <div class="property-price">
                            <strong>${property.price.toLocaleString()}</strong>
                            <span>درهم/شهر</span>
                        </div>
                        
                        <div class="property-actions">
                            <button class="btn btn-view" data-id="${property.id}">
                                <i class="fas fa-eye"></i>
                                عرض
                            </button>
                            
                            ${!isBooked ? `
                            <button class="btn btn-contact" data-id="${property.id}">
                                <i class="fas fa-phone"></i>
                                اتصل
                            </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // إرفاق أحداث بطاقات العقار
    attachPropertyCardEvents() {
        // أزرار المفضلة
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.toggleFavorite(id);
            });
        });
        
        // أزرار العرض
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                this.viewProperty(id);
            });
        });
        
        // أزرار الاتصال
        document.querySelectorAll('.btn-contact').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                this.contactOwner(id);
            });
        });
        
        // النقر على البطاقة
        document.querySelectorAll('.property-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.favorite-btn') && 
                    !e.target.closest('.btn-view') && 
                    !e.target.closest('.btn-contact')) {
                    const id = parseInt(card.dataset.id);
                    this.viewProperty(id);
                }
            });
        });
    }
    
    // تصفية العقارات
    filterProperties(searchTerm = '') {
        const filtered = this.properties.filter(property => {
            const searchLower = searchTerm.toLowerCase();
            
            return searchTerm === '' || 
                   property.title.toLowerCase().includes(searchLower) ||
                   property.description.toLowerCase().includes(searchLower) ||
                   property.city.toLowerCase().includes(searchLower) ||
                   property.neighborhood.toLowerCase().includes(searchLower);
        });
        
        this.renderProperties(filtered);
    }
    
    // تصفية حسب المدينة
    filterByCity(city) {
        if (!city) {
            this.renderProperties();
            return;
        }
        
        const filtered = this.properties.filter(property => 
            property.city === city
        );
        
        this.renderProperties(filtered);
    }
    
    // تصفية حسب النوع
    filterByType(type) {
        if (!type) {
            this.renderProperties();
            return;
        }
        
        const filtered = this.properties.filter(property => 
            property.type === type
        );
        
        this.renderProperties(filtered);
    }
    
    // تصفية حسب السعر
    filterByPrice(priceRange) {
        let filtered;
        
        switch (priceRange) {
            case 'low':
                filtered = this.properties.filter(p => p.price < 1000);
                break;
            case 'medium':
                filtered = this.properties.filter(p => p.price >= 1000 && p.price <= 2000);
                break;
            case 'high':
                filtered = this.properties.filter(p => p.price > 2000);
                break;
            default:
                filtered = this.properties;
        }
        
        this.renderProperties(filtered);
    }
    
    // تحميل المزيد من العقارات
    loadMoreProperties() {
        // محاكاة تحميل المزيد
        showNotification('جاري تحميل المزيد من العقارات...', 'info');
        
        setTimeout(() => {
            // في الواقع ستجلب من API
            const currentCount = document.querySelectorAll('.property-card').length;
            const remaining = this.properties.slice(currentCount, currentCount + 3);
            
            if (remaining.length > 0) {
                const container = document.querySelector('.properties-grid');
                remaining.forEach(property => {
                    container.insertAdjacentHTML('beforeend', this.createPropertyCard(property));
                });
                
                // إضافة أحداث للبطاقات الجديدة
                this.attachPropertyCardEvents();
                
                showNotification(`تم تحميل ${remaining.length} عقار إضافي`, 'success');
            } else {
                showNotification('لا توجد عقارات إضافية', 'info');
            }
        }, 1000);
    }
    
    // عرض تفاصيل العقار
    viewProperty(id) {
        const property = this.getPropertyById(id);
        if (!property) {
            showNotification('العقار غير موجود', 'error');
            return;
        }
        
        this.currentProperty = property;
        
        // حفظ العقار الأخير المعروض
        localStorage.setItem('lastViewedProperty', JSON.stringify(property));
        
        // توجيه لصفحة التفاصيل
        window.location.href = `listing.html?id=${id}`;
    }
    
    // الحصول على عقار بالمعرف
    getPropertyById(id) {
        return this.properties.find(p => p.id === id);
    }
    
    // إضافة/إزالة من المفضلة
    toggleFavorite(id) {
        const property = this.getPropertyById(id);
        if (!property) return;
        
        const favoriteBtn = document.querySelector(`.favorite-btn[data-id="${id}"]`);
        
        if (this.favorites.has(id)) {
            // إزالة من المفضلة
            this.favorites.delete(id);
            if (favoriteBtn) {
                favoriteBtn.classList.remove('active');
                favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
                favoriteBtn.title = 'إضافة للمفضلة';
            }
            showNotification('تمت الإزالة من المفضلة', 'info');
        } else {
            // إضافة للمفضلة
            this.favorites.add(id);
            if (favoriteBtn) {
                favoriteBtn.classList.add('active');
                favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
                favoriteBtn.title = 'إزالة من المفضلة';
            }
            showNotification('تمت الإضافة للمفضلة', 'success');
        }
        
        this.saveFavorites();
    }
    
    // الاتصال بالمالك
    contactOwner(id) {
        const property = this.getPropertyById(id);
        if (!property) return;
        
        const modal = this.createContactModal(property);
        document.body.appendChild(modal);
        
        // إظهار النافذة
        setTimeout(() => modal.classList.add('show'), 10);
    }
    
    // إنشاء نافذة الاتصال
    createContactModal(property) {
        const modal = document.createElement('div');
        modal.className = 'contact-modal';
        modal.innerHTML = `
            <div class="contact-modal-content">
                <div class="modal-header">
                    <h3>الاتصال بمالك العقار</h3>
                    <button class="modal-close">&times;</button>
                </div>
                
                <div class="modal-body">
                    <div class="property-info-summary">
                        <img src="${property.images[0] || 'assets/images/default-property.jpg'}" 
                             alt="${property.title}">
                        <div>
                            <h4>${property.title}</h4>
                            <p>${property.neighborhood}، ${property.city}</p>
                            <p class="price">${property.price.toLocaleString()} درهم/شهر</p>
                        </div>
                    </div>
                    
                    <div class="owner-info">
                        <h4>معلومات المالك</h4>
                        <p><i class="fas fa-user"></i> ${property.owner.name}</p>
                        <p><i class="fas fa-phone"></i> ${property.owner.phone}</p>
                        ${property.owner.verified ? '<p class="verified"><i class="fas fa-check-circle"></i> موثق</p>' : ''}
                    </div>
                    
                    <form class="contact-form">
                        <div class="form-group">
                            <label for="message">رسالتك</label>
                            <textarea id="message" 
                                      placeholder="اكتب رسالتك هنا..." 
                                      rows="4"
                                      required></textarea>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary modal-close">إلغاء</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-paper-plane"></i>
                                إرسال الرسالة
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // التصميم
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        modal.querySelector('.contact-modal-content').style.cssText = `
            background: white;
            border-radius: 15px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            transform: translateY(-20px);
            transition: transform 0.3s ease;
        `;
        
        // أحداث الإغلاق
        modal.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            });
        });
        
        // إغلاق بالنقر خارج المحتوى
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            }
        });
        
        // إرسال النموذج
        const form = modal.querySelector('.contact-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = form.querySelector('#message').value;
            
            // محاكاة إرسال الرسالة
            showNotification('جاري إرسال رسالتك...', 'info');
            
            setTimeout(() => {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                    showNotification('تم إرسال رسالتك بنجاح', 'success');
                    
                    // إرسال إشعار للمالك
                    if (notificationSystem) {
                        notificationSystem.createNotification(
                            'رسالة جديدة',
                            `لديك رسالة جديدة عن عقارك "${property.title}"`,
                            'message',
                            { propertyId: property.id }
                        );
                    }
                }, 300);
            }, 1500);
        });
        
        return modal;
    }
    
    // الحصول على العقارات المفضلة
    getFavoriteProperties() {
        return this.properties.filter(p => this.favorites.has(p.id));
    }
    
    // الحصول على العقارات حسب المدينة
    getPropertiesByCity(city) {
        return this.properties.filter(p => p.city === city);
    }
    
    // الحصول على العقارات حسب النوع
    getPropertiesByType(type) {
        return this.properties.filter(p => p.type === type);
    }
    
    // البحث المتقدم
    advancedSearch(criteria) {
        let results = this.properties;
        
        if (criteria.city) {
            results = results.filter(p => p.city === criteria.city);
        }
        
        if (criteria.type) {
            results = results.filter(p => p.type === criteria.type);
        }
        
        if (criteria.minPrice) {
            results = results.filter(p => p.price >= criteria.minPrice);
        }
        
        if (criteria.maxPrice) {
            results = results.filter(p => p.price <= criteria.maxPrice);
        }
        
        if (criteria.rooms) {
            results = results.filter(p => p.rooms >= criteria.rooms);
        }
        
        if (criteria.features && criteria.features.length > 0) {
            results = results.filter(p => 
                criteria.features.every(feature => p.features.includes(feature))
            );
        }
        
        return results;
    }
    
    // إضافة عقار جديد
    async addProperty(propertyData) {
        try {
            // في الواقع سترسل للـ API
            const newProperty = {
                id: Date.now(),
                ...propertyData,
                createdAt: new Date().toISOString(),
                availability: 'available',
                rating: 0,
                reviews: 0,
                owner: {
                    id: 1,
                    name: 'أنت',
                    verified: true
                }
            };
            
            this.properties.unshift(newProperty);
            this.renderProperties();
            
            showNotification('تم إضافة العقار بنجاح', 'success');
            
            return newProperty;
            
        } catch (error) {
            console.error('فشل إضافة العقار:', error);
            showNotification('فشل إضافة العقار', 'error');
            throw error;
        }
    }
    
    // تحديث عقار
    async updateProperty(id, propertyData) {
        const index = this.properties.findIndex(p => p.id === id);
        
        if (index === -1) {
            showNotification('العقار غير موجود', 'error');
            return;
        }
        
        this.properties[index] = { ...this.properties[index], ...propertyData };
        this.renderProperties();
        
        showNotification('تم تحديث العقار بنجاح', 'success');
    }
    
    // حذف عقار
    async deleteProperty(id) {
        if (!confirm('هل أنت متأكد من حذف هذا العقار؟')) {
            return;
        }
        
        const index = this.properties.findIndex(p => p.id === id);
        
        if (index === -1) {
            showNotification('العقار غير موجود', 'error');
            return;
        }
        
        this.properties.splice(index, 1);
        this.renderProperties();
        
        showNotification('تم حذف العقار بنجاح', 'success');
    }
    
    // حفظ العقار الأخير المعروض
    saveLastViewed(property) {
        localStorage.setItem('lastViewedProperty', JSON.stringify(property));
    }
    
    // تحميل العقار الأخير المعروض
    loadLastViewed() {
        try {
            const saved = localStorage.getItem('lastViewedProperty');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    }
    
    // الحصول على إحصائيات العقارات
    getPropertyStats() {
        const stats = {
            total: this.properties.length,
            available: this.properties.filter(p => p.availability === 'available').length,
            booked: this.properties.filter(p => p.availability === 'booked').length,
            byCity: {},
            byType: {},
            averagePrice: 0
        };
        
        // حسب المدينة
        this.properties.forEach(p => {
            stats.byCity[p.city] = (stats.byCity[p.city] || 0) + 1;
        });
        
        // حسب النوع
        this.properties.forEach(p => {
            stats.byType[p.type] = (stats.byType[p.type] || 0) + 1;
        });
        
        // متوسط السعر
        if (this.properties.length > 0) {
            const totalPrice = this.properties.reduce((sum, p) => sum + p.price, 0);
            stats.averagePrice = Math.round(totalPrice / this.properties.length);
        }
        
        return stats;
    }
}

// إنشاء نسخة واحدة من مدير العقارات
const propertyManager = new PropertyManager();

// جعل الدوال متاحة عالمياً
window.propertyManager = propertyManager;
