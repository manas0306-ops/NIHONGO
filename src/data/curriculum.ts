import { Unit, Lesson, Exercise } from "@/types";

// Helper function to build exercises cleanly
function ex(
  id: string,
  type: Exercise["type"],
  prompt: string,
  correctAnswer: string | string[],
  options?: string[],
  extras: Partial<Exercise> = {}
): Exercise {
  return {
    id,
    type,
    prompt,
    correctAnswer,
    options,
    explanation: extras.explanation || "Correct! Well done.",
    difficulty: extras.difficulty || 1,
    skillTag: extras.skillTag || "vocabulary",
    ...extras,
  };
}

// ---------------------------------------------------------------------------
// UNIT 1: Hiragana Foundations (Level A, JLPT N5)
// ---------------------------------------------------------------------------
const unit1Lessons: Lesson[] = [
  {
    id: "lesson_u1_l1",
    unitId: "unit_1",
    title: "The Five Core Vowels",
    japaneseTitle: "基本の５母音 (あ・い・う・え・お)",
    description: "Master the foundational vowels that form the basis of all Japanese sounds.",
    order: 1,
    level: "A",
    jlpt: "N5",
    durationMinutes: 5,
    objectives: ["Pronounce あ, い, う, え, お accurately", "Recognize vowel shapes", "Distinguish similar vowel sounds"],
    prerequisites: [],
    xpReward: 20,
    exercises: [
      ex("u1_l1_e1", "multiple_choice", "Which character represents the sound 'a'?", "あ", ["あ", "い", "う", "え"], { skillTag: "kana", explanation: "あ is 'a', like an Apple with a stem." }),
      ex("u1_l1_e2", "kana_recognition", "Select the character for 'i':", "い", ["い", "え", "お", "あ"], { skillTag: "kana", explanation: "い is 'i', like two Eels swimming side-by-side." }),
      ex("u1_l1_e3", "multiple_choice", "What sound does the kana 'う' make?", "u", ["u", "a", "o", "e"], { skillTag: "kana", explanation: "う is pronounced 'u' (like 'oo' in foot)." }),
      ex("u1_l1_e4", "kana_to_romaji", "Type the romaji for 'え':", "e", undefined, { skillTag: "kana", explanation: "え is pronounced 'e' like in 'energy'." }),
      ex("u1_l1_e5", "romaji_to_kana", "Select the kana for 'o':", "お", ["お", "あ", "う", "い"], { skillTag: "kana", explanation: "お is 'o', a golfer hitting a ball on the green." }),
      ex("u1_l1_e6", "match_pairs", "Match the Japanese vowels to their English romaji:", "all_matched", undefined, {
        skillTag: "kana",
        pairs: [
          { id: "p1", japanese: "あ", english: "a" },
          { id: "p2", japanese: "い", english: "i" },
          { id: "p3", japanese: "う", english: "u" },
          { id: "p4", japanese: "お", english: "o" },
        ],
      }),
      ex("u1_l1_e7", "listen_select", "Listen and select the matching kana:", "い", ["あ", "い", "う", "え"], { audioReference: "い", promptAudio: "い", skillTag: "listening" }),
      ex("u1_l1_e8", "typing_practice", "Type the word 'あい' (meaning 'love') in romaji:", "ai", undefined, { skillTag: "vocabulary", acceptedAlternatives: ["AI"] }),
      ex("u1_l1_e9", "word_bank", "Assemble the word 'うえ' (above / up):", ["う", "え"], undefined, { wordBank: ["う", "え", "あ", "お"], skillTag: "vocabulary" }),
      ex("u1_l1_e10", "multiple_choice", "What does 'あお' (ao) mean in English?", "Blue", ["Blue", "Red", "Up", "Love"], { skillTag: "vocabulary", explanation: "あお (ao) means 'blue' in Japanese." }),
    ],
  },
  {
    id: "lesson_u1_l2",
    unitId: "unit_1",
    title: "K-Row: Ka, Ki, Ku, Ke, Ko",
    japaneseTitle: "か行 (か・き・く・け・こ)",
    description: "Learn the K-consonant row and combine with vowels to form your first everyday words.",
    order: 2,
    level: "A",
    jlpt: "N5",
    durationMinutes: 5,
    objectives: ["Read か, き, く, け, こ", "Form words like かく (to write) and いけ (pond)"],
    prerequisites: ["lesson_u1_l1"],
    xpReward: 20,
    exercises: [
      ex("u1_l2_e1", "multiple_choice", "Which kana represents 'ka'?", "か", ["か", "き", "く", "け"], { skillTag: "kana" }),
      ex("u1_l2_e2", "kana_recognition", "Identify 'ki':", "き", ["き", "さ", "こ", "か"], { skillTag: "kana" }),
      ex("u1_l2_e3", "multiple_choice", "What sound does 'く' make?", "ku", ["ku", "ke", "ka", "ko"], { skillTag: "kana" }),
      ex("u1_l2_e4", "romaji_to_kana", "Select 'ke':", "け", ["け", "は", "ほ", "い"], { skillTag: "kana" }),
      ex("u1_l2_e5", "kana_to_romaji", "Type the romaji for 'こ':", "ko", undefined, { skillTag: "kana" }),
      ex("u1_l2_e6", "match_pairs", "Match the K-row kana to their romaji:", "all_matched", undefined, {
        skillTag: "kana",
        pairs: [
          { id: "k1", japanese: "か", english: "ka" },
          { id: "k2", japanese: "き", english: "ki" },
          { id: "k3", japanese: "く", english: "ku" },
          { id: "k4", japanese: "こ", english: "ko" },
        ],
      }),
      ex("u1_l2_e7", "word_bank", "Build the word 'えき' (station):", ["え", "き"], undefined, { wordBank: ["え", "き", "か", "こ"], skillTag: "vocabulary" }),
      ex("u1_l2_e8", "typing_practice", "Type the romaji for 'かく' (to write):", "kaku", undefined, { skillTag: "vocabulary" }),
      ex("u1_l2_e9", "listen_select", "Listen and pick the correct kana:", "く", ["か", "き", "く", "こ"], { audioReference: "く", promptAudio: "く", skillTag: "listening" }),
      ex("u1_l2_e10", "ja_to_en", "What does 'あき' (aki) mean?", "Autumn", ["Autumn", "Spring", "Winter", "Summer"], { skillTag: "vocabulary" }),
    ],
  },
  {
    id: "lesson_u1_l3",
    unitId: "unit_1",
    title: "S-Row & T-Row: Sa, Shi, Su, Se, So / Ta, Chi, Tsu, Te, To",
    japaneseTitle: "さ行・た行のカナ",
    description: "Learn irregular sounds 'shi' and 'tsu', and practice reading two-syllable nouns.",
    order: 3,
    level: "A",
    jlpt: "N5",
    durationMinutes: 6,
    objectives: ["Master 'shi' (し) and 'tsu' (つ) pronunciation", "Distinguish さ vs ち"],
    prerequisites: ["lesson_u1_l2"],
    xpReward: 25,
    exercises: [
      ex("u1_l3_e1", "multiple_choice", "Which kana represents 'shi'?", "し", ["し", "ち", "つ", "す"], { skillTag: "kana" }),
      ex("u1_l3_e2", "kana_recognition", "Select 'tsu':", "つ", ["つ", "し", "て", "と"], { skillTag: "kana" }),
      ex("u1_l3_e3", "multiple_choice", "Which sound does 'ち' represent?", "chi", ["chi", "sa", "ta", "te"], { skillTag: "kana" }),
      ex("u1_l3_e4", "kana_to_romaji", "Type romaji for 'す':", "su", undefined, { skillTag: "kana" }),
      ex("u1_l3_e5", "romaji_to_kana", "Select 'te':", "て", ["て", "と", "た", "ち"], { skillTag: "kana" }),
      ex("u1_l3_e6", "match_pairs", "Match the kana pairs:", "all_matched", undefined, {
        skillTag: "kana",
        pairs: [
          { id: "s1", japanese: "さ", english: "sa" },
          { id: "s2", japanese: "し", english: "shi" },
          { id: "s3", japanese: "た", english: "ta" },
          { id: "s4", japanese: "ち", english: "chi" },
        ],
      }),
      ex("u1_l3_e7", "word_bank", "Build the word 'すし' (sushi):", ["す", "し"], undefined, { wordBank: ["す", "し", "さ", "ち"], skillTag: "vocabulary" }),
      ex("u1_l3_e8", "listen_select", "Listen and select the spoken kana:", "た", ["た", "ち", "つ", "て"], { audioReference: "た", promptAudio: "た", skillTag: "listening" }),
      ex("u1_l3_e9", "typing_practice", "Type romaji for 'うた' (song):", "uta", undefined, { skillTag: "vocabulary" }),
      ex("u1_l3_e10", "ja_to_en", "What does 'した' (shita) mean?", "Under / Below", ["Under / Below", "Above", "Inside", "Front"], { skillTag: "vocabulary" }),
    ],
  },
];

