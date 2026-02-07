$(document).ready(function(){
    $(window).scroll(function(){
        // sticky navbar on scroll script
        if(this.scrollY > 20){
            $('.navbar').addClass("sticky");
        }else{
            $('.navbar').removeClass("sticky");
        }
        
        // scroll-up button show/hide script
        if(this.scrollY > 500){
            $('.scroll-up-btn').addClass("show");
        }else{
            $('.scroll-up-btn').removeClass("show");
        }
    });

    // slide-up script
    $('.scroll-up-btn').click(function(){
        $('html').animate({scrollTop: 0});
        // removing smooth scroll on slide-up button click
        $('html').css("scrollBehavior", "auto");
    });

    $('.navbar .menu li a').click(function(){
        // applying again smooth scroll on menu items click
        $('html').css("scrollBehavior", "smooth");
    });

    // toggle menu/navbar script
    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
    });

    // typing text animation script
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

    // owl carousel script
    $('.carousel').owlCarousel({
        margin: 20,
        loop: true,
        autoplay: true,
        autoplayTimeOut: 2000,
        autoplayHoverPause: true,
        responsive: {
            0:{
                items: 1,
                nav: false
            },
            600:{
                items: 2,
                nav: false
            },
            1000:{
                items: 3,
                nav: false
            }
        }
    });
});

// ============================================
// FORM VALIDATION FUNCTIONS
// ============================================

// Clear all error messages
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
    document.querySelectorAll('.field input, .field textarea').forEach(field => {
        field.classList.remove('error');
    });
}

// Show error message
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + '-error');
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement && inputElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.classList.add('error');
    }
}

// Validate name
function validateName(name) {
    if (!name || name.trim().length === 0) {
        return { valid: false, message: 'Please enter your name' };
    }
    if (name.trim().length < 2) {
        return { valid: false, message: 'Name must be at least 2 characters' };
    }
    if (name.length > 50) {
        return { valid: false, message: 'Name is too long (max 50 characters)' };
    }
    // Check for numbers in name
    if (/\d/.test(name)) {
        return { valid: false, message: 'Name cannot contain numbers' };
    }
    // Check for only letters, spaces, hyphens, and apostrophes
    if (!/^[a-zA-Z\s\-']+$/.test(name)) {
        return { valid: false, message: 'Name can only contain letters, spaces, hyphens and apostrophes' };
    }
    return { valid: true };
}

// Validate email
function validateEmail(email) {
    if (!email || email.trim().length === 0) {
        return { valid: false, message: 'Please enter your email address' };
    }
    
    // Email regex pattern - requires at least one letter before @
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailPattern.test(email)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }
    
    // Check if email has at least one letter (not just numbers)
    const localPart = email.split('@')[0];
    if (!/[a-zA-Z]/.test(localPart)) {
        return { valid: false, message: 'Email must contain at least one letter before @' };
    }
    
    return { valid: true };
}

// Validate phone (optional but if provided, must be valid)
function validatePhone(phone) {
    // If phone is empty, it's valid (optional field)
    if (!phone || phone.trim().length === 0) {
        return { valid: true };
    }
    
    // Remove spaces, hyphens, and parentheses
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Check if it contains only digits and optional + at start
    const phonePattern = /^\+?[0-9]{6,15}$/;
    
    if (!phonePattern.test(cleanPhone)) {
        return { valid: false, message: 'Please enter a valid phone number' };
    }
    
    return { valid: true };
}

// Validate subject
function validateSubject(subject) {
    if (!subject || subject.trim().length === 0) {
        return { valid: false, message: 'Please enter a subject' };
    }
    if (subject.trim().length < 3) {
        return { valid: false, message: 'Subject must be at least 3 characters' };
    }
    if (subject.length > 100) {
        return { valid: false, message: 'Subject is too long (max 100 characters)' };
    }
    // Check for numbers in subject
    if (/\d/.test(subject)) {
        return { valid: false, message: 'Subject cannot contain numbers' };
    }
    return { valid: true };
}

// Validate message
function validateMessage(message) {
    if (!message || message.trim().length === 0) {
        return { valid: false, message: 'Please enter your message' };
    }
    if (message.trim().length < 10) {
        return { valid: false, message: 'Message must be at least 10 characters' };
    }
    if (message.length > 1000) {
        return { valid: false, message: 'Message is too long (max 1000 characters)' };
    }
    return { valid: true };
}

// ============================================
// EMAILJS INTEGRATION
// ============================================

// Initialize EmailJS - REPLACE WITH YOUR PUBLIC KEY
(function() {
    emailjs.init("0xN5Ev41mvoMwzoQk"); // Replace with your actual public key from EmailJS dashboard
})();

