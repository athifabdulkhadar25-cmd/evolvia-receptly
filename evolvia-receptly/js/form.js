/* "Request my free pilot" form. Opens an email to RECEPTLY.email.
   When you have a backend, replace the mailto line with a fetch() POST to your server. */
$("f").addEventListener("submit", function (e) {
  e.preventDefault();
  var d = new FormData(e.target);
  var body = "Business: " + d.get("biz") + "\nPhone: " + d.get("phone") + "\nType: " + d.get("type");
  $("thanks").style.display = "block";
  window.location.href = "mailto:" + RECEPTLY.email +
    "?subject=" + encodeURIComponent("Evolvia Receptly free pilot request") +
    "&body=" + encodeURIComponent(body);
});