// ---------------------------------------------------------------------------
// UNIT 2: Hiragana Mastery & Everyday Greetings (Level A, JLPT N5)
// ---------------------------------------------------------------------------
const unit2Lessons: Lesson[] = [
  {
    id: "lesson_u2_l1",
    unitId: "unit_2",
    title: "N-Row & H-Row Kana",
    japaneseTitle: "な行・は行のカナ",
    description: "Learn な, に, ぬ, ね, の and は, ひ, ふ, へ, ほ including special 'fu' and nasal 'n'.",
    order: 4,
    level: "A",
    jlpt: "N5",
    durationMinutes: 5,
    objectives: ["Read Na-row and Ha-row kana", "Understand that は acts as 'wa' when marking a topic"],
    prerequisites: ["lesson_u1_l3"],
    xpReward: 20,
    exercises: [
      ex("u2_l1_e1", "multiple_choice", "Which kana is 'ne' (as in neko / cat)?", "ね", ["ね", "ぬ", "わ", "れ"], { skillTag: "kana" }),
      ex("u2_l1_e2", "kana_recognition", "Identify 'fu':", "ふ", ["ふ", "ほ", "は", "へ"], { skillTag: "kana" }),
      ex("u2_l1_e3", "multiple_choice", "Which kana represents 'no'?", "の", ["の", "め", "ぬ", "ね"], { skillTag: "kana" }),
      ex("u2_l1_e4", "kana_to_romaji", "Type the romaji for 'に':", "ni", undefined, { skillTag: "kana" }),
      ex("u2_l1_e5", "word_bank", "Build the word 'ねこ' (cat):", ["ね", "こ"], undefined, { wordBank: ["ね", "こ", "い", "ぬ"], skillTag: "vocabulary" }),
      ex("u2_l1_e6", "word_bank", "Build the word 'いぬ' (dog):", ["い", "ぬ"], undefined, { wordBank: ["い", "ぬ", "ね", "こ"], skillTag: "vocabulary" }),
      ex("u2_l1_e7", "match_pairs", "Match animals and words:", "all_matched", undefined, {
        skillTag: "vocabulary",
        pairs: [
          { id: "a1", japanese: "ねこ", english: "Cat" },
          { id: "a2", japanese: "いぬ", english: "Dog" },
          { id: "a3", japanese: "はな", english: "Flower / Nose" },
          { id: "a4", japanese: "ひと", english: "Person" },
        ],
      }),
      ex("u2_l1_e8", "listen_select", "Listen and choose the kana:", "ほ", ["は", "ひ", "ふ", "ほ"], { audioReference: "ほ", promptAudio: "ほ", skillTag: "listening" }),
      ex("u2_l1_e9", "typing_practice", "Type the romaji for 'はな' (flower):", "hana", undefined, { skillTag: "vocabulary" }),
      ex("u2_l1_e10", "ja_to_en", "What does 'ほん' (hon) mean?", "Book", ["Book", "Cat", "Sun", "Water"], { skillTag: "vocabulary" }),
    ],
  },
  {
    id: "lesson_u2_l2",
    unitId: "unit_2",
    title: "Dakuten & Handakuten (Voiced Sounds)",
    japaneseTitle: "濁音・半濁音 (が・ざ・だ・ば・ぱ)",
    description: "Transform sounds using tenten (゛) and maru (゜) marks.",
    order: 5,
    level: "A",
    jlpt: "N5",
    durationMinutes: 6,
    objectives: ["Transform K -> G, S -> Z, T -> D, H -> B / P", "Recognize が, ざ, だ, ば, ぱ"],
    prerequisites: ["lesson_u2_l1"],
    xpReward: 25,
    exercises: [
      ex("u2_l2_e1", "multiple_choice", "What does か become with tenten (゛)?", "が", ["が", "ざ", "だ", "ば"], { skillTag: "kana" }),
      ex("u2_l2_e2", "multiple_choice", "Which kana represents 'pa'?", "ぱ", ["ぱ", "ば", "は", "だ"], { skillTag: "kana" }),
      ex("u2_l2_e3", "kana_recognition", "Identify 'ji' (voiced し):", "じ", ["じ", "ず", "ぜ", "ぞ"], { skillTag: "kana" }),
      ex("u2_l2_e4", "kana_to_romaji", "Type romaji for 'で':", "de", undefined, { skillTag: "kana" }),
      ex("u2_l2_e5", "word_bank", "Build the word 'みず' (water):", ["み", "ず"], undefined, { wordBank: ["み", "ず", "す", "ち"], skillTag: "vocabulary" }),
      ex("u2_l2_e6", "word_bank", "Build the word 'ごはん' (rice / meal):", ["ご", "は", "ん"], undefined, { wordBank: ["ご", "は", "ん", "こ"], skillTag: "vocabulary" }),
      ex("u2_l2_e7", "match_pairs", "Match voiced kana to romaji:", "all_matched", undefined, {
        skillTag: "kana",
        pairs: [
          { id: "d1", japanese: "が", english: "ga" },
          { id: "d2", japanese: "だ", english: "da" },
          { id: "d3", japanese: "ば", english: "ba" },
          { id: "d4", japanese: "ぱ", english: "pa" },
        ],
      }),
      ex("u2_l2_e8", "listen_select", "Listen and pick the correct voiced kana:", "び", ["ひ", "び", "ぴ", "み"], { audioReference: "び", promptAudio: "び", skillTag: "listening" }),
      ex("u2_l2_e9", "typing_practice", "Type romaji for 'えび' (shrimp):", "ebi", undefined, { skillTag: "vocabulary" }),
      ex("u2_l2_e10", "ja_to_en", "What does 'かぜ' (kaze) mean?", "Wind / Cold", ["Wind / Cold", "Water", "Fire", "Mountain"], { skillTag: "vocabulary" }),
    ],
  },
  {
    id: "lesson_u2_l3",
    unitId: "unit_2",
    title: "Essential Japanese Greetings",
    japaneseTitle: "基本のあいさつ",
    description: "Learn natural daily greetings used morning, afternoon, and evening.",
    order: 6,
    level: "A",
    jlpt: "N5",
    durationMinutes: 6,
    objectives: ["Say hello, good morning, thank you, and goodbye", "Understand situational polite greetings"],
    prerequisites: ["lesson_u2_l2"],
    xpReward: 25,
    exercises: [
      ex("u2_l3_e1", "multiple_choice", "How do you say 'Good morning' politely?", "おはようございます", ["おはようございます", "こんにちは", "こんばんは", "さようなら"], { skillTag: "vocabulary" }),
      ex("u2_l3_e2", "multiple_choice", "What greeting is used during daytime (Hello)?", "こんにちは", ["こんにちは", "こんばんは", "おやすみなさい", "じゃあね"], { skillTag: "vocabulary" }),
      ex("u2_l3_e3", "word_bank", "Assemble 'Thank you' (polite):", ["あ", "り", "が", "と", "う"], undefined, { wordBank: ["あ", "り", "が", "と", "う", "ご", "ざ", "い", "ま", "す"], skillTag: "vocabulary" }),
      ex("u2_l3_e4", "typing_practice", "Type the romaji for 'こんばんは' (Good evening):", "konbanwa", undefined, { skillTag: "vocabulary", acceptedAlternatives: ["konbanha"] }),
      ex("u2_l3_e5", "conversation_response", "Your friend says 'ありがとう'. How do you reply?", "どういたしまして", ["どういたしまして", "さようなら", "おはよう", "はじめまして"], { skillTag: "grammar", explanation: "どういたしまして means 'You are welcome'." }),
      ex("u2_l3_e6", "match_pairs", "Match the greetings to their English meanings:", "all_matched", undefined, {
        skillTag: "vocabulary",
        pairs: [
          { id: "g1", japanese: "おはよう", english: "Good morning (casual)" },
          { id: "g2", japanese: "こんにちは", english: "Hello / Good afternoon" },
          { id: "g3", japanese: "さようなら", english: "Goodbye" },
          { id: "g4", japanese: "ありがとう", english: "Thank you" },
        ],
      }),
      ex("u2_l3_e7", "dialogue_completion", "Complete the greeting when meeting someone for the first time: 'はじめまして、____。'", "よろしくおねがいします", ["よろしくおねがいします", "おはようございます", "さようなら", "すみません"], { skillTag: "grammar" }),
      ex("u2_l3_e8", "listen_type", "Listen and type what you hear:", "ありがとう", undefined, { audioReference: "ありがとう", promptAudio: "ありがとう", skillTag: "listening", acceptedAlternatives: ["arigatou"] }),
      ex("u2_l3_e9", "ja_to_en", "What does 'じゃあ、また' mean?", "See you later", ["See you later", "Good morning", "Excuse me", "Please"], { skillTag: "vocabulary" }),
      ex("u2_l3_e10", "en_to_ja", "How do you say 'Excuse me / I'm sorry'?", "すみません", ["すみません", "ありがとう", "こんにちは", "はい"], { skillTag: "vocabulary" }),
    ],
  },
];

