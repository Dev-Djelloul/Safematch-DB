# Safematch_v0

> **Quality over quantity.** Safe is a premium dating app built around verified identities, weekly AI-curated matches, and real-world dates. No infinite scroll, no gamification — just meaningful connections.

&nbsp;

![Status](https://img.shields.io/badge/status-in%20development-blue)
![Flutter](https://img.shields.io/badge/Flutter-3.x-54C5F8?logo=flutter)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=spring)
![License](https://img.shields.io/badge/license-private-lightgrey)

---

## What is Safe?

Safe is a dating application that rejects the traditional model of unlimited swipes and passive browsing. Every week, the AI engine selects **3 curated invitations** for each user based on emotional compatibility, interaction patterns, behavioral signals, and real-world feasibility.

Users have one active conversation at a time. Dates are suggested by an AI assistant. Identity is verified. Every profile is real.

---

## Core Features

| Feature | Description |
|---|---|
| **Verified Identity** | OTP-based authentication (MVP). Document + selfie verification planned. |
| **Weekly AI Matching** | 3 curated invitations per week via scoring pipeline (compatibility, behavior, location) |
| **Structured Conversations** | One active conversation at a time — quality over volume |
| **AI Date Assistant** | Suggests real venues and time slots based on profiles and preferences |
| **Checkin System** | Mutual confirmation before and on the day of the date — reduces ghosting |
| **4th Premium Match** | Optional one-time purchase for a 4th AI-selected invitation per week |
| **Account Control** | Hide, pause, or permanently delete account at any time |

---

## Tech Stack

### Mobile — Flutter
- **Framework:** Flutter 3.x (iOS & Android)
- **State management:** Riverpod
- **Navigation:** GoRouter
- **API client:** Dio
- **Secure storage:** Flutter Secure Storage (Keychain / Keystore)
- **Payments:** Stripe SDK, Apple Pay, Google Pay

### Backend — Spring Boot
- **Framework:** Spring Boot 3.x (Java 17)
- **Auth:** JWT + OTP (PBKDF2/Argon2)
- **ORM:** Spring Data JPA / Hibernate
- **Real-time:** WebSocket (messaging)
- **Scheduler:** Spring `@Scheduled` (weekly matching pipeline)
- **Payments:** Stripe API + Webhooks
- **Push notifications:** Firebase FCM

### Infrastructure
- **Database:** PostgreSQL
- **Cache:** ~~Redis~~ (optional — pipeline results)
- **Storage:** ~~AWS S3~~ Firestore (media)
- **CI/CD:** GitHub Actions

---

## Project Structure

```
SAFEMATCH_v0/
├── frontend/               # Flutter mobile application (iOS & Android)
│   ├── lib/
│   │   ├── core/           # Theme, router, secure storage, permissions
│   │   ├── data/           # API client, repositories
│   │   └── features/       # auth · profile · matches · messaging · payments · assistant_date
│   └── test/
│
├── backend/                # Spring Boot API (Java 17)
│   └── src/main/java/
│       ├── auth/           # OTP, JWT, refresh tokens
│       ├── user/           # Profile, preferences, location
│       ├── matching/       # AI Matching Engine (weekly batch)
│       ├── messaging/      # Conversations, messages, expiration
│       ├── assistant/      # AI Date Engine
│       ├── payment/        # Stripe, premium features
│       └── security/       # RBAC, rate limiting, audit
│
├── infra/                  # Infrastructure & deployment
│   ├── docker/             # Dockerfiles, docker-compose
│   ├── ci/                 # GitHub Actions workflows
│   └── config/             # Environment config templates
│
├── docs/                   # Technical documentation
│   ├── architecture/       # UML diagrams (components, sequence, ERD)
│   ├── api/                # API reference
│   └── security/           # Security architecture
│
├── README.md
└── LEGAL.md
```

---

## Getting Started

### Prerequisites

```
Flutter SDK ≥ 3.0
Java 17
PostgreSQL 15+
```

### Backend

```bash
cd safe-backend
cp .env.example .env       # configure DB, Stripe keys, JWT secret, FCM
./mvnw spring-boot:run
```

### Mobile

```bash
cd safe-app
flutter pub get
flutter run
```

> ⚠️ API keys and secrets are never committed. Use `.env` files (backend) and a local `secrets.dart` (Flutter, gitignored).

---

## Security

- All communication over **HTTPS / TLS 1.2+**
- JWT with short expiry + rotated refresh tokens
- OTP hashed with Argon2 — never stored in plaintext
- Rate limiting per IP and endpoint
- AES-256 encryption for sensitive data at rest
- Zero payment data stored — Stripe IDs only
- Approximate geolocation only — no trajectory history
- GDPR compliant: minimization, right to erasure, anonymized logs

See [`SECURITY.md`](./SECURITY.md) for full details.

---

## Branching Strategy

See [`GIT_BRANCHING.md`](./GIT_BRANCHING.md) for the full Git Flow.

```
main        → production (tags only)
develop     → integration
feature/*   → one branch per feature
release/*   → version stabilization
hotfix/*    → critical production fix
```

---

## Roadmap

- [x] Architecture & technical specifications
- [ ] Authentication (OTP + JWT)
- [ ] User profile & preferences
- [ ] Weekly matching pipeline (AI engine)
- [ ] Messaging + real-time WebSocket
- [ ] AI Date Assistant
- [ ] Stripe payments + 4th premium match
- [ ] Checkin system
- [ ] Identity verification (Onfido / Veriff)
- [ ] Beta launch

---

## License

Private — All rights reserved.  
© 2026 Safematch
