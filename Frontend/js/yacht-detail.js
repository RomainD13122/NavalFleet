// Fichier JavaScript pour la page de détail du yacht
document.addEventListener('DOMContentLoaded', function() {
    // Galerie d'images simplifiée
    const mainImage = document.querySelector('.main-image img');
    const viewLabel = document.querySelector('.view-label');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Fonction pour changer la vue principale
    function updateMainImage(thumbnail) {
        // Retirer la classe active de toutes les vignettes
        thumbnails.forEach(t => {
            t.classList.remove('active');
        });
        
        // Ajouter la classe active à la vignette cliquée
        thumbnail.classList.add('active');
        
        // Mettre à jour l'image principale
        const thumbnailImg = thumbnail.querySelector('img');
        mainImage.src = thumbnailImg.src;
        mainImage.alt = thumbnailImg.alt;
        
        // Mettre à jour l'étiquette de vue
        const viewType = thumbnail.dataset.view;
        viewLabel.textContent = 'Vue ' + viewType;
    }

    // Événements pour les vignettes
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            updateMainImage(this);
        });
    });

    // Système d'achat
    const purchaseTypeSelect = document.getElementById('purchase-type');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const buyNowBtn = document.querySelector('.buy-now-btn');
    
    // Fonction pour calculer le prix en fonction des options
    function updatePrice() {
        const basePrice = 23611815; // Prix en euros
        let finalPrice = basePrice;
        let displayPrice = '';
        
        // Ajustement en fonction du type d'achat
        const purchaseType = purchaseTypeSelect.value;
        if (purchaseType === 'part') {
            finalPrice = basePrice * 0.25;
        } else if (purchaseType === 'lease') {
            finalPrice = basePrice * 0.1; // 10% pour la location
        }
        
        // Formater le prix
        displayPrice = new Intl.NumberFormat('fr-FR', { 
            style: 'currency', 
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(finalPrice);
        
        // Convertir en dollars
        const dollarPrice = finalPrice * 1.13; // Taux de conversion approximatif
        const displayDollarPrice = new Intl.NumberFormat('fr-FR', { 
            style: 'currency', 
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(dollarPrice);
        
        // Mettre à jour l'affichage du prix
        document.querySelector('.price-amount').textContent = displayDollarPrice;
        document.querySelector('.price-converted').textContent = `(${displayPrice})`;
    }
    
    // Événements pour les options d'achat
    purchaseTypeSelect.addEventListener('change', updatePrice);
    
    // Événements pour les boutons d'achat
    addToCartBtn.addEventListener('click', function() {
        // Animation d'ajout au panier
        this.innerHTML = '<span>✓</span> Ajouté au panier';
        this.style.backgroundColor = '#0a4b78';
        this.style.color = '#fff';
        
        // Effet visuel pour le bouton d'ajout au panier
        const checkmark = this.querySelector('span');
        checkmark.style.opacity = '0';
        checkmark.style.transform = 'scale(0)';
        checkmark.style.transition = 'opacity 0.3s, transform 0.3s';
        
        setTimeout(() => {
            checkmark.style.opacity = '1';
            checkmark.style.transform = 'scale(1)';
        }, 50);
        
        setTimeout(() => {
            window.location.href = 'panier.html';
        }, 1000);
    });
    
    buyNowBtn.addEventListener('click', function() {
        // Animation pour le bouton d'achat
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
        
        // Redirection vers la page de panier
        setTimeout(() => {
            window.location.href = 'panier.html';
        }, 300);
    });
    
    // Effet de survol pour les éléments d'information
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach(item => {
        item.addEventListener('mouseover', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseout', function() {
            this.style.transform = '';
        });
    });

    // Animation au défilement pour les sections
    const sections = document.querySelectorAll('section');
    
    function fadeInSection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }
    
    const sectionObserver = new IntersectionObserver(fadeInSection, {
        root: null,
        threshold: 0.15
    });
    
    sections.forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(20px)";
        section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        sectionObserver.observe(section);
    });
    
    document.addEventListener('scroll', function() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                section.style.opacity = "1";
                section.style.transform = "translateY(0)";
            }
        });
    });
});