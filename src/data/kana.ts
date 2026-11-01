import { KanaCharacter } from "@/types";

export const HIRAGANA_CHARACTERS: KanaCharacter[] = [
  // Vowels (a, i, u, e, o)
  { kana: "あ", romaji: "a", type: "hiragana", category: "gojuon", audioKey: "a", strokes: 3, mnemonic: "Looks like an Apple with a stem." },
  { kana: "い", romaji: "i", type: "hiragana", category: "gojuon", audioKey: "i", strokes: 2, mnemonic: "Two Eels swimming side by side." },
  { kana: "う", romaji: "u", type: "hiragana", category: "gojuon", audioKey: "u", strokes: 2, mnemonic: "A heavy stone falling on someone's back: 'Oof!'" },
  { kana: "え", romaji: "e", type: "hiragana", category: "gojuon", audioKey: "e", strokes: 2, mnemonic: "An Energetic ninja running." },
  { kana: "お", romaji: "o", type: "hiragana", category: "gojuon", audioKey: "o", strokes: 3, mnemonic: "A golfer hitting a golf ball 'On' the green." },

  // K-row
  { kana: "か", romaji: "ka", type: "hiragana", category: "gojuon", audioKey: "ka", strokes: 3, mnemonic: "A Katana sword slicing through bread." },
  { kana: "き", romaji: "ki", type: "hiragana", category: "gojuon", audioKey: "ki", strokes: 4, mnemonic: "Looks like an antique Key." },
  { kana: "く", romaji: "ku", type: "hiragana", category: "gojuon", audioKey: "ku", strokes: 1, mnemonic: "The beak of a Cuckoo bird." },
  { kana: "け", romaji: "ke", type: "hiragana", category: "gojuon", audioKey: "ke", strokes: 3, mnemonic: "A Keg of sake." },
  { kana: "こ", romaji: "ko", type: "hiragana", category: "gojuon", audioKey: "ko", strokes: 2, mnemonic: "Two Koi fish swimming around each other." },

  // S-row
  { kana: "さ", romaji: "sa", type: "hiragana", category: "gojuon", audioKey: "sa", strokes: 3, mnemonic: "A Samurai sword ready to strike." },
  { kana: "し", romaji: "shi", type: "hiragana", category: "gojuon", audioKey: "shi", strokes: 1, mnemonic: "A fishing hook caught in the sea: 'She fishes.'" },
  { kana: "す", romaji: "su", type: "hiragana", category: "gojuon", audioKey: "su", strokes: 2, mnemonic: "Slurping Soup with a curly spoon." },
  { kana: "せ", romaji: "se", type: "hiragana", category: "gojuon", audioKey: "se", strokes: 3, mnemonic: "Sitting on a bench Saying hello." },
  { kana: "そ", romaji: "so", type: "hiragana", category: "gojuon", audioKey: "so", strokes: 1, mnemonic: "Sewing a zig-zag stitch with thread." },

  // T-row
  { kana: "た", romaji: "ta", type: "hiragana", category: "gojuon", audioKey: "ta", strokes: 4, mnemonic: "Spells out the letters 't' and 'a'." },
  { kana: "ち", romaji: "chi", type: "hiragana", category: "gojuon", audioKey: "chi", strokes: 2, mnemonic: "A Cheerleader jumping with excitement." },
  { kana: "つ", romaji: "tsu", type: "hiragana", category: "gojuon", audioKey: "tsu", strokes: 1, mnemonic: "A giant Tsunami wave curling." },
  { kana: "て", romaji: "te", type: "hiragana", category: "gojuon", audioKey: "te", strokes: 1, mnemonic: "A dog's wagging Tail." },
  { kana: "と", romaji: "to", type: "hiragana", category: "gojuon", audioKey: "to", strokes: 2, mnemonic: "A splinter stuck in a big Toe." },

  // N-row
  { kana: "な", romaji: "na", type: "hiragana", category: "gojuon", audioKey: "na", strokes: 4, mnemonic: "A Nun praying before a cross." },
  { kana: "に", romaji: "ni", type: "hiragana", category: "gojuon", audioKey: "ni", strokes: 3, mnemonic: "A Needle and two threads." },
  { kana: "ぬ", romaji: "nu", type: "hiragana", category: "gojuon", audioKey: "nu", strokes: 2, mnemonic: "Chopsticks pulling up curly Noodles." },
  { kana: "ね", romaji: "ne", type: "hiragana", category: "gojuon", audioKey: "ne", strokes: 2, mnemonic: "A Neko (cat) with a curled tail." },
  { kana: "の", romaji: "no", type: "hiragana", category: "gojuon", audioKey: "no", strokes: 1, mnemonic: "A universal 'No' smoking circular sign." },

  // H-row
  { kana: "は", romaji: "ha", type: "hiragana", category: "gojuon", audioKey: "ha", strokes: 3, mnemonic: "The letter 'h' next to an 'a'." },
  { kana: "ひ", romaji: "hi", type: "hiragana", category: "gojuon", audioKey: "hi", strokes: 1, mnemonic: "Someone laughing with a huge smile: 'Hehe!'" },
  { kana: "ふ", romaji: "fu", type: "hiragana", category: "gojuon", audioKey: "fu", strokes: 4, mnemonic: "Mount Fuji with clouds around the peak." },
  { kana: "へ", romaji: "he", type: "hiragana", category: "gojuon", audioKey: "he", strokes: 1, mnemonic: "A flat path going up a green Hill." },
  { kana: "ほ", romaji: "ho", type: "hiragana", category: "gojuon", audioKey: "ho", strokes: 4, mnemonic: "A chimney on a roof with smoke: 'Hot!'" },

  // M-row
  { kana: "ま", romaji: "ma", type: "hiragana", category: "gojuon", audioKey: "ma", strokes: 3, mnemonic: "Calling your Mama with open arms." },
  { kana: "み", romaji: "mi", type: "hiragana", category: "gojuon", audioKey: "mi", strokes: 2, mnemonic: "Looks like musical notes: 'Do-Re-Mi'." },
  { kana: "む", romaji: "mu", type: "hiragana", category: "gojuon", audioKey: "mu", strokes: 3, mnemonic: "A cow saying 'Moo'." },
  { kana: "め", romaji: "me", type: "hiragana", category: "gojuon", audioKey: "me", strokes: 2, mnemonic: "Noodles with an eye in the center: 'Me (eye)'." },
  { kana: "も", romaji: "mo", type: "hiragana", category: "gojuon", audioKey: "mo", strokes: 3, mnemonic: "A fish hook catching More and more worms." },

  // Y-row
  { kana: "や", romaji: "ya", type: "hiragana", category: "gojuon", audioKey: "ya", strokes: 3, mnemonic: "A Yak with horns standing proud." },
  { kana: "ゆ", romaji: "yu", type: "hiragana", category: "gojuon", audioKey: "yu", strokes: 2, mnemonic: "A unique fish swimming in warm spring water." },
  { kana: "よ", romaji: "yo", type: "hiragana", category: "gojuon", audioKey: "yo", strokes: 2, mnemonic: "A Yo-yo suspended on a finger." },

  // R-row
  { kana: "ら", romaji: "ra", type: "hiragana", category: "gojuon", audioKey: "ra", strokes: 2, mnemonic: "A Rabbit sitting on its back legs." },
  { kana: "り", romaji: "ri", type: "hiragana", category: "gojuon", audioKey: "ri", strokes: 2, mnemonic: "Reeds swaying gently in a calm river." },
  { kana: "る", romaji: "ru", type: "hiragana", category: "gojuon", audioKey: "ru", strokes: 1, mnemonic: "A road that loops at the end." },
  { kana: "れ", romaji: "re", type: "hiragana", category: "gojuon", audioKey: "re", strokes: 2, mnemonic: "A person bending down to rest." },
  { kana: "ろ", romaji: "ro", type: "hiragana", category: "gojuon", audioKey: "ro", strokes: 1, mnemonic: "A road with no loop (robbed of its loop!)." },

  // W-row & N
  { kana: "わ", romaji: "wa", type: "hiragana", category: "gojuon", audioKey: "wa", strokes: 2, mnemonic: "A white swan gliding across water." },
  { kana: "を", romaji: "wo", type: "hiragana", category: "gojuon", audioKey: "wo", strokes: 3, mnemonic: "A person with arms outstretched saying 'Whoa!'." },
  { kana: "ん", romaji: "n", type: "hiragana", category: "gojuon", audioKey: "n", strokes: 1, mnemonic: "The lowercase cursive letter 'n'." },

  // Dakuten (G, Z, D, B)
  { kana: "が", romaji: "ga", type: "hiragana", category: "dakuten", audioKey: "ga", strokes: 5, mnemonic: "か with voice marks (tenten)." },
  { kana: "ぎ", romaji: "gi", type: "hiragana", category: "dakuten", audioKey: "gi", strokes: 6, mnemonic: "き with voice marks (tenten)." },
  { kana: "ぐ", romaji: "gu", type: "hiragana", category: "dakuten", audioKey: "gu", strokes: 3, mnemonic: "く with voice marks (tenten)." },
  { kana: "げ", romaji: "ge", type: "hiragana", category: "dakuten", audioKey: "ge", strokes: 5, mnemonic: "け with voice marks (tenten)." },
  { kana: "ご", romaji: "go", type: "hiragana", category: "dakuten", audioKey: "go", strokes: 4, mnemonic: "こ with voice marks (tenten)." },
  { kana: "ざ", romaji: "za", type: "hiragana", category: "dakuten", audioKey: "za", strokes: 5, mnemonic: "さ with voice marks (tenten)." },
  { kana: "じ", romaji: "ji", type: "hiragana", category: "dakuten", audioKey: "ji", strokes: 3, mnemonic: "し with voice marks (tenten)." },
  { kana: "ず", romaji: "zu", type: "hiragana", category: "dakuten", audioKey: "zu", strokes: 4, mnemonic: "す with voice marks (tenten)." },
  { kana: "ぜ", romaji: "ze", type: "hiragana", category: "dakuten", audioKey: "ze", strokes: 5, mnemonic: "せ with voice marks (tenten)." },
  { kana: "ぞ", romaji: "zo", type: "hiragana", category: "dakuten", audioKey: "zo", strokes: 3, mnemonic: "そ with voice marks (tenten)." },
  { kana: "だ", romaji: "da", type: "hiragana", category: "dakuten", audioKey: "da", strokes: 6, mnemonic: "た with voice marks (tenten)." },
  { kana: "ぢ", romaji: "ji", type: "hiragana", category: "dakuten", audioKey: "dji", strokes: 4, mnemonic: "ち with voice marks (tenten)." },
  { kana: "づ", romaji: "dzu", type: "hiragana", category: "dakuten", audioKey: "dzu", strokes: 3, mnemonic: "つ with voice marks (tenten)." },
  { kana: "で", romaji: "de", type: "hiragana", category: "dakuten", audioKey: "de", strokes: 3, mnemonic: "て with voice marks (tenten)." },
  { kana: "ど", romaji: "do", type: "hiragana", category: "dakuten", audioKey: "do", strokes: 4, mnemonic: "と with voice marks (tenten)." },
  { kana: "ば", romaji: "ba", type: "hiragana", category: "dakuten", audioKey: "ba", strokes: 5, mnemonic: "は with voice marks (tenten)." },
  { kana: "び", romaji: "bi", type: "hiragana", category: "dakuten", audioKey: "bi", strokes: 3, mnemonic: "ひ with voice marks (tenten)." },
  { kana: "ぶ", romaji: "bu", type: "hiragana", category: "dakuten", audioKey: "bu", strokes: 6, mnemonic: "ふ with voice marks (tenten)." },
  { kana: "べ", romaji: "be", type: "hiragana", category: "dakuten", audioKey: "be", strokes: 3, mnemonic: "へ with voice marks (tenten)." },
  { kana: "ぼ", romaji: "bo", type: "hiragana", category: "dakuten", audioKey: "bo", strokes: 6, mnemonic: "ほ with voice marks (tenten)." },

  // Handakuten (P)
  { kana: "ぱ", romaji: "pa", type: "hiragana", category: "handakuten", audioKey: "pa", strokes: 4, mnemonic: "は with little circle (maru)." },
  { kana: "ぴ", romaji: "pi", type: "hiragana", category: "handakuten", audioKey: "pi", strokes: 2, mnemonic: "ひ with little circle (maru)." },
  { kana: "ぷ", romaji: "pu", type: "hiragana", category: "handakuten", audioKey: "pu", strokes: 5, mnemonic: "ふ with little circle (maru)." },
  { kana: "ぺ", romaji: "pe", type: "hiragana", category: "handakuten", audioKey: "pe", strokes: 2, mnemonic: "へ with little circle (maru)." },
  { kana: "ぽ", romaji: "po", type: "hiragana", category: "handakuten", audioKey: "po", strokes: 5, mnemonic: "ほ with little circle (maru)." },

  // Yoon Combinations
  { kana: "きゃ", romaji: "kya", type: "hiragana", category: "yoon", audioKey: "kya", strokes: 7, mnemonic: "き + small や" },
  { kana: "きゅ", romaji: "kyu", type: "hiragana", category: "yoon", audioKey: "kyu", strokes: 6, mnemonic: "き + small ゆ" },
  { kana: "きょ", romaji: "kyo", type: "hiragana", category: "yoon", audioKey: "kyo", strokes: 6, mnemonic: "き + small よ" },
  { kana: "しゃ", romaji: "sha", type: "hiragana", category: "yoon", audioKey: "sha", strokes: 4, mnemonic: "し + small や" },
  { kana: "しゅ", romaji: "shu", type: "hiragana", category: "yoon", audioKey: "shu", strokes: 3, mnemonic: "し + small ゆ" },
  { kana: "しょ", romaji: "sho", type: "hiragana", category: "yoon", audioKey: "sho", strokes: 3, mnemonic: "し + small よ" },
  { kana: "ちゃ", romaji: "cha", type: "hiragana", category: "yoon", audioKey: "cha", strokes: 5, mnemonic: "ち + small や" },
  { kana: "ちゅ", romaji: "chu", type: "hiragana", category: "yoon", audioKey: "chu", strokes: 4, mnemonic: "ち + small ゆ" },
  { kana: "ちょ", romaji: "cho", type: "hiragana", category: "yoon", audioKey: "cho", strokes: 4, mnemonic: "ち + small よ" },
  { kana: "にゃ", romaji: "nya", type: "hiragana", category: "yoon", audioKey: "nya", strokes: 7, mnemonic: "に + small や (cat sound!)" },
  { kana: "りゅ", romaji: "ryu", type: "hiragana", category: "yoon", audioKey: "ryu", strokes: 4, mnemonic: "り + small ゆ (dragon!)" },
  { kana: "りょ", romaji: "ryo", type: "hiragana", category: "yoon", audioKey: "ryo", strokes: 4, mnemonic: "り + small よ" },
];

