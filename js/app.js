let deferredPrompt;

const input = document.getElementById('telefone');
const msg = document.getElementById('msg');
const btn = document.getElementById('btnAbrir');

// =====================
// 📲 PWA INSTALL TOAST
// =====================
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const toastEl = document.getElementById('installToast');
  const toast = new bootstrap.Toast(toastEl, {
    delay: 10000
  });

  toast.show();

  document.getElementById('installAction').onclick = async () => {
    toast.hide();

    if (deferredPrompt) {
      deferredPrompt.prompt();

      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('PWA instalado');
      }

      deferredPrompt = null;
    }
  };
});
// =====================
// 📞 MÁSCARA TELEFONE
// =====================
input.addEventListener('input', () => {
  let v = input.value.replace(/\D/g, '');

  if (v.length > 11) v = v.slice(0, 11);

  if (v.length > 6) {
    v = v.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
  } else if (v.length > 2) {
    v = v.replace(/(\d{2})(\d+)/, '($1) $2');
  }
  input.value = v;
});
// =====================
// 📱 DETECÇÃO DEVICES
// =====================
function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}
function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}
// =====================
// 📱 DETECTAR VARIANTES
// =====================
function getPreferredWhatsApp() {
  return localStorage.getItem("wa_variant") || "standard";
}
function setPreferredWhatsApp(type) {
  localStorage.setItem("wa_variant", type);
}
// =====================
// 🚀 ABRIR WHATSAPP
// =====================
function abrirWhats() {
  let numero = input.value.replace(/\D/g, '');

  if (!numero.startsWith('55')) {
    numero = '55' + numero;
  }
  if (numero.length < 12) {
    msg.innerText = 'Número inválido';
    msg.classList.add('text-danger');
    return;
  }

  msg.classList.remove('text-danger');
  msg.innerText = 'Abrindo...';

  const texto = encodeURIComponent("");
  const variant = getPreferredWhatsApp();

  const urlWeb = `https://web.whatsapp.com/send?phone=${numero}&text=${texto}`;
  const urlApp = `https://wa.me/${numero}?text=${texto}`;

  if (isMobile()) {

    if (isAndroid()) {
      const intentPackage = variant === "business"
        ? "com.whatsapp.w4b"
        : "com.whatsapp";

      const intentUrl = `intent://send?phone=${numero}&text=${texto}#Intent;scheme=whatsapp;package=${intentPackage};end`;

      window.location.href = intentUrl;

      // fallback para wa.me
      setTimeout(() => {
        window.location.href = urlApp;
      }, 1500);
    } else if (isiOS()) {
      // iOS não permite escolher app → usa padrão
      window.location.href = urlApp;
    }
  } else {
    // Desktop → abre WhatsApp Web
    window.open(urlWeb, '_blank');
  }
}
// =====================
// 🎯 EVENTO BOTÃO
// =====================
btn.addEventListener('click', abrirWhats);

// =====================
// ⚙️ SERVICE WORKER
// =====================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('js/sw.js', { scope: '/' })
        .catch(err => console.error('SW erro:', err));
}
