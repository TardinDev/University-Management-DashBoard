# University Management Dashboard

Tableau de bord de gestion universitaire complet avec interface Google Classroom-like, gestion des cours, devoirs, messagerie, et **intelligence artificielle integree** (Claude, Anthropic).

L'IA est presente a travers toute l'application : assistant d'ecriture inline dans les textareas (amelioration, generation, traduction, formalisation), revision de cours interactive pour les etudiants avec generation de fiches structurees, et actions contextuelles adaptees au role de l'utilisateur.

## Stack technique

| Couche    | Technologies                                         |
|-----------|------------------------------------------------------|
| Frontend  | React 19, Refine v5, shadcn/ui, Tailwind CSS v4, Vite, TypeScript |
| Backend   | Express, Prisma, PostgreSQL, bcryptjs                |
| Auth      | Sessions cookie (httpOnly, 7 jours)                  |
| IA        | API Claude (Anthropic) via proxy backend             |

## Structure du projet

```
University-Management-DashBoard/
  Frontend/          # Application React (Vite)
  Backend/           # API Express + Prisma
  docker-compose.yml # PostgreSQL
```

## Installation

### Prerequisites

- Node.js 18+
- PostgreSQL 15+ (ou Docker)

### Backend

```bash
cd Backend
npm install
cp .env.example .env   # ou editer .env directement
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Variables d'environnement (`Backend/.env`) :

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/university_db"
SESSION_SECRET="super-secret-session-key-change-in-production"
ANTHROPIC_API_KEY=sk-ant-...    # requis pour l'assistant IA
CORS_ORIGIN="http://localhost:5173"
PORT=3001
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

L'application demarre sur `http://localhost:5173`.

## Comptes de demo

| Role      | Email               | Mot de passe |
|-----------|---------------------|--------------|
| Admin     | admin@univ.mg       | admin123     |
| Professeur| prof1@univ.mg       | prof123      |
| Etudiant  | student1@univ.mg    | student123   |

## Fonctionnalites principales

### Par role

- **Admin** : Gestion des etudiants, enseignants, departements, matieres, emploi du temps, notes, messagerie, demandes administratives — **IA : redaction d'emails, reponses aux demandes**
- **Professeur** : Cours (creation, annonces, devoirs, ressources, forum, notation), quiz, messagerie — **IA : generation de quiz, annonces, descriptions de devoirs**
- **Etudiant** : Cours (rejoindre par code, soumissions), portfolio, demandes administratives, messagerie — **IA : revision de cours, generation de fiches, redaction de demandes et portfolio**

---

## Intelligence Artificielle (Claude, Anthropic)

L'IA est un pilier central de l'application. Elle intervient a deux niveaux :

### 1. Assistant d'ecriture inline

Chaque champ texte de l'application dispose d'un bouton "baguette magique" (visible au survol). Un clic ouvre un popover avec des **actions contextuelles adaptees a la page** :

| Page                 | Contexte        | Actions IA                                             |
|----------------------|-----------------|--------------------------------------------------------|
| Messagerie (admin)   | `email`         | Ameliorer, Ton formel, Generer email, Traduire EN, Developper |
| Annonces de cours    | `announcement`  | Ameliorer, Generer annonce, Ton formel, Simplifier     |
| Devoirs              | `assignment`    | Ameliorer, Generer description, Ton formel, Developper |
| Forum                | `forum`         | Ameliorer, Ton formel, Simplifier, Generer message     |
| Quiz                 | `quiz`          | Generer question, Ameliorer enonce, Simplifier         |
| Reponses admin       | `admin-response`| Generer reponse, Ameliorer, Ton formel                 |
| Demandes admin       | `admin-request` | Generer demande, Ameliorer, Ton formel                 |
| Portfolio            | `portfolio`     | Generer description, Ameliorer, Developper             |
| Messages             | `message`       | Ameliorer, Ton formel, Simplifier, Traduire EN         |
| Ressources           | `resource`      | Generer description, Ameliorer                         |

Le resultat IA s'affiche dans le popover avec deux options : **Appliquer** (remplace le texte) ou **Inserer** (ajoute a la suite).

### 2. Revision de cours interactive (etudiants)

Sur la page **Emploi du temps**, les etudiants disposent d'une section dediee permettant de :
- Selectionner un cours parmi ceux affiches dans le planning
- Generer en un clic une **fiche de revision structuree** contenant :
  - Resume des concepts cles
  - Definitions importantes
  - Exemples concrets
  - Questions d'auto-evaluation avec reponses
  - Conseils de revision

### Architecture IA

```
Frontend (AITextHelper / useAIAssist) --> POST /ai/assist --> Backend proxy --> API Claude (Anthropic)
```

- La cle API Anthropic est stockee **cote serveur uniquement** (securite)
- Le composant `AITextHelper` remplace les `<Textarea>` standard avec IA integree
- Le hook `useAIAssist` est reutilisable pour tout appel IA dans l'application
- Modele utilise : **Claude Sonnet 4.5** (`claude-sonnet-4-5-20250929`)

## API Backend

| Methode | Route              | Description                  |
|---------|--------------------|------------------------------|
| POST    | /auth/login        | Connexion                    |
| POST    | /auth/register     | Inscription                  |
| POST    | /auth/logout       | Deconnexion                  |
| GET     | /auth/me           | Utilisateur courant          |
| GET/POST| /users             | Gestion des utilisateurs     |
| GET/POST| /courses           | Gestion des cours            |
| GET/POST| /assignments       | Gestion des devoirs          |
| GET/POST| /submissions       | Gestion des soumissions      |
| GET/POST| /announcements     | Annonces                     |
| POST    | /upload            | Upload de fichiers           |
| POST    | /ai/assist         | Proxy IA (Claude)            |

## Scripts

```bash
# Frontend
npm run dev       # Serveur de developpement
npm run build     # Build de production
npm run preview   # Preview du build

# Backend
npm run dev       # Serveur de developpement (tsx watch)
npm run build     # Compilation TypeScript
npm run seed      # Seed de la base de donnees
```

## Licence

Projet universitaire.