export const KATAKANA_CHARACTERS: KanaCharacter[] = [
  // Vowels
  { kana: "ア", romaji: "a", type: "katakana", category: "gojuon", audioKey: "a", strokes: 2, mnemonic: "An Axe with an angular edge." },
  { kana: "イ", romaji: "i", type: "katakana", category: "gojuon", audioKey: "i", strokes: 2, mnemonic: "An Easy chair standing upright." },
  { kana: "ウ", romaji: "u", type: "katakana", category: "gojuon", audioKey: "u", strokes: 3, mnemonic: "An Umbrella handle." },
  { kana: "エ", romaji: "e", type: "katakana", category: "gojuon", audioKey: "e", strokes: 3, mnemonic: "An Elevator door opening." },
  { kana: "オ", romaji: "o", type: "katakana", category: "gojuon", audioKey: "o", strokes: 3, mnemonic: "An Opera singer bowing." },

  // K-row
  { kana: "カ", romaji: "ka", type: "katakana", category: "gojuon", audioKey: "ka", strokes: 2, mnemonic: "Sharp angular Katana edge." },
  { kana: "キ", romaji: "ki", type: "katakana", category: "gojuon", audioKey: "ki", strokes: 3, mnemonic: "An antique Key with notches." },
  { kana: "ク", romaji: "ku", type: "katakana", category: "gojuon", audioKey: "ku", strokes: 2, mnemonic: "A Chef's Cooking knife." },
  { kana: "ケ", romaji: "ke", type: "katakana", category: "gojuon", audioKey: "ke", strokes: 3, mnemonic: "A Kettle with handle." },
  { kana: "コ", romaji: "ko", type: "katakana", category: "gojuon", audioKey: "ko", strokes: 2, mnemonic: "A Corner of a square box." },

  // S-row
  { kana: "サ", romaji: "sa", type: "katakana", category: "gojuon", audioKey: "sa", strokes: 3, mnemonic: "Three Sardines on a skewer." },
  { kana: "シ", romaji: "shi", type: "katakana", category: "gojuon", audioKey: "shi", strokes: 3, mnemonic: "She looking upward (strokes go up)." },
  { kana: "ス", romaji: "su", type: "katakana", category: "gojuon", audioKey: "su", strokes: 2, mnemonic: "A pair of Sunglasses." },
  { kana: "セ", romaji: "se", type: "katakana", category: "gojuon", audioKey: "se", strokes: 2, mnemonic: "Sitting on a bench." },
  { kana: "ソ", romaji: "so", type: "katakana", category: "gojuon", audioKey: "so", strokes: 2, mnemonic: "A needle sewing downwards." },

  // T-row
  { kana: "タ", romaji: "ta", type: "katakana", category: "gojuon", audioKey: "ta", strokes: 3, mnemonic: "A Tidal wave curling." },
  { kana: "チ", romaji: "chi", type: "katakana", category: "gojuon", audioKey: "chi", strokes: 3, mnemonic: "A Cheerleader with pom-poms." },
  { kana: "ツ", romaji: "tsu", type: "katakana", category: "gojuon", audioKey: "tsu", strokes: 3, mnemonic: "Two drops falling down (strokes go down)." },
  { kana: "テ", romaji: "te", type: "katakana", category: "gojuon", audioKey: "te", strokes: 3, mnemonic: "A Television antenna." },
  { kana: "ト", romaji: "to", type: "katakana", category: "gojuon", audioKey: "to", strokes: 2, mnemonic: "A Totem pole." },

  // N-row
  { kana: "ナ", romaji: "na", type: "katakana", category: "gojuon", audioKey: "na", strokes: 2, mnemonic: "A cross for a Nun." },
  { kana: "ニ", romaji: "ni", type: "katakana", category: "gojuon", audioKey: "ni", strokes: 2, mnemonic: "Two (ni) parallel lines." },
  { kana: "ヌ", romaji: "nu", type: "katakana", category: "gojuon", audioKey: "nu", strokes: 2, mnemonic: "Nunchucks swinging." },
  { kana: "ネ", romaji: "ne", type: "katakana", category: "gojuon", audioKey: "ne", strokes: 4, mnemonic: "A Necktie hanging straight." },
  { kana: "ノ", romaji: "no", type: "katakana", category: "gojuon", audioKey: "no", strokes: 1, mnemonic: "A long straight Nose." },

  // H-row
  { kana: "ハ", romaji: "ha", type: "katakana", category: "gojuon", audioKey: "ha", strokes: 2, mnemonic: "A thatched Hut roof." },
  { kana: "ヒ", romaji: "hi", type: "katakana", category: "gojuon", audioKey: "hi", strokes: 2, mnemonic: "A Hero with his chest puffed out." },
  { kana: "フ", romaji: "fu", type: "katakana", category: "gojuon", audioKey: "fu", strokes: 1, mnemonic: "A Flag fluttering in the wind." },
  { kana: "ヘ", romaji: "he", type: "katakana", category: "gojuon", audioKey: "he", strokes: 1, mnemonic: "A steep Hill." },
  { kana: "ホ", romaji: "ho", type: "katakana", category: "gojuon", audioKey: "ho", strokes: 4, mnemonic: "A Holy cross with side rays." },

  // M-row
  { kana: "マ", romaji: "ma", type: "katakana", category: "gojuon", audioKey: "ma", strokes: 2, mnemonic: "A glass of Martini." },
  { kana: "ミ", romaji: "mi", type: "katakana", category: "gojuon", audioKey: "mi", strokes: 3, mnemonic: "Three missile streaks." },
  { kana: "ム", romaji: "mu", type: "katakana", category: "gojuon", audioKey: "mu", strokes: 2, mnemonic: "A triangle of Muscle." },
  { kana: "メ", romaji: "me", type: "katakana", category: "gojuon", audioKey: "me", strokes: 2, mnemonic: "Metal swords crossing." },
  { kana: "モ", romaji: "mo", type: "katakana", category: "gojuon", audioKey: "mo", strokes: 3, mnemonic: "More shelves on the wall." },

  // Y-row
  { kana: "ヤ", romaji: "ya", type: "katakana", category: "gojuon", audioKey: "ya", strokes: 2, mnemonic: "A Yacht sail." },
  { kana: "ユ", romaji: "yu", type: "katakana", category: "gojuon", audioKey: "yu", strokes: 2, mnemonic: "A sharp U-turn sign." },
  { kana: "ヨ", romaji: "yo", type: "katakana", category: "gojuon", audioKey: "yo", strokes: 3, mnemonic: "A Yogurt spoon." },

  // R-row
  { kana: "ラ", romaji: "ra", type: "katakana", category: "gojuon", audioKey: "ra", strokes: 2, mnemonic: "A Ramen bowl." },
  { kana: "リ", romaji: "ri", type: "katakana", category: "gojuon", audioKey: "ri", strokes: 2, mnemonic: "A Ribbon cut in two." },
  { kana: "ル", romaji: "ru", type: "katakana", category: "gojuon", audioKey: "ru", strokes: 2, mnemonic: "Two Roots growing down." },
  { kana: "レ", romaji: "re", type: "katakana", category: "gojuon", audioKey: "re", strokes: 1, mnemonic: "A red laser checkmark." },
  { kana: "ロ", romaji: "ro", type: "katakana", category: "gojuon", audioKey: "ro", strokes: 3, mnemonic: "A square Robot mouth." },

  // W-row & N
  { kana: "ワ", romaji: "wa", type: "katakana", category: "gojuon", audioKey: "wa", strokes: 2, mnemonic: "A wine glass cup." },
  { kana: "ヲ", romaji: "wo", type: "katakana", category: "gojuon", audioKey: "wo", strokes: 3, mnemonic: "A person walking on wires." },
  { kana: "ン", romaji: "n", type: "katakana", category: "gojuon", audioKey: "n", strokes: 2, mnemonic: "A Knight smiling upward." },

  // Katakana Dakuten (Voiced: G, Z, D, B)
  { kana: "ガ", romaji: "ga", type: "katakana", category: "dakuten", audioKey: "ga", strokes: 4, mnemonic: "カ with dakuten marks." },
  { kana: "ギ", romaji: "gi", type: "katakana", category: "dakuten", audioKey: "gi", strokes: 5, mnemonic: "キ with dakuten marks." },
  { kana: "グ", romaji: "gu", type: "katakana", category: "dakuten", audioKey: "gu", strokes: 4, mnemonic: "ク with dakuten marks." },
  { kana: "ゲ", romaji: "ge", type: "katakana", category: "dakuten", audioKey: "ge", strokes: 5, mnemonic: "ケ with dakuten marks." },
  { kana: "ゴ", romaji: "go", type: "katakana", category: "dakuten", audioKey: "go", strokes: 4, mnemonic: "コ with dakuten marks." },
  { kana: "ザ", romaji: "za", type: "katakana", category: "dakuten", audioKey: "za", strokes: 5, mnemonic: "サ with dakuten marks." },
  { kana: "ジ", romaji: "ji", type: "katakana", category: "dakuten", audioKey: "ji", strokes: 5, mnemonic: "シ with dakuten marks." },
  { kana: "ズ", romaji: "zu", type: "katakana", category: "dakuten", audioKey: "zu", strokes: 4, mnemonic: "ス with dakuten marks." },
  { kana: "ゼ", romaji: "ze", type: "katakana", category: "dakuten", audioKey: "ze", strokes: 4, mnemonic: "セ with dakuten marks." },
  { kana: "ゾ", romaji: "zo", type: "katakana", category: "dakuten", audioKey: "zo", strokes: 4, mnemonic: "ソ with dakuten marks." },
  { kana: "ダ", romaji: "da", type: "katakana", category: "dakuten", audioKey: "da", strokes: 5, mnemonic: "タ with dakuten marks." },
  { kana: "ヂ", romaji: "ji", type: "katakana", category: "dakuten", audioKey: "dji", strokes: 5, mnemonic: "チ with dakuten marks." },
  { kana: "ヅ", romaji: "dzu", type: "katakana", category: "dakuten", audioKey: "dzu", strokes: 5, mnemonic: "ツ with dakuten marks." },
  { kana: "デ", romaji: "de", type: "katakana", category: "dakuten", audioKey: "de", strokes: 5, mnemonic: "テ with dakuten marks." },
  { kana: "ド", romaji: "do", type: "katakana", category: "dakuten", audioKey: "do", strokes: 4, mnemonic: "ト with dakuten marks." },
  { kana: "バ", romaji: "ba", type: "katakana", category: "dakuten", audioKey: "ba", strokes: 4, mnemonic: "ハ with dakuten marks." },
  { kana: "ビ", romaji: "bi", type: "katakana", category: "dakuten", audioKey: "bi", strokes: 4, mnemonic: "ヒ with dakuten marks." },
  { kana: "ブ", romaji: "bu", type: "katakana", category: "dakuten", audioKey: "bu", strokes: 3, mnemonic: "フ with dakuten marks." },
  { kana: "ベ", romaji: "be", type: "katakana", category: "dakuten", audioKey: "be", strokes: 3, mnemonic: "ヘ with dakuten marks." },
  { kana: "ボ", romaji: "bo", type: "katakana", category: "dakuten", audioKey: "bo", strokes: 6, mnemonic: "ホ with dakuten marks." },

  // Katakana Handakuten (Semi-voiced: P)
  { kana: "パ", romaji: "pa", type: "katakana", category: "handakuten", audioKey: "pa", strokes: 3, mnemonic: "ハ with maru circle." },
  { kana: "ピ", romaji: "pi", type: "katakana", category: "handakuten", audioKey: "pi", strokes: 3, mnemonic: "ヒ with maru circle." },
  { kana: "プ", romaji: "pu", type: "katakana", category: "handakuten", audioKey: "pu", strokes: 2, mnemonic: "フ with maru circle." },
  { kana: "ペ", romaji: "pe", type: "katakana", category: "handakuten", audioKey: "pe", strokes: 2, mnemonic: "ヘ with maru circle." },
  { kana: "ポ", romaji: "po", type: "katakana", category: "handakuten", audioKey: "po", strokes: 5, mnemonic: "ホ with maru circle." },

  // Katakana Yoon (Contracted Sounds)
  { kana: "キャ", romaji: "kya", type: "katakana", category: "yoon", audioKey: "kya", strokes: 5, mnemonic: "キ + small ャ" },
  { kana: "キュ", romaji: "kyu", type: "katakana", category: "yoon", audioKey: "kyu", strokes: 5, mnemonic: "キ + small ュ" },
  { kana: "キョ", romaji: "kyo", type: "katakana", category: "yoon", audioKey: "kyo", strokes: 6, mnemonic: "キ + small ョ" },
  { kana: "シャ", romaji: "sha", type: "katakana", category: "yoon", audioKey: "sha", strokes: 5, mnemonic: "シ + small ャ" },
  { kana: "シュ", romaji: "shu", type: "katakana", category: "yoon", audioKey: "shu", strokes: 5, mnemonic: "シ + small ュ" },
  { kana: "ショ", romaji: "sho", type: "katakana", category: "yoon", audioKey: "sho", strokes: 6, mnemonic: "シ + small ョ" },
  { kana: "チャ", romaji: "cha", type: "katakana", category: "yoon", audioKey: "cha", strokes: 5, mnemonic: "チ + small ャ" },
  { kana: "チュ", romaji: "chu", type: "katakana", category: "yoon", audioKey: "chu", strokes: 5, mnemonic: "チ + small ュ" },
  { kana: "チョ", romaji: "cho", type: "katakana", category: "yoon", audioKey: "cho", strokes: 6, mnemonic: "チ + small ョ" },
  { kana: "ニャ", romaji: "nya", type: "katakana", category: "yoon", audioKey: "nya", strokes: 4, mnemonic: "ニ + small ャ" },
  { kana: "リュ", romaji: "ryu", type: "katakana", category: "yoon", audioKey: "ryu", strokes: 4, mnemonic: "リ + small ュ" },
  { kana: "リョ", romaji: "ryo", type: "katakana", category: "yoon", audioKey: "ryo", strokes: 5, mnemonic: "リ + small ョ" },
];

