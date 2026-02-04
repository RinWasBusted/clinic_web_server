# Clinic Web Server

A Node.js/TypeScript backend server for a clinic management system with authentication features and PostgreSQL database integration.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Development](#development)
- [Database](#database)

## ✨ Features

- RESTful API with Express.js
- TypeScript for type safety
- PostgreSQL database integration
- User authentication system
- Docker containerization for database services
- Hot reload with Nodemon
- ESLint code linting
- Husky for Git hooks
- Commitlint for conventional commits

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js v5.2.1
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Database Client**: node-postgres (pg)
- **Environment Variables**: dotenv
- **Development Tools**: 
  - Nodemon for auto-restart
  - ESLint for linting
  - Husky for Git hooks
  - ts-node for TypeScript execution

## 📦 Prerequisites

Before running this project, make sure you have installed:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **Docker** and **Docker Compose** (for database services)

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/RinWasBusted/clinic_web_server.git
cd clinic_web_server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` file and update the values according to your setup:
```env
DB_USER=<your_database_user>
DB_HOST=localhost
DB_NAME=<your_database_name>
DB_PASSWORD=<your_database_password>
DB_PORT=5432
PORT=3000
```

5. Start the database services with Docker:
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- pgAdmin web interface on port 5050

## ⚙️ Configuration

### Environment Variables

The application uses environment variables for secure configuration. All sensitive data must be stored in the `.env` file:

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_USER` | Database username | postgres |
| `DB_HOST` | Database host | localhost |
| `DB_NAME` | Database name | clinic_db |
| `DB_PASSWORD` | Database password | secure_password_123 |
| `DB_PORT` | Database port | 5432 |
| `PORT` | Server port | 3000 |

**⚠️ Security Notice:** 
- Never commit the `.env` file to version control
- Use `.env.example` as a template with placeholder values
- Keep sensitive information like passwords secure
- Use `.env` for local development only
- For production, use environment-specific configuration

### Docker Services

The application uses Docker Compose to manage database services. See `docker-compose.yml` for details.

## 🏃 Running the Application

### Development Mode

Run with hot reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000` (configured via PORT environment variable).

### Production Mode

1. Build the project:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

### Other Commands

- **Type checking**: `npm run type-check`
- **Linting**: `npm run lint`

## 📁 Project Structure

```
clinic_web_server/
├── src/
│   ├── db.ts                    # Database connection configuration
│   ├── index.ts                 # Application entry point
│   ├── server.ts                # Express server setup
│   └── features/
│       └── auth/
│           ├── auth.controller.ts  # Authentication controllers
│           ├── auth.model.ts       # Database models/schemas
│           ├── auth.route.ts       # Authentication routes
│           └── auth.service.ts     # Business logic
├── dist/                        # Compiled JavaScript output
├── .env                         # Environment variables (not in git)
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── docker-compose.yml           # Docker services configuration
├── eslint.config.js            # ESLint configuration
├── nodemon.json                # Nodemon configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

## 🔧 Development

### Code Style

The project uses ESLint with TypeScript support. Configuration is in `eslint.config.js`.

Run linting:
```bash
npm run lint
```

### Git Hooks

Husky is configured to run Git hooks. The project uses commitlint to enforce conventional commit messages.

### Hot Reload Configuration

Nodemon watches for changes in:
- `*.ts`, `*.html`, `*.css`, `*.ejs`, `*.json` files
- Ignores: `*.spec.ts` files

## 🗄️ Database

### Accessing the Database

**Via pgAdmin (Web Interface):**
1. Open http://localhost:5050
2. Login with credentials configured in `docker-compose.yml`
3. Add new server connection with your configured database settings

**Via Command Line:**
```bash
docker exec -it postgres_container psql -U <DB_USER> -d <DB_NAME>
```

### Managing Docker Services

Start services:
```bash
docker-compose up -d
```

Stop services:
```bash
docker-compose down
```

View logs:
```bash
docker-compose logs -f
```

See `docker-compose.yml` for database service configuration and credentials.

## ❔ How to Push

### Commit Convention

This project uses conventional commits to maintain a clean and organized git history.

**Format:**
```bash
git commit -m "{type}: {subject}"
```

**Rules:**
- `{type}`: One of the types listed below
- `{subject}`: Write a short, imperative tense description of the change (lowercase, no period at end)

**Automatic Checks:**
- ESLint and formatting checks run automatically via pre-commit hooks (Husky)
- Commits must follow the conventional commit format (enforced by commitlint)

### Commit Types

| Type | Description |
|:---|:---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) |
| `refactor` | A code change that neither fixes a bug nor adds a feature |
| `perf` | A code change that improves performance |
| `test` | Adding missing tests or correcting existing tests |
| `build` | Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm) |
| `ci` | Changes to CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs) |
| `chore` | Other changes that don't modify src or test files |
| `revert` | Reverts a previous commit |

### Examples

```bash
# Adding a new feature
git commit -m "feat: add user login endpoint"

# Fixing a bug
git commit -m "fix: resolve database connection timeout"

# Updating documentation
git commit -m "docs: update installation instructions"

# Refactoring code
git commit -m "refactor: simplify authentication logic"

# Updating dependencies
git commit -m "build: upgrade express to v5.2.1"
```
