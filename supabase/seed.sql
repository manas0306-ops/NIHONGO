-- ==============================================================================
-- NekoNihongo Seed Curriculum & Units Data
-- ==============================================================================

INSERT INTO public.units (id, order_index, title, japanese_title, description, level, jlpt, icon_name, color_gradient)
VALUES 
('unit_1', 1, 'Hiragana Foundations', 'ひらがなの基礎', 'Master the 46 fundamental kana characters, vowel timing, and core syllable rows.', 'A', 'N5', 'BookOpen', 'from-pink-500 to-rose-500'),
('unit_2', 2, 'Hiragana Mastery & Greetings', '濁音・半濁音とあいさつ', 'Learn voiced sounds (がざだば), handakuten (ぱ), and essential daily Japanese greetings.', 'A', 'N5', 'Smile', 'from-emerald-500 to-green-600'),
('unit_3', 3, 'Katakana Essentials & Loanwords', 'カタカナと外来語', 'Read loanwords, food terms, tech vocabulary, and country names in Katakana.', 'A', 'N5', 'Globe', 'from-blue-500 to-indigo-600'),
('unit_4', 4, 'Self-Introductions & Topic Marker は', '自己紹介と助詞「は」', 'Introduce your name, nationality, and role with は, です, and demonstratives.', 'B', 'N5', 'User', 'from-amber-500 to-yellow-600')
ON CONFLICT (id) DO NOTHING;
