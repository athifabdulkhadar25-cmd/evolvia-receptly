/* "See what you're losing" calculator. Defaults come from config.js. */
(function () {
  var c = RECEPTLY.calculator;
  $("mc").value = c.missedCalls;
  $("val").value = c.bookingValue;
  $("rec").value = c.recoveryPercent;

  function calc() {
    var mc = +$("mc").value, v = +$("val").value, r = +$("rec").value;
    $("mcO").textContent = mc;
    $("valO").textContent = "$" + v;
    $("recO").textContent = r + "%";
    // missed calls per week x weeks per month x share recovered x value of a booking
    var gain = Math.round(mc * c.weeksPerMonth * (r / 100) * v);
    $("gain").textContent = "$" + gain.toLocaleString("en-US");
    $("roi").textContent = (gain / RECEPTLY.price).toFixed(1) + "x";
  }
  ["mc", "val", "rec"].forEach(function (id) { $(id).addEventListener("input", calc); });
  calc();
})();
