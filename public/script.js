$(document).ready(function(){
    $(window).scroll(function(){
        if(this.scrollY > 20){
            $('.navbar').addClass("sticky");
        }else{
            $('.navbar').removeClass("sticky");
        }
        if(this.scrollY > 500){
            $('.scroll-up-btn').addClass("show");
        }else{
            $('.scroll-up-btn').removeClass("show");
        }
    });

    $('.scroll-up-btn').click(function(){
        $('html').animate({scrollTop: 0});
        $('html').css("scrollBehavior", "auto");
    });

    $('.navbar .menu li a').click(function(){
        $('html').css("scrollBehavior", "smooth");
    });

    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
    });

    var typed = new Typed(".typing", {
        strings: ["Student", "Passionate Developer", "Leetcoder"],
        typeSpeed: 70,
        backSpeed: 50,
        loop: true
    });

    var typed = new Typed(".typing-2", {
        strings: ["Student", "Future Developer", "Leetcoder"],
        typeSpeed: 70,
        backSpeed: 50,
        loop: true
    });

    $('.carousel').owlCarousel({
        margin: 20,
        loop: true,
        autoplay: true,
        autoplayTimeOut: 2000,
        autoplayHoverPause: true,
        responsive: {
            0:{ items: 1, nav: false },
            600:{ items: 2, nav: false },
            1000:{ items: 3, nav: false }
        }
    });
});

// ============================================
// DYNAMIC API URL
// window.location.origin automatically resolves to:
//   http://localhost:3000  (local)
//   https://your-app.onrender.com  (Render)
// No hardcoding needed!
// ============================================
const API_URL = window.location.origin + '/api/contact';

// ============================================
// EMAILJS INIT — kept as-is for email notifications
// ============================================
(function() {
    emailjs.init("0xN5Ev41mvoMwzoQk");
})();

// ============================================
// FORM VALIDATION FUNCTIONS
// ============================================

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
    document.querySelectorAll('.field input, .field textarea').forEach(field => {
        field.classList.remove('error');
    });
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + '-error');
    const inputElement = document.getElementById(fieldId);
    if (errorElement && inputElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.classList.add('error');
    }
}

function validateName(name) {
    if (!name || name.trim().length === 0) return { valid: false, message: 'Please enter your name' };
    if (name.trim().length < 2) return { valid: false, message: 'Name must be at least 2 characters' };
    if (name.length > 50) return { valid: false, message: 'Name is too long (max 50 characters)' };
    if (/\d/.test(name)) return { valid: false, message: 'Name cannot contain numbers' };
    if (!/^[a-zA-Z\s\-']+$/.test(name)) return { valid: false, message: 'Name can only contain letters, spaces, hyphens and apostrophes' };
    return { valid: true };
}

function validateEmail(email) {
    if (!email || email.trim().length === 0) return { valid: false, message: 'Please enter your email address' };
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) return { valid: false, message: 'Please enter a valid email address' };
    const localPart = email.split('@')[0];
    if (!/[a-zA-Z]/.test(localPart)) return { valid: false, message: 'Email must contain at least one letter before @' };
    return { valid: true };
}

function validatePhone(phone) {
    if (!phone || phone.trim().length === 0) return { valid: true };
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!/^\+?[0-9]{6,15}$/.test(cleanPhone)) return { valid: false, message: 'Please enter a valid phone number' };
    return { valid: true };
}

function validateSubject(subject) {
    if (!subject || subject.trim().length === 0) return { valid: false, message: 'Please enter a subject' };
    if (subject.trim().length < 3) return { valid: false, message: 'Subject must be at least 3 characters' };
    if (subject.length > 100) return { valid: false, message: 'Subject is too long (max 100 characters)' };
    if (/\d/.test(subject)) return { valid: false, message: 'Subject cannot contain numbers' };
    return { valid: true };
}

function validateMessage(message) {
    if (!message || message.trim().length === 0) return { valid: false, message: 'Please enter your message' };
    if (message.trim().length < 10) return { valid: false, message: 'Message must be at least 10 characters' };
    if (message.length > 1000) return { valid: false, message: 'Message is too long (max 1000 characters)' };
    return { valid: true };
}

// ============================================
// FORM SUBMISSION
// EmailJS  → sends you an email notification
// MongoDB  → stores the enquiry in the database
// Both run in parallel with Promise.allSettled
// ============================================

