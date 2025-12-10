// ===== FORM VALIDATION MODULE =====

class FormValidator {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupPropertyForm();
        this.setupContactForm();
        this.setupAllForms();
    }
    
    // إعداد جميع النماذج تلقائياً
    setupAllForms() {
        document.querySelectorAll('form').forEach(form => {
            this.setupForm(form);
        });
    }
    
    // إعداد نموذج معين
    setupForm(form) {
        form.setAttribute('novalidate', '');
        
        // التحقق عند الإرسال
        form.addEventListener('submit', (e) => this.validateForm(e, form));
        
        // التحقق أثناء الكتابة
        form.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    // إعداد نموذج إضافة العقار
    setupPropertyForm() {
        const form = document.getElementById('addPropertyForm');
        if (!form) return;
        
        // رفع الملفات
        const fileInput = form.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }
        
        // عرض المعاينة للسعر
        const priceInput = form.querySelector('input[type="number"]');
        if (priceInput) {
            priceInput.addEventListener('input', (e) => {
                this.updatePricePreview(e.target.value);
            });
        }
    }
    
    // إعداد نموذج الاتصال
    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        // التحقق من رقم الهاتف
        const phoneInput = form.querySelector('input[type="tel"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                this.formatPhoneNumber(e.target);
            });
        }
    }
    
    // التحقق من النموذج كاملاً
    validateForm(e, form) {
        e.preventDefault();
        
        let isValid = true;
        const inputs = form.querySelectorAll('input, select, textarea[required]');
        
        // التحقق من كل حقل
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        // إذا كان النموذج صالحاً
        if (isValid) {
            this.showFormSuccess(form);
            this.submitForm(form);
        } else {
            this.showFormError(form, 'يرجى تصحيح الأخطاء قبل الإرسال');
        }
        
        return isValid;
    }
    
    // التحقق من حقل فردي
    validateField(input) {
        const value = input.value.trim();
        const fieldName = input.getAttribute('name') || input.getAttribute('placeholder') || 'هذا الحقل';
        
        // إزالة أي أخطاء سابقة
        this.clearFieldError(input);
        
        // إذا كان الحقل مطلوباً وفارغاً
        if (input.hasAttribute('required') && !value) {
            this.showFieldError(input, `${fieldName} مطلوب`);
            return false;
        }
        
        // التحقق حسب النوع
        switch (input.type) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    this.showFieldError(input, 'البريد الإلكتروني غير صالح');
                    return false;
                }
                break;
                
            case 'tel':
                if (value && !this.isValidPhone(value)) {
                    this.showFieldError(input, 'رقم الهاتف غير صالح (10 أرقام)');
                    return false;
                }
                break;
                
            case 'number':
                const min = parseInt(input.getAttribute('min')) || 0;
                const max = parseInt(input.getAttribute('max')) || Infinity;
                const numValue = parseInt(value);
                
                if (value && (numValue < min || numValue > max)) {
                    this.showFieldError(input, `القيمة يجب أن تكون بين ${min} و ${max}`);
                    return false;
                }
                break;
                
            case 'file':
                if (input.hasAttribute('required') && !input.files.length) {
                    this.showFieldError(input, `${fieldName} مطلوب`);
                    return false;
                }
                break;
        }
        
        // التحقق من الطول
        const minLength = input.getAttribute('minlength');
        const maxLength = input.getAttribute('maxlength');
        
        if (minLength && value.length < minLength) {
            this.showFieldError(input, `${fieldName} يجب أن يكون ${minLength} أحرف على الأقل`);
            return false;
        }
        
        if (maxLength && value.length > maxLength) {
            this.showFieldError(input, `${fieldName} يجب أن لا يتجاوز ${maxLength} أحرف`);
            return false;
        }
        
        return true;
    }
    
    // عرض خطأ لحقل معين
    showFieldError(input, message) {
        // إضافة فئة الخطأ
        input.classList.add('error');
        
        // إنصراف عنصر الخطأ
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ef233c;
            font-size: 0.85rem;
            margin-top: 5px;
            margin-right: 5px;
        `;
        
        // إضافة بعد الحقل
        input.parentNode.appendChild(errorElement);
        
        // تركيز على الحقل
        input.focus();
    }
    
    // مسح خطأ الحقل
    clearFieldError(input) {
        input.classList.remove('error');
        
        const errorElement = input.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // عرض نجاح النموذج
    showFormSuccess(form) {
        const successElement = document.createElement('div');
        successElement.className = 'form-success';
        successElement.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>تم إرسال النموذج بنجاح!</span>
        `;
        successElement.style.cssText = `
            background: #06d6a0;
            color: white;
            padding: 15px;
            border-radius: 10px;
            margin-top: 20px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-weight: 600;
        `;
        
        form.appendChild(successElement);
        
        // إخفاء بعد 5 ثواني
        setTimeout(() => {
            successElement.remove();
        }, 5000);
    }
    
    // عرض خطأ النموذج
    showFormError(form, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        errorElement.style.cssText = `
            background: #ef233c;
            color: white;
            padding: 15px;
            border-radius: 10px;
            margin-top: 20px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-weight: 600;
        `;
        
        form.insertBefore(errorElement, form.firstChild);
        
        // إخفاء بعد 5 ثواني
        setTimeout(() => {
            errorElement.remove();
        }, 5000);
    }
    
    // إرسال النموذج
    submitForm(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // عرض حالة التحميل
        if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="loading"></div> جاري الإرسال...';
            submitBtn.disabled = true;
            
            // محاكاة الإرسال
            setTimeout(() => {
                // هنا ستقوم بإرسال البيانات للخادم
                console.log('تم إرسال البيانات:', Object.fromEntries(formData));
                
                // إعادة الزر لحالته الأصلية
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // إعادة تعيين النموذج
                form.reset();
                
                // إشعار النجاح
                showNotification('تم إرسال النموذج بنجاح!', 'success');
                
            }, 2000);
        }
    }
    
    // معالجة رفع الملفات
    handleFileUpload(e) {
        const input = e.target;
        const files = input.files;
        const previewContainer = document.getElementById('filePreview');
        
        if (!previewContainer) return;
        
        // تفريغ المعاينات السابقة
        previewContainer.innerHTML = '';
        
        // عرض المعاينات
        Array.from(files).forEach((file, index) => {
            if (!file.type.match('image.*')) {
                showNotification('يجب رفع صور فقط', 'warning');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.createElement('div');
                preview.className = 'file-preview';
                preview.innerHTML = `
                    <img src="${e.target.result}" alt="معاينة ${index + 1}">
                    <button type="button" class="remove-file" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                previewContainer.appendChild(preview);
                
                // زر حذف الصورة
                const removeBtn = preview.querySelector('.remove-file');
                removeBtn.addEventListener('click', () => this.removeFile(input, index));
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    // حذف ملف من المعاينة
    removeFile(input, index) {
        const files = Array.from(input.files);
        files.splice(index, 1);
        
        // تحديث ملفات الإدخال
        const dataTransfer = new DataTransfer();
        files.forEach(file => dataTransfer.items.add(file));
        input.files = dataTransfer.files;
        
        // تحديث المعاينة
        this.handleFileUpload({ target: input });
    }
    
    // تحديث معاينة السعر
    updatePricePreview(price) {
        const preview = document.getElementById('pricePreview');
        if (preview) {
            preview.textContent = `${parseInt(price).toLocaleString()} درهم/شهر`;
        }
    }
    
    // تنسيق رقم الهاتف
    formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length > 10) {
            value = value.substring(0, 10);
        }
        
        // تنسيق: 06-12-34-56-78
        if (value.length > 6) {
            value = value.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3-$4-$5');
        } else if (value.length > 4) {
            value = value.replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3');
        } else if (value.length > 2) {
            value = value.replace(/(\d{2})(\d{2})/, '$1-$2');
        }
        
        input.value = value;
    }
    
    // التحقق من البريد الإلكتروني
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // التحقق من رقم الهاتف
    isValidPhone(phone) {
        const digits = phone.replace(/\D/g, '');
        return digits.length === 10;
    }
}

// إنشاء نسخة واحدة من FormValidator
const formValidator = new FormValidator();

// جعل الدوال متاحة عالمياً
window.formValidator = formValidator;
