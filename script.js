// كود رئيسي للمنصة
document.addEventListener('DOMContentLoaded', function() {
    console.log('منصة سكن الطلاب جاهزة!');
    
    // 1. بحث السكن
    const searchBtn = document.getElementById('chercher');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const ville = document.getElementById('ville').value;
            const budget = document.getElementById('budget').value;
            const chambres = document.getElementById('chambres').value;
            
            if (!ville) {
                alert('الرجاء إدخال اسم المدينة');
                return;
            }
            
            console.log('بحث عن سكن:', { ville, budget, chambres });
            alert(`جاري البحث عن سكن في ${ville} بميزانية ${budget} درهم`);
        });
    }
    
    // 2. إضافة إعلان
    const addForm = document.getElementById('add-property-form');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const adresse = document.getElementById('adresse').value;
            const prix = document.getElementById('prix').value;
            const contact = document.getElementById('contact').value;
            
            if (!adresse || !prix || !contact) {
                alert('الرجاء ملء جميع الحقول الإلزامية');
                return;
            }
            
            console.log('إعلان جديد:', { adresse, prix, contact });
            alert(`تم إضافة الإعلان بنجاح!\nسيتم مراجعته قريباً`);
            
            // إعادة تعيين النموذج
            this.reset();
        });
    }
    
    // 3. رفع الصور
    const fileInput = document.getElementById('photos');
    const fileLabel = document.querySelector('.file-label');
    
    if (fileInput && fileLabel) {
        fileLabel.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileLabel.innerHTML = `<i class="fas fa-check-circle"></i> ${this.files.length} صورة مختارة`;
                fileLabel.style.background = 'rgba(40, 167, 69, 0.1)';
                fileLabel.style.borderColor = '#28a745';
                fileLabel.style.color = '#28a745';
            }
        });
    }
    
    // 4. التنقل السلس
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
    
    // 5. تفاعل أزرار التفاصيل
    document.querySelectorAll('.btn-details').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.property-card');
            const title = card.querySelector('h3').textContent;
            const location = card.querySelector('.property-location').textContent;
            const price = card.querySelector('strong').textContent;
            
            alert(`تفاصيل السكن:\n\n${title}\n${location}\n${price}\n\nللاستفسار: 0600-000000`);
        });
    });
});
