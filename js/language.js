// ===== MULTI-LANGUAGE SYSTEM WITH PAYMENT =====

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
                'title.payment': 'الدفع والاشتراكات',
                
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
                'message.languageChanged': 'تم تغيير اللغة',
                
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
                'day.sunday': 'الأحد',
                
                // ===== الدفع والاشتراكات =====
                'payment.title': 'الدفع والاشتراكات',
                'payment.ownerSubscriptions': 'اشتراكات الملاك',
                'payment.studentCommission': 'عمولة الطالب',
                'payment.selectPlan': 'اختر خطتك',
                'payment.basicPlan': 'الباقة البسيطة',
                'payment.premiumPlan': 'الباقة المتقدمة',
                'payment.proPlan': 'الباقة المحترفة',
                'payment.pricePerMonth': '/شهر',
                'payment.maxProperties': 'حد أقصى للعقارات',
                'payment.featuredListings': 'عقارات مميزة',
                'payment.prioritySupport': 'دعم أولوي',
                'payment.unlimitedProperties': 'عقارات غير محدودة',
                'payment.subscribeNow': 'اشترك الآن',
                'payment.commissionRate': 'عمولة %2 على الحجز',
                'payment.securePayment': 'دفع آمن',
                'payment.paymentMethods': 'طرق الدفع',
                'payment.cih': 'البنك المغربي للتجارة الخارجية',
                'payment.attijari': 'أتجياري باي',
                'payment.paypal': 'باي بال',
                'payment.card': 'بطاقة ائتمان',
                'payment.transactionHistory': 'سجل المعاملات',
                'payment.date': 'التاريخ',
                'payment.amount': 'المبلغ',
                'payment.status': 'الحالة',
                'payment.status.paid': 'مدفوع',
                'payment.status.pending': 'قيد الانتظار',
                'payment.status.failed': 'فشل',
                'payment.renewSubscription': 'جدد اشتراكك',
                'payment.upgradePlan': 'ترقية الباقة',
                'payment.mostPopular': 'الأكثر شعبية',
                'payment.commissionNote': 'العمولة تضمن خدمة آمنة وموثوقة للطالب مع دعم كامل خلال فترة الإيجار',
                'payment.allTransactionsEncrypted': 'جميع المعاملات مشفرة وآمنة'
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
                'title.payment': 'Paiements et Abonnements',
                
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
                'message.languageChanged': 'Langue changée',
                
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
                'day.sunday': 'Dimanche',
                
                // ===== الدفع والاشتراكات =====
                'payment.title': 'Paiements et Abonnements',
                'payment.ownerSubscriptions': 'Abonnements Propriétaires',
                'payment.studentCommission': 'Commission Étudiant',
                'payment.selectPlan': 'Choisissez votre forfait',
                'payment.basicPlan': 'Forfait Basique',
                'payment.premiumPlan': 'Forfait Premium',
                'payment.proPlan': 'Forfait Pro',
                'payment.pricePerMonth': '/mois',
                'payment.maxProperties': 'Propriétés max',
                'payment.featuredListings': 'Annonces en vedette',
                'payment.prioritySupport': 'Support prioritaire',
                'payment.unlimitedProperties': 'Propriétés illimitées',
                'payment.subscribeNow': 'S\'abonner maintenant',
                'payment.commissionRate': 'Commission 2% sur réservation',
                'payment.securePayment': 'Paiement sécurisé',
                'payment.paymentMethods': 'Modes de paiement',
                'payment.cih': 'CIH Bank',
                'payment.attijari': 'Attijari Pay',
                'payment.paypal': 'PayPal',
                'payment.card': 'Carte de crédit',
                'payment.transactionHistory': 'Historique des transactions',
                'payment.date': 'Date',
                'payment.amount': 'Montant',
                'payment.status': 'Statut',
                'payment.status.paid': 'Payé',
                'payment.status.pending': 'En attente',
                'payment.status.failed': 'Échoué',
                'payment.renewSubscription': 'Renouveler l\'abonnement',
                'payment.upgradePlan': 'Mettre à niveau',
                'payment.mostPopular': 'Le plus populaire',
                'payment.commissionNote': 'La commission garantit un service sécurisé et fiable pour l\'étudiant avec un support complet pendant la location',
                'payment.allTransactionsEncrypted': 'Toutes les transactions sont cryptées et sécurisées'
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
                'title.payment': 'Payments & Subscriptions',
                
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
                'message.languageChanged': 'Language changed',
                
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
                'day.sunday': 'Sunday',
                
                // ===== PAYMENT AND SUBSCRIPTIONS =====
                'payment.title': 'Payments & Subscriptions',
                'payment.ownerSubscriptions': 'Owner Subscriptions',
                'payment.studentCommission': 'Student Commission',
                'payment.selectPlan': 'Choose Your Plan',
                'payment.basicPlan': 'Basic Plan',
                'payment.premiumPlan': 'Premium Plan',
                'payment.proPlan': 'Pro Plan',
                'payment.pricePerMonth': '/month',
                'payment.maxProperties': 'Max Properties',
                'payment.featuredListings': 'Featured Listings',
                'payment.prioritySupport': 'Priority Support',
                'payment.unlimitedProperties': 'Unlimited Properties',
                'payment.subscribeNow': 'Subscribe Now',
                'payment.commissionRate': '2% Commission on Booking',
                'payment.securePayment': 'Secure Payment',
                'payment.paymentMethods': 'Payment Methods',
                'payment.cih': 'CIH Bank',
                'payment.attijari': 'Attijari Pay',
                'payment.paypal': 'PayPal',
                'payment.card': 'Credit Card',
                'payment.transactionHistory': 'Transaction History',
                'payment.date': 'Date',
                'payment.amount': 'Amount',
                'payment.status': 'Status',
                'payment.status.paid': 'Paid',
                'payment.status.pending': 'Pending',
                'payment.status.failed': 'Failed',
                'payment.renewSubscription': 'Renew Subscription',
                'payment.upgradePlan': 'Upgrade Plan',
                'payment.mostPopular': 'Most Popular',
                'payment.commissionNote': 'Commission ensures secure and reliable service for students with full support during the rental period',
                'payment.allTransactionsEncrypted': 'All transactions are encrypted and secure'
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
                    <h3 style="margin: 0; color: #333;">${this.translate('payment.upgradePlan')}</h3>
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
                        ${this.translate('btn.cancel')}
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
                        <h4 style="margin: 0; color: ${plan.color};">${this.translate(`payment.${plan.name}Plan`)}</h4>
                        <div style="font-size: 24px; font-weight: bold; color: ${plan.color};">
                            ${plan.price} ${this.translate('payment.pricePerMonth').replace('/', '')}
                            <small style="font-size: 14px; color: #666;">${this.translate('payment.pricePerMonth')}</small>
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
                        ${this.translate('payment.subscribeNow')}
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
            showNotification(this.translate('message.error'), 'الباقة غير موجودة', 'error');
            return;
        }
        
        // محاكاة عملية الدفع
        showNotification(this.translate('message.loading'), 'جاري تحويلك لصفحة الدفع...', 'info');
        
        // محاكاة انتظار الدفع
        setTimeout(async () => {
            // محاكاة نجاح الدفع
            this.currentUserPlan = plan;
            localStorage.setItem('userSubscription', planName);
            
            showNotification(
                this.translate('message.success'),
                `تم الاشتراك في الباقة ${this.translate(`payment.${planName}Plan`)} بنجاح!`,
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
                <h3 style="text-align: center; margin-bottom: 20px;">${this.translate('payment.transactionHistory')}</h3>
                <div style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead style="background: #4361ee; color: white;">
                            <tr>
                                <th style="padding: 15px; text-align: right;">${this.translate('payment.date')}</th>
                                <th style="padding: 15px; text-align: right;">${this.translate('payment.amount')}</th>
                                <th style="padding: 15px; text-align: right;">${this.translate('payment.status')}</th>
                                <th style="padding: 15px; text-align: right;">النوع</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        transactions.forEach(transaction => {
            const date = new Date(transaction.date).toLocaleDateString('ar-EG');
            const amount = transaction.amount.toFixed(2);
            const status = transaction.status === 'completed' ? this.translate('payment.status.paid') : 
                          transaction.status === 'pending' ? this.translate('payment.status.pending') : 
                          this.translate('payment.status.failed');
            
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
        
        if (confirm(`هل تريد تجديد اشتراك ${this.translate(`payment.${this.currentUserPlan.name}Plan`)} بقيمة ${this.currentUserPlan.price} درهم؟`)) {
            this.selectPlan(this.currentUserPlan.name);
        }
    }
    
    // الحصول على عدد عقارات المستخدم
    getUserPropertiesCount() {
        // محاكاة - في الواقع يجب جلب من قاعدة البيانات
        return parseInt(localStorage.getItem('userPropertiesCount') || '0');
    }
    
    // دالة الترجمة المساعدة
    translate(key) {
        if (window.languageManager) {
            return window.languageManager.translate(key);
        }
        return key;
    }
}

// ===== GLOBAL FUNCTIONS =====

// إنشاء نسخة واحدة من مدير اللغة
const languageManager = new LanguageManager();

// إنشاء نسخة واحدة من مدير الدفع
const paymentManager = new PaymentManager();

// دالة عرض الإشعارات
function showNotification(title, message = '', type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'quick-notification';
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';
    
    notification.innerHTML = `
        <div class="notification-content">
            <span>${icon} <strong>${title}</strong> ${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#06d6a0' : 
                    type === 'error' ? '#ef476f' : 
                    type === 'warning' ? '#ffd166' : '#4361ee'};
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
    closeBtn.addEventListener('click', function() {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // إضافة للصفحة
    document.body.appendChild(notification);
    
    // إزالة تلقائية بعد 5 ثواني
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// جعل الدوال متاحة عالمياً
window.languageManager = languageManager;
window.paymentManager = paymentManager;
window.translate = (key, defaultValue = '') => languageManager.translate(key, defaultValue);
window.changeLanguage = (lang) => languageManager.changeLanguage(lang);
window.showNotification = showNotification;
window.calculateCommission = (amount) => paymentManager.calculateCommission(amount);
