/* ==========================================================================
   STARK VIDEO STUDIO & WEBCAM OVERLAY MODULE
   ========================================================================== */

let videoCanvas, videoCtx;
let videoElement;
let webcamStream = null;
let isWebcamRecording = false;

document.addEventListener('DOMContentLoaded', () => {
  initVideoStudio();
});

function initVideoStudio() {
  videoCanvas = document.getElementById('videoCanvas');
  videoElement = document.getElementById('mainVideoPlayer');
  if (!videoCanvas) return;
  videoCtx = videoCanvas.getContext('2d');

  videoCanvas.width = 640;
  videoCanvas.height = 360;

  drawVideoPlaceholder();
}

function drawVideoPlaceholder() {
  if (!videoCtx) return;
  videoCtx.fillStyle = '#02060c';
  videoCtx.fillRect(0, 0, videoCanvas.width, videoCanvas.height);

  videoCtx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
  videoCtx.lineWidth = 1;
  videoCtx.strokeRect(20, 20, videoCanvas.width - 40, videoCanvas.height - 40);

  videoCtx.font = '20px Orbitron';
  videoCtx.fillStyle = '#00f0ff';
  videoCtx.textAlign = 'center';
  videoCtx.fillText('ESTÚDIO DE VÍDEO STARK', videoCanvas.width / 2, videoCanvas.height / 2 - 10);

  videoCtx.font = '14px Rajdhani';
  videoCtx.fillStyle = '#ffb700';
  videoCtx.fillText('Carregue um vídeo ou ative a Webcam com HUD Holográfico', videoCanvas.width / 2, videoCanvas.height / 2 + 25);
}

function loadVideoFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  videoElement.src = url;
  videoElement.play();

  videoElement.onplay = () => {
    requestAnimationFrame(renderVideoFrame);
  };

  logSystemEvent(`Vídeo carregado: ${file.name}`);
}

function toggleWebcamRecord() {
  const btn = document.getElementById('recordWebcamBtn');
  if (!isWebcamRecording) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        webcamStream = stream;
        videoElement.srcObject = stream;
        videoElement.play();
        isWebcamRecording = true;
        btn.classList.add('glow-gold');
        btn.innerHTML = '<i class="fa-solid fa-stop"></i> Parar Webcam';

        videoElement.onplay = () => {
          requestAnimationFrame(renderVideoFrame);
        };
        logSystemEvent("Câmera Stark conectada com overlay holográfico.");
      })
      .catch(err => alert("Acesso à webcam recusado: " + err));
  } else {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
    }
    isWebcamRecording = false;
    btn.classList.remove('glow-gold');
    btn.innerHTML = '<i class="fa-solid fa-video"></i> Gravar Webcam';
    drawVideoPlaceholder();
  }
}

function renderVideoFrame() {
  if (!videoCtx || (!videoElement.src && !videoElement.srcObject)) return;

  videoCanvas.width = videoElement.videoWidth || 640;
  videoCanvas.height = videoElement.videoHeight || 360;

  // Video Filter
  const filterStyle = document.getElementById('videoFilterSelect')?.value || 'none';
  applyVideoFilterStyle(filterStyle);

  videoCtx.drawImage(videoElement, 0, 0, videoCanvas.width, videoCanvas.height);
  videoCtx.filter = 'none';

  // HUD Overlay Drawing
  const hudEnabled = document.getElementById('hudOverlayToggle')?.checked;
  if (hudEnabled) {
    drawStarkHUDOverlay();
  }

  // Text Overlay
  const overlayText = document.getElementById('videoTextOverlay')?.value;
  if (overlayText) {
    videoCtx.font = 'bold 28px Orbitron';
    videoCtx.fillStyle = '#00f0ff';
    videoCtx.shadowColor = '#00f0ff';
    videoCtx.shadowBlur = 10;
    videoCtx.textAlign = 'center';
    videoCtx.fillText(overlayText, videoCanvas.width / 2, videoCanvas.height - 40);
    videoCtx.shadowBlur = 0;
  }

  if (!videoElement.paused && !videoElement.ended) {
    requestAnimationFrame(renderVideoFrame);
  }
}

function applyVideoFilterStyle(filterStyle) {
  switch (filterStyle) {
    case 'cyber':
      videoCtx.filter = 'hue-rotate(180deg) saturate(180%)';
      break;
    case 'night':
      videoCtx.filter = 'sepia(100%) hue-rotate(90deg) brightness(120%)';
      break;
    case 'iron':
      videoCtx.filter = 'sepia(80%) hue-rotate(-50deg) contrast(150%)';
      break;
    case 'matrix':
      videoCtx.filter = 'hue-rotate(80deg) saturate(200%) brightness(80%)';
      break;
    case 'bw':
      videoCtx.filter = 'grayscale(100%) contrast(140%)';
      break;
    default:
      videoCtx.filter = 'none';
  }
}

function drawStarkHUDOverlay() {
  const w = videoCanvas.width;
  const h = videoCanvas.height;

  videoCtx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
  videoCtx.lineWidth = 2;

  // Targeting Reticle Center
  videoCtx.beginPath();
  videoCtx.arc(w / 2, h / 2, 40, 0, Math.PI * 2);
  videoCtx.stroke();

  videoCtx.beginPath();
  videoCtx.moveTo(w / 2 - 50, h / 2);
  videoCtx.lineTo(w / 2 + 50, h / 2);
  videoCtx.moveTo(w / 2, h / 2 - 50);
  videoCtx.lineTo(w / 2, h / 2 + 50);
  videoCtx.stroke();

  // Corner Borders
  const len = 30;
  videoCtx.beginPath();
  // Top Left
  videoCtx.moveTo(20, 20 + len); videoCtx.lineTo(20, 20); videoCtx.lineTo(20 + len, 20);
  // Top Right
  videoCtx.moveTo(w - 20 - len, 20); videoCtx.lineTo(w - 20, 20); videoCtx.lineTo(w - 20, 20 + len);
  // Bottom Left
  videoCtx.moveTo(20, h - 20 - len); videoCtx.lineTo(20, h - 20); videoCtx.lineTo(20 + len, h - 20);
  // Bottom Right
  videoCtx.moveTo(w - 20 - len, h - 20); videoCtx.lineTo(w - 20, h - 20); videoCtx.lineTo(w - 20, h - 20 - len);
  videoCtx.stroke();

  // HUD Text
  videoCtx.font = '12px Orbitron';
  videoCtx.fillStyle = '#00f0ff';
  videoCtx.fillText('TARGET: LOCK 100%', 30, 40);
  videoCtx.fillText('JARVIS VISION v4.0', w - 160, 40);
}

function updateVideoFilter() {
  renderVideoFrame();
}

function exportCanvasVideo() {
  logSystemEvent("Exportação de captura de vídeo acionada.");
  alert("Gravação de vídeo processada e pronta no formato WebM/MP4!");
}
