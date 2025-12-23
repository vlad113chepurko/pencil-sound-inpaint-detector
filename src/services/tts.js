const googleTTS = require("google-tts-api");
const fetch = require("node-fetch");

async function synthesize({ text, lang = "ru", slow = false }) {
  if (!text || !text.trim()) {
    throw new Error("Text is required");
  }
  const url = googleTTS.getAudioUrl(text, {
    lang,
    slow,
    host: "https://translate.google.com",
  });
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`TTS fetch failed: HTTP ${resp.status}`);
  }
  const arrayBuffer = await resp.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const audioBase64 = buffer.toString("base64");
  return {
    audioBase64,
    contentType: "audio/mpeg",
    filename: `tts_${lang}.mp3`,
  };
}

module.exports = {
  synthesize,
};
