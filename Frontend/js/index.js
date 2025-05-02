// Script principal pour la page d'accueil
document.addEventListener('DOMContentLoaded', function() {
    // Animation du header lors du défilement
    animateHeaderOnScroll();
    
    // Navigation douce pour les liens d'ancrage
    setupSmoothScrolling();
    
    // Carrousel pour les témoignages
    initializeTestimonialSlider();
    
    // Gestion du formulaire de contact
    setupContactForm();
    
    // Animation à l'apparition des éléments lors du défilement
    setupScrollAnimations();
    
    // Compteur pour les chiffres clés
    initializeCounters();
});

// Fonction pour animer le header lors du défilement
function animateHeaderOnScroll() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Fonction pour la navigation douce
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Ajouter une classe active au lien cliqué
                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Faire défiler jusqu'à l'élément cible
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mise à jour de la navigation active lors du défilement
    window.addEventListener('scroll', function() {
        let scrollPosition = window.scrollY + 200;
        
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('active');
                    
                    if (link.getAttribute('href') === '#' + section.getAttribute('id')) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Fonction pour initialiser le slider de témoignages
function initializeTestimonialSlider() {
    const testimonialSlider = {
        currentIndex: 0,
        items: document.querySelectorAll('.testimonial-item'),
        dots: document.querySelectorAll('.navigation-dots .dot'),
        
        init: function() {
            if (this.items.length === 0) return;
            
            this.showSlide(this.currentIndex);
            this.setupNavigation();
            this.startAutoSlide();
        },
        
        showSlide: function(index) {
            // Masquer tous les témoignages
            this.items.forEach(item => {
                item.classList.remove('active');
            });
            
            // Désactiver tous les points
            this.dots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // Afficher le témoignage actif avec animation
            this.items[index].style.opacity = '0';
            this.items[index].classList.add('active');
            setTimeout(() => {
                this.items[index].style.opacity = '1';
                this.items[index].style.transition = 'opacity 0.5s ease';
            }, 50);
            
            this.dots[index].classList.add('active');
            this.currentIndex = index;
        },
        
        nextSlide: function() {
            const nextIndex = (this.currentIndex + 1) % this.items.length;
            this.showSlide(nextIndex);
        },
        
        setupNavigation: function() {
            const self = this;
            
            // Navigation par les points
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', function() {
                    self.showSlide(index);
                });
            });
        },
        
        startAutoSlide: function() {
            const self = this;
            setInterval(() => {
                self.nextSlide();
            }, 5000); // Changer de témoignage toutes les 5 secondes
        }
    };
    
    // Initialiser le carrousel si des témoignages sont présents
    if (document.querySelector('.testimonial-slider')) {
        testimonialSlider.init();
    }
}

// Fonction pour gérer le formulaire de contact
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les valeurs du formulaire
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Validation simple
            if (!name || !email || !message) {
                showFormNotification('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }
            
            // Validation de l'email
            if (!isValidEmail(email)) {
                showFormNotification('Veuillez entrer une adresse e-mail valide.', 'error');
                return;
            }
            
            // Simuler l'envoi du formulaire avec une animation
            const submitButton = contactForm.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Envoi en cours...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                showFormNotification('Merci pour votre message ! Nous vous contacterons bientôt.', 'success');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }
}

// Fonction pour afficher une notification
function showFormNotification(message, type) {
    // Vérifier si une notification existe déjà
    let notification = document.querySelector('.form-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'form-notification';
        document.getElementById('contact-form').appendChild(notification);
    }
    
    notification.textContent = message;
    notification.className = 'form-notification ' + type;
    notification.style.display = 'block';
    
    // Faire disparaître la notification après 5 secondes
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 500);
    }, 5000);
}

// Fonction pour valider un email
function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Fonction pour animer les éléments au scroll
function setupScrollAnimations() {
    const elementsToAnimate = document.querySelectorAll('.about-content, .yacht-card, .service-card, .contact-card, .testimonial-slider, .key-figures, .cta-content');
    
    // Fonction pour vérifier si un élément est visible
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Fonction pour ajouter une classe d'animation aux éléments visibles
    function handleScrollAnimation() {
        elementsToAnimate.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initialiser le style des éléments à animer
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Vérifier les éléments au chargement et au défilement
    window.addEventListener('load', handleScrollAnimation);
    window.addEventListener('scroll', handleScrollAnimation);
}

// Fonction pour initialiser les compteurs dans la section chiffres clés
function initializeCounters() {
    const counters = document.querySelectorAll('.figure-number');
    
    function startCounting(counter) {
        const target = parseInt(counter.textContent);
        const duration = 2000; // durée en ms
        const startTime = Date.now();
        
        function updateCounter() {
            const currentTime = Date.now();
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            let text = counter.textContent;
            const isPlus = text.includes('+');
            text = text.replace('+', '');
            
            const value = Math.floor(progress * parseInt(text));
            counter.textContent = isPlus ? value + '+' : value;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (isPlus ? '+' : '');
            }
        }
        
        updateCounter();
    }
    
    function handleCounterAnimation() {
        counters.forEach(counter => {
            if (isInViewport(counter) && !counter.classList.contains('counted')) {
                counter.classList.add('counted');
                setTimeout(() => {
                    startCounting(counter);
                }, 200);
            }
        });
    }
    
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Événement de défilement
    window.addEventListener('scroll', handleCounterAnimation);
    // Vérification initiale
    handleCounterAnimation();
}