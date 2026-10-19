# Japanese Audio & Speech Subsystem 🎧🎙️

## 1. Native Japanese Text-to-Speech (TTS)

NekoNihongo implements native Japanese speech synthesis utilizing the browser's standard `SpeechSynthesis` Web Speech API.

- Automatic Japanese voice detection (`ja-JP` language tag)
- Configurable playback rate: 0.75x (slow), 1.0x (normal), 1.25x (fast)
- Replay audio for words, full example sentences, and listening exercises
- Automatic fallback gracefully handling environments where TTS voice synthesis is disabled or restricted.

---

## 2. Speech Recognition & Pronunciation

The speaking studio uses `SpeechRecognition` / `webkitSpeechRecognition` with Japanese (`ja-JP`) language models.

- Explicit permission lifecycle states:
  - `ready`: Microphone standby
  - `recording`: Active audio capture
  - `processing`: Evaluating audio stream
  - `result_available`: Comparing transcript with reference sentence
  - `permission_required`: Browser denied mic access
  - `unsupported`: Browser lacks speech recognition
- Similarity matching using Levenshtein distance against normalized Japanese text (stripping Japanese punctuation and whitespace).
- Transparent keyboard alternative mode for unsupported browsers or noisy environments.
