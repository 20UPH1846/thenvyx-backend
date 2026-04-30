// Loading screen
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('hide');
  }, 2000);
});

// Typing animation
const typingText = document.querySelector('.typing-text');
const words = ['Sweet Solutions.', 'Smart Technology.', 'Modern Websites.'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
  const currentWord = words[wordIndex];
  const currentChar = currentWord.substring(0, charIndex);
  typingText.textContent = currentChar;

  if (!isDeleting && charIndex < currentWord.length) {
    charIndex++;
    setTimeout(typeWriter, 100);
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeWriter, 50);
  } else {
    isDeleting = !isDeleting;
    wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
    setTimeout(typeWriter, 1000);
  }
}

typeWriter();

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      // Close mobile menu after clicking
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    }
  });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 100) {
    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
  } else {
    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  }
});

// Advanced scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) rotateX(0deg)';
      }, index * 100);
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.card, .why-item, .stat, .testimonial, .portfolio-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(50px) rotateX(10deg)';
  el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  observer.observe(el);
});

// Parallax effect for hero
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroImage = document.querySelector('.hero-image img');
  if (heroImage) {
    heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
  }
});

// Particle background effect
function createParticles() {
  const hero = document.querySelector('.hero');
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    hero.appendChild(particle);
  }
}

createParticles();

// Form submission handling with animation
const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = form.querySelector('.submit-btn');
  const originalText = submitBtn.innerHTML;

  // Get form data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // Basic validation
  if (!data.name || !data.email || !data.subject || !data.message) {
    showFormMessage('Please fill in all required fields.', 'error');
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showFormMessage('Please enter a valid email address.', 'error');
    return;
  }

  // Show loading state
  submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
  submitBtn.disabled = true;

  // ── Real API Call to Backend ──────────────────────────────────
  try {
    const response = await fetch('https://thenvyx-backend.onrender.com/api/contact', { 
method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      showFormMessage(result.message, 'success');
      form.reset();
      submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';

      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 3000);
    } else {
      showFormMessage(result.message || 'Oops! Something went wrong. Please try again later.', 'error');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  } catch (error) {
    showFormMessage('Unable to connect to server. Please try again later.', 'error');
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = 'block';

  // Auto-hide after 5 seconds
  setTimeout(() => {
    formMessage.style.display = 'none';
  }, 5000);
}

// Real-time form validation
const inputs = form.querySelectorAll('input, textarea, select');
inputs.forEach(input => {
  input.addEventListener('blur', () => {
    validateField(input);
  });

  input.addEventListener('input', () => {
    if (input.classList.contains('error')) {
      validateField(input);
    }
  });
});

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = '';

  // Remove existing error styling
  field.classList.remove('error');
  field.classList.remove('success');

  switch (field.name) {
    case 'name':
      if (!value) {
        isValid = false;
        errorMessage = 'Name is required';
      } else if (value.length < 2) {
        isValid = false;
        errorMessage = 'Name must be at least 2 characters';
      }
      break;

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        isValid = false;
        errorMessage = 'Email is required';
      } else if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email';
      }
      break;

    case 'phone':
      if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
      break;

    case 'subject':
      if (!value) {
        isValid = false;
        errorMessage = 'Please select a subject';
      }
      break;

    case 'message':
      if (!value) {
        isValid = false;
        errorMessage = 'Message is required';
      } else if (value.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters';
      }
      break;
  }

  if (!isValid) {
    field.classList.add('error');
    showFieldError(field, errorMessage);
  } else if (value) {
    field.classList.add('success');
  }
}

function showFieldError(field, message) {
  // Remove existing error message
  const existingError = field.parentNode.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }

  // Create and show error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.textContent = message;
  field.parentNode.appendChild(errorDiv);

  // Remove error after 3 seconds
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.remove();
    }
  }, 3000);
}

// Add loading animation to buttons
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function() {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = 'scale(1)';
    }, 150);
  });
});

// Scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

// Back to top functionality
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset;
  const docHeight = document.body.offsetHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = scrollPercent + '%';

  // Back to top button visibility
  if (scrollTop > 300) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

// Back to top click handler
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});