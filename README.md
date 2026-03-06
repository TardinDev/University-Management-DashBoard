# University Management Dashboard

Tableau de bord de gestion universitaire complet avec interface Google Classroom-like, gestion des cours, devoirs, messagerie, et assistant IA integre.

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

- **Admin** : Gestion des etudiants, enseignants, departements, matieres, emploi du temps, notes, messagerie, demandes administratives
- **Professeur** : Cours (creation, annonces, devoirs, ressources, forum, notation), quiz, messagerie
- **Etudiant** : Cours (rejoindre par code, soumissions), portfolio, demandes administratives, messagerie

### Assistant IA inline

Un assistant d'ecriture IA est integre directement dans les champs texte de l'application. Un bouton "baguette magique" apparait au survol de chaque textarea concerne, ouvrant un popover avec des actions contextuelles :

| Page                 | Contexte        | Actions disponibles                                    |
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

**Architecture :**

```
Frontend (AITextHelper) --> POST /ai/assist --> Backend proxy --> API Claude (Anthropic)
```

La cle API est stockee cote serveur uniquement. Le composant `AITextHelper` remplace les `<Textarea>` standard et propose les actions filtrees par contexte.

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