export const KANA_SPECIAL_RULES = [
  {
    id: "sokuon",
    title: "Small Tsu — Geminate Consonants (促音)",
    japaneseTitle: "促音（っ・ッ）の法則",
    summary: "The small っ (Hiragana) or ッ (Katakana) represents a full one-beat pause (glottal stop) before consonants k, s, t, p.",
    ruleExplanation:
      "Unlike full-size つ/ツ, small っ/ッ produces no vowel. It doubles the following roman consonant: 切符 (きっぷ / ki-p-pu, ticket), もっと (mo-t-to, more), ベッド (be-d-do, bed). In Japanese mora timing, this pause takes exactly the same rhythmic length as any normal kana.",
    examples: [
      { japanese: "切符", reading: "きっぷ", romaji: "kippu", english: "ticket", explanation: "Double 'p' with small っ" },
      { japanese: "雑誌", reading: "ざっし", romaji: "zasshi", english: "magazine", explanation: "Double 's' with small っ" },
      { japanese: "ベッド", reading: "ベッド", romaji: "beddo", english: "bed", explanation: "Double 'd' with small ッ" },
      { japanese: "コップ", reading: "コップ", romaji: "koppu", english: "glass / cup", explanation: "Double 'p' with small ッ" },
    ],
  },
  {
    id: "choonpu",
    title: "Long Vowel Conventions (長音符 & 長音)",
    japaneseTitle: "長音の表記ルール",
    summary: "How prolonged vowels are represented in native Japanese words versus Katakana loanwords.",
    ruleExplanation:
      "In Katakana, long vowels are represented by the dash symbol ー (chōonpu): コーヒー (kōhī, coffee), ケーキ (kēki, cake). In Hiragana, long 'o' is written as おう (not おお in 95% of words): ありがとう (arigatō), おとうさん (otōsan). Long 'e' is written as えい: せんせい (sensei).",
    examples: [
      { japanese: "コーヒー", reading: "コーヒー", romaji: "kōhī", english: "coffee", explanation: "Katakana uses horizontal dash ー" },
      { japanese: "お父さん", reading: "おとうさん", romaji: "otōsan", english: "father", explanation: "Hiragana long 'o' spelled with う" },
      { japanese: "先生", reading: "せんせい", romaji: "sensei", english: "teacher", explanation: "Hiragana long 'e' spelled with い" },
    ],
  },
  {
    id: "particles",
    title: "Special Particle Pronunciation (助詞の特例)",
    japaneseTitle: "助詞「は・へ・を」の発音",
    summary: "Three kana change their pronunciation when functioning as grammatical particles.",
    ruleExplanation:
      "1. は is pronounced 'wa' when marking topic (私は = watashi wa).\n2. へ is pronounced 'e' when marking direction (東京へ = Tōkyō e).\n3. を is pronounced 'o' when marking direct object (水を = mizu o). In modern Japanese, を is only used as a particle.",
    examples: [
      { japanese: "私は", reading: "わたしは", romaji: "watashi wa", english: "as for me", explanation: "は pronounced 'wa'" },
      { japanese: "日本へ", reading: "にほんへ", romaji: "nihon e", english: "to Japan", explanation: "へ pronounced 'e'" },
      { japanese: "本を読む", reading: "ほんをよむ", romaji: "hon o yomu", english: "to read a book", explanation: "を pronounced 'o'" },
    ],
  },
];

export const SIMILAR_KANA_PAIRS = [
  { pair: ["さ", "ち"], explanation: "さ faces right with one loop; ち faces left with top bar and belly." },
  { pair: ["き", "さ"], explanation: "き has two horizontal bars; さ has only one horizontal bar." },
  { pair: ["は", "ほ"], explanation: "ほ has a top bar covering the vertical stroke; は has an open top." },
  { pair: ["わ", "ね", "れ"], explanation: "わ is rounded; ね has a loop at the tail; れ flips outward." },
  { pair: ["め", "ぬ"], explanation: "ぬ loops at the tail like curly noodles; め has no loop at the tail." },
  { pair: ["る", "ろ"], explanation: "る has a closed loop at bottom; ろ is open with no loop." },
  { pair: ["シ", "ツ"], explanation: "シ (shi) strokes go sideways/upward; ツ (tsu) strokes go downward." },
  { pair: ["ソ", "ン"], explanation: "ソ (so) strokes go downward; ン (n) strokes sweep upward from bottom." },
];
