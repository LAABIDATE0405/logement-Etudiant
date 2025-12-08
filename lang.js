// الترجمات
const translations = {
    ar: {
        app_name: "سكن الطلاب",
        search_housing: "البحث عن سكن",
        add_listing: "إضافة إعلان",
        help: "المساعدة",
        login: "تسجيل الدخول",
        search_title: "ابحث عن سكنك المثالي",
        search_subtitle: "أكثر من 500 سكن متاح للطلاب في مختلف المدن",
        city_placeholder: "أدخل اسم المدينة",
        budget_placeholder: "الميزانية الشهرية (درهم)",
        rooms_placeholder: "عدد الغرف",
        search_button: "بحث",
        available_housing: "السكن المتاح",
        add_listing_subtitle: "شارك سكنك مع الطلاب واحصل على دخل إضافي",
        full_address: "العنوان الكامل",
        monthly_price: "السعر الشهري (درهم)",
        rooms_number: "عدد الغرف",
        description: "الوصف",
        photos: "صور السكن",
        choose_files: "اختر صور السكن",
        contact_info: "معلومات الاتصال",
        phone_placeholder: "رقم الهاتف",
        publish_button: "نشر الإعلان",
        quick_links: "روابط سريعة",
        terms: "شروط الاستخدام",
        privacy: "الخصوصية",
        contact_us: "اتصل بنا",
        rights_reserved: "جميع الحقوق محفوظة"
    },
    fr: {
        app_name: "Logement Étudiant",
        search_housing: "Rechercher un logement",
        add_listing: "Ajouter une annonce",
        help: "Aide",
        login: "Se connecter",
        search_title: "Trouvez votre logement idéal",
        search_subtitle: "Plus de 500 logements disponibles pour étudiants",
        city_placeholder: "Entrez le nom de la ville",
        budget_placeholder: "Budget mensuel (DH)",
        rooms_placeholder: "Nombre de chambres",
        search_button: "Rechercher",
        available_housing: "Logements disponibles",
        add_listing_subtitle: "Partagez votre logement avec des étudiants",
        full_address: "Adresse complète",
        monthly_price: "Prix mensuel (DH)",
        rooms_number: "Nombre de chambres",
        description: "Description",
        photos: "Photos du logement",
        choose_files: "Choisir des photos",
        contact_info: "Informations de contact",
        phone_placeholder: "Numéro de téléphone",
        publish_button: "Publier l'annonce",
        quick_links: "Liens rapides",
        terms: "Conditions d'utilisation",
        privacy: "Confidentialité",
        contact_us: "Contactez-nous",
        rights_reserved: "Tous droits réservés"
    }
};

// تغيير اللغة
function changeLanguage(lang) {
    // اتجاه الصفحة
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // ترجمة النصوص
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // ترجمة placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(input => {
        const key = input.getAttribute('data-translate-placeholder');
        if (translations[lang] && translations[lang][key]) {
            input.placeholder = translations[lang][key];
        }
    });
    
    // حفظ اللغة
    localStorage.setItem('language', lang);
    
    // تحديث أزرار اللغة
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إضافة أزرار اللغة
    const navbar = document.querySelector('.navbar .container');
    if (navbar && !document.querySelector('.language-switcher')) {
        const languageSwitcher = document.createElement('div');
        languageSwitcher.className = 'language-switcher';
        languageSwitcher.innerHTML = `
            <button class="lang-btn" data-lang="ar">العربية</button>
            <button class="lang-btn" data-lang="fr">Français</button>
        `;
        navbar.appendChild(languageSwitcher);
    }
    
    // تحميل اللغة المحفوظة
    const savedLang = localStorage.getItem('language') || 'ar';
    changeLanguage(savedLang);
    
    // أحداث أزرار اللغة
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('lang-btn')) {
            const lang = e.target.getAttribute('data-lang');
            changeLanguage(lang);
        }
    });
});