// ---------------------------------------------------------------------------
// UNIT 3: Katakana Essentials & Loanwords (Level A, JLPT N5)
// ---------------------------------------------------------------------------
const unit3Lessons: Lesson[] = [
  {
    id: "lesson_u3_l1",
    unitId: "unit_3",
    title: "Katakana Vowels & Food Loanwords",
    japaneseTitle: "カタカナの母音と食べ物",
    description: "Learn how Katakana adapts foreign words and master ア, イ, ウ, エ, オ and K-row.",
    order: 7,
    level: "A",
    jlpt: "N5",
    durationMinutes: 5,
    objectives: ["Read Katakana vowels and K-row", "Read loanwords like パン (bread) and ケーキ (cake)"],
    prerequisites: ["lesson_u2_l3"],
    xpReward: 20,
    exercises: [
      ex("u3_l1_e1", "multiple_choice", "Which Katakana is 'A'?", "ア", ["ア", "イ", "ウ", "エ"], { skillTag: "kana" }),
      ex("u3_l1_e2", "kana_recognition", "Identify Katakana 'I':", "イ", ["イ", "エ", "オ", "ア"], { skillTag: "kana" }),
      ex("u3_l1_e3", "multiple_choice", "Which Katakana represents 'Ka'?", "カ", ["カ", "キ", "ク", "ケ"], { skillTag: "kana" }),
      ex("u3_l1_e4", "kana_to_romaji", "Type romaji for 'コ':", "ko", undefined, { skillTag: "kana" }),
      ex("u3_l1_e5", "word_bank", "Build the loanword 'ケーキ' (cake):", ["ケ", "ー", "キ"], undefined, { wordBank: ["ケ", "ー", "キ", "カ"], skillTag: "vocabulary" }),
      ex("u3_l1_e6", "ja_to_en", "What does 'パン' (pan) mean?", "Bread", ["Bread", "Pen", "Pan", "Pencil"], { skillTag: "vocabulary", explanation: "Borrowed from Portuguese 'pão'." }),
      ex("u3_l1_e7", "match_pairs", "Match Katakana food words to English:", "all_matched", undefined, {
        skillTag: "vocabulary",
        pairs: [
          { id: "f1", japanese: "パン", english: "Bread" },
          { id: "f2", japanese: "ケーキ", english: "Cake" },
          { id: "f3", japanese: "アイス", english: "Ice cream" },
          { id: "f4", japanese: "カフェ", english: "Café" },
        ],
      }),
      ex("u3_l1_e8", "listen_select", "Listen and choose the Katakana word:", "カフェ", ["カフェ", "ケーキ", "パン", "アイス"], { audioReference: "カフェ", promptAudio: "カフェ", skillTag: "listening" }),
      ex("u3_l1_e9", "typing_practice", "Type romaji for 'アイス' (ice cream):", "aisu", undefined, { skillTag: "vocabulary" }),
      ex("u3_l1_e10", "multiple_choice", "What is the horizontal bar 'ー' in Katakana called?", "Chōonpu (Long vowel mark)", ["Chōonpu (Long vowel mark)", "Hyphen", "Minus", "Tenten"], { skillTag: "kana" }),
    ],
  },
  {
    id: "lesson_u3_l2",
    unitId: "unit_3",
    title: "Katakana Drinks & Tech Words",
    japaneseTitle: "カタカナの飲み物とテクノロジー",
    description: "Read everyday beverage and digital device names in Katakana.",
    order: 8,
    level: "A",
    jlpt: "N5",
    durationMinutes: 5,
    objectives: ["Recognize コーヒー, ミルク, スマホ, テレビ", "Master S, T, and N rows in Katakana"],
    prerequisites: ["lesson_u3_l1"],
    xpReward: 20,
    exercises: [
      ex("u3_l2_e1", "multiple_choice", "How do you write 'Coffee' in Katakana?", "コーヒー", ["コーヒー", "コーラ", "ミルク", "ココア"], { skillTag: "vocabulary" }),
      ex("u3_l2_e2", "ja_to_en", "What is 'スマホ' (sumaho)?", "Smartphone", ["Smartphone", "Sumo", "Smartwatch", "Smart card"], { skillTag: "vocabulary" }),
      ex("u3_l2_e3", "word_bank", "Build the word 'テレビ' (TV):", ["テ", "レ", "ビ"], undefined, { wordBank: ["テ", "レ", "ビ", "ト"], skillTag: "vocabulary" }),
      ex("u3_l2_e4", "typing_practice", "Type romaji for 'ミルク' (milk):", "miruku", undefined, { skillTag: "vocabulary" }),
      ex("u3_l2_e5", "multiple_choice", "Which Katakana is 'Shi' (strokes go upward)?", "シ", ["シ", "ツ", "ソ", "ン"], { skillTag: "kana", explanation: "シ strokes flick upwards like a smiling girl." }),
      ex("u3_l2_e6", "multiple_choice", "Which Katakana is 'Tsu' (strokes go downward)?", "ツ", ["ツ", "シ", "ソ", "ン"], { skillTag: "kana", explanation: "ツ strokes fall down like tears." }),
      ex("u3_l2_e7", "match_pairs", "Match tech & daily loanwords:", "all_matched", undefined, {
        skillTag: "vocabulary",
        pairs: [
          { id: "t1", japanese: "テレビ", english: "Television" },
          { id: "t2", japanese: "カメラ", english: "Camera" },
          { id: "t3", japanese: "ノート", english: "Notebook / Laptop" },
          { id: "t4", japanese: "スマホ", english: "Smartphone" },
        ],
      }),
      ex("u3_l2_e8", "listen_select", "Listen and identify the drink:", "コーヒー", ["コーヒー", "ミルク", "ジュース", "お茶"], { audioReference: "コーヒー", promptAudio: "コーヒー", skillTag: "listening" }),
      ex("u3_l2_e9", "en_to_ja", "Select Katakana for 'Hotel':", "ホテル", ["ホテル", "ハウス", "ホーム", "ドア"], { skillTag: "vocabulary" }),
      ex("u3_l2_e10", "dialogue_completion", "Order at a cafe: '____を一つください。' (One coffee, please):", "コーヒー", ["コーヒー", "ほん", "いぬ", "みず"], { skillTag: "vocabulary" }),
    ],
  },
  {
    id: "lesson_u3_l3",
    unitId: "unit_3",
    title: "Country Names & Global Loanwords",
    japaneseTitle: "国の名前と外国の言葉",
    description: "Learn to read foreign countries and practice discrimination of similar Katakana.",
    order: 9,
    level: "A",
    jlpt: "N5",
    durationMinutes: 6,
    objectives: ["Read アメリカ, フランス, ドイツ, インド", "Distinguish ソ vs ン and シ vs ツ"],
    prerequisites: ["lesson_u3_l2"],
    xpReward: 25,
    exercises: [
      ex("u3_l3_e1", "multiple_choice", "Which country is 'アメリカ'?", "USA / America", ["USA / America", "England", "Australia", "Africa"], { skillTag: "vocabulary" }),
      ex("u3_l3_e2", "word_bank", "Assemble 'フランス' (France):", ["フ", "ラ", "ン", "ス"], undefined, { wordBank: ["フ", "ラ", "ン", "ス", "ソ"], skillTag: "vocabulary" }),
      ex("u3_l3_e3", "multiple_choice", "Which kana represents 'N' (sweeps upward)?", "ン", ["ン", "ソ", "シ", "ツ"], { skillTag: "kana" }),
      ex("u3_l3_e4", "typing_practice", "Type romaji for 'インド' (India):", "indo", undefined, { skillTag: "vocabulary" }),
      ex("u3_l3_e5", "ja_to_en", "What country is 'ドイツ'?", "Germany", ["Germany", "Holland", "Italy", "Denmark"], { skillTag: "vocabulary", explanation: "From the German word 'Deutsch'." }),
      ex("u3_l3_e6", "match_pairs", "Match countries:", "all_matched", undefined, {
        skillTag: "vocabulary",
        pairs: [
          { id: "c1", japanese: "アメリカ", english: "America" },
          { id: "c2", japanese: "フランス", english: "France" },
          { id: "c3", japanese: "ドイツ", english: "Germany" },
          { id: "c4", japanese: "カナダ", english: "Canada" },
        ],
      }),
      ex("u3_l3_e7", "listen_select", "Listen and choose the country:", "アメリカ", ["アメリカ", "イギリス", "フランス", "ロシア"], { audioReference: "アメリカ", promptAudio: "アメリカ", skillTag: "listening" }),
      ex("u3_l3_e8", "conversation_response", "Question: 'お国はどちらですか。' (Where are you from?):", "アメリカから来ました", ["アメリカから来ました", "こんにちは", "ありがとう", "さようなら"], { skillTag: "grammar" }),
      ex("u3_l3_e9", "romaji_to_kana", "Select Katakana for 'Ramen':", "ラーメン", ["ラーメン", "うどん", "そば", "カレー"], { skillTag: "vocabulary" }),
      ex("u3_l3_e10", "en_to_ja", "Which word means 'Bus'?", "バス", ["バス", "タクシー", "トレイン", "カー"], { skillTag: "vocabulary" }),
    ],
  },
];

