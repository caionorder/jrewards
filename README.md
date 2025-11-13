# Reward Service Tag

A lightweight, decoupled JavaScript tag for managing and delivering reward-based experiences on your site.

This project provides a standalone **Reward Service Tag**, designed to work independently of the main `core.js` tag. It enables seamless integration of reward mechanics, such as points, badges, and other incentives, without requiring changes to the core tracking or rendering scripts.

✅ Decoupled from `core.js` for maximum flexibility  
✅ Built with **TypeScript** for safety and maintainability  
✅ Follows the same logic and conventions as the default `core.js` tag  
✅ Easy to embed and initialize on any page  
✅ Minimal impact on page load and performance  

---

## 📦 About

This tag was developed in **TypeScript**, following the same logic and structure as the default `core.js` tag used across our platform.  

It’s intended to allow teams to deploy and test rewards features without touching or redeploying the main core tag. By mirroring the patterns of `core.js`, it ensures a consistent developer experience while remaining completely decoupled.

---

## 🚀 Installation

Simply embed the compiled tag on your page:

### Example:

```html
<script src="https://genius.groone.com/jrewards.min.js" type="module"></script>

<div
    groone="reward"
    data-id="{id_reward}"
    data-client="{id_client}"
></div>

---

## 🛠️ Development

To build the tag from source:

```bash
npm install
npm run dev
http-server . -p 5173
```

The output JavaScript will be generated in the `dist/` folder, ready to be served.

---