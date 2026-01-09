/* ==========================================================
   STT_LongListening.js
   Purpose:
   Keep microphone alive after user grants permission.
   Mobile safe, Chrome safe.
   ========================================================== */

(function (window) {
  "use strict";

  if (!window.STT) {
    console.error("STT_LongListening: STT missing");
    return;
  }

  let active = false;

  function start() {
    if (active) return;
    active = true;

    // First real user-gesture start already done
    loop();
  }

  function loop() {
    if (!active) return;

    try {
      STT.start(function (text) {
        if (text && window.STT.onResult) {
          STT.onResult(text);
        }

        // restart after each phrase
        setTimeout(loop, 400);
      });
    } catch (e) {
      // try again after delay
      setTimeout(loop, 1000);
    }
  }

  function stop() {
    active = false;
    if (STT.stop) STT.stop();
  }

  window.STT_LongListening = {
    start,
    stop
  };

})(window);
