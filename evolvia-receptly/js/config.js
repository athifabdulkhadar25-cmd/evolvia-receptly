/* ==========================================================
   EVOLVIA RECEPTLY SETTINGS: change things here first.
   ========================================================== */
window.RECEPTLY = {
  // Monthly plan price in dollars (shown in pricing and the savings maths)
  price: 20,

  // Where the "Request my free pilot" form sends the email
  email: "hello@evolvia.com",

  // Leave empty to use Claude's built-in demo (works inside Claude only).
  // When you build your own server, put its address here, e.g. "https://api.yoursite.com/chat"
  apiUrl: "",

  // Starting numbers for the "See what you're losing" sliders
  calculator: { missedCalls: 10, bookingValue: 40, recoveryPercent: 50, weeksPerMonth: 4.3 },

  // The animated chat at the top of the page
  heroChat: [
    ["in", "Hi, I called your clinic. Do you have a slot tomorrow for a toothache?"],
    ["out", "Hello! Sorry we missed you. Yes: 10:30 AM or 4:00 PM tomorrow with Dr. Nair. Which suits you?"],
    ["in", "10:30 please"],
    ["out", "Booked for 10:30 AM. Can I have your name for the booking?"],
    ["in", "Anita Joseph"],
    ["booked", "Confirmed: Anita Joseph, tomorrow 10:30 AM. Reminder sent."]
  ],

  // The sample business used in the "Talk to the receptionist" demo
  clinic: {
    name: "Smile Dental Clinic",
    hours: "Mon-Sat, 9 AM - 6 PM",
    greeting: "Hello, this is Smile Dental Clinic. How can I help you today?",
    services: [ // name, duration, price
      ["Check-up and cleaning", "30 min", "$40"],
      ["Tooth filling", "45 min", "$70"],
      ["Toothache visit", "30 min", "$35"],
      ["Teeth whitening", "60 min", "$120"]
    ],
    slots: ["Tomorrow 9:00 AM", "Tomorrow 10:30 AM", "Tomorrow 4:00 PM", "Friday 11:00 AM", "Friday 5:30 PM"]
  }
};
