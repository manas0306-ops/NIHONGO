# NekoNihongo Database & Persistence Architecture 🗄️

## 1. Relational Schema Overview

The database design adheres to 3NF relational normalization while providing high-performance JSONB storage for lesson structures and exercise answers.

```
                      +---------------+
                      | auth.users    |
                      +-------+-------+
                              |
               +--------------+--------------+
               |                             |
      +--------v--------+           +--------v--------+
      | profiles        |           | user_preferences|
      +--------+--------+           +-----------------+
               |
  +------------+---------------------------+-------------------------+
  |                                        |                         |
+-v-------------------+          +---------v---------+     +---------v---------+
| lesson_completions  |          | srs_items         |     | user_achievements |
| (idempotent TXs)    |          | (SM-2 intervals)  |     +-------------------+
+---------------------+          +-------------------+
```

---

## 2. Table Specifications

1. `profiles`: User account identification, display name, avatar, total XP, current streak, and level.
2. `user_preferences`: Theme ID (`sakura`, `matcha`, `midnight`, `zen`, `ocean`, `autumn`, `lantern`), color mode (`light`, `dark`, `system`), audio playback rate, furigana/romaji visibility toggles, study duration, and timezone.
3. `units`: Curriculum units (Order, Level, JLPT N5-N1, title, description, gradient theme).
4. `lessons`: Unit lessons (Order, title, japanese_title, objectives, duration, XP rewards).
5. `exercises`: Individual interactive questions with types, prompts, correct answers, accepted alternatives, and pedagogical explanations.
6. `lesson_completions`: Audit trail of finished lessons with an explicit `transaction_id` unique constraint preventing replay attacks and duplicate reward claims.
7. `srs_items`: Spaced repetition tracking storing interval in days, repetitions, ease factor, due timestamp, and recall mastery status.
8. `xp_transactions`: Ledger of all awarded experience points.
9. `user_achievements`: Timestamped achievement badge unlock history.
10. `user_quests`: Daily mission tracker with date-scoped unique keys.

---

## 3. Row Level Security (RLS)

All user-owned tables enforce Supabase RLS:
- Users may only view and manipulate records where `auth.uid() = user_id`.
- Public curriculum content (`units`, `lessons`, `exercises`) is read-only for public access.
