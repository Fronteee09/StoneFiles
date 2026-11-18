import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDuu5Y88zLYuPWqxHs9pis6OfeNDKoG8YE",
  authDomain: "stonefiles-c2a40.firebaseapp.com",
  projectId: "stonefiles-c2a40",
  storageBucket: "stonefiles-c2a40.firebasestorage.app",
  messagingSenderId: "855521046414",
  appId: "1:855521046414:web:2996e4c8f2a6b47a72fedf",
  measurementId: "G-WEFNP7N7DG"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function applyTheme(font, bg) {
  let style = document.getElementById('sf-custom-theme-style');
  if (!style) {
    style = document.createElement('style');
    style.id = 'sf-custom-theme-style';
    document.head.appendChild(style);
  }

  let cssRules = `
    @font-face {
      font-family: 'Minecraft';
      src: url('Minecraft.ttf') format('truetype');
    }
    @font-face {
      font-family: 'MineCrafter';
      src: url('MineCrafter.ttf') format('truetype');
    }
  `;

  if (font === 'Arial') {
    cssRules += `
      * { font-family: Arial, Helvetica, sans-serif !important; }
      .site-title { font-family: 'MineCrafter', Arial, sans-serif !important; }
    `;
  } else {
    cssRules += `
      * { font-family: 'Minecraft', monospace, sans-serif !important; }
      .site-title { font-family: 'MineCrafter', 'Minecraft', sans-serif !important; }
    `;
  }

  if (bg) {
    cssRules += `
      body {
        background: linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url('${bg}') !important;
        background-size: cover !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-attachment: fixed !important;
      }
    `;
  }

  style.innerHTML = cssRules;
}

// Applica subito dai dati salvati nel browser
const cachedFont = localStorage.getItem('sf_font') || 'Minecraft';
const cachedBg = localStorage.getItem('sf_bg');
applyTheme(cachedFont, cachedBg);

// Sincronizza con l'account Firebase
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const snap = await getDoc(doc(db, "userSettings", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        const font = data.font || cachedFont;
        const bg = data.background || cachedBg;
        
        if (data.font) localStorage.setItem('sf_font', data.font);
        if (data.background) localStorage.setItem('sf_bg', data.background);
        
        applyTheme(font, bg);
      }
    } catch (e) {
      console.error("Errore sincronizzazione tema:", e);
    }
  }
});
