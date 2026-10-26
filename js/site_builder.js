/* ==========================================================================
   STARK WEBSITE & LIVE CODE BUILDER MODULE
   ========================================================================== */

let activeWebTab = 'html';

const WEB_TEMPLATES = {
  portfolio: {
    html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Portfólio Stark Tech</title>
</head>
<body>
  <div class="card">
    <div class="avatar">⚡</div>
    <h1>Tony Stark</h1>
    <p>Engenheiro Chefe & Desenvolvedor Stark Industries</p>
    <button onclick="contact()">Entrar em Contato</button>
  </div>
</body>
</html>`,
    css: `body {
  background: #050a14;
  color: #fff;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
.card {
  background: #0a1426;
  border: 2px solid #00f0ff;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 0 25px rgba(0,240,255,0.3);
}
.avatar {
  font-size: 50px;
  margin-bottom: 10px;
}
button {
  background: #00f0ff;
  color: #000;
  border: none;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 6px;
  margin-top: 15px;
}`,
    js: `function contact() {
  alert('Mensagem enviada diretamente para a central JARVIS!');
}`
  },

  landing: {
    html: `<!DOCTYPE html>
<html>
<head><title>Stark AI Landing</title></head>
<body>
  <header>
    <h1>JARVIS AI PROTOCOL</h1>
    <p>A Próxima Geração de Inteligência Artificial Multidisciplinar</p>
  </header>
  <main>
    <div class="box">⚡ 3D Engine</div>
    <div class="box">🤖 Arduino C++</div>
    <div class="box">🎥 Media Studio</div>
  </main>
</body>
</html>`,
    css: `body {
  background: #02060c;
  color: #00f0ff;
  font-family: sans-serif;
  text-align: center;
  padding: 40px;
}
main {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}
.box {
  background: rgba(0,240,255,0.1);
  border: 1px solid #00f0ff;
  padding: 20px;
  border-radius: 8px;
  width: 150px;
}`,
    js: `console.log('Landing Page IA Pronta!');`
  },

  cyber: {
    html: `<!DOCTYPE html>
<html>
<head><title>Cyber Dashboard</title></head>
<body>
  <div class="hud">
    <h2>[ CYBER DASHBOARD ONLINE ]</h2>
    <div class="pulse">STATUS: 100% OPERACIONAL</div>
  </div>
</body>
</html>`,
    css: `body {
  background: #000;
  color: #ffb700;
  font-family: monospace;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.hud {
  border: 2px dashed #ffb700;
  padding: 40px;
  text-align: center;
}
.pulse {
  color: #00ff88;
  animation: blink 1s infinite;
}
@keyframes blink { 50% { opacity: 0.3; } }`,
    js: `// Cyber Dashboard Script`
  }
};

document.addEventListener('DOMContentLoaded', () => {
  updateWebPreview();
});

function switchWebCodeTab(tab) {
  activeWebTab = tab;
  document.querySelectorAll('.web-tab-btn').forEach(b => b.classList.remove('active'));

  const activeBtn = document.querySelector(`.web-tab-btn[onclick="switchWebCodeTab('${tab}')"]`);
  if (activeBtn) activeBtn.classList.add('active');

  document.getElementById('webHtmlEditor').style.display = tab === 'html' ? 'block' : 'none';
  document.getElementById('webCssEditor').style.display = tab === 'css' ? 'block' : 'none';
  document.getElementById('webJsEditor').style.display = tab === 'js' ? 'block' : 'none';
}

function updateWebPreview() {
  const html = document.getElementById('webHtmlEditor').value;
  const css = document.getElementById('webCssEditor').value;
  const js = document.getElementById('webJsEditor').value;

  const previewFrame = document.getElementById('webPreviewFrame');
  const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;

  frameDoc.open();
  frameDoc.write(`
    ${html}
    <style>${css}</style>
    <script>${js}</script>
  `);
  frameDoc.close();
}

function loadWebTemplate(type) {
  if (WEB_TEMPLATES[type]) {
    document.getElementById('webHtmlEditor').value = WEB_TEMPLATES[type].html;
    document.getElementById('webCssEditor').value = WEB_TEMPLATES[type].css;
    document.getElementById('webJsEditor').value = WEB_TEMPLATES[type].js;
    updateWebPreview();
    logSystemEvent(`Template de Website carregado: ${type.toUpperCase()}`);
  }
}

function downloadWebsiteCode() {
  const html = document.getElementById('webHtmlEditor').value;
  const css = document.getElementById('webCssEditor').value;
  const js = document.getElementById('webJsEditor').value;

  const fullSite = `
${html}
<style>
${css}
</style>
<script>
${js}
</script>
`;

  const blob = new Blob([fullSite], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `stark_website_${Date.now()}.html`;
  link.click();
  logSystemEvent("Código-fonte do Website baixado com sucesso.");
}
