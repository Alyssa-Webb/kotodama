# Setting up VOICEVOX for Kotodama

VOICEVOX is a free Japanese text-to-speech app. Kotodama uses it at build time to pre-render every Japanese line into small audio files, so voices work offline on the phone.

1. Download the free Windows installer from the official site, **https://voicevox.hiroshiba.jp/**. Choose the **GPU/CPU** version (CPU is fine).
2. Install it and open it once. Accept the terms of use inside the app. No account or API key is needed.
3. Keep the app open while voices are generated. It runs a local engine at `http://127.0.0.1:50021` (override with the `VOICEVOX_URL` environment variable). Nothing goes over the internet.
4. Koto's voice is **ずんだもん (Zundamon)**. Free use requires the credit `VOICEVOX:ずんだもん` (shown on the Credits screen).
5. With VOICEVOX running:
   - `npm run voice:audition` opens a page to listen to voices and pick one per guide.
   - `npm run voice:build` renders every line into the app's audio files.

If Windows SmartScreen warns about the installer, check that it came from voicevox.hiroshiba.jp before allowing it.