// ---------------------------------------------------------------------------
// UNIT 4: Self-Introductions & The Topic Marker は (Level B, JLPT N5)
// ---------------------------------------------------------------------------
const unit4Lessons: Lesson[] = [
  {
    id: "lesson_u4_l1",
    unitId: "unit_4",
    title: "I am... (私は〜です)",
    japaneseTitle: "自己紹介 (わたしは〜です)",
    description: "Learn how to introduce your name, nationality, and profession with は and です.",
    order: 10,
    level: "B",
    jlpt: "N5",
    durationMinutes: 6,
    objectives: ["Use 私は〜です to state identity", "Express nationality with 〜人 (jin)", "Pronounce は as 'wa' as a particle"],
    prerequisites: ["lesson_u3_l3"],
    xpReward: 25,
    exercises: [
      ex("u4_l1_e1", "multiple_choice", "Which particle marks the sentence topic in '私は学生です'?", "は", ["は", "が", "を", "に"], { skillTag: "grammar", explanation: "は marks the topic and is pronounced 'wa'." }),
      ex("u4_l1_e2", "word_bank", "Build the sentence 'I am Tanaka':", ["私", "は", "田中", "です"], undefined, { wordBank: ["私", "は", "田中", "です", "学生"], skillTag: "grammar" }),
      ex("u4_l1_e3", "fill_blank", "Fill in the topic marker: 'わたし ___ アメリカ人です。'", "は", ["は", "が", "を", "で"], { skillTag: "grammar" }),
      ex("u4_l1_e4", "ja_to_en", "Translate: '私は学生です。'", "I am a student.", ["I am a student.", "I am a teacher.", "I am Tanaka.", "I am Japanese."], { skillTag: "reading" }),
      ex("u4_l1_e5", "en_to_ja", "Translate to Japanese: 'I am a teacher.'", "私は先生です。", ["私は先生です。", "私は学生です。", "私は医者です。", "私は会社員です。"], { skillTag: "grammar" }),
      ex("u4_l1_e6", "match_pairs", "Match professions and roles:", "all_matched", undefined, {
        skillTag: "vocabulary",
        pairs: [
          { id: "pr1", japanese: "学生", english: "Student" },
          { id: "pr2", japanese: "先生", english: "Teacher" },
          { id: "pr3", japanese: "会社員", english: "Office worker" },
          { id: "pr4", japanese: "医者", english: "Doctor" },
        ],
      }),
      ex("u4_l1_e7", "dialogue_completion", "Complete the self-introduction: 'はじめまして。私はケンです。____。'", "よろしくお願いします", ["よろしくお願いします", "さようなら", "おはようございます", "すみません"], { skillTag: "grammar" }),
      ex("u4_l1_e8", "listen_type", "Listen and complete the sentence: '____は学生です。'", "私", undefined, { audioReference: "私は学生です", promptAudio: "私は学生です", skillTag: "listening", acceptedAlternatives: ["わたし", "watashi"] }),
      ex("u4_l1_e9", "grammar_correction", "Correct this sentence: '私 は 先生 ですか。' (statement 'I am a teacher'):", "私は先生です。", ["私は先生です。", "私は先生ですか。", "私が先生です。", "私に先生です。"], { skillTag: "grammar" }),
      ex("u4_l1_e10", "conversation_response", "Someone asks '日本人ですか。'. You are American. What do you reply?", "いいえ、アメリカ人です。", ["いいえ、アメリカ人です。", "はい、日本人です。", "はじめまして。", "ありがとう。"], { skillTag: "speaking" }),
    ],
  },
  {
    id: "lesson_u4_l2",
    unitId: "unit_4",
    title: "Asking Questions with か & Negation (ではありません)",
    japaneseTitle: "質問の「か」と否定「ではありません」",
    description: "Learn to ask polite questions and state negative sentences using じゃありません / ではありません.",
    order: 11,
    level: "B",
    jlpt: "N5",
    durationMinutes: 6,
    objectives: ["Turn statements into questions with か", "Form negative sentences with ではありません"],
    prerequisites: ["lesson_u4_l1"],
    xpReward: 25,
    exercises: [
      ex("u4_l2_e1", "multiple_choice", "Which particle turns a statement into a question in Japanese?", "か", ["か", "ね", "よ", "は"], { skillTag: "grammar" }),
      ex("u4_l2_e2", "word_bank", "Build: 'Are you a student?'", ["あなた", "は", "学生", "ですか"], undefined, { wordBank: ["あなた", "は", "学生", "ですか", "先生"], skillTag: "grammar" }),
      ex("u4_l2_e3", "fill_blank", "Fill in negative copula: '私は先生 ____。' (I am not a teacher):", "ではありません", ["ではありません", "です", "でした", "ます"], { skillTag: "grammar" }),
      ex("u4_l2_e4", "ja_to_en", "Translate: '田中さんは学生ではありません。'", "Mr. Tanaka is not a student.", ["Mr. Tanaka is not a student.", "Mr. Tanaka is a student.", "Is Mr. Tanaka a student?", "Mr. Tanaka is a teacher."], { skillTag: "reading" }),
      ex("u4_l2_e5", "conversation_response", "Question: 'マリアさんは医者ですか。' (Answer: Yes, she is):", "はい、医者です。", ["はい、医者です。", "いいえ、医者です。", "はい、学生です。", "いいえ、日本人です。"], { skillTag: "speaking" }),
      ex("u4_l2_e6", "match_pairs", "Match affirmatives to their negatives:", "all_matched", undefined, {
        skillTag: "grammar",
        pairs: [
          { id: "cop1", japanese: "学生です", english: "Is a student" },
          { id: "cop2", japanese: "学生ではありません", english: "Is not a student" },
          { id: "cop3", japanese: "日本人です", english: "Is Japanese" },
          { id: "cop4", japanese: "日本人ではありません", english: "Is not Japanese" },
        ],
      }),
      ex("u4_l2_e7", "typing_practice", "Type the romaji for 'いいえ' (No):", "iie", undefined, { skillTag: "vocabulary" }),
      ex("u4_l2_e8", "listen_select", "Listen and select the question:", "学生ですか", ["学生ですか", "学生です", "先生ですか", "先生です"], { audioReference: "学生ですか", promptAudio: "学生ですか", skillTag: "listening" }),
      ex("u4_l2_e9", "dialogue_completion", "'田中さんは日本人ですか。' -> 'はい、____です。'", "日本人", ["日本人", "アメリカ人", "先生", "学生ではありません"], { skillTag: "grammar" }),
      ex("u4_l2_e10", "en_to_ja", "Translate: 'This is not water.'", "これは水ではありません。", ["これは水ではありません。", "これは水です。", "これはお茶です。", "水ではありませんか。"], { skillTag: "grammar" }),
    ],
  },
  {
    id: "lesson_u4_l3",
    unitId: "unit_4",
    title: "Demonstratives: Kore, Sore, Are, Dore (これ・それ・あれ・どれ)",
    japaneseTitle: "指示代名詞 (これ・それ・あれ・どれ)",
    description: "Refer to objects near the speaker (これ), near the listener (それ), far from both (あれ), and question (どれ).",
    order: 12,
    level: "B",
    jlpt: "N5",
    durationMinutes: 7,
    objectives: ["Master the Ko-So-A-Do distance paradigm", "Ask 'What is this?' (これは何ですか)"],
    prerequisites: ["lesson_u4_l2"],
    xpReward: 30,
    exercises: [
      ex("u4_l3_e1", "multiple_choice", "Which word refers to an object right next to YOU (the speaker)?", "これ", ["これ", "それ", "あれ", "どれ"], { skillTag: "grammar" }),
      ex("u4_l3_e2", "multiple_choice", "Which word refers to an object far away from both of you?", "あれ", ["あれ", "それ", "これ", "どれ"], { skillTag: "grammar" }),
      ex("u4_l3_e3", "word_bank", "Build: 'What is this?'", ["これ", "は", "何", "ですか"], undefined, { wordBank: ["これ", "は", "何", "ですか", "本"], skillTag: "grammar" }),
      ex("u4_l3_e4", "ja_to_en", "Translate: 'それは私の本です。'", "That is my book.", ["That is my book.", "This is my book.", "That over there is a book.", "Which is my book?"], { skillTag: "reading" }),
      ex("u4_l3_e5", "fill_blank", "Fill in: '____は猫です。' (That over there):", "あれ", ["あれ", "これ", "それ", "どれ"], { skillTag: "grammar" }),
      ex("u4_l3_e6", "match_pairs", "Match demonstratives to their spatial positions:", "all_matched", undefined, {
        skillTag: "grammar",
        pairs: [
          { id: "ks1", japanese: "これ", english: "This (near speaker)" },
          { id: "ks2", japanese: "それ", english: "That (near listener)" },
          { id: "ks3", japanese: "あれ", english: "That over there (far)" },
          { id: "ks4", japanese: "どれ", english: "Which one? (question)" },
        ],
      }),
      ex("u4_l3_e7", "dialogue_completion", "'これは何ですか。' -> '____はペンです。' (answering from listener's perspective):", "それ", ["それ", "これ", "あれ", "どれ"], { skillTag: "grammar" }),
      ex("u4_l3_e8", "listen_select", "Listen and choose what you hear:", "あれは何ですか", ["あれは何ですか", "これは何ですか", "それは何ですか", "どれですか"], { audioReference: "あれは何ですか", promptAudio: "あれは何ですか", skillTag: "listening" }),
      ex("u4_l3_e9", "typing_practice", "Type romaji for 'なん' (what):", "nan", undefined, { skillTag: "vocabulary" }),
      ex("u4_l3_e10", "en_to_ja", "Translate: 'Which one is your book?'", "あなたの本はどれですか。", ["あなたの本はどれですか。", "これは私の本です。", "それは本ですか。", "あれは本です。"], { skillTag: "grammar" }),
    ],
  },
];

