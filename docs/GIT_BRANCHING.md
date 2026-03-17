# Git Branching Strategy

```
main
 └── develop
      ├── feature/user-auth
      ├── feature/profile
      └── ...

release/1.0.0  ──► main
hotfix/fix-crash  ──► main + develop
```

---

## Branches

| Branche | Rôle | Base | Merge vers |
|---|---|---|---|
| `main` | Production stable | — | — |
| `develop` | Intégration continue | `main` | — |
| `feature/*` | Une fonctionnalité | `develop` | `develop` |
| `release/*` | Préparation version | `develop` | `main` + `develop` |
| `hotfix/*` | Fix critique prod | `main` | `main` + `develop` |

---

### `main`
Branche de production. **Aucun commit direct.**  
Uniquement des merges depuis `release/*` ou `hotfix/*`. Chaque merge est tagué (`v1.0.0`).

### `develop`
Branche d'intégration. Base de tous les `feature/*`.  
Toujours buildable. Reçoit les back-merges des `hotfix/*`.

### `feature/*`
```bash
git checkout -b feature/user-auth     # depuis develop
# ... commits ...
git push origin feature/user-auth     # → Pull Request vers develop
```
Exemples : `feature/user-auth` · `feature/profile` · `feature/matching-engine`

### `release/*`
```bash
git checkout -b release/1.0.0         # depuis develop — feature freeze
# fixes, bump version...
git merge --no-ff release/1.0.0       # → main + tag
git merge --no-ff release/1.0.0       # → develop (back-merge)
```

### `hotfix/*`
```bash
git checkout -b hotfix/fix-payment-crash   # depuis main
# fix...
git merge --no-ff hotfix/fix-payment-crash # → main + tag
git merge --no-ff hotfix/fix-payment-crash # → develop (obligatoire)
```
Exemples : `hotfix/fix-payment-crash` · `hotfix/otp-expiry-bypass`

---

## Commit Convention

```
feat(auth): add OTP verification
fix(payment): handle null Stripe webhook
chore(ci): add dependency scan
```
Types : `feat` · `fix` · `chore` · `refactor` · `docs` · `test` · `perf`

feat      → new feature
fix       → bug fix
chore     → config, dependencies, CI/CD (no functional change)
refactor  → code change without behavior change
docs      → documentation only
test      → adding or fixing tests
perf      → performance improvement
