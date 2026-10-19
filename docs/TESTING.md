# Testing & Quality Assurance 🧪

## 1. Automated Test Suites

NekoNihongo includes automated unit and integration tests written in Vitest and React Testing Library.

```bash
# Execute all tests
npm run test
```

### Coverage Areas

1. `tests/unit/sm2.test.ts`:
   - Validates SuperMemo SM-2 interval expansion, repetitions tracking, and ease factor adjustments.
   - Tests failure resets (grade < 3) and ease factor lower bound (1.3 minimum).
   - Validates due date filtering against current timestamps.
2. `tests/unit/gamification.test.ts`:
   - Tests timezone-aware streak increments.
   - Verifies streak protection with streak freezes.
   - Verifies idempotent reward calculations.
   - Validates user level curve based on accumulated XP.
3. `tests/unit/curriculum.test.ts`:
   - Verifies 10 units, 30 lessons, and 300 unique individual exercises.
   - Verifies non-empty prompts, answers, and educational explanations.
4. `tests/unit/speech.test.ts`:
   - Tests Japanese text normalization.
   - Tests Levenshtein speech transcript comparison.
