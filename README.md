# Memory Game - Jeu de Mémoire

Un jeu de mémoire moderne et accessible développé pour Clic Campus, avec une architecture full-stack utilisant Next.js et FastAPI.

## 🎯 Fonctionnalités

### Modes de jeu
- **Solo** : Mode un joueur avec suivi du temps et des mouvements
- **Multijoueur local** : Jusqu'à 4 joueurs avec gestion des tours par tour

### Personnalisation
- **Thèmes** : 
  - **Nombres** : Chiffres de 1 à 8 (grille 4×4) ou 1 à 18 (grille 6×6)
  - **Icônes** : Plusieurs catégories disponibles
    - Icônes Lucide React (par défaut)
    - **Pokémon** : Images depuis PokeAPI
    - **Chiens** : Photos depuis Dog API
    - **Films** : Affiches de films populaires depuis TMDB
    - **Drapeaux** : Drapeaux de pays depuis REST Countries API
    - **Fruits** : Emojis de fruits
- **Taille de grille** : 
  - 4×4 (16 cartes)
  - 6×6 (36 cartes)
  - **Personnalisée** : Taille de grille configurable (largeur × hauteur)

### Suivi de partie
- Compteur de coups en temps réel
- Chronomètre précis (secondes)
- Tableau des scores (multijoueur) avec suivi par joueur
- Détection automatique de fin de partie
- Page de résultats avec statistiques détaillées
- **Animation de nouveau record** : Célébration spéciale lorsque vous atteignez la première place
- **Badge "Nouveau Record"** : Affichage doré pour les records personnels

### Classements
- **Page Top 10** : Classement complet avec podium pour les 3 premiers
- **Statistiques détaillées** :
  - Nombre total de parties
  - Score moyen
  - Temps moyen et meilleur temps
  - Nombre de coups moyen et meilleur nombre de coups
  - Nombre total de joueurs uniques
- Affichage responsive avec statistiques visuelles

## 🏗️ Architecture

### Frontend
- **Framework** : Next.js 14 (App Router)
- **Language** : TypeScript
- **Styling** : TailwindCSS
- **State Management** : Zustand (avec persistance locale)
- **Data Fetching** : TanStack Query (React Query)
- **Animations** : Framer Motion
- **Icons** : Lucide React

### Backend
- **Framework** : FastAPI
- **Language** : Python 3.12+
- **ORM** : SQLModel
- **Validation** : Pydantic
- **Database** : PostgreSQL (production) ou SQLite (développement)
- **Linter** : Ruff avec règles strictes

### Justification des choix techniques

#### Zustand pour la gestion d'état
- **Léger** : Bundle size minimal comparé à Redux
- **Simple** : API intuitive, moins de boilerplate
- **Performant** : Re-renders optimisés
- **Persistance** : Support natif via middleware pour sauvegarder la partie en cours

#### TanStack Query
- **Cache intelligent** : Réduit les appels API inutiles
- **Gestion d'erreurs** : Built-in error handling et retry logic
- **Optimistic updates** : Améliore l'UX

#### SQLModel
- **Type-safe** : Combinaison de SQLAlchemy et Pydantic
- **Validation** : Validation automatique des données
- **Migrations** : Compatible avec Alembic si nécessaire

## 📁 Structure du projet

```
memory-game/
├── app/                    # Next.js App Router
│   ├── home/              # Page d'accueil/paramètres
│   ├── game/              # Page de jeu
│   ├── results/           # Page de résultats
│   ├── top10/             # Page Top 10
│   └── layout.tsx         # Layout principal
├── components/            # Composants React réutilisables
│   ├── GameCard.tsx      # Carte de jeu avec animations 3D
│   ├── GameGrid.tsx      # Grille de jeu responsive
│   ├── GameStats.tsx     # Statistiques de jeu en temps réel
│   ├── VictoryAnimation.tsx  # Animation de victoire
│   ├── NewRecordAnimation.tsx  # Animation de nouveau record
│   ├── SettingsMenu.tsx   # Menu de paramètres
│   ├── ThemeToggle.tsx   # Toggle dark/light mode
│   ├── LanguageToggle.tsx  # Toggle FR/EN
│   └── QueryClientProvider.tsx
├── lib/                   # Utilitaires et stores
│   ├── store.ts          # Store Zustand avec persistance
│   ├── api.ts            # Client API
│   ├── i18n.ts           # Internationalisation FR/EN
│   └── icons.ts           # Mapping des icônes Lucide
├── backend/               # Backend FastAPI
│   ├── app/
│   │   ├── main.py       # Application FastAPI
│   │   ├── models.py     # Modèles SQLModel
│   │   ├── schemas.py    # Schémas Pydantic
│   │   ├── database.py   # Configuration DB
│   │   ├── themes.py     # Gestion des thèmes dynamiques
│   │   └── ...
│   ├── tests/            # Tests pytest
│   │   ├── test_scores.py
│   │   ├── test_themes.py
│   │   ├── test_models.py
│   │   └── test_schemas.py
│   ├── requirements.txt
│   ├── pytest.ini        # Configuration pytest
│   └── Dockerfile
├── docker-compose.yml     # Orchestration Docker
└── README.md
```

