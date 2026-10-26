/* ==========================================================================
   STARK IMAGE CREATOR & CANVAS EDITOR MODULE
   ========================================================================== */

let imgCanvas, imgCtx;
let loadedImage = null;
let currentInvert = false;
let currentSepia = false;

document.addEventListener('DOMContentLoaded', () => {
  initImageCanvas();
});

function initImageCanvas() {
  imgCanvas = document.getElementById('imageCanvas');
  if (!imgCanvas) return;
  imgCtx = imgCanvas.getContext('2d');

  imgCanvas.width = 600;
  imgCanvas.height = 400;

  // Render initial default canvas
  drawDefaultCanvasContent();
}

function drawDefaultCanvasContent() {
  if (!imgCtx) return;
  imgCtx.fillStyle = '#030810';
  imgCtx.fillRect(0, 0, imgCanvas.width, imgCanvas.height);

  // Draw HUD Grid
  imgCtx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
  imgCtx.lineWidth = 1;
  for (let x = 0; x < imgCanvas.width; x += 40) {
    imgCtx.beginPath();
    imgCtx.moveTo(x, 0);
    imgCtx.lineTo(x, imgCanvas.height);
    imgCtx.stroke();
  }
  for (let y = 0; y < imgCanvas.height; y += 40) {
    imgCtx.beginPath();
    imgCtx.moveTo(0, y);
    imgCtx.lineTo(imgCanvas.width, y);
    imgCtx.stroke();
  }

  // Stark HUD Circle Graphic
  imgCtx.strokeStyle = '#00f0ff';
  imgCtx.lineWidth = 3;
  imgCtx.beginPath();
  imgCtx.arc(imgCanvas.width / 2, imgCanvas.height / 2, 80, 0, Math.PI * 2);
  imgCtx.stroke();

  // Text
  imgCtx.font = '24px Orbitron';
  imgCtx.fillStyle = '#00f0ff';
  imgCtx.textAlign = 'center';
  imgCtx.fillText('STARK IMAGE STUDIO', imgCanvas.width / 2, imgCanvas.height / 2 - 110);
  imgCtx.font = '14px Rajdhani';
  imgCtx.fillStyle = '#ffb700';
  imgCtx.fillText('Carregue uma foto ou use o Gerador de Imagens IA', imgCanvas.width / 2, imgCanvas.height / 2 + 120);
}

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      loadedImage = img;
      imgCanvas.width = img.width > 1200 ? 1200 : img.width;
      imgCanvas.height = img.height > 800 ? 800 : img.height;
      renderCanvas();
      logSystemEvent("Nova imagem carregada no estúdio.");
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function renderCanvas() {
  if (!imgCtx) return;

  imgCtx.clearRect(0, 0, imgCanvas.width, imgCanvas.height);

  // Apply filters
  const bright = document.getElementById('brightRange')?.value || 100;
  const contrast = document.getElementById('contrastRange')?.value || 100;
  const sat = document.getElementById('satRange')?.value || 100;
  const hue = document.getElementById('hueRange')?.value || 0;

  let filterStr = `brightness(${bright}%) contrast(${contrast}%) saturate(${sat}%) hue-rotate(${hue}deg)`;
  if (currentInvert) filterStr += ' invert(100%)';
  if (currentSepia) filterStr += ' sepia(100%)';

  imgCtx.filter = filterStr;

  if (loadedImage) {
    imgCtx.drawImage(loadedImage, 0, 0, imgCanvas.width, imgCanvas.height);
  } else {
    drawDefaultCanvasContent();
  }

  imgCtx.filter = 'none'; // reset filter for subsequent overlay draws
}

function applyImageFilters() {
  document.getElementById('brightVal').textContent = `${document.getElementById('brightRange').value}%`;
  document.getElementById('contrastVal').textContent = `${document.getElementById('contrastRange').value}%`;
  document.getElementById('satVal').textContent = `${document.getElementById('satRange').value}%`;
  document.getElementById('hueVal').textContent = `${document.getElementById('hueRange').value}deg`;

  renderCanvas();
}

function toggleInvert() {
  currentInvert = !currentInvert;
  renderCanvas();
}

function toggleSepia() {
  currentSepia = !currentSepia;
  renderCanvas();
}

function resetImageFilters() {
  document.getElementById('brightRange').value = 100;
  document.getElementById('contrastRange').value = 100;
  document.getElementById('satRange').value = 100;
  document.getElementById('hueRange').value = 0;
  currentInvert = false;
  currentSepia = false;
  applyImageFilters();
}

function addTextToCanvas() {
  const text = document.getElementById('overlayTextInput').value;
  const color = document.getElementById('overlayTextColor').value;
  if (!text) return;

  renderCanvas(); // Redraw base first

  imgCtx.font = 'bold 36px Orbitron';
  imgCtx.fillStyle = color;
  imgCtx.shadowColor = color;
  imgCtx.shadowBlur = 15;
  imgCtx.textAlign = 'center';
  imgCtx.fillText(text, imgCanvas.width / 2, imgCanvas.height / 2);
  imgCtx.shadowBlur = 0; // reset shadow

  logSystemEvent("Texto sobreposto adicionado à imagem.");
}

function generateAIImage() {
  const prompt = document.getElementById('aiImagePrompt').value;
  const style = document.getElementById('aiImageStyle').value;

  if (!prompt.trim()) {
    alert("Digite um prompt para a IA gerar a arte.");
    return;
  }

  logSystemEvent(`Gerando arte IA estilo [${style}] para: "${prompt}"`);
  speakJarvis(`Sintetizando imagem digital no estilo ${style}.`);

  // Procedural Canvas Art Generation representing AI result
  imgCanvas.width = 640;
  imgCanvas.height = 400;
  imgCtx.fillStyle = '#050a14';
  imgCtx.fillRect(0, 0, imgCanvas.width, imgCanvas.height);

  const grad = imgCtx.createRadialGradient(320, 200, 20, 320, 200, 300);
  grad.addColorStop(0, '#00f0ff');
  grad.addColorStop(0.5, '#ffb700');
  grad.addColorStop(1, '#050a14');
  imgCtx.fillStyle = grad;
  imgCtx.beginPath();
  imgCtx.arc(320, 200, 150, 0, Math.PI * 2);
  imgCtx.fill();

  imgCtx.font = '22px Orbitron';
  imgCtx.fillStyle = '#ffffff';
  imgCtx.textAlign = 'center';
  imgCtx.fillText(`JARVIS AI ART: ${prompt.toUpperCase()}`, 320, 200);

  loadedImage = null; // AI canvas becomes new source
}

function exportEditedImage() {
  const link = document.createElement('a');
  link.download = `stark_art_${Date.now()}.png`;
  link.href = imgCanvas.toDataURL('image/png');
  link.click();
  logSystemEvent("Imagem exportada com sucesso.");
}
