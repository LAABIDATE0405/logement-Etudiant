// ===== MULTI-LANGUAGE SYSTEM =====

class LanguageManager {
    constructor() {
        this.currentLang = 'ar';
        this.translations = {};
        this.init();
    }
    
    async init() {
        await this.loadTranslations();
        this.setupLanguageSwitcher();
        this.applyLanguage();
    }
    
    // تحميل الترجمات
    async loadTranslations() {
        try {
            // يمكن تحميل من ملفات JSON
            this.translations = {
                ar: await this.loadTranslationFile('ar'),
                fr: await this.loadTranslationFile('fr'),
                en: await this.loadTranslationFile('en')
            };
        } catch (error) {
            console.warn('فشل تحميل الترجمات، استخدام الترجمات الافتراضية');
            this.loadDefaultTranslations();
        }
        
        // تحميل اللغة المحفوظة
        const savedLang = localStorage.getItem('language') || 'ar';
        this.currentLang = savedLang;
    }
    
    // تحميل ملف ترجمة
    async loadTranslationFile(lang) {
        // في الواقع ستجلب من ملف JSON
        // return await fetch(`/translations/${lang}.json`).then(r => r.json());
        
        // ترجمات افتراضية
        return this.getDefaultTranslations(lang);
    }
    
    // تحميل الترجمات الافتراضية
    loadDefaultTranslations() {
        this.translations = {
            ar: this.getDefaultTranslations('ar'),
            fr: this.getDefaultTranslations('fr'),
            en: this.getDefaultTranslations('en')
        };
    }
    
