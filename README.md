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

```html
<script src="https://script.joinads.me/jrewards.min.js" type="module"></script>

<div joinadscode="AdRewarded" data-id="{ID_QUIZ}" data-domain="{DOMAIN}" data-subdomain="{SUBDOMAIN_SLOT}" data-network="{NETWORK_CODE}"  data-date="{DATE_SLOT}"></div>
```

### Example:

Simply install example in your `<body>`

```html
<script src="https://script.joinads.me/jrewards.min.js" type="module"></script>
<div joinadscode="AdRewarded" data-id="36" data-domain="setorreciclagem.com.br" data-subdomain="Setorreciclagem" data-network="3649630"  data-date="20240913"></div>
```

---

## 🛠️ Development

To build the tag from source:

```bash
npm install
npm run build
```

The output JavaScript will be generated in the `dist/` folder, ready to be served.

---

## 📄 License

MIT