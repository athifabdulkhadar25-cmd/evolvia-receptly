/* "Talk to the receptionist" live demo.
   - Business details come from config.js (RECEPTLY.clinic).
   - The AI instructions are in INSTRUCTIONS below: edit the wording to change behaviour.
   - Two ways to get answers:
       1) Inside Claude: uses Claude's built-in "sample" feature (no setup).
       2) On your own site: set RECEPTLY.apiUrl in config.js to your server. */
(function () {
  var clinic = RECEPTLY.clinic;
  var slots = clinic.slots.map(function (t) { return { t: t }; });
  var history = [], busy = false, box = $("dchat");

  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }

  function renderInfo() {
    $("dinfo").innerHTML = "<li><span>Hours</span><span>" + esc(clinic.hours) + "</span></li>" +
      clinic.services.map(function (s) { return "<li><span>" + esc(s[0]) + " (" + esc(s[1]) + ")</span><span>" + esc(s[2]) + "</span></li>"; }).join("");
    $("dslots").innerHTML = slots.map(function (s) {
      return '<li class="' + (s.who ? "taken" : "") + '"><span>' + esc(s.t) + "</span>" +
        (s.who ? '<span class="tag">Booked: ' + esc(s.who) + "</span>" : "<span>Open</span>") + "</li>";
    }).join("");
  }

  // ---- The AI's instructions: edit this text to change how the receptionist behaves ----
  var INSTRUCTIONS =
    "You are the receptionist for " + clinic.name + ". Reply in the same language the customer writes in. " +
    "Keep replies short and friendly, 1 to 3 sentences. Answer only from these clinic details: hours " + clinic.hours +
    "; services: " + clinic.services.map(function (s) { return s[0] + " " + s[1] + " " + s[2]; }).join("; ") + ". " +
    "Always call get_open_slots before offering times. Never invent times, prices or services. " +
    "To book, you need the customer name and a chosen slot, then call book_slot. " +
    "If the customer has a medical emergency or you do not know the answer, say a staff member will call them back. " +
    "Never give medical advice.";

  // ---- Actions the AI can ask for (your code does the real work) ----
  var tools = [
    { name: "get_open_slots", description: "List appointment slots that are still open.",
      inputSchema: { type: "object", properties: {} },
      execute: function () { return slots.filter(function (s) { return !s.who; }).map(function (s) { return s.t; }); } },
    { name: "book_slot", description: "Book an open slot for a customer.",
      inputSchema: { type: "object", properties: { slot: { type: "string" }, name: { type: "string" } }, required: ["slot", "name"] },
      execute: function (a) {
        var s = slots.filter(function (x) { return x.t === a.slot && !x.who; })[0];
        if (!s) throw new Error("That slot is not available.");
        s.who = String(a.name).slice(0, 40); renderInfo();
        return "Booked " + s.t + " for " + s.who;
      } }
  ];

  var samplePromise = null;
  function getSample() {
    if (!samplePromise) samplePromise = (window.claude && claude.use) ? claude.use("sample") : Promise.resolve(null);
    return samplePromise;
  }

  // Returns a promise of the reply text. Swap this function if you use a different AI provider.
  function getReply(onText) {
    if (RECEPTLY.apiUrl) {
      return fetch(RECEPTLY.apiUrl, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }) })
        .then(function (r) { return r.json(); })
        .then(function (d) { return d.text; });
    }
    return getSample().then(function (sample) {
      if (!sample) return "The live demo works when this page is opened in Claude. To run it on your own site, set apiUrl in js/config.js.";
      var turns = history.map(function (m, i) { return i === 0 ? { role: "user", content: INSTRUCTIONS + "\n\nCustomer says: " + m.content } : m; });
      return sample(turns, { tools: tools, cache: false, onText: function (r) { onText(r.text || "Typing..."); } })
        .then(function (r) { return r.text; });
    });
  }

  function send() {
    var inp = $("dtext"), txt = inp.value.trim();
    if (!txt || busy) return;
    inp.value = ""; addBubble(box, "in", txt); history.push({ role: "user", content: txt });
    busy = true; $("dsend").disabled = true; $("dnote").textContent = "";
    var out = addBubble(box, "out", "Typing...");
    getReply(function (t) { out.textContent = t; box.scrollTop = box.scrollHeight; })
      .then(function (text) { out.textContent = text; history.push({ role: "assistant", content: text }); })
      .catch(function (e) {
        history.pop(); out.textContent = "Sorry, the receptionist could not reply.";
        $("dnote").textContent = (e && e.code === "not_granted") ? "Allow access when prompted to use the live demo."
          : (e && e.code === "rate_limited") ? "Too many messages. Wait a moment and try again." : "Something went wrong. Please try again.";
      })
      .then(function () { busy = false; $("dsend").disabled = false; inp.focus(); });
  }

  renderInfo();
  addBubble(box, "out", clinic.greeting);
  $("dsend").onclick = send;
  $("dtext").addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });
})();
