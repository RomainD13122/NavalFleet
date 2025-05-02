// Fichier JavaScript amélioré pour la page d'achat avec filtres fonctionnels
document.addEventListener('DOMContentLoaded', function() {
    // État global des filtres
    const filterState = {
        types: [],
        locations: [],
        length: { min: 0, max: 100 },
        price: { min: 0, max: 50000000 },
        year: { min: 1980, max: 2025 },
        search: '',
        sort: 'relevance'
    };

    // Éléments DOM
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    const applyRangeButtons = document.querySelectorAll('.apply-range');
    const resetButtons = document.querySelectorAll('.reset-filters');
    const sortSelect = document.getElementById('sort-select');
    const yachtCards = document.querySelectorAll('.yacht-card');
    const resultsCount = document.querySelector('.results-count');
    const noResults = document.querySelector('.no-results');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.querySelector('.search-button');
    const filterTags = document.getElementById('filter-tags');
    const toggleFiltersButton = document.getElementById('toggle-filters');
    const viewOptions = document.querySelectorAll('.view-option');
    const yachtGrid = document.querySelector('.yacht-grid');
    
    // Initialisation
    init();
    
    function init() {
        // Initialiser les sliders de plage
        initRangeSliders();
        
        // Configurer les événements
        setupEventListeners();
        
        // Mettre à jour le compteur de résultats initial
        updateResultsCount();
        
        // Initialiser les vues rapides
        initQuickView();
    }
    
    function setupEventListeners() {
        // Événements pour les filtres par type et emplacement
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const filterType = this.name; // 'type' ou 'location'
                const value = this.value;
                
                if (this.checked) {
                    // Ajouter à l'état des filtres
                    filterState[filterType + 's'].push(value);
                    // Ajouter un tag de filtre
                    addFilterTag(filterType, value);
                } else {
                    // Retirer de l'état des filtres
                    filterState[filterType + 's'] = filterState[filterType + 's'].filter(item => item !== value);
                    // Retirer le tag de filtre
                    removeFilterTag(filterType, value);
                }
                
                // Appliquer les filtres
                applyFilters();
            });
        });
        
        // Événements pour les plages
        applyRangeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterType = this.dataset.filter;
                
                if (filterType === 'length') {
                    const minInput = document.getElementById('length-min-input');
                    const maxInput = document.getElementById('length-max-input');
                    
                    filterState.length.min = minInput.value ? parseFloat(minInput.value) : 0;
                    filterState.length.max = maxInput.value ? parseFloat(maxInput.value) : 100;
                    
                    // Mettre à jour les sliders
                    document.getElementById('length-min').value = filterState.length.min;
                    document.getElementById('length-max').value = filterState.length.max;
                    updateSliderTrack('length');
                    
                    // Ajouter ou mettre à jour le tag de filtre
                    updateRangeFilterTag('length', `${filterState.length.min}m - ${filterState.length.max}m`);
                }
                else if (filterType === 'price') {
                    const minInput = document.getElementById('price-min-input');
                    const maxInput = document.getElementById('price-max-input');
                    
                    filterState.price.min = minInput.value ? parseInt(minInput.value) : 0;
                    filterState.price.max = maxInput.value ? parseInt(maxInput.value) : 50000000;
                    
                    // Mettre à jour les sliders
                    document.getElementById('price-min').value = filterState.price.min;
                    document.getElementById('price-max').value = filterState.price.max;
                    updateSliderTrack('price');
                    
                    // Formater les prix pour l'affichage
                    const formattedMin = formatPrice(filterState.price.min);
                    const formattedMax = formatPrice(filterState.price.max);
                    
                    // Ajouter ou mettre à jour le tag de filtre
                    updateRangeFilterTag('price', `${formattedMin} - ${formattedMax}`);
                }
                else if (filterType === 'year') {
                    const minInput = document.getElementById('year-min-input');
                    const maxInput = document.getElementById('year-max-input');
                    
                    filterState.year.min = minInput.value ? parseInt(minInput.value) : 1980;
                    filterState.year.max = maxInput.value ? parseInt(maxInput.value) : 2025;
                    
                    // Mettre à jour les sliders
                    document.getElementById('year-min').value = filterState.year.min;
                    document.getElementById('year-max').value = filterState.year.max;
                    updateSliderTrack('year');
                    
                    // Ajouter ou mettre à jour le tag de filtre
                    updateRangeFilterTag('year', `${filterState.year.min} - ${filterState.year.max}`);
                }
                
                // Appliquer les filtres
                applyFilters();
            });
        });
        
        // Événement pour la réinitialisation des filtres
        resetButtons.forEach(button => {
            button.addEventListener('click', resetFilters);
        });
        
        // Événement pour le tri
        sortSelect.addEventListener('change', function() {
            filterState.sort = this.value;
            sortResults();
        });
        
        // Événement pour la recherche
        searchButton.addEventListener('click', function() {
            filterState.search = searchInput.value.toLowerCase().trim();
            // Ajouter ou mettre à jour le tag de recherche
            if (filterState.search) {
                updateSearchFilterTag(filterState.search);
            } else {
                removeFilterTag('search');
            }
            applyFilters();
        });
        
        // Rechercher aussi en appuyant sur Entrée
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                filterState.search = this.value.toLowerCase().trim();
                // Ajouter ou mettre à jour le tag de recherche
                if (filterState.search) {
                    updateSearchFilterTag(filterState.search);
                } else {
                    removeFilterTag('search');
                }
                applyFilters();
            }
        });
        
        // Événement pour afficher/masquer les filtres (en mobile)
        if (toggleFiltersButton) {
            toggleFiltersButton.addEventListener('click', function() {
                const sidebar = document.querySelector('.filters-sidebar');
                sidebar.classList.toggle('visible');
                
                if (sidebar.classList.contains('visible')) {
                    this.innerHTML = '<i class="fas fa-times"></i> Fermer';
                } else {
                    this.innerHTML = '<i class="fas fa-sliders-h"></i> Filtres';
                }
            });
        }
        
        // Gestion des vues (grille/liste)
        viewOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Retirer la classe active de toutes les options
                viewOptions.forEach(opt => opt.classList.remove('active'));
                // Ajouter la classe active à l'option cliquée
                this.classList.add('active');
                
                // Changer la vue
                const viewType = this.dataset.view;
                if (viewType === 'grid') {
                    yachtGrid.classList.remove('list-view');
                } else if (viewType === 'list') {
                    yachtGrid.classList.add('list-view');
                }
            });
        });
    }
    
    // Initialisation des sliders de plage
    function initRangeSliders() {
        // Slider pour la longueur
        setupRangeSlider('length', 0, 100);
        
        // Slider pour le prix
        setupRangeSlider('price', 0, 50000000, 100000);
        
        // Slider pour l'année
        setupRangeSlider('year', 1980, 2025, 1);
    }
    
    // Configuration d'un slider de plage
    function setupRangeSlider(type, min, max, step = 1) {
        const minRange = document.getElementById(`${type}-min`);
        const maxRange = document.getElementById(`${type}-max`);
        const minInput = document.getElementById(`${type}-min-input`);
        const maxInput = document.getElementById(`${type}-max-input`);
        const minValue = document.getElementById(`${type}-min-value`);
        const maxValue = document.getElementById(`${type}-max-value`);
        
        // Initialiser l'état
        filterState[type].min = min;
        filterState[type].max = max;
        
        // Configurer les attributs des sliders
        minRange.min = min;
        minRange.max = max;
        minRange.value = min;
        minRange.step = step;
        
        maxRange.min = min;
        maxRange.max = max;
        maxRange.value = max;
        maxRange.step = step;
        
        // Configurer les attributs des inputs
        minInput.min = min;
        minInput.max = max;
        minInput.value = min;
        minInput.step = step;
        
        maxInput.min = min;
        maxInput.max = max;
        maxInput.value = max;
        maxInput.step = step;
        
        // Mettre à jour l'affichage des valeurs
        if (type === 'price') {
            minValue.textContent = formatPrice(min);
            maxValue.textContent = formatPrice(max);
        } else {
            minValue.textContent = min;
            maxValue.textContent = max;
        }
        
        // Événement pour le slider min
        minRange.addEventListener('input', function() {
            let minVal = parseInt(minRange.value);
            let maxVal = parseInt(maxRange.value);
            
            if (minVal > maxVal) {
                minVal = maxVal;
                minRange.value = minVal;
            }
            
            // Mettre à jour l'input et la valeur affichée
            minInput.value = minVal;
            if (type === 'price') {
                minValue.textContent = formatPrice(minVal);
            } else {
                minValue.textContent = minVal;
            }
            
            // Mettre à jour la track du slider
            updateSliderTrack(type);
        });
        
        // Événement pour le slider max
        maxRange.addEventListener('input', function() {
            let minVal = parseInt(minRange.value);
            let maxVal = parseInt(maxRange.value);
            
            if (maxVal < minVal) {
                maxVal = minVal;
                maxRange.value = maxVal;
            }
            
            // Mettre à jour l'input et la valeur affichée
            maxInput.value = maxVal;
            if (type === 'price') {
                maxValue.textContent = formatPrice(maxVal);
            } else {
                maxValue.textContent = maxVal;
            }
            
            // Mettre à jour la track du slider
            updateSliderTrack(type);
        });
        
        // Événement pour l'input min
        minInput.addEventListener('input', function() {
            let minVal = parseInt(minInput.value);
            let maxVal = parseInt(maxInput.value);
            
            if (minVal > maxVal) {
                minVal = maxVal;
                minInput.value = minVal;
            }
            
            // Mettre à jour le slider et la valeur affichée
            minRange.value = minVal;
            if (type === 'price') {
                minValue.textContent = formatPrice(minVal);
            } else {
                minValue.textContent = minVal;
            }
            
            // Mettre à jour la track du slider
            updateSliderTrack(type);
        });
        
        // Événement pour l'input max
        maxInput.addEventListener('input', function() {
            let minVal = parseInt(minInput.value);
            let maxVal = parseInt(maxInput.value);
            
            if (maxVal < minVal) {
                maxVal = minVal;
                maxInput.value = maxVal;
            }
            
            // Mettre à jour le slider et la valeur affichée
            maxRange.value = maxVal;
            if (type === 'price') {
                maxValue.textContent = formatPrice(maxVal);
            } else {
                maxValue.textContent = maxVal;
            }
            
            // Mettre à jour la track du slider
            updateSliderTrack(type);
        });
        
        // Initialiser la track du slider
        updateSliderTrack(type);
    }
    
    // Mise à jour visuelle de la track du slider
    function updateSliderTrack(type) {
        const minRange = document.getElementById(`${type}-min`);
        const maxRange = document.getElementById(`${type}-max`);
        const track = minRange.parentElement.querySelector('.slider-track');
        
        const percent1 = ((minRange.value - minRange.min) / (minRange.max - minRange.min)) * 100;
        const percent2 = ((maxRange.value - minRange.min) / (minRange.max - minRange.min)) * 100;
        
        track.style.background = `linear-gradient(to right, #ddd ${percent1}%, var(--color-primary) ${percent1}%, var(--color-primary) ${percent2}%, #ddd ${percent2}%)`;
    }
    
    // Application des filtres
    function applyFilters() {
        let visibleCount = 0;
        
        yachtCards.forEach(card => {
            // Récupérer les attributs data- du yacht
            const type = card.dataset.type;
            const price = parseFloat(card.dataset.price);
            const year = parseInt(card.dataset.year);
            const length = parseFloat(card.dataset.length);
            const location = card.dataset.location;
            const name = card.querySelector('.yacht-name').textContent.toLowerCase();
            
            // Vérifier si le yacht correspond aux critères de filtrage
            let matchesType = filterState.types.length === 0 || filterState.types.includes(type);
            let matchesLocation = filterState.locations.length === 0 || filterState.locations.includes(location);
            let matchesLength = length >= filterState.length.min && length <= filterState.length.max;
            let matchesPrice = price >= filterState.price.min && price <= filterState.price.max;
            let matchesYear = year >= filterState.year.min && year <= filterState.year.max;
            let matchesSearch = !filterState.search || name.includes(filterState.search);
            
            // Afficher ou masquer le yacht
            if (matchesType && matchesLocation && matchesLength && matchesPrice && matchesYear && matchesSearch) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Mettre à jour le compteur de résultats
        updateResultsCount(visibleCount);
        
        // Afficher le message de résultats vides si nécessaire
        if (visibleCount === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
        
        // Appliquer le tri
        sortResults();
    }
    
    // Tri des résultats
    function sortResults() {
        const sortValue = filterState.sort;
        const cardsArray = Array.from(yachtCards).filter(card => card.style.display !== 'none');
        
        cardsArray.sort((a, b) => {
            if (sortValue === 'price-asc') {
                return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
            } 
            else if (sortValue === 'price-desc') {
                return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
            } 
            else if (sortValue === 'year-desc') {
                return parseInt(b.dataset.year) - parseInt(a.dataset.year);
            } 
            else if (sortValue === 'length-desc') {
                return parseFloat(b.dataset.length) - parseFloat(a.dataset.length);
            }
            
            return 0; // Default pour 'relevance'
        });
        
        // Réorganiser les éléments dans le DOM
        const parent = document.querySelector('.yacht-grid');
        cardsArray.forEach(card => {
            parent.appendChild(card);
        });
    }
    
    // Réinitialisation des filtres
    function resetFilters() {
        // Réinitialiser l'état des filtres
        filterState.types = [];
        filterState.locations = [];
        filterState.length = { min: 0, max: 100 };
        filterState.price = { min: 0, max: 50000000 };
        filterState.year = { min: 1980, max: 2025 };
        filterState.search = '';
        filterState.sort = 'relevance';
        
        // Réinitialiser les inputs
        filterCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Réinitialiser les sliders
        document.getElementById('length-min').value = 0;
        document.getElementById('length-max').value = 100;
        document.getElementById('length-min-input').value = 0;
        document.getElementById('length-max-input').value = 100;
        document.getElementById('length-min-value').textContent = '0';
        document.getElementById('length-max-value').textContent = '100';
        
        document.getElementById('price-min').value = 0;
        document.getElementById('price-max').value = 50000000;
        document.getElementById('price-min-input').value = 0;
        document.getElementById('price-max-input').value = 50000000;
        document.getElementById('price-min-value').textContent = '0 €';
        document.getElementById('price-max-value').textContent = '50 000 000 €';
        
        document.getElementById('year-min').value = 1980;
        document.getElementById('year-max').value = 2025;
        document.getElementById('year-min-input').value = 1980;
        document.getElementById('year-max-input').value = 2025;
        document.getElementById('year-min-value').textContent = '1980';
        document.getElementById('year-max-value').textContent = '2025';
        
        // Mettre à jour les tracks des sliders
        updateSliderTrack('length');
        updateSliderTrack('price');
        updateSliderTrack('year');
        
        // Réinitialiser la recherche
        searchInput.value = '';
        
        // Réinitialiser le tri
        sortSelect.selectedIndex = 0;
        
        // Vider les tags de filtre
        filterTags.innerHTML = '';
        
        // Appliquer les filtres
        applyFilters();
    }
    
    // Mise à jour du compteur de résultats
    function updateResultsCount(count = null) {
        if (count === null) {
            // Compter les cartes visibles
            count = Array.from(yachtCards).filter(card => card.style.display !== 'none').length;
        }
        
        // Mettre à jour le texte
        resultsCount.textContent = `${count} yacht${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}`;
    }
    
    // Ajouter un tag de filtre
    function addFilterTag(type, value) {
        // Vérifier si le tag existe déjà
        if (document.querySelector(`.filter-tag[data-type="${type}"][data-value="${value}"]`)) {
            return;
        }
        
        // Créer l'élément tag
        const tag = document.createElement('div');
        tag.className = 'filter-tag';
        tag.dataset.type = type;
        tag.dataset.value = value;
        
        // Déterminer le texte à afficher
        let displayText;
        if (type === 'type') {
            displayText = `Type: ${value.charAt(0).toUpperCase() + value.slice(1)}`;
        } else if (type === 'location') {
            displayText = `Lieu: ${value.charAt(0).toUpperCase() + value.slice(1)}`;
        }
        
        tag.innerHTML = `${displayText} <i class="fas fa-times"></i>`;
        
        // Ajouter l'événement pour supprimer le filtre
        tag.querySelector('i').addEventListener('click', function() {
            // Décocher la case correspondante
            document.querySelector(`input[name="${type}"][value="${value}"]`).checked = false;
            
            // Mettre à jour l'état des filtres
            if (type === 'type') {
                filterState.types = filterState.types.filter(item => item !== value);
            } else if (type === 'location') {
                filterState.locations = filterState.locations.filter(item => item !== value);
            }
            
            // Supprimer le tag
            tag.remove();
            
            // Appliquer les filtres
            applyFilters();
        });
        
        // Ajouter le tag à la liste
        filterTags.appendChild(tag);
    }
    
    // Mettre à jour un tag de filtre de plage
    function updateRangeFilterTag(type, displayValue) {
        // Vérifier si le tag existe déjà
        let tag = document.querySelector(`.filter-tag[data-type="${type}-range"]`);
        
        if (!tag) {
            // Créer l'élément tag s'il n'existe pas
            tag = document.createElement('div');
            tag.className = 'filter-tag';
            tag.dataset.type = `${type}-range`;
            
            // Déterminer le texte du label
            let labelText;
            if (type === 'length') {
                labelText = 'Longueur:';
            } else if (type === 'price') {
                labelText = 'Prix:';
            } else if (type === 'year') {
                labelText = 'Année:';
            }
            
            tag.innerHTML = `${labelText} ${displayValue} <i class="fas fa-times"></i>`;
            
            // Ajouter l'événement pour réinitialiser le filtre
            tag.querySelector('i').addEventListener('click', function() {
                // Réinitialiser le filtre spécifique
                if (type === 'length') {
                    filterState.length = { min: 0, max: 100 };
                    document.getElementById('length-min').value = 0;
                    document.getElementById('length-max').value = 100;
                    document.getElementById('length-min-input').value = 0;
                    document.getElementById('length-max-input').value = 100;
                    document.getElementById('length-min-value').textContent = '0';
                    document.getElementById('length-max-value').textContent = '100';
                    updateSliderTrack('length');
                } 
                else if (type === 'price') {
                    filterState.price = { min: 0, max: 50000000 };
                    document.getElementById('price-min').value = 0;
                    document.getElementById('price-max').value = 50000000;
                    document.getElementById('price-min-input').value = 0;
                    document.getElementById('price-max-input').value = 50000000;
                    document.getElementById('price-min-value').textContent = '0 €';
                    document.getElementById('price-max-value').textContent = '50 000 000 €';
                    updateSliderTrack('price');
                } 
                else if (type === 'year') {
                    filterState.year = { min: 1980, max: 2025 };
                    document.getElementById('year-min').value = 1980;
                    document.getElementById('year-max').value = 2025;
                    document.getElementById('year-min-input').value = 1980;
                    document.getElementById('year-max-input').value = 2025;
                    document.getElementById('year-min-value').textContent = '1980';
                    document.getElementById('year-max-value').textContent = '2025';
                    updateSliderTrack('year');
                }
                
                // Supprimer le tag
                tag.remove();
                
                // Appliquer les filtres
                applyFilters();
            });
            
            // Ajouter le tag à la liste
            filterTags.appendChild(tag);
        } else {
            // Mettre à jour le texte du tag existant
            let labelText;
            if (type === 'length') {
                labelText = 'Longueur:';
            } else if (type === 'price') {
                labelText = 'Prix:';
            } else if (type === 'year') {
                labelText = 'Année:';
            }
            
            tag.innerHTML = `${labelText} ${displayValue} <i class="fas fa-times"></i>`;
            
            // Réattacher l'événement
            tag.querySelector('i').addEventListener('click', function() {
                // Réinitialiser le filtre spécifique
                if (type === 'length') {
                    filterState.length = { min: 0, max: 100 };
                    document.getElementById('length-min').value = 0;
                    document.getElementById('length-max').value = 100;
                    document.getElementById('length-min-input').value = 0;
                    document.getElementById('length-max-input').value = 100;
                    document.getElementById('length-min-value').textContent = '0';
                    document.getElementById('length-max-value').textContent = '100';
                    updateSliderTrack('length');
                } 
                else if (type === 'price') {
                    filterState.price = { min: 0, max: 50000000 };
                    document.getElementById('price-min').value = 0;
                    document.getElementById('price-max').value = 50000000;
                    document.getElementById('price-min-input').value = 0;
                    document.getElementById('price-max-input').value = 50000000;
                    document.getElementById('price-min-value').textContent = '0 €';
                    document.getElementById('price-max-value').textContent = '50 000 000 €';
                    updateSliderTrack('price');
                } 
                else if (type === 'year') {
                    filterState.year = { min: 1980, max: 2025 };
                    document.getElementById('year-min').value = 1980;
                    document.getElementById('year-max').value = 2025;
                    document.getElementById('year-min-input').value = 1980;
                    document.getElementById('year-max-input').value = 2025;
                    document.getElementById('year-min-value').textContent = '1980';
                    document.getElementById('year-max-value').textContent = '2025';
                    updateSliderTrack('year');
                }
                
                // Supprimer le tag
                tag.remove();
                
                // Appliquer les filtres
                applyFilters();
            });
        }
    }
    
    // Mettre à jour un tag de filtre de recherche
    function updateSearchFilterTag(searchValue) {
        // Vérifier si le tag existe déjà
        let tag = document.querySelector('.filter-tag[data-type="search"]');
        
        if (!tag) {
            // Créer l'élément tag s'il n'existe pas
            tag = document.createElement('div');
            tag.className = 'filter-tag';
            tag.dataset.type = 'search';
            
            tag.innerHTML = `Recherche: ${searchValue} <i class="fas fa-times"></i>`;
            
            // Ajouter l'événement pour supprimer le filtre
            tag.querySelector('i').addEventListener('click', function() {
                // Réinitialiser la recherche
                filterState.search = '';
                searchInput.value = '';
                
                // Supprimer le tag
                tag.remove();
                
                // Appliquer les filtres
                applyFilters();
            });
            
            // Ajouter le tag à la liste
            filterTags.appendChild(tag);
        } else {
            // Mettre à jour le texte du tag existant
            tag.innerHTML = `Recherche: ${searchValue} <i class="fas fa-times"></i>`;
            
            // Réattacher l'événement
            tag.querySelector('i').addEventListener('click', function() {
                // Réinitialiser la recherche
                filterState.search = '';
                searchInput.value = '';
                
                // Supprimer le tag
                tag.remove();
                
                // Appliquer les filtres
                applyFilters();
            });
        }
    }
    
    // Supprimer un tag de filtre
    function removeFilterTag(type, value = null) {
        if (value) {
            // Supprimer un tag spécifique
            const tag = document.querySelector(`.filter-tag[data-type="${type}"][data-value="${value}"]`);
            if (tag) {
                tag.remove();
            }
        } else {
            // Supprimer tous les tags d'un type
            document.querySelectorAll(`.filter-tag[data-type="${type}"]`).forEach(tag => {
                tag.remove();
            });
            
            // Ou supprimer un tag de plage ou de recherche
            const rangeTag = document.querySelector(`.filter-tag[data-type="${type}-range"]`);
            if (rangeTag) {
                rangeTag.remove();
            }
        }
    }
    
    // Formater un prix pour l'affichage
    function formatPrice(price) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(price);
    }
    
    // Initialiser les vues rapides
    function initQuickView() {
        const quickViewButtons = document.querySelectorAll('.quick-view');
        const modal = document.getElementById('quick-view-modal');
        const closeModal = document.querySelector('.close-modal');
        const modalBody = document.querySelector('.modal-body');
        
        // Ouvrir la vue rapide
        quickViewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const yachtId = this.dataset.id;
                const card = this.closest('.yacht-card');
                
                // Récupérer les informations du yacht
                const yachtName = card.querySelector('.yacht-name').textContent;
                const yachtPrice = card.querySelector('.yacht-price').textContent;
                const yachtImage = card.querySelector('.yacht-image img').src;
                const yachtType = card.querySelector('.yacht-type').textContent;
                const yachtSpecs = Array.from(card.querySelectorAll('.spec-item')).map(spec => spec.textContent.trim());
                const yachtLocation = card.querySelector('.yacht-location').textContent;
                const yachtLink = card.querySelector('.yacht-link').getAttribute('href');
                
                // Créer le contenu de la vue rapide
                const quickViewContent = `
                    <div class="quick-view-content">
                        <div class="quick-view-image">
                            <img src="${yachtImage}" alt="${yachtName}">
                        </div>
                        <div class="quick-view-details">
                            <h2>${yachtName}</h2>
                            <p class="quick-view-price">${yachtPrice}</p>
                            <p class="quick-view-type">${yachtType}</p>
                            <div class="quick-view-specs">
                                ${yachtSpecs.map(spec => `<div class="quick-view-spec">${spec}</div>`).join('')}
                            </div>
                            <p class="quick-view-location">${yachtLocation}</p>
                            <div class="quick-view-actions">
                                <a href="${yachtLink}" class="yacht-link">Voir les détails</a>
                                <button class="add-to-cart-btn">Ajouter au panier</button>
                            </div>
                        </div>
                    </div>
                `;
                
                // Mettre à jour le contenu de la modal
                modalBody.innerHTML = quickViewContent;
                
                // Afficher la modal
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Empêcher le défilement
            });
        });
        
        // Fermer la vue rapide
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Réactiver le défilement
            });
        }
        
        // Fermer la vue rapide en cliquant en dehors
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Réactiver le défilement
            }
        });
    }
});