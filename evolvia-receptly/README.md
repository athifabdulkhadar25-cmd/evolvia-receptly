# Evolvia Receptly

Landing page and demo for an AI receptionist for small businesses.

## Files: what to change where
| I want to change... | Open this file |
|---|---|
| Price, email address, sample chat, clinic details, calculator start values | `js/config.js` |
| Colours, fonts, spacing | `css/styles.css` (colours are at the very top) |
| Page text and sections | `index.html` |
| How the calculator works | `js/calculator.js` |
| How the AI receptionist behaves (its instructions and actions) | `js/demo.js` |
| What happens when the signup form is sent | `js/form.js` |
| Logo | replace `assets/logo.png` |
| Database tables / AI prompt template | `database/` |

## Run it
Double-click `index.html`. No installation needed.

## Put it on GitHub and online
1. Create a new empty repository on github.com (name it `evolvia-receptly`).
2. In this folder run:
   ```
   git init
   git add .
   git commit -m "First version"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/evolvia-receptly.git
   git push -u origin main
   ```
3. Free hosting: in the repo go to Settings > Pages > Deploy from branch > main > Save.
   Your site appears at `https://YOUR-USERNAME.github.io/evolvia-receptly/`.

## Note on the live demo
The "Talk to the receptionist" demo uses Claude's built-in feature, which only works inside Claude.
On GitHub Pages it shows a message instead. To make it work on your own site, build a small server
that talks to an AI service, then put its address in `apiUrl` in `js/config.js`.
