import { Story } from "@/types";

export const STORIES_DATABASE: Story[] = [
  {
    id: "story_cafe_order",
    title: "At the Shibuya Cat Café",
    japaneseTitle: "渋谷の猫カフェで",
    level: "N5",
    summary:
      "Kenji visits a cozy cat café in Shibuya and practices ordering a warm matcha latte and greeting the staff.",
    culturalNote:
      "In Japanese cafés, staff will often ask '店内でお召し上がりですか？' (Are you having it here?) or 'お持ち帰りですか？' (To go?). Also, it is common to say 'ごちそうさまでした' when finishing a meal.",
    vocabularyHighlights: [
      { word: "いらっしゃいませ", reading: "irasshaimase", meaning: "Welcome (to our shop)" },
      { word: "注文", reading: "ちゅうもん (chuumon)", meaning: "Order" },
      { word: "お願いします", reading: "おねがいします (onegaishimasu)", meaning: "Please (request)" },
      { word: "かわいい", reading: "kawaii", meaning: "Cute" },
    ],
    dialogue: [
      {
        speaker: "Staff (店員)",
        avatar: "🐱",
        japanese: "いらっしゃいませ！何名様ですか。",
        furigana: "いらっしゃいませ！なんめいさま[何名様]ですか。",
        romaji: "Irasshaimase! Nan-mei-sama desu ka.",
        english: "Welcome! How many guests?",
      },
      {
        speaker: "Kenji (健二)",
        avatar: "👦",
        japanese: "一人です。",
        furigana: "ひとり[一人]です。",
        romaji: "Hitori desu.",
        english: "Just one person.",
      },
      {
        speaker: "Staff (店員)",
        avatar: "🐱",
        japanese: "こちらのお席へどうぞ。ご注文はお決まりですか。",
        furigana: "こちらの おせき[席]へ どうぞ。ごちゅうもん[注文]は おき[決]まりですか。",
        romaji: "Kochira no oseki e douzo. Gochuumon wa okimari desu ka.",
        english: "Please take this seat. Have you decided on your order?",
      },
      {
        speaker: "Kenji (健二)",
        avatar: "👦",
        japanese: "抹茶ラテを一つお願いします。",
        furigana: "まっちゃ[抹茶]ラテを ひとつ[一つ] おねが[願]いします。",
        romaji: "Matcha rate o hitotsu onegaishimasu.",
        english: "One matcha latte, please.",
      },
      {
        speaker: "Staff (店員)",
        avatar: "🐱",
        japanese: "かしこまりました。あちらに白い猫がいますよ。",
        furigana: "かしこまりました。あちらに しろ[白]い ねこ[猫]が いますよ。",
        romaji: "Kashikomarimashita. Achira ni shiroi neko ga imasu yo.",
        english: "Certainly. There is a white cat over there!",
      },
      {
        speaker: "Kenji (健二)",
        avatar: "👦",
        japanese: "わあ、とてもかわいいですね！",
        furigana: "わあ、とても かわいいですね！",
        romaji: "Waa, totemo kawaii desu ne!",
        english: "Wow, it's so cute!",
      },
    ],
    questions: [
      {
        id: "q_cafe_1",
        question: "How many people was Kenji with?",
        options: ["He was alone (一人)", "With two friends", "With his family"],
        correctAnswer: 0,
        explanation: "Kenji responded '一人です' (Hitori desu) which means 'Just one person / alone'.",
      },
      {
        id: "q_cafe_2",
        question: "What beverage did Kenji order?",
        options: ["Hot black coffee", "Matcha latte (抹茶ラテ)", "Green tea"],
        correctAnswer: 1,
        explanation: "Kenji said '抹茶ラテを一つお願いします' (One matcha latte, please).",
      },
    ],
  },
  {
    id: "story_train_station",
    title: "Asking Directions at the Station",
    japaneseTitle: "駅で道を尋ねる",
    level: "N5",
    summary:
      "A learner asks a station attendant how to reach the Yamanote line train platform in Shinjuku Station.",
    culturalNote:
      "Shinjuku is the world's busiest train station. Attendants are stationed near ticket gates (改札口) and are very helpful when you politely say 'すみません' (Excuse me).",
    vocabularyHighlights: [
      { word: "すみません", reading: "sumimasen", meaning: "Excuse me / I'm sorry" },
      { word: "駅", reading: "えき (eki)", meaning: "Train station" },
      { word: "どこ", reading: "doko", meaning: "Where" },
      { word: "山手線", reading: "やまのてせん (yamanotesen)", meaning: "Yamanote Line" },
    ],
    dialogue: [
      {
        speaker: "Traveler (旅行者)",
        avatar: "🎒",
        japanese: "すみません、山手線のホームはどこですか。",
        furigana: "すみません、やまのてせん[山手線]の ホームは どこですか。",
        romaji: "Sumimasen, Yamanote-sen no hoomu wa doko desu ka.",
        english: "Excuse me, where is the platform for the Yamanote Line?",
      },
      {
        speaker: "Attendant (駅員)",
        avatar: "👮",
        japanese: "山手線ですね。階段を上がって、十四番線です。",
        furigana: "やまのてせん[山手線]ですね。かいだん[階段]を あ[上]がって、じゅうよんばんせん[十四番線]です。",
        romaji: "Yamanote-sen desu ne. Kaidan o agatte, juuyon-bansen desu.",
        english: "The Yamanote Line, right? Go up the stairs, it's platform 14.",
      },
      {
        speaker: "Traveler (旅行者)",
        avatar: "🎒",
        japanese: "階段の上ですね。ありがとうございます！",
        furigana: "かいだん[階段]の うえ[上]ですね。ありがとうございます！",
        romaji: "Kaidan no ue desu ne. Arigatou gozaimasu!",
        english: "At the top of the stairs. Thank you very much!",
      },
    ],
    questions: [
      {
        id: "q_train_1",
        question: "Which train line was the traveler looking for?",
        options: ["Shinkansen", "Yamanote Line (山手線)", "Chuo Line"],
        correctAnswer: 1,
        explanation: "The traveler asked: '山手線のホームはどこですか' (Where is the Yamanote line platform?).",
      },
    ],
  },
];
