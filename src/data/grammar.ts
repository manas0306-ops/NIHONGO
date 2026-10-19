import { GrammarEntry } from "@/types";

export const GRAMMAR_DATABASE: GrammarEntry[] = [
  {
    id: "g_wa_topic",
    pattern: "A は B です (wa / desu)",
    title: "Topic Marker は & Copula です",
    level: "N5",
    meaning: "A is B (Speaking of A, it is B)",
    formation: "[Noun A] + は + [Noun B / Na-adj] + です",
    explanation:
      "The particle は (pronounced 'wa' when used as a particle) marks the topic of the sentence. です acts as a polite copula equivalent to 'to be' (is / am / are) in English.",
    register: "polite",
    commonMistakes:
      "Pronouncing は as 'ha' instead of 'wa'. Using が when you intend to introduce a broad conversational topic.",
    examples: [
      {
        japanese: "私は学生です。",
        furigana: "わたし[私]は がくせい[学生]です。",
        romaji: "Watashi wa gakusei desu.",
        english: "I am a student.",
        audioText: "わたしはがくせいです。",
      },
      {
        japanese: "これは猫です。",
        furigana: "これは ねこ[猫]です。",
        romaji: "Kore wa neko desu.",
        english: "This is a cat.",
        audioText: "これはねこです。",
      },
      {
        japanese: "田中さんは先生です。",
        furigana: "たなか[田中]さんは せんせい[先生]です。",
        romaji: "Tanaka-san wa sensei desu.",
        english: "Mr. Tanaka is a teacher.",
        audioText: "たなかさんはせんせいです。",
      },
    ],
    relatedGrammar: ["g_ka_question", "g_mo_also"],
  },
  {
    id: "g_ka_question",
    pattern: "〜ですか (desu ka)",
    title: "Question Particle か",
    level: "N5",
    meaning: "Is it ~? (Sentence question particle)",
    formation: "[Sentence] + か",
    explanation:
      "Adding か (ka) at the end of a sentence turns it into a question. Japanese does not require changing word order or adding a question mark in formal writing, though a rising intonation is used.",
    register: "polite",
    commonMistakes:
      "Inverting subject and verb like in English. In Japanese, simply add か at the end.",
    examples: [
      {
        japanese: "あなたは日本人ですか。",
        furigana: "あなたは にほんじん[日本人]ですか。",
        romaji: "Anata wa nihonjin desu ka.",
        english: "Are you Japanese?",
        audioText: "あなたはにほんじんですか。",
      },
      {
        japanese: "これは何ですか。",
        furigana: "これは なん[何]ですか。",
        romaji: "Kore wa nan desu ka.",
        english: "What is this?",
        audioText: "これはなんですか。",
      },
    ],
    relatedGrammar: ["g_wa_topic"],
  },
  {
    id: "g_wo_object",
    pattern: "〜を (o / wo)",
    title: "Direct Object Marker を",
    level: "N5",
    meaning: "Marks the direct object of a transitive action",
    formation: "[Noun] + を + [Transitive Verb]",
    explanation:
      "The particle を (written 'wo', pronounced 'o') marks the noun receiving the direct action of a transitive verb, such as eating food, drinking water, or reading a book.",
    register: "polite",
    commonMistakes:
      "Using を with intransitive verbs like 行く (to go) or 好き (liked - which takes が).",
    examples: [
      {
        japanese: "水を飲みます。",
        furigana: "みず[水]を の[飲]みます。",
        romaji: "Mizu o nomimasu.",
        english: "I drink water.",
        audioText: "みずをのみます。",
      },
      {
        japanese: "本を読みます。",
        furigana: "ほん[本]を よ[読]みます。",
        romaji: "Hon o yomimasu.",
        english: "I read a book.",
        audioText: "ほんをよみます。",
      },
      {
        japanese: "寿司を食べます。",
        furigana: "すし[寿司]を た[食]べます。",
        romaji: "Sushi o tabemasu.",
        english: "I eat sushi.",
        audioText: "すしをたべます。",
      },
    ],
    relatedGrammar: ["g_ni_direction", "g_de_means"],
  },
  {
    id: "g_ni_direction",
    pattern: "〜に / へ (ni / e)",
    title: "Direction & Destination Markers に & へ",
    level: "N5",
    meaning: "To / towards a place or point in time",
    formation: "[Place / Time] + に / へ + [Movement Verb (行く / 来る / 帰る)]",
    explanation:
      "に indicates a specific destination or arrival point, while へ (pronounced 'e') emphasizes the direction of motion towards a destination. に is also used for specific points in time (e.g. 7時に = at 7 o'clock).",
    register: "polite",
    commonMistakes:
      "Using に for relative time words like 今日 (today) or 明日 (tomorrow). Those do not take に.",
    examples: [
      {
        japanese: "学校へ行きます。",
        furigana: "がっこう[学校]へ い[行]きます。",
        romaji: "Gakkou e ikimasu.",
        english: "I go to school.",
        audioText: "がっこうへいきます。",
      },
      {
        japanese: "東京に行きます。",
        furigana: "とうきょう[東京]に い[行]きます。",
        romaji: "Toukyou ni ikimasu.",
        english: "I go to Tokyo.",
        audioText: "とうきょうにいきます。",
      },
      {
        japanese: "七時に起きます。",
        furigana: "しちじ[七時]に お[起]きます。",
        romaji: "Shichiji ni okimasu.",
        english: "I wake up at seven o'clock.",
        audioText: "しちじにおきます。",
      },
    ],
    relatedGrammar: ["g_de_means"],
  },
  {
    id: "g_de_means",
    pattern: "〜で (de)",
    title: "Location of Action & Means Marker で",
    level: "N5",
    meaning: "At / in (location of action); by means of / with (tool)",
    formation: "[Place / Tool / Means] + で + [Action Verb]",
    explanation:
      "で marks where an active action takes place (unlike に which marks static existence with います/あります), or the tool/vehicle used to carry out an action (e.g. 電車で = by train).",
    register: "polite",
    commonMistakes:
      "Confusing で (location of active event) with に (location of static presence).",
    examples: [
      {
        japanese: "図書館で勉強します。",
        furigana: "としょかん[図書館]で べんきょう[勉強]します。",
        romaji: "Toshokan de benkyou shimasu.",
        english: "I study at the library.",
        audioText: "としょかんでべんきょうします。",
      },
      {
        japanese: "箸で食べます。",
        furigana: "はし[箸]で た[食]べます。",
        romaji: "Hashi de tabemasu.",
        english: "I eat with chopsticks.",
        audioText: "はしでたべます。",
      },
    ],
    relatedGrammar: ["g_wo_object", "g_ni_direction"],
  },
  {
    id: "g_te_form",
    pattern: "〜てください (te kudasai)",
    title: "Requests with てください",
    level: "N5",
    meaning: "Please do ~",
    formation: "[Verb te-form] + ください",
    explanation:
      "Connects the versatile verb te-form with ください to make polite requests or instructions.",
    register: "polite",
    commonMistakes:
      "Using with plain dictionary form instead of properly conjugated te-form.",
    examples: [
      {
        japanese: "聞いてください。",
        furigana: "き[聞]いてください。",
        romaji: "Kiite kudasai.",
        english: "Please listen.",
        audioText: "きいてください。",
      },
      {
        japanese: "日本語で言ってください。",
        furigana: "にほんご[日本語]で い[言]ってください。",
        romaji: "Nihongo de itte kudasai.",
        english: "Please say it in Japanese.",
        audioText: "にほんごでいってください。",
      },
    ],
  },
];