    // الترجمات الافتراضية
    getDefaultTranslations(lang) {
        const translations = {
            ar: {
                // التنقل
                'nav.home': 'الرئيسية',
                'nav.search': 'بحث',
                'nav.add': 'إضافة',
                'nav.help': 'مساعدة',
                'nav.login': 'دخول',
                'nav.dashboard': 'لوحة التحكم',
                
                // الأزرار
                'btn.search': 'بحث',
                'btn.view': 'عرض التفاصيل',
                'btn.add': 'إضافة جديد',
                'btn.save': 'حفظ',
                'btn.cancel': 'إلغاء',
                'btn.submit': 'إرسال',
                'btn.delete': 'حذف',
                'btn.edit': 'تعديل',
                'btn.more': 'عرض المزيد',
                
                // العناوين
                'title.welcome': 'مرحباً بك في StudentStay',
                'title.search': 'ابحث عن سكن طلابي',
                'title.available': 'سكن متاح للطلاب',
                'title.add': 'إضافة سكن جديد',
                'title.features': 'مميزات المنصة',
                'title.contact': 'اتصل بنا',
                
                // النصوص
                'text.hero': 'أكثر من 1000 سكن متاح في 12 مدينة مغربية',
                'text.city': 'المدينة أو الجامعة',
                'text.propertyType': 'نوع السكن',
                'text.budget': 'الميزانية',
                'text.rooms': 'عدد الغرف',
                'text.location': 'الموقع',
                'text.price': 'السعر',
                'text.description': 'الوصف',
                'text.features': 'المميزات',
                'text.owner': 'صاحب العقار',
                'text.student': 'طالب',
                
                // الرسائل
                'message.loading': 'جاري التحميل...',
                'message.success': 'تمت العملية بنجاح',
                'message.error': 'حدث خطأ',
                'message.noResults': 'لم يتم العثور على نتائج',
                'message.loginRequired': 'يجب تسجيل الدخول',
                'message.confirmDelete': 'هل أنت متأكد من الحذف؟',
                
                // النماذج
                'form.fullName': 'الاسم الكامل',
                'form.email': 'البريد الإلكتروني',
                'form.phone': 'رقم الهاتف',
                'form.password': 'كلمة المرور',
                'form.confirmPassword': 'تأكيد كلمة المرور',
                'form.address': 'العنوان',
                'form.city': 'المدينة',
                'form.price': 'السعر الشهري',
                'form.description': 'وصف السكن',
                'form.images': 'صور السكن',
                
                // الأخطاء
                'error.required': 'هذا الحقل مطلوب',
                'error.email': 'بريد إلكتروني غير صالح',
                'error.phone': 'رقم هاتف غير صالح',
                'error.password': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
                'error.match': 'القيم غير متطابقة',
                'error.min': 'القيمة صغيرة جداً',
                'error.max': 'القيمة كبيرة جداً',
                
                // لوحة التحكم
                'dashboard.welcome': 'مرحباً',
                'dashboard.properties': 'عقاراتي',
                'dashboard.bookings': 'الحجوزات',
                'dashboard.messages': 'الرسائل',
                'dashboard.income': 'الدخل',
                'dashboard.settings': 'الإعدادات',
                'dashboard.logout': 'تسجيل الخروج',
                
                // التواريخ
                'date.today': 'اليوم',
                'date.yesterday': 'أمس',
                'date.thisWeek': 'هذا الأسبوع',
                'date.thisMonth': 'هذا الشهر',
                
                // الأيام
                'day.monday': 'الاثنين',
                'day.tuesday': 'الثلاثاء',
                'day.wednesday': 'الأربعاء',
                'day.thursday': 'الخميس',
                'day.friday': 'الجمعة',
                'day.saturday': 'السبت',
                'day.sunday': 'الأحد'
            },
            
            fr: {
                // التنقل
                'nav.home': 'Accueil',
                'nav.search': 'Rechercher',
                'nav.add': 'Ajouter',
                'nav.help': 'Aide',
                'nav.login': 'Connexion',
                'nav.dashboard': 'Tableau de bord',
                
                // الأزرار
                'btn.search': 'Rechercher',
                'btn.view': 'Voir détails',
                'btn.add': 'Ajouter nouveau',
                'btn.save': 'Enregistrer',
                'btn.cancel': 'Annuler',
                'btn.submit': 'Envoyer',
                'btn.delete': 'Supprimer',
                'btn.edit': 'Modifier',
                'btn.more': 'Voir plus',
                
                // العناوين
                'title.welcome': 'Bienvenue sur StudentStay',
                'title.search': 'Trouver un logement étudiant',
                'title.available': 'Logements disponibles',
                'title.add': 'Ajouter un logement',
                'title.features': 'Fonctionnalités',
                'title.contact': 'Contactez-nous',
                
                // النصوص
                'text.hero': 'Plus de 1000 logements disponibles dans 12 villes marocaines',
                'text.city': 'Ville ou université',
                'text.propertyType': 'Type de logement',
                'text.budget': 'Budget',
                'text.rooms': 'Nombre de chambres',
                'text.location': 'Emplacement',
                'text.price': 'Prix',
                'text.description': 'Description',
                'text.features': 'Caractéristiques',
                'text.owner': 'Propriétaire',
                'text.student': 'Étudiant',
                
                // الرسائل
                'message.loading': 'Chargement...',
                'message.success': 'Opération réussie',
                'message.error': 'Une erreur est survenue',
                'message.noResults': 'Aucun résultat trouvé',
                'message.loginRequired': 'Connexion requise',
                'message.confirmDelete': 'Êtes-vous sûr de vouloir supprimer ?',
                
                // النماذج
                'form.fullName': 'Nom complet',
                'form.email': 'Adresse email',
                'form.phone': 'Numéro de téléphone',
                'form.password': 'Mot de passe',
                'form.confirmPassword': 'Confirmer le mot de passe',
                'form.address': 'Adresse',
                'form.city': 'Ville',
                'form.price': 'Prix mensuel',
                'form.description': 'Description du logement',
                'form.images': 'Photos du logement',
                
                // الأخطاء
                'error.required': 'Ce champ est obligatoire',
                'error.email': 'Adresse email invalide',
                'error.phone': 'Numéro de téléphone invalide',
                'error.password': 'Le mot de passe doit contenir au moins 6 caractères',
                'error.match': 'Les valeurs ne correspondent pas',
                'error.min': 'Valeur trop petite',
                'error.max': 'Valeur trop grande',
                
                // لوحة التحكم
                'dashboard.welcome': 'Bienvenue',
                'dashboard.properties': 'Mes propriétés',
                'dashboard.bookings': 'Réservations',
                'dashboard.messages': 'Messages',
                'dashboard.income': 'Revenus',
                'dashboard.settings': 'Paramètres',
                'dashboard.logout': 'Déconnexion',
                
                // التواريخ
                'date.today': 'Aujourd\'hui',
                'date.yesterday': 'Hier',
                'date.thisWeek': 'Cette semaine',
                'date.thisMonth': 'Ce mois',
                
                // الأيام
                'day.monday': 'Lundi',
                'day.tuesday': 'Mardi',
                'day.wednesday': 'Mercredi',
                'day.thursday': 'Jeudi',
                'day.friday': 'Vendredi',
                'day.saturday': 'Samedi',
                'day.sunday': 'Dimanche'
            },
            
            en: {
                // Navigation
                'nav.home': 'Home',
                'nav.search': 'Search',
                'nav.add': 'Add',
                'nav.help': 'Help',
                'nav.login': 'Login',
                'nav.dashboard': 'Dashboard',
                
                // Buttons
                'btn.search': 'Search',
                'btn.view': 'View Details',
                'btn.add': 'Add New',
                'btn.save': 'Save',
                'btn.cancel': 'Cancel',
                'btn.submit': 'Submit',
                'btn.delete': 'Delete',
                'btn.edit': 'Edit',
                'btn.more': 'Show More',
                
                // Titles
                'title.welcome': 'Welcome to StudentStay',
                'title.search': 'Find Student Housing',
                'title.available': 'Available Properties',
                'title.add': 'Add New Property',
                'title.features': 'Platform Features',
                'title.contact': 'Contact Us',
                
                // Texts
                'text.hero': 'Over 1000 properties available in 12 Moroccan cities',
                'text.city': 'City or University',
                'text.propertyType': 'Property Type',
                'text.budget': 'Budget',
                'text.rooms': 'Number of Rooms',
                'text.location': 'Location',
                'text.price': 'Price',
                'text.description': 'Description',
                'text.features': 'Features',
                'text.owner': 'Owner',
                'text.student': 'Student',
                
                // Messages
                'message.loading': 'Loading...',
                'message.success': 'Operation successful',
                'message.error': 'An error occurred',
                'message.noResults': 'No results found',
                'message.loginRequired': 'Login required',
                'message.confirmDelete': 'Are you sure you want to delete?',
                
                // Forms
                'form.fullName': 'Full Name',
                'form.email': 'Email Address',
                'form.phone': 'Phone Number',
                'form.password': 'Password',
                'form.confirmPassword': 'Confirm Password',
                'form.address': 'Address',
                'form.city': 'City',
                'form.price': 'Monthly Price',
                'form.description': 'Property Description',
                'form.images': 'Property Images',
                
                // Errors
                'error.required': 'This field is required',
                'error.email': 'Invalid email address',
                'error.phone': 'Invalid phone number',
                'error.password': 'Password must be at least 6 characters',
                'error.match': 'Values do not match',
                'error.min': 'Value too small',
                'error.max': 'Value too large',
                
                // Dashboard
                'dashboard.welcome': 'Welcome',
                'dashboard.properties': 'My Properties',
                'dashboard.bookings': 'Bookings',
                'dashboard.messages': 'Messages',
                'dashboard.income': 'Income',
                'dashboard.settings': 'Settings',
                'dashboard.logout': 'Logout',
                
                // Dates
                'date.today': 'Today',
                'date.yesterday': 'Yesterday',
                'date.thisWeek': 'This Week',
                'date.thisMonth': 'This Month',
                
                // Days
                'day.monday': 'Monday',
                'day.tuesday': 'Tuesday',
                'day.wednesday': 'Wednesday',
                'day.thursday': 'Thursday',
                'day.friday': 'Friday',
                'day.saturday': 'Saturday',
                'day.sunday': 'Sunday'
            }
        };
        
        return translations[lang] || translations.ar;
    }
    
