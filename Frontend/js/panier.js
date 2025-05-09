// NavalfleetCart - Système amélioré de gestion du panier
const NavalfleetCart = {
    // Initialisation du panier
    init: function() {
        // Éléments DOM du panier
        this.cartCountElement = document.getElementById('cart-count');
        this.cartItemsContainer = document.getElementById('cart-items-container');
        this.emptyCartMessage = document.getElementById('empty-cart');
        this.subtotalElement = document.getElementById('subtotal-price');
        this.discountRowElement = document.getElementById('discount-row');
        this.discountAmountElement = document.getElementById('discount-amount');
        this.totalElement = document.getElementById('total-price');
        this.checkoutBtn = document.getElementById('checkout-btn');
        this.clearCartBtn = document.getElementById('clear-cart');
        this.promoCodeInput = document.getElementById('promo-code');
        this.promoApplyBtn = document.getElementById('apply-promo');
        this.promoMessageElement = document.getElementById('promo-message');
        this.suggestionContainer = document.getElementById('suggestion-container');
        this.confirmationModal = document.getElementById('confirmation-modal');
        this.errorModal = document.getElementById('error-modal');
        
        // Initialiser le panier
        this.updateCartDisplay();
        
        // Attacher les événements
        this.bindEvents();
        
        // Initialiser les suggestions
        this.initSuggestions();
    },

    // Attacher tous les événements
    bindEvents: function() {
        // Si nous sommes sur la page panier
        if (window.location.pathname.includes('panier.html')) {
            // Événement pour vider le panier
            if (this.clearCartBtn) {
                this.clearCartBtn.addEventListener('click', () => this.confirmClearCart());
            }
            
            // Événement pour le code promo
            if (this.promoApplyBtn) {
                this.promoApplyBtn.addEventListener('click', () => this.applyPromoCode());
            }
            
            // Événement pour la touche Entrée dans le champ de code promo
            if (this.promoCodeInput) {
                this.promoCodeInput.addEventListener('keyup', (e) => {
                    if (e.key === 'Enter') {
                        this.applyPromoCode();
                    }
                });
            }
            
            // Événement pour le paiement
            if (this.checkoutBtn) {
                this.checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
            }
            
            // Fermeture des modals
            document.querySelectorAll('.close-modal').forEach(closeBtn => {
                closeBtn.addEventListener('click', () => {
                    document.querySelectorAll('.modal').forEach(modal => {
                        modal.style.display = 'none';
                    });
                });
            });
            
            // Fermeture des modals en cliquant en dehors
            window.addEventListener('click', (e) => {
                document.querySelectorAll('.modal').forEach(modal => {
                    if (e.target === modal) {
                        modal.style.display = 'none';
                    }
                });
            });
        }
        
        // Surveiller tous les boutons d'ajout au panier sur le site
        document.querySelectorAll('.add-to-cart-btn, .add-suggestion-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Récupérer les informations du yacht
                const yachtData = this.getYachtDataFromButton(btn);
                
                if (yachtData) {
                    // Vérifier si le yacht est déjà dans le panier
                    if (this.isYachtInCart(yachtData.id)) {
                        // Afficher un message d'erreur
                        this.showErrorModal('Ce yacht est déjà dans votre panier. Chaque yacht est unique et ne peut être ajouté qu\'une seule fois.');
                    } else {
                        // Ajouter au panier
                        this.addToCart(yachtData);
                        
                        // Animation et feedback
                        this.animateAddToCart(btn, yachtData.name);
                    }
                }
            });
        });
        
        // Mettre à jour le compteur du panier dans la barre de navigation
        this.updateCartCounter();
    },
    
    // Vérifier si un yacht est déjà dans le panier
    isYachtInCart: function(yachtId) {
        const cart = this.getCart();
        return cart.some(item => item.id === yachtId);
    },
    
    // Récupérer les données du yacht à partir du bouton cliqué
    getYachtDataFromButton: function(button) {
        let container = button.closest('.yacht-card, .suggestion-item, .purchase-box, .quick-view-content');
        if (!container) return null;
        
        // Pour la page de détail du yacht
        if (container.classList.contains('purchase-box')) {
            // Récupérer les sélections du formulaire
            const purchaseType = document.getElementById('purchase-type')?.value || 'full';
            const deliveryLocation = document.getElementById('delivery-location')?.value || 'current';
            const crew = document.getElementById('crew')?.value || 'none';
            
            // Récupérer le nom du yacht depuis le titre de la page
            const yachtName = document.querySelector('.yacht-title h1')?.textContent || 'Yacht';
            
            // Générer un ID unique basé sur le nom
            const yachtId = 'yacht-' + yachtName.replace(/\s+/g, '-').toLowerCase();
            
            // Récupérer les autres informations
            const yachtPrice = document.querySelector('.price-amount')?.textContent || '0 €';
            const yachtPriceEur = document.querySelector('.price-converted')?.textContent || '0 €';
            const yachtImage = document.querySelector('.main-image img')?.src || '';
            const yachtType = document.querySelector('.yacht-type')?.textContent || 'Yacht';
            
            // Récupérer les spécifications
            const yachtLength = document.querySelector('.spec-item:nth-child(1) .spec-value')?.textContent || '0m';
            const yachtYear = document.querySelector('.spec-item:nth-child(2) .spec-value')?.textContent || '2023';
            const yachtEngine = document.querySelector('.spec-item:nth-child(3) .spec-value')?.textContent || '0hp';
            
            // Récupérer l'emplacement
            const yachtLocation = document.querySelector('.yacht-location')?.textContent || 'Sur demande';
            
            return {
                id: yachtId,
                name: yachtName,
                price: yachtPrice,
                priceEur: yachtPriceEur,
                image: yachtImage,
                type: yachtType,
                specs: {
                    length: yachtLength,
                    year: yachtYear,
                    engine: yachtEngine
                },
                location: yachtLocation,
                options: {
                    purchaseType,
                    deliveryLocation,
                    crew
                }
            };
        }
        
        // Pour les cartes de yacht et suggestions
        const yachtId = container.dataset.id || ('yacht-' + Math.random().toString(36).substring(2, 9));
        const yachtName = container.querySelector('h3')?.textContent || 'Yacht';
        const yachtPrice = container.querySelector('.yacht-price, .suggestion-price')?.textContent || '0 €';
        const yachtImage = container.querySelector('img')?.src || '';
        const yachtType = container.querySelector('.yacht-type, .suggestion-specs')?.textContent?.split('•')?.[0]?.trim() || 'Yacht';
        
        // Récupérer les spécifications
        let yachtLength = '0m';
        let yachtYear = '2023';
        let yachtEngine = '0hp';
        
        const specItems = container.querySelectorAll('.spec-item');
        if (specItems.length > 0) {
            yachtLength = specItems[0]?.textContent.trim() || '0m';
            yachtYear = specItems[1]?.textContent.trim() || '2023';
            yachtEngine = specItems[2]?.textContent.trim() || '0hp';
        } else {
            // Pour les suggestions
            const specText = container.querySelector('.suggestion-specs')?.textContent || '';
            const specParts = specText.split('•');
            if (specParts.length > 1) {
                yachtLength = specParts[1]?.trim() || '0m';
            }
        }
        
        // Récupérer l'emplacement
        const yachtLocation = container.querySelector('.yacht-location')?.textContent || 'Sur demande';
        
        return {
            id: yachtId,
            name: yachtName,
            price: yachtPrice,
            priceEur: yachtPrice,
            image: yachtImage,
            type: yachtType,
            specs: {
                length: yachtLength,
                year: yachtYear,
                engine: yachtEngine
            },
            location: yachtLocation,
            options: {
                purchaseType: 'full',
                deliveryLocation: 'current',
                crew: 'none'
            }
        };
    },
    
    // Ajouter un yacht au panier
    addToCart: function(yachtData) {
        if (!yachtData) return false;
        
        // Récupérer le panier actuel
        let cart = this.getCart();
        
        // Vérifier si ce yacht existe déjà dans le panier
        const existingYachtIndex = cart.findIndex(item => item.id === yachtData.id);
        
        if (existingYachtIndex !== -1) {
            // Si le yacht existe déjà, montrer le modal d'erreur
            this.showErrorModal('Ce yacht est déjà dans votre panier. Chaque yacht est unique et ne peut être ajouté qu\'une seule fois.');
            return false;
        } else {
            // Ajouter le yacht au panier
            cart.push(yachtData);
            
            // Sauvegarder le panier
            this.saveCart(cart);
            
            // Mettre à jour l'affichage
            this.updateCartDisplay();
            
            // Afficher le modal de confirmation si nous ne sommes pas sur la page panier
            if (!window.location.pathname.includes('panier.html')) {
                this.showConfirmationModal(yachtData.name);
            } else {
                // Sinon, afficher une notification
                this.showNotification(`"${yachtData.name}" ajouté à votre panier`, 'success');
            }
            
            return true;
        }
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
            this.showNotification(`"${removedItem.name}" supprimé de votre panier`, 'success');
        }
    },
    
    // Vider le panier avec confirmation
    confirmClearCart: function() {
        if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
            this.clearCart();
        }
    },
    
    // Vider le panier
    clearCart: function() {
        this.saveCart([]);
        this.clearActivePromo();
        this.updateCartDisplay();
        this.showNotification('Votre panier a été vidé', 'success');
    },
    
    // Mettre à jour l'affichage du panier
    updateCartDisplay: function() {
        const cartItems = this.getCart();
        
        // Mettre à jour le compteur dans la navigation
        this.updateCartCounter(cartItems.length);
        
        // Si nous sommes sur la page panier, mettre à jour le contenu
        if (window.location.pathname.includes('panier.html')) {
            // Mettre à jour le contenu des éléments du panier
            this.renderCartItems(cartItems);
            
            // Mettre à jour les suggestions
            this.updateSuggestions(cartItems);
        }
    },
    
    // Mettre à jour le compteur du panier
    updateCartCounter: function(count = null) {
        if (count === null) {
            count = this.getCart().length;
        }
        
        // Mettre à jour le compteur dans l'en-tête du panier si présent
        if (this.cartCountElement) {
            this.cartCountElement.textContent = count;
        }
        
        // Ajouter un compteur à côté du lien Panier dans la navigation
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            if (link.textContent.includes('Panier')) {
                // Vérifier si le compteur existe déjà
                let counter = link.querySelector('.cart-counter');
                
                if (count > 0) {
                    if (!counter) {
                        counter = document.createElement('span');
                        counter.className = 'cart-counter';
                        link.appendChild(counter);
                    }
                    counter.textContent = count;
                    counter.classList.add('active');
                } else if (counter) {
                    counter.textContent = '0';
                    counter.classList.remove('active');
                }
            }
        });
    },
    
    // Afficher les articles du panier
    renderCartItems: function(cartItems) {
        // Si les éléments DOM n'existent pas, sortir de la fonction
        if (!this.cartItemsContainer || !this.emptyCartMessage) return;
        
        // Vider le conteneur des articles
        this.cartItemsContainer.innerHTML = '';
        
        // Si le panier est vide
        if (cartItems.length === 0) {
            this.emptyCartMessage.style.display = 'block';
            this.cartItemsContainer.style.display = 'none';
            
            // Désactiver le bouton de paiement
            if (this.checkoutBtn) {
                this.checkoutBtn.disabled = true;
            }
            
            // Mettre à jour le résumé avec des montants à zéro
            this.updateOrderSummary(0);
            return;
        }
        
        // Si nous avons des articles
        this.emptyCartMessage.style.display = 'none';
        this.cartItemsContainer.style.display = 'block';
        
        // Activer le bouton de paiement
        if (this.checkoutBtn) {
            this.checkoutBtn.disabled = false;
        }
        
        // Variables pour le total
        let totalPrice = 0;
        
        // Créer les éléments HTML pour chaque article
        cartItems.forEach(item => {
            try {
                // Calculer le prix total
                let priceText = item.priceEur || item.price || '0 €';
                
                // Nouveau traitement des prix qui gère correctement les grands nombres
                let priceStr;
                
                // Vérifier le format du prix
                if (/^\s*\d{1,3}(?:\s\d{3})+(?:[,.]\d+)?\s*[€$£]?\s*$/.test(priceText)) {
                    // Format avec espaces comme séparateurs de milliers (3 790 000 €)
                    priceStr = priceText.replace(/\s/g, '').replace(/[€$£]/g, '').replace(',', '.');
                } else if (/^\s*\d{1,3}(?:\.\d{3})+(?:,\d+)?\s*[€$£]?\s*$/.test(priceText)) {
                    // Format européen avec points comme séparateurs de milliers (3.790.000,00 €)
                    priceStr = priceText.replace(/\./g, '').replace(/[€$£]/g, '').replace(',', '.');
                } else if (/^\s*\d{1,3}(?:,\d{3})+(?:\.\d+)?\s*[€$£]?\s*$/.test(priceText)) {
                    // Format américain avec virgules comme séparateurs de milliers (3,790,000.00 $)
                    priceStr = priceText.replace(/,/g, '').replace(/[€$£]/g, '');
                } else {
                    // Format simple sans séparateurs ou autre format
                    priceStr = priceText.replace(/[^0-9,.]/g, '');
                    
                    // S'il reste une virgule, la convertir en point
                    if (priceStr.includes(',') && !priceStr.includes('.')) {
                        priceStr = priceStr.replace(',', '.');
                    } 
                    // Si plusieurs virgules, c'est probablement un séparateur de milliers
                    else if ((priceStr.match(/,/g) || []).length > 1) {
                        priceStr = priceStr.replace(/,/g, '');
                    }
                }
                
                // Convertir en nombre
                let price = parseFloat(priceStr);
                
                // Ajouter un console.log pour déboguer
                console.log(`Prix original: ${priceText}, Prix traité: ${priceStr}, Prix final: ${price}`);
                
                if (!isNaN(price)) {
                    totalPrice += price;
                }
                
                // Déterminer les textes des options
                let purchaseTypeText = this.getPurchaseTypeText(item.options?.purchaseType);
                let deliveryLocationText = this.getDeliveryLocationText(item.options?.deliveryLocation);
                let crewText = this.getCrewText(item.options?.crew);
                
                // Créer l'élément HTML
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.dataset.id = item.id;
                
                cartItemElement.innerHTML = `
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <div class="item-specs">
                            <span><i class="fas fa-ship"></i> ${item.type}</span>
                            <span><i class="fas fa-ruler-horizontal"></i> ${item.specs?.length || '0m'}</span>
                            <span><i class="fas fa-calendar-alt"></i> ${item.specs?.year || '2023'}</span>
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
                        <div class="current-price">${this.formatPrice(price)}</div>
                        ${item.price !== item.priceEur ? `<div class="original-price">${item.price}</div>` : ''}
                    </div>
                `;
                
                // Ajouter l'élément au conteneur
                this.cartItemsContainer.appendChild(cartItemElement);
                
                // Ajouter les événements pour les boutons
                this.attachCartItemEvents(cartItemElement);
                
            } catch (error) {
                console.error("Erreur lors du rendu d'un article:", error);
            }
        });
        
        // Mettre à jour le résumé de la commande
        this.updateOrderSummary(totalPrice);
    },
    
    // Attacher les événements aux éléments du panier
    attachCartItemEvents: function(cartItemElement) {
        // Bouton de suppression
        const removeBtn = cartItemElement.querySelector('.remove-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                const yachtId = removeBtn.dataset.id;
                const cartItem = removeBtn.closest('.cart-item');
                
                // Animation de suppression
                cartItem.style.opacity = '0.5';
                cartItem.style.transform = 'translateX(20px)';
                cartItem.style.transition = 'opacity 0.3s, transform 0.3s';
                
                // Après l'animation, supprimer l'article
                setTimeout(() => {
                    this.removeFromCart(yachtId);
                }, 300);
            });
        }
        
        // Bouton de modification
        const editBtn = cartItemElement.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                const yachtId = editBtn.dataset.id;
                
                // Rediriger vers la page de détail correspondante
                // On pourrait améliorer ceci en stockant l'URL dans les données du panier
                this.redirectToYachtDetail(yachtId);
            });
        }
    },
    
    // Rediriger vers la page de détail
    redirectToYachtDetail: function(yachtId) {
        const cart = this.getCart();
        const yacht = cart.find(item => item.id === yachtId);
        
        if (yacht) {
            // Construire l'URL en fonction du nom
            let detailUrl = 'yacht-detail.html';
            
            // Redirection basée sur le nom du yacht
            if (yacht.name.includes('Tecnomar')) {
                detailUrl = 'yacht-detail4.html';
            } else if (yacht.name.includes('Heysea')) {
                detailUrl = 'yacht-detail.html';
            } else if (yacht.name.includes('Icon')) {
                detailUrl = 'yacht-detail2.html';
            } else if (yacht.name.includes('Sunseeker')) {
                detailUrl = 'yacht-detail3.html';
            }
            
            window.location.href = detailUrl;
        }
    },
    
    // Mettre à jour le résumé de la commande
    updateOrderSummary: function(totalPrice) {
        // Si les éléments DOM n'existent pas, sortir de la fonction
        if (!this.subtotalElement || !this.totalElement) return;
        
        // Vérifier si un code promo est actif
        const activePromo = this.getActivePromo();
        let finalPrice = totalPrice;
        
        // Mettre à jour le sous-total
        this.subtotalElement.textContent = this.formatPrice(totalPrice);
        
        // Appliquer la réduction si un code promo est actif
        if (activePromo) {
            // Mettre à jour l'affichage de la remise
            if (this.discountRowElement && this.discountAmountElement) {
                // Calculer la remise
                let discountValue = 0;
                
                if (activePromo.code === 'ALAN') {
                    // Remise de 100%
                    discountValue = totalPrice;
                } else if (activePromo.percentOff) {
                    discountValue = totalPrice * (activePromo.percentOff / 100);
                } else if (activePromo.amountOff) {
                    discountValue = activePromo.amountOff;
                }
                
                // Plafonner la remise au montant total
                discountValue = Math.min(discountValue, totalPrice);
                
                // Mettre à jour l'affichage
                this.discountAmountElement.textContent = `- ${this.formatPrice(discountValue)}`;
                this.discountRowElement.classList.add('active');
                
                // Appliquer la remise au prix final
                finalPrice = totalPrice - discountValue;
            }
        } else {
            // Masquer la ligne de remise si aucun code promo n'est actif
            if (this.discountRowElement) {
                this.discountRowElement.classList.remove('active');
            }
        }
        
        // Mettre à jour le prix total
        this.totalElement.textContent = this.formatPrice(finalPrice);
        
        // Mettre à jour le texte du bouton de paiement
        if (this.checkoutBtn) {
            if (finalPrice <= 0) {
                this.checkoutBtn.textContent = 'Obtenir gratuitement';
            } else {
                this.checkoutBtn.textContent = 'Procéder au paiement';
            }
        }
    },
    
    // Appliquer un code promo
    applyPromoCode: function() {
        // Si les éléments DOM n'existent pas, sortir de la fonction
        if (!this.promoCodeInput || !this.promoMessageElement) return;
        
        const code = this.promoCodeInput.value.trim().toUpperCase();
        
        if (!code) {
            this.showPromoMessage('Veuillez saisir un code promotionnel', 'error');
            return;
        }
        
        // Valider le code promo
        if (code === 'ALAN') {
            // Enregistrer le code promo actif
            this.setActivePromo({
                code: 'ALAN',
                percentOff: 100,
                message: 'Code promotionnel ALAN appliqué - 100% de réduction!'
            });
            
            this.showPromoMessage('Code ALAN appliqué avec succès! Votre commande est gratuite!', 'success');
            
            // Mettre à jour l'affichage
            this.updateCartDisplay();
        } else if (code === 'BIENVENUE') {
            // Code de bienvenue - 10% de réduction
            this.setActivePromo({
                code: 'BIENVENUE',
                percentOff: 10,
                message: 'Code promotionnel BIENVENUE appliqué - 10% de réduction!'
            });
            
            this.showPromoMessage('Code BIENVENUE appliqué avec succès! Profitez de 10% de réduction sur votre commande.', 'success');
            
            // Mettre à jour l'affichage
            this.updateCartDisplay();
        } else if (code === 'LUXURY') {
            // Code pour les yachts de luxe - 5% de réduction
            this.setActivePromo({
                code: 'LUXURY',
                percentOff: 5,
                message: 'Code promotionnel LUXURY appliqué - 5% de réduction!'
            });
            
            this.showPromoMessage('Code LUXURY appliqué avec succès! Profitez de 5% de réduction sur votre commande.', 'success');
            
            // Mettre à jour l'affichage
            this.updateCartDisplay();
        } else {
            this.showPromoMessage('Code promotionnel invalide', 'error');
            
            // Animation d'erreur
            this.promoCodeInput.classList.add('shake');
            setTimeout(() => {
                this.promoCodeInput.classList.remove('shake');
            }, 500);
        }
    },
    
    // Afficher un message pour le code promo
    showPromoMessage: function(message, type) {
        if (!this.promoMessageElement) return;
        
        this.promoMessageElement.textContent = message;
        this.promoMessageElement.className = 'promo-message';
        
        if (type) {
            this.promoMessageElement.classList.add(type);
        }
    },
    
    // Enregistrer un code promo actif
    setActivePromo: function(promoData) {
        localStorage.setItem('navalfleetPromo', JSON.stringify(promoData));
    },
    
    // Récupérer un code promo actif
    getActivePromo: function() {
        const promoData = localStorage.getItem('navalfleetPromo');
        return promoData ? JSON.parse(promoData) : null;
    },
    
    // Supprimer un code promo actif
    clearActivePromo: function() {
        localStorage.removeItem('navalfleetPromo');
    },
    
    // Procéder au paiement
    proceedToCheckout: function() {
        if (!this.checkoutBtn) return;
        
        // Animation pour le bouton
        const originalText = this.checkoutBtn.textContent;
        this.checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement en cours...';
        this.checkoutBtn.disabled = true;
        
        // Vérifier si un code promo est actif
        const activePromo = this.getActivePromo();
        const isFree = activePromo && activePromo.code === 'ALLAN';
        
        // Simuler un traitement
        setTimeout(() => {
            if (isFree) {
                alert('Félicitations! Votre commande est gratuite grâce au code ALLAN. Votre yacht sera livré prochainement!');
            } else {
                window.location.href = 'paiement.html';
            }
            
            this.checkoutBtn.innerHTML = originalText;
            this.checkoutBtn.disabled = false;
        }, 1500);
    },
    
    // Animation pour l'ajout au panier
    animateAddToCart: function(button, productName) {
        // Animation du bouton
        const originalText = button.textContent;
        button.innerHTML = '<i class="fas fa-check"></i> Ajouté au panier';
        button.style.backgroundColor = 'var(--color-success)';
        button.style.color = '#fff';
        button.style.borderColor = 'var(--color-success)';
        
        // Réinitialiser le bouton après un délai
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
            button.style.color = '';
            button.style.borderColor = '';
        }, 2000);
    },
    
    // Afficher une notification
    showNotification: function(message, type = 'success') {
        // Supprimer toute notification existante
        const existingNotifications = document.querySelectorAll('.cart-notification');
        existingNotifications.forEach(notification => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        });
        
        // Créer une notification
        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
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
    },
    
    // Afficher le modal de confirmation
    showConfirmationModal: function(yachtName) {
        if (!this.confirmationModal) return;
        
        // Mettre à jour le contenu du modal
        const modalBody = this.confirmationModal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.querySelector('h2').textContent = 'Yacht ajouté au panier';
            modalBody.querySelector('p').textContent = `"${yachtName}" a été ajouté à votre panier avec succès.`;
        }
        
        // Afficher le modal
        this.confirmationModal.style.display = 'block';
    },
    
    // Afficher le modal d'erreur
    showErrorModal: function(message) {
        if (!this.errorModal) return;
        
        // Mettre à jour le contenu du modal
        const modalBody = this.errorModal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.querySelector('p').textContent = message;
        }
        
        // Afficher le modal
        this.errorModal.style.display = 'block';
    },
    
    // Initialiser les suggestions
    initSuggestions: function() {
        if (!this.suggestionContainer) return;
        
        // Récupérer la liste des suggestions
        const suggestions = this.getSuggestions();
        
        // Afficher les suggestions
        this.renderSuggestions(suggestions);
    },
    
    // Récupérer la liste des suggestions
    getSuggestions: function() {
        // Liste des yachts disponibles
        const availableYachts = [
            {
                id: 'yacht-tecnomar-63',
                name: '2021 Tecnomar 63',
                price: '3,790,000 €',
                image: 'styles/img/Bateauaccueil1.png',
                type: 'Motoryacht',
                specs: {
                    length: '19m',
                    year: '2021'
                }
            },
            {
                id: 'yacht-heysea-asteria-142',
                name: '2023 Heysea Asteria 142',
                price: '23,611,815 €',
                image: 'styles/img/Bateauaccueil2.png',
                type: 'Mega Yacht',
                specs: {
                    length: '43m',
                    year: '2023'
                }
            },
            {
                id: 'yacht-fountaine-pajot-alegria-67',
                name: '2025 Fountaine Pajot Alegria 67',
                price: '484,571 €',
                image: 'styles/img/Bateauaccueil3.png',
                type: 'Catamaran',
                specs: {
                    length: '20m',
                    year: '2025'
                }
            },
            {
                id: 'yacht-cheoy-lee-66-lrc',
                name: '1982 Cheoy Lee 66 LRC',
                price: '511,002 €',
                image: 'styles/img/Bateauaccueil4.png',
                type: 'Motoryacht',
                specs: {
                    length: '20m',
                    year: '1982'
                }
            },
            {
                id: 'yacht-icon-67m',
                name: '2010 Icon 67m',
                price: '41,792,889 €',
                image: 'styles/img/Bateau2arrière.png',
                type: 'Mega Yacht',
                specs: {
                    length: '67.36m',
                    year: '2010'
                }
            },
            {
                id: 'yacht-sunseeker-portofino-47',
                name: '2009 Sunseeker Portofino 47',
                price: '329,000 €',
                image: 'styles/img/Bateau1arrière.png',
                type: 'Motoryacht',
                specs: {
                    length: '14.95m',
                    year: '2009'
                }
            }
        ];
        
        return availableYachts;
    },
    
    // Afficher les suggestions
    renderSuggestions: function(suggestions) {
        if (!this.suggestionContainer) return;
        
        // Vider le conteneur
        this.suggestionContainer.innerHTML = '';
        
        // Récupérer le panier
        const cart = this.getCart();
        
        // Filtrer les suggestions pour exclure les yachts déjà dans le panier
        const filteredSuggestions = suggestions.filter(suggestion => 
            !cart.some(item => item.id === suggestion.id)
        );
        
        // Limiter à 3 suggestions
        const limitedSuggestions = filteredSuggestions.slice(0, 3);
        
        // Si pas de suggestions
        if (limitedSuggestions.length === 0) {
            this.suggestionContainer.innerHTML = `
                <div class="no-suggestions">
                    <p>Aucune suggestion disponible pour le moment.</p>
                </div>
            `;
            return;
        }
        
        // Créer les éléments HTML pour chaque suggestion
        limitedSuggestions.forEach(suggestion => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'suggestion-item';
            suggestionElement.dataset.id = suggestion.id;
            
            suggestionElement.innerHTML = `
                <div class="suggestion-image">
                    <img src="${suggestion.image}" alt="${suggestion.name}">
                    <div class="suggestion-type">${suggestion.type}</div>
                </div>
                <div class="suggestion-details">
                    <h3>${suggestion.name}</h3>
                    <div class="suggestion-price">${suggestion.price}</div>
                    <div class="suggestion-specs">
                        <span>${suggestion.type}</span> • <span>${suggestion.specs.length}</span>
                    </div>
                    <button class="add-suggestion-btn">Ajouter au panier</button>
                </div>
            `;
            
            // Ajouter l'élément au conteneur
            this.suggestionContainer.appendChild(suggestionElement);
            
            // Ajouter l'événement pour le bouton d'ajout
            const addBtn = suggestionElement.querySelector('.add-suggestion-btn');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    const yachtData = this.getYachtDataFromButton(addBtn);
                    
                    if (yachtData) {
                        // Vérifier si le yacht est déjà dans le panier
                        if (this.isYachtInCart(yachtData.id)) {
                            // Afficher un message d'erreur
                            this.showErrorModal('Ce yacht est déjà dans votre panier. Chaque yacht est unique et ne peut être ajouté qu\'une seule fois.');
                        } else {
                            // Ajouter au panier
                            const success = this.addToCart(yachtData);
                            
                            if (success) {
                                // Animation et feedback
                                this.animateAddToCart(addBtn, yachtData.name);
                                
                                // Mettre à jour les suggestions
                                setTimeout(() => {
                                    this.updateSuggestions(this.getCart());
                                }, 500);
                            }
                        }
                    }
                });
            }
        });
    },
    
    // Mettre à jour les suggestions
    updateSuggestions: function(cartItems) {
        // Récupérer la liste des suggestions
        const suggestions = this.getSuggestions();
        
        // Afficher les suggestions filtrées
        this.renderSuggestions(suggestions);
    },
    
    // Formatage du prix
    formatPrice: function(price) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(price);
    },
    
    // Formatage des textes d'option
    getPurchaseTypeText: function(type) {
        switch (type) {
            case 'full': return 'Achat complet';
            case 'part': return 'Copropriété (25%)';
            case 'lease': return 'Location longue durée';
            default: return 'Achat complet';
        }
    },
    
    getDeliveryLocationText: function(location) {
        switch (location) {
            case 'current': return 'Emplacement actuel';
            case 'monaco': return 'Monaco';
            case 'cannes': return 'Cannes';
            case 'stTropez': return 'Saint-Tropez';
            default: return 'Emplacement actuel';
        }
    },
    
    getCrewText: function(crew) {
        switch (crew) {
            case 'none': return 'Sans équipage';
            case 'basic': return 'Équipage basique (3 personnes)';
            case 'full': return 'Équipage complet (8 personnes)';
            default: return 'Sans équipage';
        }
    }
};

// Initialiser le panier au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    NavalfleetCart.init();
});