// Fonction pour animer la navigation lors du défilement
document.addEventListener('DOMContentLoaded', function() {
    // Animation du header lors du défilement
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.background = '#0a4b78';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            header.querySelectorAll('nav a').forEach(link => {
                link.style.color = '#fff';
            });
            document.querySelector('.logo').style.color = '#fff';
            document.querySelector('.logo span').style.color = '#d9a82e';
        } else {
            header.style.background = '#fff';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            header.querySelectorAll('nav a').forEach(link => {
                link.style.color = '#0a4b78';
            });
            document.querySelector('.logo').style.color = '#0a4b78';
            document.querySelector('.logo span').style.color = '#d9a82e';
        }
    });

    // Navigation douce pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Carrousel pour les témoignages
    const testimonialSlider = {
        currentIndex: 0,
        items: document.querySelectorAll('.testimonial-item'),
        dots: document.querySelectorAll('.navigation-dots .dot'),
        
        init: function() {
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
            
            // Afficher le témoignage actif
            this.items[index].classList.add('active');
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

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les valeurs du formulaire
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            // Validation simple
            if (!name || !email || !message) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }
            
            // Simuler l'envoi du formulaire
            alert('Merci pour votre message ! Nous vous contacterons bientôt.');
            contactForm.reset();
        });
    }

    // Animation à l'apparition des éléments lors du défilement
    const elementsToAnimate = document.querySelectorAll('.about-content, .yacht-card, .service-card');
    
    // Fonction pour vérifier si un élément est visible
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
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
});