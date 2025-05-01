// Fichier pour gérer les fonctionnalités de la page d'achat
document.addEventListener('DOMContentLoaded', function() {
    // Gestion des filtres
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    const filterRanges = document.querySelectorAll('.apply-range');
    const resetButton = document.querySelector('.reset-filters');
    const sortSelect = document.getElementById('sort-select');
    const yachtCards = document.querySelectorAll('.yacht-card');
    
    // Compteur de résultats
    const resultsCount = document.querySelector('.results-count');
    
    // Application des filtres
    function applyFilters() {
        // Récupération des types de bateaux sélectionnés
        const selectedTypes = Array.from(filterCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        
        // Affichage de tous les yachts si aucun filtre n'est sélectionné
        if (selectedTypes.length === 0) {
            yachtCards.forEach(card => {
                card.style.display = 'flex';
            });
        } else {
            // Filtrage par type
            yachtCards.forEach(card => {
                const yachtType = card.querySelector('.yacht-type').textContent.toLowerCase();
                
                let matchesType = false;
                for (const type of selectedTypes) {
                    if (yachtType.includes(type.replace('-', ' '))) {
                        matchesType = true;
                        break;
                    }
                }
                
                if (matchesType) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }
        
        // Mise à jour du compteur de résultats
        updateResultsCount();
    }
    
    // Mise à jour du compteur de résultats
    function updateResultsCount() {
        const visibleCards = Array.from(yachtCards).filter(card => card.style.display !== 'none');
        resultsCount.textContent = `${visibleCards.length} yachts trouvés`;
    }
    
    // Réinitialisation des filtres
    function resetFilters() {
        // Décocher toutes les cases
        filterCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Vider les champs de plage
        document.querySelectorAll('.min-input, .max-input').forEach(input => {
            input.value = '';
        });
        
        // Réinitialiser le tri
        sortSelect.selectedIndex = 0;
        
        // Afficher tous les yachts
        yachtCards.forEach(card => {
            card.style.display = 'flex';
        });
        
        // Mise à jour du compteur
        updateResultsCount();
    }
    
    // Tri des résultats
    function sortResults() {
        const sortValue = sortSelect.value;
        const cardsArray = Array.from(yachtCards);
        const parentElement = document.querySelector('.yacht-grid');
        
        cardsArray.sort((a, b) => {
            if (sortValue === 'price-asc') {
                const priceA = extractPrice(a.querySelector('.yacht-price').textContent);
                const priceB = extractPrice(b.querySelector('.yacht-price').textContent);
                return priceA - priceB;
            } else if (sortValue === 'price-desc') {
                const priceA = extractPrice(a.querySelector('.yacht-price').textContent);
                const priceB = extractPrice(b.querySelector('.yacht-price').textContent);
                return priceB - priceA;
            } else if (sortValue === 'year-desc') {
                const yearA = extractYear(a.querySelector('.spec-item:nth-child(2)').textContent);
                const yearB = extractYear(b.querySelector('.spec-item:nth-child(2)').textContent);
                return yearB - yearA;
            } else if (sortValue === 'length-desc') {
                const lengthA = extractLength(a.querySelector('.spec-item:nth-child(1)').textContent);
                const lengthB = extractLength(b.querySelector('.spec-item:nth-child(1)').textContent);
                return lengthB - lengthA;
            }
            
            return 0; // Default for 'relevance'
        });
        
        // Réorganiser les éléments dans le DOM
        cardsArray.forEach(card => {
            parentElement.appendChild(card);
        });
    }
    
    // Fonctions d'extraction pour le tri
    function extractPrice(priceText) {
        return parseFloat(priceText.replace(/[^0-9,.]/g, '').replace(',', '.'));
    }
    
    function extractYear(yearText) {
        return parseInt(yearText.trim());
    }
    
    function extractLength(lengthText) {
        return parseFloat(lengthText.replace('m', '').trim());
    }
    
    // Événements pour les filtres
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Événements pour les ranges
    filterRanges.forEach(button => {
        button.addEventListener('click', function() {
            // Dans une application réelle, il faudrait implémenter la logique de filtrage par plage ici
            applyFilters();
        });
    });
    
    // Événement pour la réinitialisation
    resetButton.addEventListener('click', resetFilters);
    
    // Événement pour le tri
    sortSelect.addEventListener('change', sortResults);
    
    // Pagination
    document.querySelectorAll('.pagination a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Dans une application réelle, on chargerait la page correspondante ou on paginerait via AJAX
            // Pour cette maquette, on change juste la classe active
            document.querySelector('.pagination a.active').classList.remove('active');
            this.classList.add('active');
        });
    });
    
    // Application des filtres au chargement pour initialiser le compteur
    updateResultsCount();
});