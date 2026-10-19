-- ==============================================================================
-- NekoNihongo Complete Database Schema & RLS Policies
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT DEFAULT '🐱',
  bio TEXT DEFAULT '',
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER PREFERENCES
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'sakura',
  color_mode TEXT NOT NULL DEFAULT 'system',
  audio_speed NUMERIC(3, 2) DEFAULT 1.0,
  show_furigana BOOLEAN DEFAULT TRUE,
  show_romaji BOOLEAN DEFAULT TRUE,
  sound_effects BOOLEAN DEFAULT TRUE,
  reduced_motion BOOLEAN DEFAULT FALSE,
  font_size TEXT DEFAULT 'base',
  daily_xp_goal INTEGER DEFAULT 30,
  daily_study_minutes INTEGER DEFAULT 15,
  ability_level TEXT DEFAULT 'beginner',
  primary_goal TEXT DEFAULT 'conversation',
  timezone TEXT DEFAULT 'UTC',
  has_completed_onboarding BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CURRICULUM LEVELS & UNITS
CREATE TABLE IF NOT EXISTS public.units (
  id TEXT PRIMARY KEY,
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  japanese_title TEXT NOT NULL,
  description TEXT NOT NULL,
  level TEXT NOT NULL,
  jlpt TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  color_gradient TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LESSONS
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  unit_id TEXT REFERENCES public.units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  japanese_title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  level TEXT NOT NULL,
  jlpt TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 5,
  xp_reward INTEGER DEFAULT 20,
  objectives JSONB DEFAULT '[]'::jsonb,
  prerequisites JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EXERCISES
CREATE TABLE IF NOT EXISTS public.exercises (
  id TEXT PRIMARY KEY,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  japanese_prompt TEXT,
  options JSONB DEFAULT '[]'::jsonb,
  correct_answer JSONB NOT NULL,
  accepted_alternatives JSONB DEFAULT '[]'::jsonb,
  explanation TEXT NOT NULL,
  hint TEXT,
  difficulty INTEGER DEFAULT 1,
  skill_tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LESSON COMPLETIONS (Unique constraint prevents duplicate reward transactions)
CREATE TABLE IF NOT EXISTS public.lesson_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  attempts INTEGER DEFAULT 1,
  time_spent_seconds INTEGER DEFAULT 0,
  transaction_id TEXT UNIQUE NOT NULL, -- Idempotency key
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SPACED REPETITION (SRS) ITEMS
CREATE TABLE IF NOT EXISTS public.srs_items (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  item_key TEXT NOT NULL,
  japanese TEXT NOT NULL,
  reading TEXT NOT NULL,
  meaning TEXT NOT NULL,
  interval_days INTEGER DEFAULT 0,
  repetitions INTEGER DEFAULT 0,
  ease_factor NUMERIC(4, 2) DEFAULT 2.50,
  due_date TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ,
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  mastery_level TEXT DEFAULT 'learning',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, item_type, item_key)
);

-- 8. XP & CURRENCY TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.xp_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  transaction_key TEXT UNIQUE, -- Idempotent
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ACHIEVEMENTS & USER UNLOCKS
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, achievement_id)
);

-- 10. DAILY QUESTS PROGRESS
CREATE TABLE IF NOT EXISTS public.user_quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL,
  date_str DATE NOT NULL,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  UNIQUE (user_id, quest_id, date_str)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.srs_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;

-- Public Curriculum Read Access
CREATE POLICY "Public can view units" ON public.units FOR SELECT USING (true);
CREATE POLICY "Public can view lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Public can view exercises" ON public.exercises FOR SELECT USING (true);

-- User-Owned Data Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own completions" ON public.lesson_completions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own SRS items" ON public.srs_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own XP transactions" ON public.xp_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own quests" ON public.user_quests FOR ALL USING (auth.uid() = user_id);
