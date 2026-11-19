# SmartHire — Smart Job Recommendation and Skill Matching System

A full-stack project that preserves the uploaded HTML/CSS/Bootstrap/vanilla-JavaScript website and adds a Java 21 + Spring Boot 3.2.5 REST backend. The backend persists accounts, skills and applications, computes skill-coverage recommendations, and extracts supported skills from PDF/TXT resumes.

## Important project/report alignment

The official report describes a React/Next.js + TypeScript + Tailwind frontend in its narrative, while the supplied ZIP actually contains a static HTML, CSS, Bootstrap and vanilla JavaScript website. This deliverable preserves the actual supplied website and does not replace it with a different frontend framework. The report's stated matching rule is implemented: **match % = matched required skills / total required skills × 100**. Jobs with no matched skills are excluded from recommendation results. The weighted 60/25/15 formula mentioned in some earlier website copy is not used because it conflicts with the report's implemented algorithm.

The job catalogue is the fictional sample data from the supplied site/report; it is not a live external job feed. Resume extraction is dictionary-based and is not semantic/AI resume parsing.

## Features implemented

- Existing pages retained: Home, About, Login, Registration, Profile, Dashboard, Browse Jobs, Job Details and 404.
- Preserved Bootstrap visual design and existing page structure.
- Backend registration/login with BCrypt password hashing and signed 24-hour bearer tokens.
- Profile persistence: name, email, qualification, experience and skills.
- Backend job catalogue and `/api/match` skill-coverage algorithm, matched/missing skill lists, zero-match exclusion and relevance sorting.
- Search and match-score filters on Browse Jobs.
- Resume upload for PDF and TXT (5 MB maximum), text extraction and supported-skill detection; detected skills can be saved to the profile.
- Persistent application submissions and Dashboard application history.
- Validation, JSON error responses, configurable CORS and configurable database settings.
- H2 file database for simple local startup; optional MySQL configuration and SQL schema for hosted deployment.

## Requirements

- Java JDK 21
- Apache Maven 3.9+
- A modern browser
- Node.js is not required for this static frontend. VS Code Live Server is convenient for local preview.

## Run locally

### 1. Start the backend

Open a terminal in the `backend` directory:

```bash
mvn clean test
mvn spring-boot:run
```

The API starts at `http://localhost:8080`. Check it with:

```bash
curl http://localhost:8080/api/hello
```

The default database is a persistent H2 file at `backend/data/smarthire`. The H2 console is at `http://localhost:8080/h2-console` during local development. JDBC URL: `jdbc:h2:file:./data/smarthire;MODE=MySQL;AUTO_SERVER=TRUE`, user `sa`, blank password.

### 2. Start the frontend

Open the project folder in VS Code and run `index.html` with the Live Server extension (typically `http://127.0.0.1:5500`). The default backend URL is `http://localhost:8080` in `js/config.js`.

If the frontend runs on a different origin, add that exact origin to `CORS_ALLOWED_ORIGINS` for the backend.

### 3. Use the application

1. Register a new account.
2. Sign in and update your profile/skills.
3. Browse jobs or open the Dashboard to see skill matches and skill gaps.
4. Upload a PDF/TXT resume from Profile to detect and add skills.
5. Open a job detail page and select **Apply Now**. The Dashboard shows submitted applications.

## MySQL setup (optional production database)

1. Create a MySQL 8 database/user, or run `database/schema-mysql.sql` using an account permitted to create the database.
2. Set the environment variables shown in `.env.example`:

```text
DB_URL=jdbc:mysql://YOUR_HOST:3306/smarthire?useSSL=true&serverTimezone=UTC
DB_USERNAME=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASSWORD
DB_DRIVER=com.mysql.cj.jdbc.Driver
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
CORS_ALLOWED_ORIGINS=https://YOUR-FRONTEND.vercel.app
```

3. Do not commit real credentials. Set environment variables in the hosting provider's secret/environment settings. Use a managed persistent database; do not rely on an ephemeral host filesystem for production data.

## Deployment preparation

### Frontend on Vercel

1. Import this project repository into Vercel.
2. Select **Other** as the framework preset; no build command is required for the static HTML site.
3. Set the output directory to the project root (or the folder containing `index.html`).
4. Before deploying, change `window.SMART_HIRE_API_URL` in `js/config.js` to the public HTTPS URL of the deployed backend.
5. Deploy and add the Vercel domain to backend `CORS_ALLOWED_ORIGINS`.

### Backend on a Java host

Deploy the `backend/` Spring Boot project to a Java 21-capable host (for example, Render, Railway, or another provider supporting Maven/Java services). Use build command `mvn clean package` and start command `java -jar target/smart-job-recommender-1.0.0.jar` (run from `backend/`). Configure `PORT`, `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DRIVER`, `JWT_SECRET` and `CORS_ALLOWED_ORIGINS`. Attach a managed MySQL 8 database for persistent production data. Confirm `/api/hello` responds over HTTPS after deployment.

No deployment has been performed by this package build; configure hosting accounts and provider credentials separately.

## API reference

See [`docs/API.md`](docs/API.md) for endpoints, request bodies and authorization. API base URL locally: `http://localhost:8080`.

## Project structure

```text
smart-job-recommender/
├── index.html, login.html, register.html, profile.html
├── jobs.html, job-details.html, dashboard.html, about.html, 404.html
├── css/                 # Existing styles and favicon assets
├── assets/              # Favicon referenced by HTML pages
├── js/                  # Frontend behavior, API client and backend URL config
├── backend/             # Maven/Spring Boot project
│   ├── src/main/java/   # Controllers, services, entities, repositories, security
│   ├── src/main/resources/ # application.properties
│   └── src/test/java/   # Backend unit test
├── database/            # Optional MySQL schema
├── docs/API.md
├── .env.example
├── pom.xml
└── vercel.json
```

## Known limitations

- The report's frontend framework description (React/Next.js) does not match the uploaded source ZIP. The supplied HTML/Bootstrap/vanilla-JS frontend is intentionally retained.
- Job/company/location/salary records are fictional sample profiles. No live job-board integration or admin job editor is included.
- Resume skill extraction uses a controlled dictionary and basic text extraction. Scanned/image-only PDFs and semantic synonyms are not interpreted.
- Password reset, email verification, refresh tokens, role-based admin permissions and production-grade rate limiting are not included.
- Authentication uses a signed bearer token; deploy with a strong `JWT_SECRET` and HTTPS.
- The backend build/test suite must be run in an environment with Maven and dependency repository access. See the delivery notes for the build verification actually performed in this environment.
