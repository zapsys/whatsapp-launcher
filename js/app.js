let deferredPrompt;

const input = document.getElementById('telefone');
const msg = document.getElementById('msg');
const btn = document.getElementById('btnAbrir');

// Máscara inteligente enquanto digita
input.addEventListener('input', () => {
  input.value = formatarNumero(input.value);
});

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
// ===============================
// 📞 LÓGICA NÚMERO DE TELEFONE
// ===============================
function parseNumero(valor) {
  let numero = valor.replace(/\D/g, '');

  const especial = /^(0800|0500|4001|4003|4004|3003)/.test(numero);

  if (especial) {
    return {
      tipo: 'especial',
      numero,
      valido: numero.length >= 8
    };
  }
  if (numero.length < 10) {
    return { valido: false };
  }

  let ddd = numero.slice(0, 2);
  let restante = numero.slice(2);

  // Detecta tipo
  let tipo = restante.length === 9 ? 'celular' : 'fixo';

  // Corrige celular sem 9
  if (restante.length === 8 && /^[6-9]/.test(restante)) {
    restante = '9' + restante;
    tipo = 'celular';
  }
  return {
    tipo,
    ddd,
    numero: ddd + restante,
    valido: true
  };
}
// =================================
// 📞 MÁSCARA INTELIGENTE TELEFONE
// =================================
function formatarNumero(valor) {
  let v = valor.replace(/\D/g, '');

  // Números especiais
  if (/^(0800|4004|4001)/.test(v)) {
    if (v.startsWith('0800')) {
      return v.replace(/(\d{4})(\d{3})(\d{0,4})/, (_, a, b, c) =>
        [a, b, c].filter(Boolean).join(' ')
      );
    }
    return v.replace(/(\d{4})(\d{0,4})/, (_, a, b) =>
      b ? `${a}-${b}` : a
    );
  }
  if (v.length > 11) v = v.slice(0, 11);

  if (v.length > 10) {
    return v.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
  } else if (v.length > 6) {
    return v.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
  } else if (v.length > 2) {
    return v.replace(/(\d{2})(\d+)/, '($1) $2');
  }
  return v;
}
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
  const parsed = parseNumero(input.value);

  if (!parsed.valido) {
    msg.innerText = 'Número inválido';
    msg.classList.add('text-danger');
    return;
  }

  let numeroFinal = parsed.numero;

  // Só adiciona +55 se não for especial
  if (parsed.tipo !== 'especial') {
    numeroFinal = '55' + numeroFinal;
  }

  msg.classList.remove('text-danger');

  if (parsed.tipo === 'especial') {
    msg.innerText = 'Número especial — pode não funcionar no WhatsApp';
  } else {
    msg.innerText = 'Abrindo...';
  }

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

// ===========================================
// ⚙️ SERVICE WORKER | 🔄 AUTO UPDATE PWA
// ===========================================
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('js/sw.js', { scope: '/' }).then(reg => {

    // Detecta nova versão
    reg.onupdatefound = () => {
      const newWorker = reg.installing;

      newWorker.onstatechange = () => {
        if (newWorker.state === 'installed') {

          if (navigator.serviceWorker.controller) {
            console.log('Nova versão disponível');

            // força ativação
            newWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        }
      };
    };
  });
  // Reload automático quando atualizar
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Atualizado — recarregando...');
    window.location.reload();
  });
}
