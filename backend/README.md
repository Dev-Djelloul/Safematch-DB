# Safematch — Backend

> Spring Boot 3.x · Java 17 · PostgreSQL · Firestore · Firebase · Stripe · Cloud Run

![Status](https://img.shields.io/badge/status-in%20development-blue)
![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=spring)

---

## Overview

The Safematch backend is the **business core** of the platform. It handles matching logic, AI scoring, user management, payments, and security — exposed as a versioned REST API consumed by the Flutter app.

It integrates with **PostgreSQL** (source of truth), **Firestore** (real-time), **Firebase Auth** (identity), and **Stripe** (payments), and is deployed on **Cloud Run**.

---

## Package Structure

```
com.safematch.app
│
├── api
│   ├── controller
│   ├── dto
│   │   ├── request
│   │   └── response
│   └── mapper
│
├── domain
│   ├── model
│   ├── service
│   ├── event
│   └── port
│       ├── AiScoringPort.java
│       ├── FirebaseAuthPort.java
│       └── FirestorePort.java
│
├── infrastructure
│   ├── ai
│   ├── config
│   ├── entity
│   ├── repository
│   ├── security
│   │   ├── jwt
│   │   └── firebase
│   ├── payment
│   └── storage
│       ├── firestore
│       └── firebaseStorage
│
└── common
    ├── exception
    └── util
```

---

## Layer Breakdown

### `api` — Exposure
Handles everything external: HTTP, JSON, input validation.

- **`controller/`** — REST endpoints. One controller per domain area (`AuthController`, `MatchController`, `MessagingController`…). No business logic here — controllers delegate directly to services.
- **`dto/`** — Data transfer objects. Internal entities are never exposed to the client directly.
  - `request/` — payloads received from Flutter
  - `response/` — payloads sent back to Flutter
- **`mapper/`** — Converts `DTO ↔ domain model`. Keeps the API layer fully independent from the domain.

---

### `domain` — Business logic
The core of Safematch. **No dependency on Spring, JPA, Firebase, or any external technology.**  
This layer can be tested in complete isolation.

- **`model/`** — Business objects: `User`, `Match`, `Conversation`, `Preferences`, `CompatibilityScore`…
- **`service/`** — All business rules live here:
  - weekly matching pipeline
  - emotional + behavioral scoring
  - preference filtering
  - conversation lifecycle
  - safety and sanction logic
- **`event/`** — Internal domain events (`MatchCreatedEvent`, `ConversationExpiredEvent`…). Decouples side effects from business actions.
- **`port/`** — Interfaces (ports) that the domain defines but does not implement:
  - `AiScoringPort.java` — contract for AI scoring (implemented in `infrastructure/ai`)
  - `FirebaseAuthPort.java` — contract for identity verification
  - `FirestorePort.java` — contract for real-time data access

  This is the **Hexagonal Architecture** pattern: the domain defines what it needs, infrastructure provides the implementation. Swapping AI providers or databases never touches business logic.

---

### `infrastructure` — Technical implementations
Implements the ports defined by the domain. All technology-specific code lives here.

- **`ai/`** — AI client implementations (scoring, moderation, recommendations). Implements `AiScoringPort`.
- **`config/`** — Spring Boot configuration: CORS, Swagger, beans, security chain.
- **`entity/`** — JPA entities mapping PostgreSQL tables. Separate from domain models by design.
- **`repository/`** — Spring Data JPA repositories. PostgreSQL is the **source of truth** for all critical data: users, matches, payments, preferences, audit logs.
- **`security/`**
  - `jwt/` — JWT generation, validation, refresh token rotation
  - `firebase/` — Firebase token verification, user mapping. Implements `FirebaseAuthPort`.
- **`payment/`** — Stripe API integration, webhook handling, premium feature management.
- **`storage/`**
  - `firestore/` — Real-time features: chat, presence, typing signals. Implements `FirestorePort`.
  - `firebaseStorage/` — Media URLs only. Files are uploaded directly from Flutter; backend stores the URL in PostgreSQL.

---

### `common` — Cross-cutting
Shared across all layers. No business logic.

- **`exception/`** — Custom business exceptions (`MatchNotFoundException`, `OtpExpiredException`…) + global `@ControllerAdvice` handler returning consistent error responses.
- **`util/`** — Stateless helpers: JWT utilities, Argon2 hashing, geolocation calculations, date formatting.

---

## Request Flow

```
Flutter
  │
  ▼
Controller        ← receives HTTP request, validates DTO
  │
  ▼
Mapper            ← DTO request → domain model
  │
  ▼
Service           ← applies business rules
  │  ├── Repository       → PostgreSQL (Cloud SQL)
  │  ├── FirestorePort    → Firestore (real-time)
  │  ├── FirebaseAuthPort → Firebase Auth
  │  └── AiScoringPort   → AI engine
  │
  ▼
Mapper            ← domain model → DTO response
  │
  ▼
Controller        ← returns HTTP response to Flutter
```

---

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | Spring Boot 3.x (Java 17) |
| Auth | JWT + OTP (Argon2) + Firebase Auth |
| ORM | Spring Data JPA / Hibernate |
| Primary database | PostgreSQL (Cloud SQL) |
| Real-time | Firestore (NoSQL) |
| Media storage | Firebase Storage |
| Scheduler | Spring `@Scheduled` (weekly matching) |
| Payments | Stripe API + Webhooks |
| Push notifications | Firebase FCM |
| Deployment | Cloud Run (containerized) |
| Secrets | GCP Secret Manager |

---

## Getting Started

### Prerequisites

```
Java 17+
PostgreSQL 15+
Maven 3.9+
```

### Run locally

```bash
cd backend
cp .env.example .env     # fill in DB, JWT secret, Stripe keys, Firebase config
./mvnw spring-boot:run
```

### Key environment variables

```env
DB_URL=jdbc:postgresql://localhost:5432/safematch
JWT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
FIREBASE_PROJECT_ID=
```

> ⚠️ Never commit `.env` or any secrets. Use GCP Secret Manager in production.

---

## Related

- [`/frontend`](../frontend) — Flutter mobile app
- [`/infra`](../infra) — Docker, CI/CD, Cloud Run config
- [`/docs`](../docs) — Architecture diagrams, UML, API reference
