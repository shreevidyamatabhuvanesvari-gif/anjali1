/* ==========================================================
   AnjaliPresence.js
   PURPOSE:
   अंजली की शांत उपस्थिति बनाए रखना
   - उत्तर देना आवश्यक नहीं
   - 30 मिनट में एक बार हल्की उपस्थिति
   - नाम/पहचान/घोषणा नहीं
   - केवल "ए सुनो…" का एहसास
   ========================================================== */

(function (window) {
  "use strict";

  let active = false;
  let timer = null;

  const INTERVAL = 30 * 60 * 1000; // 30 मिनट

  /* -------- सुरक्षित TTS कॉल -------- */
  function speak(text) {
    try {
      if (window.TTS && typeof window.TTS.speak === "function") {
        window.TTS.speak(text);
      }
    } catch (e) {
      // जानबूझकर silent
    }
  }

  /* -------- उपस्थिति वाक्य -------- */
  function presenceLine() {
    speak("ए सुनो…");
  }

  /* -------- शुरू करें -------- */
  function start() {
    if (active) return;

    active = true;

    // पहला वाक्य — केवल एक बार
    setTimeout(() => {
      presenceLine();
    }, 800);

    // हर 30 मिनट पर
    timer = setInterval(() => {
      if (active) {
        presenceLine();
      }
    }, INTERVAL);
  }

  /* -------- रोकें -------- */
  function stop() {
    active = false;
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  /* -------- स्थिति -------- */
  function status() {
    return {
      active,
      intervalMinutes: 30
    };
  }

  /* -------- GLOBAL EXPOSE -------- */
  window.AnjaliPresence = Object.freeze({
    start,
    stop,
    status
  });

})(window);
