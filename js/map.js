// ===== MAPS & LOCATION SYSTEM =====

class MapManager {
    constructor() {
        this.map = null;
        this.markers = [];
        this.userLocation = null;
        this.init();
    }
    
    async init() {
        await this.loadMapsAPI();
        this.setupLocationServices();
    }
    
    // تحميل API الخرائط
    async loadMapsAPI() {
        // يمكنك استخدام Google Maps أو Leaflet أو OpenStreetMap
        // هذا مثال باستخدام Leaflet (مجاني)
        
        if (typeof L === 'undefined') {
            await this.loadLeaflet();
        }
    }
    
    // تحميل Leaflet
    async loadLeaflet() {
        return new Promise((resolve, reject) => {
            // تحميل CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
            link.crossOrigin = '';
            document.head.appendChild(link);
            
            // تحميل JS
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
            script.crossOrigin = '';
            
            script.onload = resolve;
            script.onerror = reject;
            
            document.head.appendChild(script);
        });
    }
    
    // إعداد خدمات الموقع
    setupLocationServices() {
        // زر تحديد الموقع
        const locateBtn = document.getElementById('locateMe');
        if (locateBtn) {
            locateBtn.addEventListener('click', () => this.locateUser());
        }
        
        // حقل البحث عن الموقع
        const locationInput = document.getElementById('locationInput');
        if (locationInput) {
            this.setupLocationAutocomplete(locationInput);
        }
    }
    