## 🚀 Installation et lancement

### Prérequis
- Node.js 20+
- Python 3.12+
- Docker et Docker Compose (optionnel, pour le déploiement)

### Installation locale

#### Frontend
```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

Le frontend sera accessible sur `http://localhost:3000`

#### Backend

**Configuration manuelle**
```bash
cd backend

# Créer un environnement virtuel (recommandé)
python3 -m venv venv

# Activer l'environnement virtuel
# Sur macOS/Linux:
source venv/bin/activate
# Sur Windows:
# venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt
# ou avec uv (recommandé)
uv pip install -r requirements.txt

# Créer un fichier .env
cp .env.example .env
```

**Lancer le serveur :**
```bash
cd backend
source venv/bin/activate  # Activer l'environnement virtuel
uvicorn app.main:app --reload
```

Le backend sera accessible sur `http://localhost:8000`

### Installation avec Docker

```bash
# Lancer tous les services (frontend, backend, PostgreSQL)
docker-compose up --build
docker compose up --build

# En mode détaché
docker-compose up -d --build
docker compose up -d --build
```

Les services seront accessibles sur :
- Frontend : `http://localhost:3000`
- Backend : `http://localhost:8000`
- PostgreSQL : `localhost:5432`

## 📝 Configuration

### Variables d'environnement

#### Backend (.env)
```env
DATABASE_URL=sqlite:///./memory_game.db
# ou pour PostgreSQL
DATABASE_URL=postgresql://user:password@localhost/memory_game
```

#### Frontend
Par défaut, le frontend utilise `http://localhost:8000` pour l'API. Pour Docker, configurez `NEXT_PUBLIC_API_URL` dans `docker-compose.yml`.

#### Accès depuis le réseau local
Le frontend et le backend sont configurés pour accepter les connexions depuis le réseau local, permettant d'accéder à l'application depuis un téléphone ou un autre appareil sur le même réseau Wi-Fi.

**Pour accéder depuis un téléphone :**
1. Démarrez le frontend : `npm run dev` (écoute sur `0.0.0.0:3000`)
2. Démarrez le backend : `make backend` ou `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
3. Trouvez votre IP locale : `ifconfig | grep "inet " | grep -v 127.0.0.1` (macOS/Linux) ou `ipconfig` (Windows)
4. Accédez depuis votre téléphone : `http://VOTRE_IP_LOCALE:3000`

## 🎮 Utilisation

1. **Démarrer une partie** : Accédez à `/home` pour configurer les paramètres
   - Choisir le thème (nombres, icônes, ou thèmes dynamiques)
   - Sélectionner la taille de grille (4×4, 6×6, ou personnalisée)
   - Définir le nombre de joueurs (1 à 4)
   - Entrer les noms des joueurs
2. **Jouer** : 
   - Cliquez sur les cartes pour les retourner et trouver les paires
   - En mode multijoueur, les tours alternent automatiquement
   - Le chronomètre et le compteur de coups sont mis à jour en temps réel
3. **Fin de partie** : 
   - Les résultats s'affichent automatiquement avec les statistiques
   - Animation de victoire
   - Si vous battez le record, une animation spéciale s'affiche
4. **Actions après la partie** :
   - **Rejouer** : Relance une partie avec les mêmes paramètres
   - **Nouvelle partie** : Retourne au menu pour changer les paramètres
   - **Voir le Top 10** : Consultez le classement complet
5. **Classements** : Consultez le Top 10 depuis la page de résultats ou directement via `/top10`

## ♿ Accessibilité

Le projet respecte les normes WCAG 2.1 AA :

- **Navigation clavier** : Tous les éléments interactifs sont accessibles au clavier
- **Focus visible** : Indicateurs de focus clairs sur tous les éléments interactifs
- **Contraste** : Ratios de contraste respectés (minimum 4.5:1)
- **ARIA** : Labels et attributs ARIA appropriés
- **Responsive** : Interface adaptée pour mobile, tablette et desktop

## 🧪 Tests et qualité

### Tests Backend

Les tests backend utilisent pytest avec une base de données SQLite en mémoire pour l'isolation.

```bash
cd backend
pip install -r requirements.txt
pytest tests/ -v
```

Les tests couvrent :
- Création et validation des scores
- Endpoints TOP 10 et statistiques
- Validation des schémas Pydantic
- Gestion des thèmes dynamiques
- Gestion d'erreurs

### Linting

#### Frontend
```bash
npm run lint
```

