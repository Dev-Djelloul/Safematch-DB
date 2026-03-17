# MVP — Safematch

##  Goal of the MVP
Deliver a first functional version of Safe that allows a user to:

- create an account  
- set up a profile and preferences  
- receive and respond to invitations  
- purchase an extra invitation  
- create a match  
- exchange messages  

This MVP establishes the foundations of the product and the technical architecture (Firebase Auth, backend, Cloud SQL, Firestore).

---

## 1. Account

### US1 — Phone Number Signup
**As a user**, I want to sign up using my phone number so I can access the app.

**Acceptance Criteria**
- Authentication via Firebase Phone Auth.  
- SMS verification code.  
- Firebase UID retrieved after signup.  
- Backend creates a new user record in Cloud SQL if the UID is new.

---

### US2 — Profile Creation
**As a user**, I want to create my profile so I can be visible in the app.

**Minimum Required Fields**
- first name  
- date of birth  
- gender  
- sexual orientation  
- at least one photo  
- optional bio  

**Acceptance Criteria**
- Profile stored in Cloud SQL.  
- Profile can be updated from the app.

---

### US3 — Gender Identity & Sexual Orientation
**As a user**, I want to define my gender identity and sexual orientation so I receive relevant suggestions.

**Acceptance Criteria**
- Gender selection (Male / Female / Non‑binary).  
- Orientation selection (Heterosexual / Homosexual / Bisexual).  
- Stored in Cloud SQL.  
- Used in the suggestion engine.

---

## 2. Preferences

### US4 — Match Preferences
**As a user**, I want to define my match preferences so I receive compatible profiles.

**Acceptance Criteria**
- Age range (min/max).  
- Maximum distance.  
- Preferred genders.  
- Stored in Cloud SQL.

---

### US5 — Geolocation Activation
**As a user**, I want to enable geolocation so I can receive nearby suggestions.

**Acceptance Criteria**
- OS permission request.  
- Location retrieved from device.  
- Coordinates stored in Cloud SQL.  
- Used in the suggestion engine.

---

## 3. Profile Suggestions

### US6 — Receive 3 Invitations
**As a user**, I want to receive 3 invitations per day so I can discover new profiles.

**Acceptance Criteria**
- Backend generates 3 suggestions using MatchService.  
- Suggestions filtered by:
  - preferences  
  - orientation  
  - distance  
  - availability (not already matched)  
- Invitations displayed in the app.

---

### US7 — Accept or Decline an Invitation
**As a user**, I want to accept or decline an invitation.

**Acceptance Criteria**
- Accept → triggers match creation attempt.  
- Decline → invitation disappears.  
- Backend records the action.

---

## 4. Purchase

### US8 — Buy an Extra Invitation
**As a user**, I want to buy an extra invitation when I have used my 3 daily invitations.

**Acceptance Criteria**
- Integration with Stripe or Apple/Google IAP (single product for MVP).  
- After purchase, backend credits 1 extra invitation.  
- User can use it immediately.

---

## 5. Matching

### US9 — Match Creation
**As a user**, I want to match with someone if we both accepted each other.

**Acceptance Criteria**
- Backend checks:
  - if the other user accepted  
  - if a match already exists  
- If valid:
  - MatchEntity created in Cloud SQL  
  - Match event pushed to Firestore for real‑time sync  
- Match appears instantly in the app.

---

## 6. Messaging

### US10 — Send a Message
**As a user**, I want to send a message to my match.

**Acceptance Criteria**
- Messages stored in Firestore (collection per match).  
- Real‑time delivery.  
- Backend moderation triggered (text only for MVP).

---

### US11 — Receive a Message
**As a user**, I want to receive messages from my match in real time.

**Acceptance Criteria**
- Firestore listeners in Flutter.  
- UI updates automatically.  
- Chat metadata updated (unreadCount, lastMessageAt).

---

## 7. Technical Architecture (MVP Scope)

### Backend
- Clean Architecture (domain → ports → adapters).  
- Services: ProfileService, MatchService, ModerationService.  
- Repositories: User, Match, ChatMetadata.  
- AI scoring & moderation: simple or mocked implementation.

### Database
- Cloud SQL (PostgreSQL) with tables:
  - users  
  - matches  
  - chat_message_metadata  
  - moderation_log  

### Real‑Time Layer
- Firestore for:
  - messaging  
  - match events  

### Authentication
- Firebase Auth (Phone).

---

## 8. Out of Scope for MVP
- Infinite swipe.  
- Advanced scoring algorithm.  
- Image moderation.  
- Push notifications.  
- Advanced settings.  
- Premium subscriptions.