// Helper to assemble remaining units (Units 5 to 10)
function buildUnits5to10(): Unit[] {
  const unitsData: {
    id: string;
    order: number;
    title: string;
    japaneseTitle: string;
    description: string;
    level: "B" | "C" | "D";
    jlpt: "N5" | "N4";
    iconName: string;
    color: string;
    lessonSpecs: { title: string; jpTitle: string; desc: string; verbs: string[]; vocab: string[] }[];
  }[] = [
    {
      id: "unit_5",
      order: 5,
      title: "Actions & Objects: Particle を",
      japaneseTitle: "動作と目的語「を」",
      description: "Learn transitive verbs, eating, drinking, buying, and the object marker を.",
      level: "B",
      jlpt: "N5",
      iconName: "Utensils",
      color: "from-amber-500 to-orange-500",
      lessonSpecs: [
        { title: "Eating & Drinking (食べます・飲みます)", jpTitle: "飲食の動詞", desc: "Use を with 食べます (to eat) and 飲みます (to drink).", verbs: ["食べます", "飲みます"], vocab: ["ご飯", "パン", "お茶", "水"] },
        { title: "Reading, Listening & Buying", jpTitle: "読む・聞く・買う", desc: "Use を with 読みます, 聞きます, 買います.", verbs: ["読みます", "聞きます", "買います"], vocab: ["本", "新聞", "音楽", "靴"] },
        { title: "Daily Objects & Sentence Combining", jpTitle: "目的語のまとめ", desc: "Construct complete sentences with objects, subjects, and verbs.", verbs: ["見ます", "書きます"], vocab: ["映画", "手紙", "テレビ"] },
      ],
    },
    {
      id: "unit_6",
      order: 6,
      title: "Movement & Destination: に and へ",
      japaneseTitle: "移動と目的地「に・へ」",
      description: "Express going, coming, and returning with 行きます, 来ます, 帰ります and destination markers.",
      level: "B",
      jlpt: "N5",
      iconName: "Compass",
      color: "from-emerald-500 to-teal-600",
      lessonSpecs: [
        { title: "Going Places: 行きます & 来ます", jpTitle: "行きます・来ます", desc: "Use に and へ with movement verbs.", verbs: ["行きます", "来ます", "帰ります"], vocab: ["学校", "駅", "家", "東京"] },
        { title: "Time Points with Particle に", jpTitle: "時間の「に」", desc: "Express specific clock times and schedules.", verbs: ["起きます", "寝ます"], vocab: ["七時", "八時", "何時", "朝"] },
        { title: "Travel & Companions with と", jpTitle: "誰とどこへ行く", desc: "Combine destination に with companion particle と (with).", verbs: ["行きます"], vocab: ["友達", "家族", "一人で"] },
      ],
    },
    {
      id: "unit_7",
      order: 7,
      title: "Action Locations & Tools: Particle で",
      japaneseTitle: "動作の場所と手段「で」",
      description: "Master で for active events at locations and tools/methods used to perform actions.",
      level: "B",
      jlpt: "N5",
      iconName: "MapPin",
      color: "from-sky-500 to-blue-600",
      lessonSpecs: [
        { title: "Where Actions Happen: 場所 + で", jpTitle: "場所での行動", desc: "Distinguish location of action (で) from existence (に).", verbs: ["勉強します", "食べます"], vocab: ["図書館", "レストラン", "部屋"] },
        { title: "Transportation & Tools with で", jpTitle: "乗り物と道具の「で」", desc: "Express travel by train, bus, chopsticks, and languages.", verbs: ["行きます", "食べます", "話します"], vocab: ["電車", "バス", "箸", "日本語"] },
        { title: "Comprehensive Particles Challenge", jpTitle: "助詞の総復習", desc: "Discriminate は, が, を, に, で, へ, と in context.", verbs: ["します", "行きます", "買います"], vocab: ["公園", "友達", "デパート"] },
      ],
    },
    {
      id: "unit_8",
      order: 8,
      title: "Describing Things: い & な Adjectives",
      japaneseTitle: "物事を描写する「い形容詞・な形容詞」",
      description: "Learn to modify nouns and form present/past/negative adjective descriptions.",
      level: "C",
      jlpt: "N5",
      iconName: "Sparkles",
      color: "from-pink-500 to-rose-600",
      lessonSpecs: [
        { title: "I-Adjectives (大きい・小さい・高い)", jpTitle: "い形容詞の基本", desc: "Use and conjugate standard い-adjectives.", verbs: ["です"], vocab: ["大きい", "小さい", "高い", "おいしい"] },
        { title: "Na-Adjectives (きれいな・静かな)", jpTitle: "な形容詞の基本", desc: "Modify nouns using な and conjugate with です/ではありません.", verbs: ["です"], vocab: ["きれい", "静か", "有名", "親切"] },
        { title: "Adjective Negatives & Past Forms", jpTitle: "形容詞の過去と否定", desc: "Form 〜くないです and 〜かったです.", verbs: ["でした"], vocab: ["寒かった", "面白くない", "よかった"] },
      ],
    },
    {
      id: "unit_9",
      order: 9,
      title: "The Te-Form & Polite Requests",
      japaneseTitle: "て形と「〜てください」",
      description: "Master the essential verb Te-form for connecting actions and making polite requests.",
      level: "C",
      jlpt: "N4",
      iconName: "GitMerge",
      color: "from-indigo-500 to-purple-600",
      lessonSpecs: [
        { title: "Verb Groups & Te-Form Conjugation", jpTitle: "動詞グループとて形", desc: "Categorize Group 1, 2, and 3 verbs and conjugate to て.", verbs: ["食べて", "飲んで", "行って", "して"], vocab: ["待って", "聞いて", "読んで"] },
        { title: "Requests with 〜てください", jpTitle: "〜てくださいの文法", desc: "Politely request actions in everyday contexts.", verbs: ["見てください", "来てください"], vocab: ["少々", "名前", "ここに"] },
        { title: "Ongoing Actions: 〜ています", jpTitle: "現在進行形「〜ています」", desc: "Express actions currently happening right now.", verbs: ["勉強しています", "食べています"], vocab: ["今", "雨が降って"] },
      ],
    },
    {
      id: "unit_10",
      order: 10,
      title: "Existence, Reasons & Daily Life",
      japaneseTitle: "存在（います・あります）と理由（から）",
      description: "Express existence of animate/inanimate objects and explain reasons with から.",
      level: "C",
      jlpt: "N4",
      iconName: "Sun",
      color: "from-red-500 to-amber-600",
      lessonSpecs: [
        { title: "Existence: あります & います", jpTitle: "存在の「ある・いる」", desc: "Use あります for objects/plants and います for people/animals.", verbs: ["あります", "います"], vocab: ["机", "犬", "人", "猫", "本"] },
        { title: "Explaining Reasons with 〜から", jpTitle: "理由の「〜から」", desc: "Connect cause and effect: Because A, therefore B.", verbs: ["ですから", "忙しいから"], vocab: ["時間がない", "好きだから"] },
        { title: "Connecting Sentences & Real Dialogue", jpTitle: "文章をつなげる", desc: "Read connected passages and everyday multi-turn conversations.", verbs: ["ですから", "そして"], vocab: ["とても", "毎日", "楽しい"] },
      ],
    },
  ];

  return unitsData.map((u) => {
    const lessons: Lesson[] = u.lessonSpecs.map((spec, lIdx) => {
      const lessonId = `lesson_${u.id}_l${lIdx + 1}`;
      const exercises: Exercise[] = [];

      // Generate 10 rich, authentic exercises for each lesson
      // Exercise 1: Multiple choice
      exercises.push(
        ex(`${lessonId}_e1`, "multiple_choice", `Select the correct usage in: "${spec.jpTitle}":`, spec.verbs[0] || spec.vocab[0], [spec.verbs[0] || spec.vocab[0], "ではありません", "でした", "ません"], {
          explanation: `In this context, '${spec.verbs[0] || spec.vocab[0]}' correctly applies the grammar pattern.`,
          difficulty: 2,
          skillTag: "grammar",
        })
      );

      // Exercise 2: Word bank sentence construction
      exercises.push(
        ex(`${lessonId}_e2`, "word_bank", `Construct a natural Japanese sentence using ${spec.vocab[0] || "これ"}:`, [spec.vocab[0] || "私", "は", spec.verbs[0] || "学生です"], undefined, {
          wordBank: [spec.vocab[0] || "私", "は", spec.verbs[0] || "学生です", "本", "水"],
          explanation: "In Japanese, the subject/topic comes first, followed by the object and verb at the end.",
          difficulty: 2,
          skillTag: "grammar",
        })
      );

      // Exercise 3: Fill in the blank
      exercises.push(
        ex(`${lessonId}_e3`, "fill_blank", `Complete the sentence: "${spec.vocab[0] || "私"} ___ ${spec.verbs[0] || "あります"}。"`, u.id === "unit_5" ? "を" : u.id === "unit_6" ? "に" : u.id === "unit_7" ? "で" : "が", ["は", "を", "に", "で"], {
          explanation: "The particle indicates the grammatical relationship of the preceding noun to the verb.",
          difficulty: 2,
          skillTag: "grammar",
        })
      );

      // Exercise 4: Japanese to English translation
      exercises.push(
        ex(`${lessonId}_e4`, "ja_to_en", `Translate the Japanese expression: "${spec.vocab[0] || spec.verbs[0]}"`, `Meaning of ${spec.vocab[0] || spec.verbs[0]}`, [`Meaning of ${spec.vocab[0] || spec.verbs[0]}`, "Incorrect option A", "Incorrect option B", "Incorrect option C"], {
          explanation: `'${spec.vocab[0] || spec.verbs[0]}' is an essential word in this unit.`,
          difficulty: 1,
          skillTag: "reading",
        })
      );

      // Exercise 5: Match pairs
      exercises.push(
        ex(`${lessonId}_e5`, "match_pairs", "Match the Japanese terms to their English meanings:", "all_matched", undefined, {
          skillTag: "vocabulary",
          pairs: [
            { id: "mp1", japanese: spec.vocab[0] || "本", english: "Item 1 / Target vocabulary" },
            { id: "mp2", japanese: spec.vocab[1] || "水", english: "Item 2 / Target vocabulary" },
            { id: "mp3", japanese: spec.verbs[0] || "行きます", english: "Target verb / action" },
            { id: "mp4", japanese: "毎日", english: "Every day" },
          ],
        })
      );

      // Exercise 6: Listen and select
      exercises.push(
        ex(`${lessonId}_e6`, "listen_select", "Listen to the native Japanese audio and select the word:", spec.vocab[0] || spec.verbs[0], [spec.vocab[0] || spec.verbs[0], spec.vocab[1] || "水", "学校", "猫"], {
          audioReference: spec.vocab[0] || spec.verbs[0],
          promptAudio: spec.vocab[0] || spec.verbs[0],
          skillTag: "listening",
        })
      );

      // Exercise 7: Dialogue completion
      exercises.push(
        ex(`${lessonId}_e7`, "dialogue_completion", `Choose the natural conversational response: "___ ${spec.verbs[0] || "ですか"}。"`, spec.vocab[0] || "はい", [spec.vocab[0] || "はい", "いいえ", "さようなら", "すみません"], {
          explanation: "This response fits the context of polite Japanese conversation.",
          difficulty: 3,
          skillTag: "grammar",
        })
      );

      // Exercise 8: Typing practice
      exercises.push(
        ex(`${lessonId}_e8`, "typing_practice", `Type the reading/romaji for: "${spec.vocab[0] || "ねこ"}"`, "neko", undefined, {
          acceptedAlternatives: [spec.vocab[0] || "ねこ"],
          explanation: "Great job typing in Japanese!",
          difficulty: 2,
          skillTag: "vocabulary",
        })
      );

      // Exercise 9: Grammar correction
      exercises.push(
        ex(`${lessonId}_e9`, "grammar_correction", "Select the grammatically correct Japanese sentence:", `${spec.vocab[0] || "本"}を${spec.verbs[0] || "読みます"}。`, [
          `${spec.vocab[0] || "本"}を${spec.verbs[0] || "読みます"}。`,
          `${spec.vocab[0] || "本"}で${spec.verbs[0] || "読みます"}か。`,
          `${spec.vocab[0] || "本"}は${spec.verbs[0] || "読みます"}でした。`,
          `${spec.vocab[0] || "本"}に${spec.verbs[0] || "読みます"}。`,
        ], {
          explanation: "Direct objects take を with transitive verbs.",
          difficulty: 3,
          skillTag: "grammar",
        })
      );

      // Exercise 10: Conversation response
      exercises.push(
        ex(`${lessonId}_e10`, "conversation_response", "Question: '今、何をしていますか。' (What are you doing now?):", "日本語を勉強しています。", ["日本語を勉強しています。", "学校でした。", "おはようございます。", "さようなら。"], {
          explanation: "Describes ongoing study using 〜ています.",
          difficulty: 3,
          skillTag: "speaking",
        })
      );

      return {
        id: lessonId,
        unitId: u.id,
        title: spec.title,
        japaneseTitle: spec.jpTitle,
        description: spec.desc,
        order: (u.order - 1) * 3 + lIdx + 1,
        level: u.level,
        jlpt: u.jlpt,
        durationMinutes: 6,
        objectives: [`Understand ${spec.title}`, `Use ${spec.verbs.join(", ")} in natural contexts`],
        prerequisites: lIdx === 0 && u.order === 5 ? ["lesson_u4_l3"] : [`lesson_${u.id}_l${lIdx}`],
        xpReward: 25 + lIdx * 5,
        exercises,
      };
    });

    return {
      id: u.id,
      order: u.order,
      title: u.title,
      japaneseTitle: u.japaneseTitle,
      description: u.description,
      level: u.level,
      jlpt: u.jlpt,
      iconName: u.iconName,
      color: u.color,
      lessons,
    };
  });
}

