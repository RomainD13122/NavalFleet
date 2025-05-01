// Gestion globale du panier avec localStorage
const NavalfleetCart = {
    // Initialisation du panier
    init: function() {
        this.updateCartDisplay();
        this.bindEvents();
        
        // Initialiser la gestion du code promo
        this.initPromoCode();
    },

    // Événements globaux
    bindEvents: function() {
        // Surveiller tous les boutons d'ajout au panier sur la page
        document.querySelectorAll('.add-to-cart-btn, .add-suggestion-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Trouver les informations du yacht
                let yachtData = NavalfleetCart.getYachtDataFromButton(this);
                
                // Ajouter au panier
                NavalfleetCart.addToCart(yachtData);
                
                // Animation et feedback
                NavalfleetCart.animateAddToCart(this, yachtData.name);
            });
        });
        
        // Si nous sommes sur la page panier, configurer les événements spécifiques
        if (window.location.pathname.includes('panier.html')) {
            this.setupCartPageEvents();
        }
    },
    
    // Récupérer les données du yacht à partir du bouton cliqué
    getYachtDataFromButton: function(button) {
        let container = button.closest('.yacht-card, .suggestion-item, .purchase-box');
        if (!container) return null;
        
        // Pour la page de détail du yacht
        if (container.classList.contains('purchase-box')) {
            // Récupérer les sélections du formulaire
            const purchaseType = document.getElementById('purchase-type')?.value || 'full';
            const deliveryLocation = document.getElementById('delivery-location')?.value || 'current';
            const crew = document.getElementById('crew')?.value || 'none';
            
            // Récupérer le nom du yacht depuis le titre de la page
            const yachtName = document.querySelector('.yacht-title h1')?.textContent || '2023 Heysea Asteria 142';
            
            // Générer un ID stable basé sur le nom
            const yachtId = 'yacht-' + yachtName.replace(/\s+/g, '-').toLowerCase();
            
            return {
                id: yachtId,
                name: yachtName,
                price: document.querySelector('.price-amount')?.textContent || '26 800 000 $',
                priceEur: document.querySelector('.price-converted')?.textContent || '(23 611 815 €)',
                image: document.querySelector('.main-image img')?.src || 'styles/img/Bateauaccueil2.png',
                type: 'Mega Yacht',
                specs: {
                    length: '43m',
                    year: '2023',
                    engine: '13840hp'
                },
                location: 'Zhuhai, Chine',
                options: {
                    purchaseType,
                    deliveryLocation,
                    crew
                }
            };
        }
        
        // Pour les cartes de yacht sur d'autres pages
        let name = container.querySelector('h3')?.textContent || '';
        
        // Générer un ID stable basé sur le nom
        const yachtId = 'yacht-' + name.replace(/\s+/g, '-').toLowerCase();
        
        let price = '';
        let priceEur = '';
        let priceElement = container.querySelector('.yacht-price, .suggestion-price');
        if (priceElement) {
            // Déterminer s'il y a deux prix ($ et €) ou un seul
            if (container.querySelector('.price-amount')) {
                price = container.querySelector('.price-amount').textContent;
                priceEur = container.querySelector('.price-converted').textContent;
            } else {
                priceEur = priceElement.textContent;
                // Convertir € en $ approximativement
                let priceNumber = parseFloat(priceEur.replace(/[^0-9,.]/g, '').replace(',', '.'));
                price = (priceNumber * 1.13).toLocaleString('fr-FR') + ' $';
            }
        }
        
        let type = container.querySelector('.yacht-type')?.textContent || 
                  container.querySelector('.suggestion-specs')?.textContent.split('•')[0]?.trim() || 
                  'Yacht';
                  
        let length = container.querySelector('.spec-item:nth-child(1)')?.textContent.trim() || 
                    container.querySelector('.suggestion-specs')?.textContent.split('•')[1]?.trim() || 
                    '20m';
                    
        let year = container.querySelector('.spec-item:nth-child(2)')?.textContent.trim() || '2023';
        
        let image = container.querySelector('img')?.src || '';
        
        return {
            id: yachtId,
            name,
            price,
            priceEur,
            image,
            type,
            specs: {
                length,
                year
            },
            location: container.querySelector('.yacht-location')?.textContent || 'Sur demande',
            options: {
                purchaseType: 'full',
                deliveryLocation: 'current',
                crew: 'none'
            }
        };
    },
    
    // Ajouter un yacht au panier
    addToCart: function(yachtData) {
        if (!yachtData) return;
        
        // Récupérer le panier actuel
        let cart = this.getCart();
        
        // Vérifier si ce modèle de yacht existe déjà dans le panier
        const existingYachtIndex = cart.findIndex(item => 
            item.name === yachtData.name && 
            item.specs.year === yachtData.specs.year
        );
        
        if (existingYachtIndex !== -1) {
            // Si le yacht existe déjà, mettre à jour ses options au lieu d'ajouter un doublon
            cart[existingYachtIndex].options = yachtData.options;
            
            // Afficher une notification
            this.showNotification(`Options de "${yachtData.name}" mises à jour dans votre panier`);
        } else {
            // Ajouter l'article avec un ID unique basé sur le nom et l'année
            yachtData.id = 'yacht-' + yachtData.name.replace(/\s+/g, '-').toLowerCase() + '-' + yachtData.specs.year;
            cart.push(yachtData);
            
            // Afficher une notification
            this.showNotification(`"${yachtData.name}" ajouté à votre panier`);
        }
        
        // Sauvegarder le panier
        this.saveCart(cart);
        
        // Mettre à jour l'affichage
        this.updateCartDisplay();
    },
    
    // Récupérer le panier depuis localStorage
    getCart: function() {
        let cart = localStorage.getItem('navalfleetCart');
        return cart ? JSON.parse(cart) : [];
    },
    
    // Sauvegarder le panier dans localStorage
    saveCart: function(cart) {
        localStorage.setItem('navalfleetCart', JSON.stringify(cart));
    },
    
    // Supprimer un article du panier
    removeFromCart: function(yachtId) {
        let cart = this.getCart();
        const removedItem = cart.find(item => item.id === yachtId);
        cart = cart.filter(item => item.id !== yachtId);
        this.saveCart(cart);
        this.updateCartDisplay();
        
        // Afficher une notification
        if (removedItem) {
            this.showNotification(`"${removedItem.name}" supprimé de votre panier`);
        }
    },
    
    // Vider le panier
    clearCart: function() {
        this.saveCart([]);
        this.updateCartDisplay();
    },
    
    // Mettre à jour l'affichage du nombre d'articles
    updateCartDisplay: function() {
        const cartItems = this.getCart();
        
        // Mettre à jour le compteur dans la navigation
        this.updateCartCounter(cartItems.length);
        
        // Si nous sommes sur la page panier, mettre à jour le contenu
        if (window.location.pathname.includes('panier.html')) {
            this.renderCartItems(cartItems);
        }
    },
    
    // Mettre à jour le compteur du panier
    updateCartCounter: function(count) {
        // Ajouter un compteur à côté du lien Panier s'il n'existe pas déjà
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            if (link.textContent.includes('Panier')) {
                // Vérifier si le compteur existe déjà
                let counter = link.querySelector('.cart-counter');
                
                if (count > 0) {
                    if (!counter) {
                        counter = document.createElement('span');
                        counter.className = 'cart-counter';
                        counter.style.display = 'inline-flex';
                        counter.style.alignItems = 'center';
                        counter.style.justifyContent = 'center';
                        counter.style.width = '20px';
                        counter.style.height = '20px';
                        counter.style.borderRadius = '50%';
                        counter.style.backgroundColor = '#d9a82e';
                        counter.style.color = '#fff';
                        counter.style.fontSize = '12px';
                        counter.style.marginLeft = '5px';
                        counter.style.fontWeight = 'bold';
                        
                        link.appendChild(counter);
                    }
                    counter.textContent = count;
                } else if (counter) {
                    link.removeChild(counter);
                }
            }
        });
    },
    
    // Afficher les articles du panier sur la page panier
    renderCartItems: function(cartItems) {
        const cartItemsContainer = document.querySelector('.cart-items');
        const emptyCart = document.querySelector('.empty-cart');
        const orderSummary = document.querySelector('.order-summary');
        
        // Mettre à jour le titre avec le nombre d'articles
        const cartItemsTitle = document.querySelector('.cart-items h2');
        if (cartItemsTitle) {
            cartItemsTitle.textContent = `Articles dans votre panier (${cartItems.length})`;
        }
        
        // Si le panier est vide
        if (cartItems.length === 0) {
            if (cartItemsContainer) {
                // Masquer tous les articles
                const items = cartItemsContainer.querySelectorAll('.cart-item');
                items.forEach(item => {
                    item.style.display = 'none';
                });
            }
            
            // Afficher le message de panier vide
            if (emptyCart) {
                emptyCart.style.display = 'block';
                
                // Désactiver le résumé
                if (orderSummary) {
                    orderSummary.style.opacity = '0.5';
                    const checkoutBtn = orderSummary.querySelector('.checkout-btn');
                    if (checkoutBtn) checkoutBtn.disabled = true;
                }
            }
            
            // Mettre à jour le résumé avec un montant de 0
            this.updateOrderSummary(0);
            return;
        }
        
        // Si nous avons des articles
        if (emptyCart) {
            emptyCart.style.display = 'none';
        }
        
        // Réactiver le résumé
        if (orderSummary) {
            orderSummary.style.opacity = '1';
            const checkoutBtn = orderSummary.querySelector('.checkout-btn');
            if (checkoutBtn) checkoutBtn.disabled = false;
        }
        
        // Créer les éléments HTML pour chaque article
        let itemsHTML = '';
        let totalPrice = 0;
        
        cartItems.forEach(item => {
            try {
                // Calculer le prix total
                let priceText = item.priceEur || '0 €';
                // Extraire le nombre du texte du prix (supprime tout sauf les chiffres, points et virgules)
                let priceStr = priceText.replace(/[^0-9,.]/g, '').replace(',', '.');
                let price = parseFloat(priceStr);
                
                if (!isNaN(price)) {
                    totalPrice += price;
                }
                
                let purchaseTypeText = '';
                switch (item.options.purchaseType) {
                    case 'full': purchaseTypeText = 'Achat complet'; break;
                    case 'part': purchaseTypeText = 'Copropriété (25%)'; break;
                    case 'lease': purchaseTypeText = 'Location longue durée'; break;
                    default: purchaseTypeText = 'Achat complet';
                }
                
                let deliveryLocationText = '';
                switch (item.options.deliveryLocation) {
                    case 'current': deliveryLocationText = 'Emplacement actuel'; break;
                    case 'monaco': deliveryLocationText = 'Monaco'; break;
                    case 'cannes': deliveryLocationText = 'Cannes'; break;
                    case 'stTropez': deliveryLocationText = 'Saint-Tropez'; break;
                    default: deliveryLocationText = 'Emplacement actuel';
                }
                
                let crewText = '';
                switch (item.options.crew) {
                    case 'none': crewText = 'Sans équipage'; break;
                    case 'basic': crewText = 'Équipage basique (3 personnes)'; break;
                    case 'full': crewText = 'Équipage complet (8 personnes)'; break;
                    default: crewText = 'Sans équipage';
                }
                
                itemsHTML += `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="item-details">
                            <h3>${item.name}</h3>
                            <div class="item-specs">
                                <span>${item.type}</span>
                                <span>•</span>
                                <span>${item.specs.length}</span>
                                <span>•</span>
                                <span>${item.specs.year}</span>
                            </div>
                            <div class="item-options">
                                <div class="option">
                                    <span class="option-label">Mode d'acquisition:</span>
                                    <span class="option-value">${purchaseTypeText}</span>
                                </div>
                                <div class="option">
                                    <span class="option-label">Lieu de livraison:</span>
                                    <span class="option-value">${deliveryLocationText}</span>
                                </div>
                                <div class="option">
                                    <span class="option-label">Service équipage:</span>
                                    <span class="option-value">${crewText}</span>
                                </div>
                            </div>
                            <div class="item-actions">
                                <button class="edit-btn" data-id="${item.id}">Modifier</button>
                                <button class="remove-btn" data-id="${item.id}">Supprimer</button>
                            </div>
                        </div>
                        <div class="item-price">
                            <div class="current-price">${item.priceEur ? item.priceEur.replace(/[()]/g, '') : '0 €'}</div>
                            <div class="original-price">${item.price || ''}</div>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error("Erreur lors du rendu d'un article:", error);
                console.log("Article problématique:", item);
            }
        });
        
        // Mettre à jour le contenu
        if (cartItemsContainer) {
            // Supprimer les articles existants sauf le titre
            const itemsToRemove = cartItemsContainer.querySelectorAll('.cart-item');
            itemsToRemove.forEach(item => {
                item.remove();
            });
            
            // Insérer les nouveaux articles après le titre
            const title = cartItemsContainer.querySelector('h2');
            if (title) {
                title.insertAdjacentHTML('afterend', itemsHTML);
            } else {
                cartItemsContainer.innerHTML = itemsHTML;
            }
        }
        
        // Mettre à jour le résumé de la commande
        this.updateOrderSummary(totalPrice);
        
        // Configurer les événements pour les nouveaux boutons
        this.setupCartPageEvents();
    },
    
    // Mettre à jour le résumé de la commande
    updateOrderSummary: function(totalPrice) {
        const summaryDetails = document.querySelector('.summary-details');
        if (!summaryDetails) return;
        
        // Vérifier si un code promo est actif
        const activePromo = this.getActivePromo();
        let finalPrice = totalPrice;
        
        // Appliquer la réduction si un code promo est actif
        if (activePromo) {
            // Mettre à jour l'affichage de la remise
            const discountRow = summaryDetails.querySelector('.discount-row');
            const discountAmount = summaryDetails.querySelector('.discount-amount');
            
            if (discountRow && discountAmount) {
                // Calculer et afficher le montant de la remise
                let discountValue = 0;
                
                if (activePromo.code === 'ALLAN') {
                    // Remise de 100%
                    discountValue = totalPrice;
                } else if (activePromo.percentOff) {
                    discountValue = totalPrice * (activePromo.percentOff / 100);
                } else if (activePromo.amountOff) {
                    discountValue = activePromo.amountOff;
                }
                
                // Plafonner la remise au montant total
                discountValue = Math.min(discountValue, totalPrice);
                
                // Formater la remise
                const formattedDiscount = new Intl.NumberFormat('fr-FR', { 
                    style: 'currency', 
                    currency: 'EUR',
                    maximumFractionDigits: 0
                }).format(discountValue);
                
                // Mettre à jour l'affichage
                discountAmount.textContent = `- ${formattedDiscount}`;
                discountRow.classList.add('active');
                discountRow.style.display = 'flex';
                
                // Appliquer la remise au prix final
                finalPrice = totalPrice - discountValue;
            }
        } else {
            // Masquer la ligne de remise si aucun code promo n'est actif
            const discountRow = summaryDetails.querySelector('.discount-row');
            if (discountRow) {
                discountRow.classList.remove('active');
                discountRow.style.display = 'none';
            }
        }
        
        // Formater le prix
        const formattedSubtotal = new Intl.NumberFormat('fr-FR', { 
            style: 'currency', 
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(totalPrice);
        
        const formattedTotal = new Intl.NumberFormat('fr-FR', { 
            style: 'currency', 
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(finalPrice);
        
        // Mettre à jour les montants
        const subtotalRow = summaryDetails.querySelector('.summary-row:nth-child(1) span:nth-child(2)');
        const totalRow = summaryDetails.querySelector('.summary-row.total span:nth-child(2)');
        
        if (subtotalRow) subtotalRow.textContent = formattedSubtotal;
        if (totalRow) totalRow.textContent = formattedTotal;
        
        // Activer/désactiver le bouton de paiement
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            if (finalPrice <= 0) {
                checkoutBtn.textContent = 'Obtenir gratuitement';
            } else {
                checkoutBtn.textContent = 'Procéder au paiement';
            }
            
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = '1';
            checkoutBtn.style.cursor = 'pointer';
        }
    },
    
    // Ajouter ces nouvelles fonctions pour gérer les codes promo
    initPromoCode: function() {
        if (!window.location.pathname.includes('panier.html')) return;
        
        const applyPromoBtn = document.getElementById('apply-promo');
        if (!applyPromoBtn) return;
        
        applyPromoBtn.addEventListener('click', () => {
            const promoCodeInput = document.getElementById('promo-code');
            const promoMessage = document.getElementById('promo-message');
            
            if (!promoCodeInput || !promoMessage) return;
            
            const code = promoCodeInput.value.trim().toUpperCase();
            if (!code) {
                this.showPromoMessage(promoMessage, 'Veuillez saisir un code promotionnel', 'error');
                return;
            }
            
            // Valider le code promo
            if (code === 'ALLAN') {
                // Enregistrer le code promo actif
                this.setActivePromo({
                    code: 'ALLAN',
                    percentOff: 100,
                    message: 'Code promotionnel ALLAN appliqué - 100% de réduction!'
                });
                
                this.showPromoMessage(promoMessage, 'Code ALLAN appliqué avec succès! Votre commande est gratuite!', 'success');
                
                // Mettre à jour l'affichage
                this.updateCartDisplay();
            } else {
                this.showPromoMessage(promoMessage, 'Code promotionnel invalide', 'error');
            }
        });
    },
    
    showPromoMessage: function(element, message, type) {
        if (!element) return;
        
        element.textContent = message;
        element.className = 'promo-message';
        
        if (type) {
            element.classList.add(type);
        }
    },
    
    setActivePromo: function(promoData) {
        localStorage.setItem('navalfleetPromo', JSON.stringify(promoData));
    },
    
    getActivePromo: function() {
        const promoData = localStorage.getItem('navalfleetPromo');
        return promoData ? JSON.parse(promoData) : null;
    },
    
    clearActivePromo: function() {
        localStorage.removeItem('navalfleetPromo');
    },
    setupCartPageEvents: function() {
        // Boutons de suppression
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const yachtId = this.dataset.id;
                const cartItem = this.closest('.cart-item');
                
                // Animation de suppression
                cartItem.style.opacity = '0.5';
                cartItem.style.transform = 'translateX(20px)';
                cartItem.style.transition = 'opacity 0.3s, transform 0.3s';
                
                // Après l'animation, supprimer l'article
                setTimeout(() => {
                    NavalfleetCart.removeFromCart(yachtId);
                }, 300);
            });
        });
        
        // Boutons de modification
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Pour cet exemple, nous redirigerons vers la page détail
                window.location.href = 'yacht-detail.html';
            });
        });
        
        // Bouton de paiement
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                // Animation pour le bouton
                const originalText = this.textContent;
                this.innerHTML = '<span>Traitement en cours...</span>';
                this.disabled = true;
                this.style.opacity = '0.8';
                
                // Vérifier si un code promo est actif
                const activePromo = NavalfleetCart.getActivePromo();
                const isFree = activePromo && activePromo.code === 'ALLAN';
                
                // Simuler un redirection vers la page de paiement
                setTimeout(() => {
                    if (isFree) {
                        alert('Félicitations! Votre commande est gratuite grâce au code ALLAN. Votre yacht sera livré prochainement!');
                    } else {
                        alert('Merci pour votre achat! Redirection vers la page de paiement sécurisé...');
                    }
                    
                    this.innerHTML = originalText;
                    this.disabled = false;
                    this.style.opacity = '1';
                    
                    // Si l'achat est complété, on pourrait vider le panier
                    // NavalfleetCart.clearCart();
                }, 1500);
            });
        }
        
        // Bouton pour vider le panier
        const clearCartBtn = document.querySelector('.clear-cart-btn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', function() {
                if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
                    // Supprimer aussi le code promo actif
                    NavalfleetCart.clearActivePromo();
                    NavalfleetCart.clearCart();
                    NavalfleetCart.showNotification('Votre panier a été vidé');
                }
            });
        }
        
        // Boutons d'ajout des suggestions
        document.querySelectorAll('.add-suggestion-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const suggestionItem = this.closest('.suggestion-item');
                const yachtData = NavalfleetCart.getYachtDataFromButton(this);
                
                // Ajouter au panier
                NavalfleetCart.addToCart(yachtData);
                
                // Animation du bouton
                this.textContent = '✓ Ajouté';
                this.style.backgroundColor = '#0a4b78';
                this.style.color = '#fff';
                this.style.borderColor = '#0a4b78';
                
                setTimeout(() => {
                    this.textContent = 'Ajouter au panier';
                    this.style.backgroundColor = '';
                    this.style.color = '';
                    this.style.borderColor = '';
                }, 2000);
            });
        });
    },
    
    // Animation pour le bouton d'ajout au panier
    animateAddToCart: function(button, productName) {
        // Animation du bouton
        button.innerHTML = '<span>✓</span> Ajouté au panier';
        button.style.backgroundColor = '#0a4b78';
        button.style.color = '#fff';
        button.style.borderColor = '#0a4b78';
        
        // Si nous sommes sur la page détail, rediriger vers le panier
        if (window.location.pathname.includes('yacht-detail.html')) {
            setTimeout(() => {
                window.location.href = 'panier.html';
            }, 1000);
            return;
        }
        
        // Réinitialiser le bouton après un délai
        setTimeout(() => {
            button.textContent = 'Ajouter au panier';
            button.style.backgroundColor = '';
            button.style.color = '';
            button.style.borderColor = '';
        }, 2000);
    },
    
    // Afficher une notification
    showNotification: function(message) {
        // Supprimer toute notification existante
        const existingNotifications = document.querySelectorAll('.cart-notification');
        existingNotifications.forEach(notification => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        });
        
        // Créer une notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Afficher la notification
        setTimeout(() => {
            notification.classList.add('visible');
        }, 100);
        
        // Cacher la notification après un délai
        setTimeout(() => {
            notification.classList.remove('visible');
            
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
};

// Initialiser le panier au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    NavalfleetCart.init();
});