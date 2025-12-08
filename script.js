// main.js
document.addEventListener('DOMContentLoaded', function() {
    // البحث عن سكن
    const searchBtn = document.getElementById('chercher');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const ville = document.getElementById('ville').value;
            const budget = document.getElementById('budget').value;
            const chambres = document.getElementById('chambres').value;
            
            // هنا يمكن إضافة كود البحث (API call)
            alert(`بحث: مدينة ${ville}, ميزانية ${budget} درهم, ${chambres} غرف`);
        });
    }
    
    // فلترة النتائج
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            filterChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // هنا يمكن إضافة كود التصفية
            console.log(`تصفية حسب: ${this.textContent}`);
        });
    });
    
    // رفع الصور
    const fileInput = document.getElementById('photos');
    const filePreview = document.getElementById('file-preview');
    
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            filePreview.innerHTML = '';
            
            for (let file of this.files) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.width = '100px';
                    img.style.height = '100px';
                    img.style.objectFit = 'cover';
                    img.style.margin = '5px';
                    img.style.borderRadius = '5px';
                    filePreview.appendChild(img);
                }
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // إضافة إعلان جديد
    const addForm = document.getElementById('add-property-form');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const adresse = document.getElementById('adresse').value;
            const prix = document.getElementById('prix').value;
            const chambres = document.getElementById('chambres').value;
            const description = document.getElementById('description').value;
            const contact = document.getElementById('contact').value;
            
            // هنا يمكن إضافة كود الإرسال إلى الخادم
            alert(`تم إضافة الإعلان بنجاح!\nالعنوان: ${adresse}\nالسعر: ${prix} درهم`);
            
            // إعادة تعيين النموذج
            this.reset();
            filePreview.innerHTML = '';
        });
    }
    
    // التنقل بين الأقسام
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hash) {
                e.preventDefault();
                
                const targetId = this.hash.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
