const textEl = document.getElementById("tts-text");
const voiceEl = document.getElementById("voice");
const langEl = document.getElementById("lang");
const rateEl = document.getElementById("rate");
const pitchEl = document.getElementById("pitch");
const btnSpeak = document.getElementById("btn-speak");
const statusEl = document.getElementById("status");
const playerEl = document.getElementById("player");

let voices = [];

function loadVoices() {
  voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  voiceEl.innerHTML = "";
  if (!voices || voices.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Voices not found (Web Speech API unavailable)";
    voiceEl.appendChild(opt);
    voiceEl.disabled = true;
    return;
  }
  voiceEl.disabled = false;

  const sorted = voices
    .slice()
    .sort((a, b) => (a.lang || "").localeCompare(b.lang || ""));
  for (const v of sorted) {
    const opt = document.createElement("option");
    opt.value = v.name;
    opt.textContent = `${v.name} (${v.lang})`;
    voiceEl.appendChild(opt);
  }

  const preferred =
    sorted.find((v) => v.lang?.startsWith("ru")) ||
    sorted.find((v) => v.lang?.startsWith("en"));
  if (preferred) voiceEl.value = preferred.name;
}

if ("speechSynthesis" in window) {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
} else {
  status(
    "Web Speech API is not supported in this browser. Use the 'Download MP3' button.",
    "warn"
  );
}

function status(msg, type = "info") {
  statusEl.textContent = msg || "";
  statusEl.className = `muted ${type}`;
}

btnSpeak.addEventListener("click", () => {
  const text = (textEl.value || "").trim();
  if (!text) return status("Enter text to synthesize", "warn");
  if (!("speechSynthesis" in window)) {
    return status(
      "Web Speech API is not available. Use the 'Download MP3' button.",
      "warn"
    );
  }
  const u = new SpeechSynthesisUtterance(text);
  const rate = parseFloat(rateEl.value || "1");
  const pitch = parseFloat(pitchEl.value || "1");
  u.rate = isFinite(rate) ? rate : 1;
  u.pitch = isFinite(pitch) ? pitch : 1;

  const selected = voices.find((v) => v.name === voiceEl.value);
  if (selected) u.voice = selected;

  speechSynthesis.cancel();
  speechSynthesis.speak(u);
  status("Speaking in browser...", "info");
});