### Type checking
```bash
npm run type-check
```

## 📊 API Endpoints

### POST `/api/scores`
Crée un nouveau score.

**Body** :
```json
{
  "player_name": "Player 1",
  "score": 8,
  "moves": 24,
  "time": 125,
  "grid_size": "4x4",
  "theme": "numbers"
}
```

### GET `/api/scores/top?limit=10`
Récupère les top scores (par défaut 10).

**Response** :
```json
[
  {
    "id": 1,
    "player_name": "Player 1",
    "score": 8,
    "moves": 20,
    "time": 100,
    "grid_size": "4x4",
    "theme": "numbers",
    "created_at": "2024-01-01T00:00:00",
    "rank": 1
  }
]
```

### GET `/api/scores/statistics`
Récupère les statistiques globales.

**Response** :
```json
{
  "total_participations": 150,
  "average_score": 6.5,
  "average_time": 120.5,
  "average_moves": 18.3,
  "best_time": 45,
  "best_moves": 12,
  "total_players": 25
}
```

### GET `/api/themes/{theme_name}?limit=18`
Récupère les données d'un thème dynamique (Pokemon, dogs, movies, flags, fruits).

**Paramètres** :
- `theme_name` : Nom du thème (pokemon, dogs, movies, flags, fruits)
- `limit` : Nombre d'éléments à récupérer (par défaut 18)

**Response** :
```json
{
  "theme": "pokemon",
  "data": [
    {
      "id": 1,
      "name": "Bulbasaur",
      "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
    }
  ]
}
```

## 🎨 Design

Le design adopte une approche moderne et professionnelle :

- **Palette de couleurs** :
  - **Bleu** (#3B82F6) : Couleur principale pour les actions et highlights
  - **Or/Ambre** : Badge "Nouveau Record" et éléments de célébration
  - **Gris foncé** (#1F2937) : Texte et éléments principaux
  - **Gris clair** (#E5E7EB) : Éléments secondaires
  - **Blanc/Noir** : Fonds selon le thème (light/dark)

- **Typographie** : Sans-serif moderne et lisible (système)
- **Formes** : Bordures arrondies (rounded-2xl, rounded-3xl) pour un look moderne
- **Animations** : 
  - Transitions fluides avec Framer Motion
  - Animations 3D pour le retournement des cartes (CSS transform)
  - Animations de victoire et nouveau record
- **Mode sombre** : Support complet avec toggle manuel ou automatique
- **Responsive** : Design adaptatif pour mobile, tablette et desktop

## ✅ Fonctionnalités Bonus Implémentées

Toutes les fonctionnalités bonus ont été implémentées et améliorées :

- [x] **Mode dark/light** : 
  - Système de thème avec détection automatique du système
  - Choix manuel (Light/Dark/System)
  - Persistance de la préférence utilisateur
  - Support complet sur toutes les pages

- [x] **Animations de flip 3D** : 
  - Animations CSS 3D fluides pour le retournement des cartes
  - Effets de shake pour les erreurs
  - Animations de match avec rotation

- [x] **Sauvegarde de partie** : 
  - Persistance complète dans localStorage via Zustand
  - Reprise après rafraîchissement de la page
  - Sauvegarde automatique de l'état de jeu

- [x] **TypeScript et Linter** : 
  - Configuration complète ESLint et Prettier pour le frontend
  - Ruff avec règles strictes pour Python
  - Type checking intégré

- [x] **Pipeline CI/CD** : 
  - GitHub Actions avec lint, build, et tests
  - Tests frontend (ESLint, Prettier, TypeScript)
  - Tests backend (pytest avec couverture complète)
  - Build automatique

- [x] **Internationalisation (i18n)** : 
  - Support complet FR/EN
  - Sélecteur de langue dans l'interface
  - Traductions pour toutes les pages et composants
  - Persistance de la langue choisie

- [x] **Thèmes dynamiques via API** : 
  - Endpoint backend `/api/themes/{theme_name}`
  - Thèmes disponibles : Pokémon, Chiens, Films, Drapeaux, Fruits
  - Validation des images avant retour
  - Cache intelligent côté frontend

- [x] **Fonctionnalités supplémentaires** :
  - Animation de nouveau record avec confetti
  - Badge doré pour les records
  - Taille de grille personnalisée
  - Accès depuis le réseau local
  - Page Top 10 avec podium et statistiques détaillées
  - Bouton "Rejouer" qui relance avec les mêmes paramètres

## 📄 Licence

Ce projet est développé dans le cadre d'un test technique pour Clic Campus.

## 👨‍💻 Développement

### Contribution

1. Créer une branche pour chaque fonctionnalité
2. Commits avec messages explicites
3. Vérifier le linting avant de commit
4. Documenter les changements majeurs

---

Développé par Gabriel Gonta pour Clic Campus

