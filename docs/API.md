# SmartHire REST API
Base URL: `http://localhost:8080`. JSON errors use `{ "error": "..." }`.

| Method | Endpoint | Auth | Purpose |
|---|---|---:|---|
| GET | `/api/hello` | No | Health check |
| POST | `/api/auth/signup` | No | Create account; returns bearer token and user |
| POST | `/api/auth/login` | No | Sign in; returns bearer token and user |
| GET | `/api/jobs` | No | List sample job profiles |
| POST | `/api/match` | No | Rank jobs by skill coverage |
| POST | `/api/resume/upload` | No | Extract text and supported skills from PDF/TXT |
| GET | `/api/profile` | Yes | Read signed-in user's profile |
| PUT | `/api/profile` | Yes | Update profile and skills |
| GET | `/api/applications` | Yes | List user's applications |
| POST | `/api/applications` | Yes | Apply to a sample job using `{ "jobId": 102 }` |

Signup body: `{ "name":"A User", "email":"a@example.com", "password":"at-least-6", "qualification":"B.Tech CSE", "experience":0 }`.

Login body: `{ "email":"a@example.com", "password":"at-least-6" }`.

Match body: `{ "skills":["Java","SQL"] }`. Results contain the job, integer `score`, `matched`, `missing`, and a plain-language explanation. Jobs with zero matched skills are omitted. The score is `(matched required skills / total required skills) * 100`, sorted descending and then by number of matched skills.

Protected requests use `Authorization: Bearer <token>`. Tokens expire after 24 hours. Passwords are stored as BCrypt hashes. Resume upload is multipart form-data with field name `file`; only PDF and TXT files up to 5 MB are accepted. Resume skill extraction is dictionary-based and is not a full semantic parser.