const contactForm = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const btnText = submitBtn.querySelector(".btn-text");
const btnLoader = submitBtn.querySelector(".btn-loader");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    clearErrors();
    formStatus.innerHTML = "";

    const name    = document.getElementById("name").value;
    const email   = document.getElementById("email").value;
    const phone   = document.getElementById("phone").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Client-side validation
    let isValid = true;
    const nameVal = validateName(name);
    if (!nameVal.valid) { showError('name', nameVal.message); isValid = false; }
    const emailVal = validateEmail(email);
    if (!emailVal.valid) { showError('email', emailVal.message); isValid = false; }
    const phoneVal = validatePhone(phone);
    if (!phoneVal.valid) { showError('phone', phoneVal.message); isValid = false; }
    const subjectVal = validateSubject(subject);
    if (!subjectVal.valid) { showError('subject', subjectVal.message); isValid = false; }
    const messageVal = validateMessage(message);
    if (!messageVal.valid) { showError('message', messageVal.message); isValid = false; }

    if (!isValid) {
        formStatus.innerHTML = '<p style="color:#f44336;font-weight:500;"><i class="fas fa-exclamation-circle"></i> Please fix the errors above</p>';
        return;
    }

    // Show loading state
    btnText.style.display = "none";
    btnLoader.style.display = "inline-block";
    submitBtn.disabled = true;

    // Run EmailJS + MongoDB save in parallel
    const [emailResult, dbResult] = await Promise.allSettled([

        // 1. EmailJS — email notification (unchanged from your original)
        emailjs.send('service_n3eby34', 'template_dr4utrf', {
            from_name: name,
            from_email: email,
            phone: phone || 'Not provided',
            subject: subject,
            message: message
        }),

        // 2. Backend API — save to MongoDB
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, subject, message })
        }).then(res => res.json())

    ]);

    const emailOk = emailResult.status === 'fulfilled';
    const dbOk    = dbResult.status === 'fulfilled' && dbResult.value?.success;

    if (dbOk && emailOk) {
        formStatus.innerHTML = '<p style="color:#4CAF50;font-weight:500;"><i class="fas fa-check-circle"></i> Message sent successfully! I\'ll get back to you soon.</p>';
    } else if (dbOk && !emailOk) {
        formStatus.innerHTML = '<p style="color:#4CAF50;font-weight:500;"><i class="fas fa-check-circle"></i> Message received! I\'ll get back to you soon.</p>';
        console.warn('EmailJS failed:', emailResult.reason);
    } else if (!dbOk && emailOk) {
        formStatus.innerHTML = '<p style="color:#ff9800;font-weight:500;"><i class="fas fa-exclamation-triangle"></i> Message sent but not saved to database. Please try again.</p>';
        console.error('DB save failed:', dbResult.reason || dbResult.value);
    } else {
        formStatus.innerHTML = '<p style="color:#f44336;font-weight:500;"><i class="fas fa-times-circle"></i> Something went wrong. Please email me directly at jeffrinsamuel2006@gmail.com</p>';
    }

    // Show any server-side field errors
    if (!dbOk && dbResult.value?.errors) {
        dbResult.value.errors.forEach(err => showError(err.field, err.message));
    }

    contactForm.reset();

    setTimeout(() => {
        btnText.style.display = "inline-block";
        btnLoader.style.display = "none";
        submitBtn.disabled = false;
        formStatus.innerHTML = "";
    }, 5000);
});

// Real-time blur validation
document.getElementById('name').addEventListener('blur', function() {
    const v = validateName(this.value);
    if (!v.valid && this.value.trim().length > 0) showError('name', v.message);
});
document.getElementById('email').addEventListener('blur', function() {
    const v = validateEmail(this.value);
    if (!v.valid && this.value.trim().length > 0) showError('email', v.message);
});
document.getElementById('phone').addEventListener('blur', function() {
    const v = validatePhone(this.value);
    if (!v.valid && this.value.trim().length > 0) showError('phone', v.message);
});
document.getElementById('subject').addEventListener('blur', function() {
    const v = validateSubject(this.value);
    if (!v.valid && this.value.trim().length > 0) showError('subject', v.message);
});
document.getElementById('message').addEventListener('blur', function() {
    const v = validateMessage(this.value);
    if (!v.valid && this.value.trim().length > 0) showError('message', v.message);
});

// Clear error on focus
document.querySelectorAll('.field input, .field textarea').forEach(field => {
    field.addEventListener('focus', function() {
        const errorElement = document.getElementById(this.id + '-error');
        if (errorElement) {
            errorElement.style.display = 'none';
            this.classList.remove('error');
        }
    });
});