    // تهيئة الخريطة
    initMap(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`الحاوية ${containerId} غير موجودة`);
            return null;
        }
        
        const defaultOptions = {
            center: [31.7917, -7.0926], // وسط المغرب
            zoom: 6,
            zoomControl: true,
            scrollWheelZoom: true,
            dragging: true,
            touchZoom: true,
            doubleClickZoom: true,
            boxZoom: true,
            keyboard: true
        };
        
        const mapOptions = { ...defaultOptions, ...options };
        
        this.map = L.map(containerId).setView(mapOptions.center, mapOptions.zoom);
        
        // إضافة طبقة الخريطة
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.map);
        
        // إضافة عناصر التحكم
        this.addMapControls();
        
        return this.map;
    }
    
    // إضافة عناصر تحكم للخريطة
    addMapControls() {
        if (!this.map) return;
        
        // زر تحديد الموقع
        L.control.locate({
            position: 'topright',
            strings: {
                title: "تحديد موقعي"
            },
            locateOptions: {
                maxZoom: 16
            }
        }).addTo(this.map);
        
        // مقياس الرسم
        L.control.scale({
            imperial: false,
            metric: true,
            position: 'bottomleft'
        }).addTo(this.map);
    }
    
    // تحديد موقع المستخدم
    async locateUser() {
        if (!navigator.geolocation) {
            showNotification('المتصفح لا يدعم تحديد الموقع', 'error');
            return;
        }
        
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            });
            
            this.userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
            
            // نقل الخريطة للموقع
            if (this.map) {
                this.map.setView([this.userLocation.lat, this.userLocation.lng], 14);
                this.addUserMarker();
            }
            
            showNotification('تم تحديد موقعك بنجاح', 'success');
            
            return this.userLocation;
            
        } catch (error) {
            console.error('فشل تحديد الموقع:', error);
            
            const messages = {
                PERMISSION_DENIED: 'تم رفض إذن الموقع',
                POSITION_UNAVAILABLE: 'معلومات الموقع غير متاحة',
                TIMEOUT: 'انتهت مهلة طلب الموقع'
            };
            
            showNotification(messages[error.code] || 'فشل تحديد الموقع', 'error');
            return null;
        }
    }
    
    // إضافة علامة المستخدم
    addUserMarker() {
        if (!this.map || !this.userLocation) return;
        
        // إزالة العلامات القديمة
        this.clearMarkers();
        
        // إنشاء أيقونة مخصصة
        const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: '<i class="fas fa-map-marker-alt"></i>',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
        
        // إضافة العلامة
        const marker = L.marker([this.userLocation.lat, this.userLocation.lng], {
            icon: userIcon,
            title: 'موقعك الحالي'
        }).addTo(this.map);
        
        // إضافة نافذة منبثقة
        marker.bindPopup(`
            <div class="location-popup">
                <h4>موقعك الحالي</h4>
                <p>الدقة: ${Math.round(this.userLocation.accuracy)} متر</p>
                <button class="btn use-this-location">استخدام هذا الموقع</button>
            </div>
        `).openPopup();
        
        this.markers.push(marker);
        
        // دائرة الدقة
        if (this.userLocation.accuracy < 1000) {
            L.circle([this.userLocation.lat, this.userLocation.lng], {
                color: '#4361ee',
                fillColor: '#4361ee',
                fillOpacity: 0.1,
                radius: this.userLocation.accuracy
            }).addTo(this.map);
        }
    }
    
    // إضافة علامات للعقارات
    addPropertyMarkers(properties) {
        if (!this.map) return;
        
        // إزالة العلامات القديمة
        this.clearMarkers();
        
        properties.forEach(property => {
            if (property.latitude && property.longitude) {
                const marker = this.createPropertyMarker(property);
                this.markers.push(marker);
            }
        });
        
        // ضبط حدود الخريطة لتناسب جميع العلامات
        if (this.markers.length > 0) {
            const group = L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }
    
    // إنشاء علامة عقار
    createPropertyMarker(property) {
        // أيقونة مخصصة حسب نوع العقار
        const icon = L.divIcon({
            className: `property-marker ${property.type}`,
            html: `
                <div class="marker-container">
                    <i class="fas fa-${this.getPropertyIcon(property.type)}"></i>
                    <span class="marker-price">${property.price}د</span>
                </div>
            `,
            iconSize: [50, 50],
            iconAnchor: [25, 50],
            popupAnchor: [0, -45]
        });
        
        const marker = L.marker([property.latitude, property.longitude], {
            icon: icon,
            title: property.title
        }).addTo(this.map);
        
        // النافذة المنبثقة
        const popupContent = `
            <div class="property-popup">
                <div class="property-popup-image">
                    <img src="${property.image || 'assets/images/default-property.jpg'}" alt="${property.title}">
                </div>
                <div class="property-popup-content">
                    <h4>${property.title}</h4>
                    <p class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${property.location}
                    </p>
                    <div class="property-features">
                        <span><i class="fas fa-bed"></i> ${property.rooms} غرف</span>
                        <span><i class="fas fa-bath"></i> ${property.bathrooms} حمام</span>
                    </div>
                    <div class="property-price">
                        <strong>${property.price.toLocaleString()} درهم</strong>
                        <span>/شهر</span>
                    </div>
                    <div class="property-actions">
                        <a href="listing.html?id=${property.id}" class="btn btn-view">عرض التفاصيل</a>
                        <button class="btn btn-directions" data-lat="${property.latitude}" data-lng="${property.longitude}">
                            <i class="fas fa-route"></i> الاتجاهات
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent, {
            maxWidth: 300,
            minWidth: 250
        });
        
        // أحداث النقر
        marker.on('click', () => {
            // يمكنك إضافة تفاعلات إضافية هنا
        });
        
        return marker;
    }
    
    // الحصول على أيقونة العقار
    getPropertyIcon(type) {
        const icons = {
            apartment: 'building',
            studio: 'home',
            room: 'door-open',
            shared: 'users',
            villa: 'house-user'
        };
        return icons[type] || 'home';
    }
    
    // إزالة جميع العلامات
    clearMarkers() {
        this.markers.forEach(marker => {
            if (marker && marker.remove) {
                marker.remove();
            }
        });
        this.markers = [];
    }
    
    // البحث عن موقع
    async searchLocation(query) {
        try {
            // استخدام Nominatim (OpenStreetMap)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=ar`
            );
            
            const results = await response.json();
            
            return results.map(result => ({
                name: result.display_name,
                lat: parseFloat(result.lat),
                lng: parseFloat(result.lon),
                type: result.type,
                importance: result.importance
            }));
            
        } catch (error) {
            console.error('فشل البحث عن موقع:', error);
            return [];
        }
    }
    
    // الإكمال التلقائي للمواقع
    setupLocationAutocomplete(input) {
        let timeout;
        
        input.addEventListener('input', (e) => {
            clearTimeout(timeout);
            
            timeout = setTimeout(async () => {
                const query = e.target.value.trim();
                
                if (query.length < 3) {
                    this.hideAutocomplete();
                    return;
                }
                
                const results = await this.searchLocation(query);
                
                if (results.length > 0) {
                    this.showAutocomplete(input, results);
                } else {
                    this.hideAutocomplete();
                }
            }, 300);
        });
        
        // إخفاء عند فقدان التركيز
        input.addEventListener('blur', () => {
            setTimeout(() => this.hideAutocomplete(), 200);
        });
    }
    
    // عرض قائمة الإكمال التلقائي
    showAutocomplete(input, results) {
        // إزالة القائمة القديمة
        this.hideAutocomplete();
        
        // إنشاء القائمة
        const list = document.createElement('ul');
        list.className = 'location-autocomplete';
        list.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-top: 5px;
            max-height: 300px;
            overflow-y: auto;
            z-index: 1000;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        `;
        
        // إضافة النتائج
        results.forEach(result => {
            const item = document.createElement('li');
            item.textContent = result.name;
            item.style.cssText = `
                padding: 10px 15px;
                cursor: pointer;
                border-bottom: 1px solid #eee;
                transition: background 0.2s;
            `;
            
            item.addEventListener('mouseenter', () => {
                item.style.background = '#f8f9fa';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.background = 'white';
            });
            
            item.addEventListener('click', () => {
                input.value = result.name;
                this.hideAutocomplete();
                
                // نقل الخريطة للموقع
                if (this.map) {
                    this.map.setView([result.lat, result.lng], 13);
                    
                    // إضافة علامة
                    const marker = L.marker([result.lat, result.lng])
                        .addTo(this.map)
                        .bindPopup(result.name)
                        .openPopup();
                    
                    this.markers.push(marker);
                }
            });
            
            list.appendChild(item);
        });
        
        // إضافة للصفحة
        input.parentNode.appendChild(list);
    }
    
    // إخفاء قائمة الإكمال التلقائي
    hideAutocomplete() {
        const existingList = document.querySelector('.location-autocomplete');
        if (existingList) {
            existingList.remove();
        }
    }
    
    // حساب المسافة بين نقطتين
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // نصف قطر الأرض بالكيلومترات
        const dLat = this.toRad(lat2 - lat1);
        const dLng = this.toRad(lng2 - lng1);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        
        return distance; // بالكيلومترات
    }
    
    // التحويل إلى راديان
    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }
    
    // فتح الاتجاهات
    openDirections(lat, lng, name = '') {
        // إذا كان موقع المستخدم معروفاً
        if (this.userLocation) {
            const url = `https://www.google.com/maps/dir/${this.userLocation.lat},${this.userLocation.lng}/${lat},${lng}`;
            window.open(url, '_blank');
        } else {
            // طلب تحديد الموقع أولاً
            if (confirm('لتحديد الاتجاهات، يرجى السماح بتحديد موقعك')) {
                this.locateUser().then(() => {
                    if (this.userLocation) {
                        const url = `https://www.google.com/maps/dir/${this.userLocation.lat},${this.userLocation.lng}/${lat},${lng}`;
                        window.open(url, '_blank');
                    }
                });
            }
        }
    }
    
    // إنشاء خريطة ثابتة (بدون تفاعل)
    createStaticMap(lat, lng, width = 400, height = 300) {
        const zoom = 15;
        const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&markers=color:red%7C${lat},${lng}&key=YOUR_API_KEY`;
        
        // يمكنك استخدام OpenStreetMap كبديل مجاني
        const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
        
        return osmUrl;
    }
    
    // الحصول على اسم الموقع من الإحداثيات
    async reverseGeocode(lat, lng) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
            );
            
            const result = await response.json();
            
            return {
                address: result.display_name,
                city: result.address.city || result.address.town || result.address.village,
                country: result.address.country
            };
            
        } catch (error) {
            console.error('فشل في reverse geocoding:', error);
            return null;
        }
    }
    
    // رسم دائرة نصف قطر البحث
    drawSearchRadius(lat, lng, radiusKm) {
        if (!this.map) return;
        
        // إزالة الدوائر القديمة
        this.clearCircles();
        
        // إضافة دائرة
        const circle = L.circle([lat, lng], {
            color: '#4361ee',
            fillColor: '#4361ee',
            fillOpacity: 0.1,
            radius: radiusKm * 1000 // تحويل لكيلومترات
        }).addTo(this.map);
        
        // إضافة نافذة منبثقة
        circle.bindPopup(`نصف قطر البحث: ${radiusKm} كم`);
        
        this.circles = this.circles || [];
        this.circles.push(circle);
    }
    
    // إزالة الدوائر
    clearCircles() {
        if (this.circles) {
            this.circles.forEach(circle => circle.remove());
            this.circles = [];
        }
    }
}

// إنشاء نسخة واحدة من مدير الخرائط
const mapManager = new MapManager();

// جعل الدوال متاحة عالمياً
window.mapManager = mapManager;
