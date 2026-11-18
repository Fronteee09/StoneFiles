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

function applyTheme(font, bg, darkness, blur) {
  let style = document.getElementById('sf-custom-theme-style');
  if (!style) {
    style = document.createElement('style');
    style.id = 'sf-custom-theme-style';
    document.head.appendChild(style);
  }

  let cssRules = `
    @font-face { font-family: 'Minecraft'; src: url('Minecraft.ttf') format('truetype'); }
    @font-face { font-family: 'MineCrafter'; src: url('MineCrafter.ttf') format('truetype'); }
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

  const bgImg = bg || 'sfondoindex.png';
  const darkVal = darkness !== undefined && darkness !== null ? darkness : '0.65';
  const isBlurred = (blur === true || blur === 'true');
  const blurPx = isBlurred ? '6px' : '0px';
  const scaleVal = isBlurred ? 'scale(1.04)' : 'scale(1)';

  cssRules += `
    body {
      background: transparent !important;
      position: relative;
    }
    body::before {
      content: "";
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      z-index: -1;
      background: linear-gradient(rgba(0, 0, 0, ${darkVal}), rgba(0, 0, 0, ${darkVal})), url('${bgImg}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      filter: blur(${blurPx});
      transform: ${scaleVal};
      pointer-events: none;
    }
  `;

  style.innerHTML = cssRules;
}

// 1. Caricamento immediato da localStorage
const cachedFont = localStorage.getItem('sf_font') || 'Minecraft';
const cachedBg = localStorage.getItem('sf_bg') || 'sfondoindex.png';
const cachedDarkness = localStorage.getItem('sf_brightness') || '0.65';
const cachedBlur = localStorage.getItem('sf_blur') === 'true';

applyTheme(cachedFont, cachedBg, cachedDarkness, cachedBlur);

// 2. Sincronizzazione con account Firebase
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const snap = await getDoc(doc(db, "userSettings", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        const font = data.font || cachedFont;
        const bg = data.background || cachedBg;
        const darkness = data.brightness !== undefined ? data.brightness : cachedDarkness;
        const blur = data.blur !== undefined ? data.blur : cachedBlur;

        localStorage.setItem('sf_font', font);
        localStorage.setItem('sf_bg', bg);
        localStorage.setItem('sf_brightness', darkness);
        localStorage.setItem('sf_blur', String(blur));

        applyTheme(font, bg, darkness, blur);
      }
    } catch (e) {
      console.error("Theme sync error:", e);
    }
  }
});
