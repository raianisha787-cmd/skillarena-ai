# SkillArena AI – Intelligent Campus Skill Assessment & Personalized Learning Platform

> **Industry:** EdTech (Education Technology) / E-Learning  
> **Target Audience:** Engineering & College Students, Training & Placement Officers (TPO), Academic Deans, Recruiters  
> **Tech Stack:** React.js, Spring Boot 3, Java 17/21, REST APIs, MySQL, JWT, Python (AI/ML), Docker, Git/GitHub  

---

## 🌟 Executive Summary

**SkillArena AI** is a next-generation AI-powered campus skill diagnostic and learning platform designed to bridge the widening gap between traditional academic curricula and industry hiring expectations. 

Unlike generic quiz platforms, SkillArena AI introduces **Role-Based Placement Benchmarking**:
1. **Interactive Timed Assessment Arena:** Tests core technical concepts (Data Structures, Spring Boot REST, MySQL Indexing, System Design, DevOps) under live proctored constraints.
2. **AI Skill Gap Diagnostics:** Uses statistical modeling (Gaussian distribution & Logistic regression) to evaluate a student's proficiency against industry benchmarks (FAANG/Tier-1 standards) and calculates their **Campus Percentile Rank**.
3. **Adaptive 4-Week Remedial Roadmap:** Generates dynamic, milestone-driven learning paths that prioritize high-impact deficit areas.
4. **TPO / Dean Campus Analytics:** Provides placement officers with cohort readiness indices, department comparison metrics, and placement probability heatmaps.

---

## 📐 System Architecture

```text
                                  🌐 Internet
                                       │
                                       ▼
                       [ React.js SPA (Vercel) ]
                        - Responsive Tailwind UI
                        - Live Timed Test Runner
                        - Skill Radar & Metrics
                        - TPO Analytics Dashboard
                                       │
                                       │ (REST APIs + JWT Auth)
                                       ▼
                    [ Spring Boot 3 Backend (Render/Railway) ]
                        - JWT Stateless Authentication
                        - Role-Based Access Control (RBAC)
                        - Assessment & Question Bank Engine
                        - Performance & Percentile Calculator
                                │            │
               (JPA / Hibernate)│            │ (HTTP REST Client)
                                ▼            ▼
                   [ Cloud MySQL 8.0 ]   [ Python AI Engine (FastAPI) ]
                   - Users & Roles        - Gaussian Percentile Engine
                   - Assessments Bank     - Skill Gap Urgency Classifier
                   - Attempt Histories    - 4-Week Roadmap Synthesizer
```

---

## 📂 Repository Directory Layout

```text
skillarena-ai/
├── frontend/                     # React.js SPA (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── App.jsx               # Main SPA router & interactive state engine
│   │   ├── main.jsx              # React DOM bootstrap
│   │   ├── index.css             # Tailwind base & custom scrollbar
│   │   └── services/api.js       # Resilient REST API client & offline fallback
│   ├── package.json              # NPM dependencies & scripts
│   ├── vite.config.js            # Vite configuration
│   └── vercel.json               # 1-click Vercel rewrite configuration
│
├── backend/                      # Spring Boot 3 Java Enterprise Backend
│   ├── pom.xml                   # Maven dependencies (JPA, Security, JJWT, MySQL)
│   └── src/main/java/com/skillarena/
│       ├── SkillArenaApplication.java
│       ├── config/ & security/   # SecurityConfig, JWT Filter, Token Provider
│       ├── controller/           # Auth, Assessment, AI, Analytics Controllers
│       ├── model/                # User, Role, Assessment, Question, Attempt
│       ├── repository/           # Spring Data JPA Repositories
│       ├── service/              # AuthService, AssessmentService, AIServiceClient
│       └── dto/                  # Request & Response payload transfer objects
│
├── ai-engine/                    # Python AI/ML Analytical Microservice
│   ├── app.py                    # FastAPI REST application
│   ├── engine.py                 # SkillGapAnalyzer & AdaptiveRoadmapGenerator
│   ├── test_engine.py            # Diagnostic unit test script
│   └── requirements.txt          # Python dependencies (FastAPI, Uvicorn, NumPy)
│
├── database/
│   └── schema.sql                # Complete MySQL DDL & realistic seed data
│
├── docker-compose.yml            # 1-Command Multi-Container Orchestration
└── README.md                     # Documentation & viva presentation guide
```

---

## 🚀 Cloud Deployment Guide (Zero Localhost for Evaluators)

To allow college evaluators and professors to access the platform directly from any desktop or mobile browser without installing code:

### Step 1: Deploy Frontend on Vercel
1. Push your repository to **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete SkillArena AI platform"
   git remote add origin https://github.com/your-username/skillarena-ai.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com/) &rarr; Click **Add New Project** &rarr; Select your GitHub repository.
3. Set root directory to `frontend`.
4. Click **Deploy**. Vercel will generate your live URL (e.g., `https://skillarena-ai.vercel.app`).

### Step 2: Deploy Cloud Database (MySQL)
1. Use **Aiven.io**, **TiDB Cloud**, or **Supabase** (all offer free tiers).
2. Connect using any MySQL Workbench or CLI and run `database/schema.sql`.

### Step 3: Deploy Backend on Render / Railway
1. Go to [Render](https://render.com/) or [Railway](https://railway.app/).
2. Select your repository and point to the `backend` directory.
3. Configure environment variables:
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<cloud-host>:3306/skillarena_db`
   - `SPRING_DATASOURCE_USERNAME`: `<cloud-user>`
   - `SPRING_DATASOURCE_PASSWORD`: `<cloud-password>`

---

## 💻 Local Development Setup

### 1. Database Setup
```bash
mysql -u root -p < database/schema.sql
```

### 2. Run Python AI Engine
```bash
cd ai-engine
pip install -r requirements.txt
python app.py
# Runs at http://localhost:8000
```

### 3. Run Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
# Runs at http://localhost:8080
```

### 4. Run React Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

---

## 🎓 Viva & Presentation Talking Points

When presenting to your professors and evaluators:
1. **Architectural Separation:** Highlight the 3-tier decoupling (React frontend, Spring Boot enterprise REST backend, and specialized Python AI analytical engine).
2. **Security & Standards:** Explain stateless JWT authentication with BCrypt hashing and CORS protection.
3. **AI Cognitive Value:** Explain why the platform is not just a quiz app—it uses Gaussian cumulative distribution functions to benchmark the student against the entire cohort and applies logistic regression to estimate placement probability.
4. **Cloud Readiness:** Demonstrate the live deployed URL to prove production engineering capabilities.