// Form submission handler
const contactForm = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const btnText = submitBtn.querySelector(".btn-text");
const btnLoader = submitBtn.querySelector(".btn-loader");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearErrors();
    formStatus.innerHTML = "";
    
    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;
    
    // Validate all fields
    let isValid = true;
    
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
        showError('name', nameValidation.message);
        isValid = false;
    }
    
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        showError('email', emailValidation.message);
        isValid = false;
    }
    
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.valid) {
        showError('phone', phoneValidation.message);
        isValid = false;
    }
    
    const subjectValidation = validateSubject(subject);
    if (!subjectValidation.valid) {
        showError('subject', subjectValidation.message);
        isValid = false;
    }
    
    const messageValidation = validateMessage(message);
    if (!messageValidation.valid) {
        showError('message', messageValidation.message);
        isValid = false;
    }
    
    // If validation fails, stop here
    if (!isValid) {
        formStatus.innerHTML = '<p style="color: #f44336; font-weight: 500;"><i class="fas fa-exclamation-circle"></i> Please fix the errors above</p>';
        return;
    }
    
    // Show loading state
    btnText.style.display = "none";
    btnLoader.style.display = "inline-block";
    submitBtn.disabled = true;
    
    // Prepare email parameters
    // IMPORTANT: These variable names MUST match the placeholders in your EmailJS template
    // For example, if your template uses {{from_name}}, then use from_name here
    const templateParams = {
        from_name: name,
        from_email: email,
        phone: phone || 'Not provided',
        subject: subject,
        message: message
    };
    
    // Send email using EmailJS
    emailjs.send('service_n3eby34', 'template_dr4utrf', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            
            // Show success message
            formStatus.innerHTML = '<p style="color: #4CAF50; font-weight: 500;"><i class="fas fa-check-circle"></i> Message sent successfully! I\'ll get back to you soon.</p>';
            
            // Reset form
            contactForm.reset();
            
            // Reset button state
            setTimeout(function() {
                btnText.style.display = "inline-block";
                btnLoader.style.display = "none";
                submitBtn.disabled = false;
                formStatus.innerHTML = "";
            }, 5000);
            
        }, function(error) {
            console.log('FAILED...', error);
            
            // Show error message with helpful details
            let errorMessage = 'Oops! Something went wrong. ';
            
            if (error.text) {
                // Check for specific error messages
                if (error.text.includes('not initialized')) {
                    errorMessage = '❌ EmailJS not configured. Please add your PUBLIC_KEY in script.js';
                } else if (error.text.includes('recipients address is empty')) {
                    errorMessage = '❌ Email template not configured. Go to EmailJS dashboard → Templates → Set "To email" to jeffrinsamuel2006@gmail.com';
                } else if (error.text.includes('service') || error.text.includes('template')) {
                    errorMessage = '❌ Invalid Service ID or Template ID. Check your EmailJS dashboard for correct IDs.';
                } else {
                    errorMessage = '❌ ' + error.text;
                }
            } else if (error.status === 422) {
                errorMessage = '❌ Email template configuration error. Make sure "To email" is set in your EmailJS template to jeffrinsamuel2006@gmail.com';
            } else if (error.status === 401) {
                errorMessage = '❌ Invalid API key. Check your PUBLIC_KEY in script.js';
            } else {
                errorMessage += 'Please try again or email me directly at jeffrinsamuel2006@gmail.com';
            }
            
            formStatus.innerHTML = '<p style="color: #f44336; font-weight: 500; font-size: 14px;">' + errorMessage + '</p>';
            
            // Reset button state
            btnText.style.display = "inline-block";
            btnLoader.style.display = "none";
            submitBtn.disabled = false;
        });
});

// Real-time validation on input blur
document.getElementById('name').addEventListener('blur', function() {
    const validation = validateName(this.value);
    if (!validation.valid && this.value.trim().length > 0) {
        showError('name', validation.message);
    }
});

document.getElementById('email').addEventListener('blur', function() {
    const validation = validateEmail(this.value);
    if (!validation.valid && this.value.trim().length > 0) {
        showError('email', validation.message);
    }
});

document.getElementById('phone').addEventListener('blur', function() {
    const validation = validatePhone(this.value);
    if (!validation.valid && this.value.trim().length > 0) {
        showError('phone', validation.message);
    }
});

document.getElementById('subject').addEventListener('blur', function() {
    const validation = validateSubject(this.value);
    if (!validation.valid && this.value.trim().length > 0) {
        showError('subject', validation.message);
    }
});

document.getElementById('message').addEventListener('blur', function() {
    const validation = validateMessage(this.value);
    if (!validation.valid && this.value.trim().length > 0) {
        showError('message', validation.message);
    }
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