    // إعداد مبدل اللغة
    setupLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn, [data-change-lang]');
        
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                let lang = btn.dataset.lang || 
                          (btn.textContent.includes('Français') ? 'fr' : 
                           btn.textContent.includes('English') ? 'en' : 'ar');
                
                this.changeLanguage(lang);
            });
        });
    }
    
    // تغيير اللغة
    changeLanguage(lang) {
        if (!this.translations[lang]) {
            console.error(`اللغة ${lang} غير مدعومة`);
            return;
        }
        
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        
        this.applyLanguage();
        
        // تحديث الأزرار النشطة
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.includes(lang === 'ar' ? 'عربي' : 
                                       lang === 'fr' ? 'Français' : 'English')) {
                btn.classList.add('active');
            }
        });
        
        // إشعار
        showNotification(
            this.translate('message.success'),
            this.translate('message.languageChanged'),
            'success'
        );
    }
    
    // تطبيق اللغة على الصفحة
    applyLanguage() {
        // تحديث سمة اللغة في HTML
        document.documentElement.lang = this.currentLang;
        document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
        
        // ترجمة جميع العناصر
        this.translatePage();
    }
    
    // ترجمة الصفحة
    translatePage() {
        // العناصر ذات سمة البيانات
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            const translation = this.translate(key);
            
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else if (element.tagName === 'IMG' && element.hasAttribute('alt')) {
                    element.alt = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // العناصر ذات الفئة
        document.querySelectorAll('.translate').forEach(element => {
            const key = element.textContent.trim();
            const translation = this.translate(key);
            
            if (translation && translation !== key) {
                element.textContent = translation;
            }
        });
        
        // تحديث عنوان الصفحة
        const titleKey = document.querySelector('title')?.dataset?.translate;
        if (titleKey) {
            const translatedTitle = this.translate(titleKey);
            if (translatedTitle) {
                document.title = translatedTitle;
            }
        }
    }
    
    // ترجمة مفتاح
    translate(key, defaultValue = '') {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // إذا لم توجد ترجمة، حاول الإنجليزية
                if (this.currentLang !== 'en') {
                    value = this.translations['en'];
                    for (const k2 of keys) {
                        if (value && typeof value === 'object' && k2 in value) {
                            value = value[k2];
                        } else {
                            return defaultValue || key;
                        }
                    }
                } else {
                    return defaultValue || key;
                }
            }
        }
        
        return value || defaultValue || key;
    }
    
    // تنسيق التاريخ حسب اللغة
    formatDate(date, options = {}) {
        const d = new Date(date);
        const langFormats = {
            ar: { year: 'numeric', month: 'long', day: 'numeric' },
            fr: { year: 'numeric', month: 'long', day: 'numeric' },
            en: { year: 'numeric', month: 'long', day: 'numeric' }
        };
        
        return d.toLocaleDateString(this.currentLang, { 
            ...langFormats[this.currentLang], 
            ...options 
        });
    }
    
    // تنسيق الوقت
    formatTime(date, options = {}) {
        const d = new Date(date);
        return d.toLocaleTimeString(this.currentLang, options);
    }
    
    // تنسيق الأرقام
    formatNumber(number, options = {}) {
        return new Intl.NumberFormat(this.currentLang, options).format(number);
    }
    
    // الحصول على اللغة الحالية
    getCurrentLanguage() {
        return this.currentLang;
    }
    
    // الحصول على قائمة اللغات المدعومة
    getSupportedLanguages() {
        return Object.keys(this.translations);
    }
    
    // إضافة ترجمة ديناميكية
    addTranslation(lang, key, value) {
        if (!this.translations[lang]) {
            this.translations[lang] = {};
        }
        
        const keys = key.split('.');
        let obj = this.translations[lang];
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!obj[keys[i]] || typeof obj[keys[i]] !== 'object') {
                obj[keys[i]] = {};
            }
            obj = obj[keys[i]];
        }
        
        obj[keys[keys.length - 1]] = value;
    }
}

// إنشاء نسخة واحدة من مدير اللغة
const languageManager = new LanguageManager();

// جعل الدوال متاحة عالمياً
window.languageManager = languageManager;
window.translate = (key, defaultValue = '') => languageManager.translate(key, defaultValue);
window.changeLanguage = (lang) => languageManager.changeLanguage(lang);
