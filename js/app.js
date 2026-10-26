/* ==========================================================================
   STARK INDUSTRIES J.A.R.V.I.S. OS v4.0 - CORE APP LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initTabNavigation();
  initJarvisVoice();
  initArcReactor();
  simulateSystemStats();
});

// Stark Clock
function initClock() {
  const clockEl = document.getElementById('starkClock');
  function updateTime() {
    const now = new Date();
    clockEl.textContent = now.toTimeString().split(' ')[0];
  }
  updateTime();
  setInterval(updateTime, 1000);
}

// Navigation Tabs
function initTabNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabTarget = item.getAttribute('data-tab');
      switchTab(tabTarget);
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

  const activeNav = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
  const activeContent = document.getElementById(tabId);

  if (activeNav) activeNav.classList.add('active');
  if (activeContent) activeContent.classList.add('active');

  logSystemEvent(`Módulo alterado para: ${tabId.replace('tab-', '').toUpperCase()}`);
}

// ARC Reactor Pulse Effect & Confetti Easter Egg
function initArcReactor() {
  const arc = document.getElementById('arcReactor');
  if (!arc) return;
  arc.addEventListener('click', () => {
    logSystemEvent("ARC Reactor Core sobrecarregado com pulso quântico!");
    speakJarvis("Pulso de energia do Reator Arc disparado. Todos os sistemas no máximo.");
    if (window.confetti) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.1, x: 0.1 },
        colors: ['#00f0ff', '#ffb700', '#ffffff']
      });
    }
  });
}

// System Logs
function logSystemEvent(msg) {
  const logsEl = document.getElementById('systemLogs');
  if (!logsEl) return;
  const time = new Date().toLocaleTimeString();
  logsEl.innerHTML += `<br>[${time}] ${msg}`;
  logsEl.scrollTop = logsEl.scrollHeight;
}

// System Stats Simulation
function simulateSystemStats() {
  setInterval(() => {
    const cpu = Math.floor(Math.random() * 25) + 10;
    const ram = (3.8 + Math.random() * 0.8).toFixed(1);
    const cpuEl = document.getElementById('cpuUsage');
    const ramEl = document.getElementById('ramUsage');
    if (cpuEl) cpuEl.textContent = `${cpu}%`;
    if (ramEl) ramEl.textContent = `${ram} GB`;
  }, 3000);
}

// JARVIS Speech & Voice Synthesis
let speechSynth = window.speechSynthesis;
let isVoiceActive = false;

function speakJarvis(text) {
  if (!speechSynth) return;
  speechSynth.cancel(); // Stop any active speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-BR';
  utterance.rate = 1.05;
  utterance.pitch = 0.95;

  const stateEl = document.getElementById('jarvisState');
  if (stateEl) stateEl.textContent = "FALANDO...";

  utterance.onend = () => {
    if (stateEl) stateEl.textContent = "PRONTO";
  };

  speechSynth.speak(utterance);
}

function initJarvisVoice() {
  const voiceBtn = document.getElementById('toggleVoiceBtn');
  const speakBtn = document.getElementById('jarvisSpeakBtn');

  if (speakBtn) {
    speakBtn.addEventListener('click', () => {
      speakJarvis("Sistemas Stark operando em perfeita harmonia. Jarvis à sua disposição.");
    });
  }

  // Web Speech API Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition && voiceBtn) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;

    voiceBtn.addEventListener('click', () => {
      if (!isVoiceActive) {
        recognition.start();
        voiceBtn.classList.add('glow-gold');
        voiceBtn.querySelector('span').textContent = "OUPINDO...";
        isVoiceActive = true;
        logSystemEvent("Reconhecimento de Voz ativado.");
      } else {
        recognition.stop();
        voiceBtn.classList.remove('glow-gold');
        voiceBtn.querySelector('span').textContent = "JARVIS VOICE";
        isVoiceActive = false;
      }
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      logSystemEvent(`Comando de Voz Recebido: "${transcript}"`);
      document.getElementById('aiInput').value = transcript;
      sendJarvisMessage();
      voiceBtn.classList.remove('glow-gold');
      voiceBtn.querySelector('span').textContent = "JARVIS VOICE";
      isVoiceActive = false;
    };

    recognition.onerror = () => {
      voiceBtn.classList.remove('glow-gold');
      voiceBtn.querySelector('span').textContent = "JARVIS VOICE";
      isVoiceActive = false;
    };
  }
}

// JARVIS AI Chat Logic
function quickPrompt(promptText) {
  const input = document.getElementById('aiInput');
  if (input) {
    input.value = promptText;
    sendJarvisMessage();
  }
}

function sendJarvisMessage() {
  const input = document.getElementById('aiInput');
  const chatDisplay = document.getElementById('chatDisplay');
  if (!input || !input.value.trim()) return;

  const userQuery = input.value.trim();
  input.value = '';

  // Append User Message
  appendChatMessage("Você", userQuery, "user-msg");

  // Process JARVIS Intelligent Response
  setTimeout(() => {
    const response = generateJarvisResponse(userQuery);
    appendChatMessage("J.A.R.V.I.S.", response, "jarvis-msg");
    speakJarvis(response.replace(/<[^>]*>?/gm, ''));
  }, 600);
}

function appendChatMessage(author, text, className) {
  const chatDisplay = document.getElementById('chatDisplay');
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${className}`;
  msgDiv.innerHTML = `
    <div class="msg-author">${author}</div>
    <div class="msg-text">${text}</div>
    <div class="msg-time">${time}</div>
  `;
  chatDisplay.appendChild(msgDiv);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

function generateJarvisResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('3d') || q.includes('modelo') || q.includes('nave') || q.includes('stl')) {
    switchTab('tab-3d');
    return "Abri a central de modelagem 3D, senhor. Você pode visualizar objetos futuristas, extrair formas e exportar arquivos STL prontos para impressão 3D!";
  } else if (q.includes('arduino') || q.includes('c++') || q.includes('led') || q.includes('código')) {
    switchTab('tab-arduino');
    return "Carreguei o estúdio Arduino C++. Programei um algoritmo para compilar e simular suas rotinas de controle de hardware com precisão Stark.";
  } else if (q.includes('imagem') || q.includes('foto') || q.includes('desenho') || q.includes('arte')) {
    switchTab('tab-image');
    return "Direcionando para o Criador de Imagens & Filtros IA. Você pode gerar designs futuristas e manipular imagens em tempo real.";
  } else if (q.includes('áudio') || q.includes('audio') || q.includes('mp3') || q.includes('música') || q.includes('som')) {
    switchTab('tab-audio');
    return "Módulo de Processamento de Áudio MP3 pronto. Aplique filtros de frequência, corte amostras e grave áudio diretamente no estúdio.";
  } else if (q.includes('vídeo') || q.includes('video') || q.includes('filme') || q.includes('cam')) {
    switchTab('tab-video');
    return "Estúdio de Vídeo ativado! Você pode aplicar overlays de holograma HUD em tempo real e gravar capturas de webcam.";
  } else if (q.includes('site') || q.includes('web') || q.includes('html') || q.includes('css')) {
    switchTab('tab-website');
    return "Ambiente Web Builder online. Gere sites completos em HTML5/CSS3/JS com suporte a visualização em tempo real e exportação.";
  } else if (q.includes('notícia') || q.includes('filme') || q.includes('noticias') || q.includes('repositório')) {
    switchTab('tab-hub');
    return "Carregando feed de notícias de tecnologia e banco de dados de filmes recentes no Hub Stark!";
  }

  return `Entendido, senhor. Executei uma análise em relação a "${query}". Todos os algoritmos de apoio estão ativados nas abas laterais para auxiliar no desenvolvimento.`;
}

document.getElementById('clearChatBtn')?.addEventListener('click', () => {
  const chatDisplay = document.getElementById('chatDisplay');
  chatDisplay.innerHTML = `
    <div class="chat-message jarvis-msg">
      <div class="msg-author"><i class="fa-solid fa-robot"></i> J.A.R.V.I.S.</div>
      <div class="msg-text">Histórico de conversa limpo. Como posso ajudar agora, senhor?</div>
      <div class="msg-time">Agora</div>
    </div>
  `;
});
