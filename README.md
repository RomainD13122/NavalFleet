# NavalFleet - Site Web de Vente de Yachts de Luxe

NavalFleet est une plateforme web élégante et fonctionnelle dédiée à la vente de yachts de luxe. Ce projet front-end offre une expérience utilisateur immersive pour les amateurs et acheteurs potentiels de bateaux haut de gamme.

## Table des matières

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Structure du projet](#structure-du-projet)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Fonctionnalités détaillées](#fonctionnalités-détaillées)
- [Auteur](#auteur)
- [Licence](#licence)

## Présentation

NavalFleet est un site web complet pour la vente de yachts de luxe, offrant une interface intuitive pour naviguer, filtrer et acheter des yachts. Le site combine élégance visuelle et fonctionnalités e-commerce avancées pour créer une expérience premium pour les utilisateurs passionnés par la navigation de plaisance haut de gamme.

## Fonctionnalités

- **Page d'accueil** immersive avec présentation de l'entreprise et yachts en vedette
- **Catalogue de yachts** avec système de filtrage avancé (type, longueur, prix, année, emplacement)
- **Pages détaillées** pour chaque yacht avec galerie d'images et spécifications techniques
- **Système de panier d'achat** complet avec gestion des articles et codes promotionnels
- **Design responsive** s'adaptant à tous les appareils (desktop, tablette, mobile)
- **Interface utilisateur intuitive** avec animations et retours visuels
- **Fonctionnalités de personnalisation** pour les options d'achat (mode d'acquisition, lieu de livraison, équipage)

## Structure du projet

```
Frontend/
├── acheter.html          # Page catalogue avec filtres
├── index.html            # Page d'accueil
├── panier.html           # Page panier
├── yacht-detail.html     # Pages détaillées des yachts (multiples variantes)
├── js/
│   ├── acheter.js        # Scripts pour la page catalogue
│   ├── index.js          # Scripts généraux
│   ├── panier.js         # Système de panier
│   └── yacht-detail.js   # Interactions pages détail
├── styles/
│   ├── css/
│   │   ├── acheter.css      # Styles page catalogue
│   │   ├── index.css        # Styles généraux
│   │   ├── panier.css       # Styles panier
│   │   ├── yacht-detail.css # Styles pages détail
│   │   └── cart-counter.css # Styles compteur panier
│   └── img/                 # Images des yachts
```

## Technologies utilisées

- **HTML5** - Structure sémantique
- **CSS3** - Styles modernes avec variables CSS et flexbox/grid
- **JavaScript** (vanilla) - Interactivité et fonctionnalités dynamiques
- **Font Awesome** - Icônes
- **Google Fonts** - Typographie

## Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/votre-username/navalfleet.git
   ```

2. Ouvrez le projet dans votre éditeur de code préféré

3. Pour visualiser le site, ouvrez le fichier `index.html` dans votre navigateur ou utilisez un serveur local :
   ```bash
   # Avec Python
   python -m http.server
   
   # Ou avec l'extension Live Server de VSCode
   # Clic droit sur index.html -> "Open with Live Server"
   ```

## Utilisation

Le site est conçu pour être intuitif :

1. Parcourez les yachts sur la page d'accueil ou accédez au catalogue complet via "Acheter"
2. Utilisez les filtres pour affiner votre recherche par type, prix, longueur, etc.
3. Consultez les détails d'un yacht en cliquant sur sa carte
4. Personnalisez vos options d'achat (mode d'acquisition, lieu de livraison, équipage)
5. Ajoutez des yachts à votre panier
6. Consultez votre panier, appliquez des codes promo et passez à la caisse

## Fonctionnalités détaillées

### Système de filtrage avancé
Le système de filtrage permet aux utilisateurs de trouver rapidement des yachts correspondant à leurs critères spécifiques :
- Filtrage par type de bateau (Mega Yacht, Catamaran, Motoryacht, etc.)
- Plages de prix, longueur et année ajustables
- Filtrage par emplacement
- Recherche par mot-clé
- Tri par pertinence, prix, année, etc.

### Galerie d'images interactive
Chaque page de détail de yacht inclut une galerie interactive permettant aux utilisateurs de :
- Visualiser le yacht sous différents angles (avant, arrière, intérieur)
- Naviguer facilement entre les images avec des vignettes
- Voir des indications sur la vue actuelle

### Panier intelligent
Le système de panier offre une expérience d'achat fluide :
- Ajout/suppression de yachts
- Personnalisation des options pour chaque yacht
- Application de codes promotionnels (ex: "BIENVENUE" pour 10% de réduction)
- Calcul automatique des prix en fonction des options sélectionnées
- Suggestions de yachts similaires

### Interface responsive
Le design s'adapte parfaitement à tous les appareils :
- Layout fluide
- Menus adaptables
- Images responsives
- Expérience utilisateur optimisée sur mobile

## Auteur

NavalFleet - Votre expert en yachts de luxe depuis 2025

## Licence

© 2025 NavalFleet. Tous droits réservés.
