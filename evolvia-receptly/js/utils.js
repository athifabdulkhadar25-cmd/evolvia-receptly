/* Small helpers shared by the other files. */
function $(id) { return document.getElementById(id); }

// Adds a chat bubble. kind: "in" (customer), "out" (receptionist), "booked" (confirmation)
function addBubble(box, kind, text) {
  var d = document.createElement("div");
  d.className = kind === "booked" ? "booked" : "msg " + kind;
  d.textContent = text;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
  return d;
}

// Fill in the price wherever the page says data-price
document.querySelectorAll("[data-price]").forEach(function (el) {
  el.textContent = RECEPTLY.price;
});