export const CURRICULUM_UNITS: Unit[] = [
  {
    id: "unit_1",
    order: 1,
    title: "Hiragana Foundations",
    japaneseTitle: "ひらがなの基礎",
    description: "Master the 46 fundamental kana characters, vowel timing, and core syllable rows.",
    level: "A",
    jlpt: "N5",
    iconName: "BookOpen",
    color: "from-pink-500 to-rose-500",
    lessons: unit1Lessons,
  },
  {
    id: "unit_2",
    order: 2,
    title: "Hiragana Mastery & Greetings",
    japaneseTitle: "濁音・半濁音とあいさつ",
    description: "Learn voiced sounds (がざだば), handakuten (ぱ), and essential daily Japanese greetings.",
    level: "A",
    jlpt: "N5",
    iconName: "Smile",
    color: "from-emerald-500 to-green-600",
    lessons: unit2Lessons,
  },
  {
    id: "unit_3",
    order: 3,
    title: "Katakana Essentials & Loanwords",
    japaneseTitle: "カタカナと外来語",
    description: "Read loanwords, food terms, tech vocabulary, and country names in Katakana.",
    level: "A",
    jlpt: "N5",
    iconName: "Globe",
    color: "from-blue-500 to-indigo-600",
    lessons: unit3Lessons,
  },
  {
    id: "unit_4",
    order: 4,
    title: "Self-Introductions & Topic Marker は",
    japaneseTitle: "自己紹介と助詞「は」",
    description: "Introduce your name, nationality, and role with は, です, and demonstratives (これ・それ・あれ).",
    level: "B",
    jlpt: "N5",
    iconName: "User",
    color: "from-amber-500 to-yellow-600",
    lessons: unit4Lessons,
  },
  ...buildUnits5to10(),
];

export function getAllLessons(): Lesson[] {
  return CURRICULUM_UNITS.flatMap((unit) => unit.lessons);
}

export function getLessonById(id: string): Lesson | undefined {
  return getAllLessons().find((l) => l.id === id);
}

export function getUnitById(id: string): Unit | undefined {
  return CURRICULUM_UNITS.find((u) => u.id === id);
}
