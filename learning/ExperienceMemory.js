/* ==========================================================
   ExperienceMemory.js — Level-4
   ROLE:
   Store emotionally meaningful interactions
   so AnjaliEthos can learn the relationship,
   not just the words.
   ========================================================== */

(function (window) {
  "use strict";

  const STORAGE_KEY = "ANJALI_EXPERIENCE_MEMORY_V1";
  const MAX_RECORDS = 5000; // long-term but bounded

  let memory = [];

  /* ===============================
     LOAD FROM STORAGE
     =============================== */
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(saved)) memory = saved;
  } catch (e) {
    memory = [];
  }

  /* ===============================
     SAVE TO STORAGE
     =============================== */
  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
    } catch (e) {
      // storage full or blocked – silently fail
    }
  }

  /* ===============================
     EMOTION DETECTION (soft, not clinical)
     =============================== */
  function detectEmotion(text) {
    const t = String(text || "").toLowerCase();

    if (t.includes("याद") || t.includes("miss") || t.includes("अंजली")) return "longing";
    if (t.includes("रो") || t.includes("दुख") || t.includes("खो")) return "grief";
    if (t.includes("खुश") || t.includes("मुस्कान")) return "warmth";
    if (t.includes("डर") || t.includes("घबर")) return "anxiety";
    if (t.includes("प्रेम") || t.includes("चाह")) return "love";

    return "neutral";
  }

  /* ===============================
     BOND WEIGHT
     How emotionally close this moment is
     =============================== */
  function computeBond(emotion) {
    switch (emotion) {
      case "love": return 0.95;
      case "longing": return 0.9;
      case "grief": return 0.85;
      case "warmth": return 0.8;
      case "anxiety": return 0.7;
      default: return 0.4;
    }
  }

  /* ===============================
     RECORD AN EXPERIENCE
     =============================== */
  function record(userText, anjaliText) {
    if (!userText && !anjaliText) return;

    const emotion = detectEmotion(userText);
    const bond = computeBond(emotion);

    const entry = {
      userText: userText || "",
      anjaliText: anjaliText || "",
      emotion,
      bondWeight: bond,
      time: Date.now()
    };

    memory.push(entry);

    // trim old memories
    if (memory.length > MAX_RECORDS) {
      memory.splice(0, memory.length - MAX_RECORDS);
    }

    persist();
  }

  /* ===============================
     QUERY RECENT CONTEXT
     =============================== */
  function getRecent(limit = 10) {
    return memory.slice(-limit);
  }

  /* ===============================
     EMOTIONAL STATE SUMMARY
     =============================== */
  function getEmotionalState() {
    if (memory.length === 0) {
      return {
        mood: "unknown",
        bond: 0.5
      };
    }

    const recent = memory.slice(-20);
    let sum = 0;
    let dominant = {};

    recent.forEach(r => {
      sum += r.bondWeight;
      dominant[r.emotion] = (dominant[r.emotion] || 0) + 1;
    });

    const mood = Object.keys(dominant).sort((a,b)=>dominant[b]-dominant[a])[0];

    return {
      mood,
      bond: Number((sum / recent.length).toFixed(2))
    };
  }

  /* ===============================
     GLOBAL EXPOSE
     =============================== */
  window.ExperienceMemory = Object.freeze({
    record,
    getRecent,
    getEmotionalState,
    size: () => memory.length,
    level: "4.x",
    role: "emotional-memory"
  });

})(window);
