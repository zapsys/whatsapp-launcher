# 📱 WhatsApp Launcher (PWA)

Aplicação web simples e instalável (PWA) para iniciar rapidamente conversas no WhatsApp a partir de um número de telefone — sem precisar salvar o contato.

## 🚀 Funcionalidades
- ✅ Máscara automática para telefone (formato BR)
- ✅ Detecção automática de dispositivo (mobile / desktop)
- ✅ Abertura inteligente:
    - App do WhatsApp (mobile)
    - WhatsApp Web (desktop fallback)
- ✅ Interface responsiva com Bootstrap (tema dark)
- ✅ Instalável como app (PWA)
- ✅ Favicon e identidade visual

## 🖥️ Demonstração

Digite um número → clique em abrir → conversa inicia instantaneamente.

## 📦 Tecnologias utilizadas
- HTML5
- JavaScript (Vanilla)
- Bootstrap 5 (Dark Theme)
- Progressive Web App (PWA)

## 📲 Instalação (PWA)

No celular:

1. Acesse o site
2. Toque no botão "Instalar app" (canto inferior direito)
3. Ou use:
    - Chrome: "Adicionar à tela inicial"
    - Safari: "Compartilhar" → "Adicionar à Tela de Início"

## ⚙️ Como funciona

A aplicação usa o endpoint oficial:
```
https://wa.me/<numero>
```

Comportamento automático:

- 📱 Mobile → abre o app do WhatsApp
- 💻 Desktop → abre WhatsApp Web

## ⚠️ Limitações
- Não é possível escolher diretamente entre WhatsApp e WhatsApp Business
- O sistema operacional decide qual app abrir
- Validação de número é básica (não garante existência no WhatsApp)

## 📁 Estrutura do projeto
```
/whatsapp-launcher
  ├── index.html
  ├── manifest.json
  ├── sw.js
  └── icons/(several files)
```

## 🛠️ Rodando localmente
⚠️ PWA não funciona com `file://`

Use um servidor local:

**Opção 1 (Python)**

```
python -m http.server
```

**Opção 2 (Node.js)**

```
npx serve
```

## 🌐 Deploy

Pode ser hospedado em qualquer serviço estático:

- GitHub Pages
- Vercel
- Netlify

## 💡 Melhorias futuras
- Histórico de números recentes
- Integração com contatos
- Compartilhamento rápido
- Suporte a mensagens personalizadas
- Detecção mais avançada de apps instalados

## 📄 Licença

[MIT](LICENSE)
