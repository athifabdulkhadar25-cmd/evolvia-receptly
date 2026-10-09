/* The animated booking conversation in the phone at the top. */
(function () {
  var chat = $("chat"), timers = [];
  function play() {
    timers.forEach(clearTimeout); timers = []; chat.innerHTML = "";
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    RECEPTLY.heroChat.forEach(function (m, i) {
      timers.push(setTimeout(function () { addBubble(chat, m[0], m[1]); }, reduce ? 0 : 900 * (i + 1)));
    });
  }
  $("replay").onclick = play;
  play();
})();
