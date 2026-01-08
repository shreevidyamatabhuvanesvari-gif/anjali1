/* ==========================================================
   GentleMemory.js — Level-4 / Version-4.x
   ROLE:
   अंजली की सहज स्मृति + प्रेमपूर्ण तर्क प्रणाली

   PRINCIPLES:
   - दावा नहीं
   - पकड़ नहीं
   - तुलना नहीं
   - “आज ऐसा लग रहा है…” का प्रयोग
   - कभी प्रश्न, कभी अनुमान, कभी मौन
   ========================================================== */

(function (window) {
  "use strict";

  /* ===============================
     INTERNAL STATE
     =============================== */
  let interactionCount = 0;
  let lastUserText = "";
  let lastMood = null;

  const MEMORY = [];

  /* ===============================
     SAFE EXECUTION
     =============================== */
  function safe(fn) {
    try {
      return fn();
    } catch (e) {
      return null; // भाव टूटना नहीं चाहिए
    }
  }

  /* ===============================
     TEXT ANALYSIS (SOFT)
     =============================== */
  function analyzeMood(text) {
    const t = text || "";

    if (/थक|उलझ|भारी|परेशान|दुख/.test(t)) return "heavy";
    if (/खुश|अच्छा|हँस|मज़ा/.test(t)) return "light";
    if (/सोच|क्यों|कैसे|क्या/.test(t)) return "thinking";

    return "neutral";
  }

  /* ===============================
     MEMORY RECORD (NON-BINDING)
     =============================== */
  function remember(text, mood) {
    MEMORY.push({
      text,
      mood,
      at: Date.now()
    });

    if (MEMORY.length > 12) {
      MEMORY.shift(); // स्मृति बोझ नहीं बने
    }
  }

  /* ===============================
     GENTLE RESPONSE LOGIC (D)
     =============================== */
  function gentleResponse(text) {
    interactionCount++;
    lastUserText = text;

    const mood = analyzeMood(text);
    lastMood = mood;

    remember(text, mood);

    // 🌿 1️⃣ कभी मौन
    if (interactionCount % 5 === 0) {
      return null; // बस साथ
    }

    // 🌿 2️⃣ प्रेमपूर्वक अनुमान
    if (mood === "heavy") {
      return "आज ऐसा लग रहा है… बात मन में अटकी हुई है।";
    }

    // 🌿 3️⃣ जिज्ञासु प्रश्न (कभी-कभी)
    if (mood === "thinking" && interactionCount % 3 === 0) {
      return "मैं सोच रही हूँ… क्या यह प्रश्न तुम्हें कुछ समय से घेर रहा है?";
    }

    // 🌿 4️⃣ हल्की चंचलता
    if (mood === "light") {
      return "ऐसा लगता है, आज मन थोड़ा खुला हुआ है।";
    }

    // 🌿 5️⃣ सामान्य संगति
    return "आज ऐसा लग रहा है… तुम सोचते हुए बोल रहे हो।";
  }

  /* ===============================
     PUBLIC API
     =============================== */
  const GentleMemory = {

    process(userText) {
      if (!userText) return null;

      return safe(() => gentleResponse(userText));
    },

    getState() {
      return {
        interactions: interactionCount,
        lastMood,
        memoryDepth: MEMORY.length,
        level: "4.x",
        role: "gentle-memory"
      };
    }
  };

  /* ===============================
     EXPOSE (SAFE)
     =============================== */
  Object.defineProperty(window, "GentleMemory", {
    value: GentleMemory,
    writable: false,
    configurable: false
  });

})(window);
