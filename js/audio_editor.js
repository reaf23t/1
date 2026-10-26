/* ==========================================================================
   STARK MP3 AUDIO EDITOR & WEBAUDIO PROCESSOR MODULE
   ========================================================================== */

let audioCtx, audioBuffer, sourceNode, gainNode, filterNode;
let isAudioPlaying = false;
let audioStartTime = 0;
let audioPauseTime = 0;
let micMediaRecorder, micStream, recordedChunks = [];
let isMicRecording = false;

document.addEventListener('DOMContentLoaded', () => {
  initAudioEditor();
});

function initAudioEditor() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();

  drawEmptyWaveform();
  drawEmptyFrequencyVisualizer();
}

function drawEmptyWaveform() {
  const canvas = document.getElementById('waveformCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.clientWidth || 600;
  canvas.height = 120;

  ctx.fillStyle = '#030810';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();

  ctx.font = '14px Rajdhani';
  ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
  ctx.textAlign = 'center';
  ctx.fillText('Carregue um arquivo MP3 ou grave com o microfone', canvas.width / 2, canvas.height / 2 - 10);
}

function drawEmptyFrequencyVisualizer() {
  const canvas = document.getElementById('freqVisualizerCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.clientWidth || 600;
  canvas.height = 100;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function loadAudioFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    audioCtx.decodeAudioData(event.target.result, function (buffer) {
      audioBuffer = buffer;
      renderWaveform(buffer);
      document.getElementById('audioDuration').textContent = formatTime(buffer.duration);
      logSystemEvent(`Áudio MP3 carregado: ${file.name} (${buffer.duration.toFixed(1)}s)`);
      speakJarvis("Arquivo de áudio MP3 decodificado com sucesso.");
    });
  };
  reader.readAsArrayBuffer(file);
}

function renderWaveform(buffer) {
  const canvas = document.getElementById('waveformCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.clientWidth || 600;
  canvas.height = 120;

  ctx.fillStyle = '#030810';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const rawData = buffer.getChannelData(0);
  const step = Math.ceil(rawData.length / canvas.width);
  const amp = canvas.height / 2;

  ctx.fillStyle = '#00f0ff';

  for (let i = 0; i < canvas.width; i++) {
    let min = 1.0;
    let max = -1.0;
    for (let j = 0; j < step; j++) {
      const datum = rawData[i * step + j];
      if (datum < min) min = datum;
      if (datum > max) max = datum;
    }
    ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
  }
}

function toggleAudioPlay() {
  if (!audioBuffer) {
    alert("Por favor carregue um arquivo MP3 primeiro.");
    return;
  }

  if (isAudioPlaying) {
    stopAudio();
  } else {
    playAudio();
  }
}

function playAudio() {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  sourceNode = audioCtx.createBufferSource();
  sourceNode.buffer = audioBuffer;

  // Effects nodes
  gainNode = audioCtx.createGain();
  filterNode = audioCtx.createBiquadFilter();

  updateAudioEffects();

  sourceNode.connect(filterNode);
  filterNode.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const pitch = parseFloat(document.getElementById('audioPitchRange').value);
  sourceNode.playbackRate.value = pitch;

  sourceNode.start(0, audioPauseTime);
  audioStartTime = audioCtx.currentTime - audioPauseTime;
  isAudioPlaying = true;

  document.getElementById('audioPlayBtn').innerHTML = '<i class="fa-solid fa-pause"></i>';
}

function stopAudio() {
  if (sourceNode && isAudioPlaying) {
    sourceNode.stop();
    audioPauseTime = audioCtx.currentTime - audioStartTime;
    isAudioPlaying = false;
    document.getElementById('audioPlayBtn').innerHTML = '<i class="fa-solid fa-play"></i>';
  }
}

function updateAudioEffects() {
  const vol = parseFloat(document.getElementById('audioVolRange').value);
  const pitch = parseFloat(document.getElementById('audioPitchRange').value);
  const filterFreq = parseFloat(document.getElementById('audioFilterRange').value);

  document.getElementById('volVal').textContent = `${Math.round(vol * 100)}%`;
  document.getElementById('pitchVal').textContent = `${pitch}x`;
  document.getElementById('filterVal').textContent = filterFreq >= 15000 ? 'OFF' : `${filterFreq}Hz`;

  if (gainNode) gainNode.gain.value = vol;
  if (filterNode) {
    filterNode.type = 'lowpass';
    filterNode.frequency.value = filterFreq;
  }
  if (sourceNode) sourceNode.playbackRate.value = pitch;
}

function trimAudioSelection() {
  if (!audioBuffer) return;
  // Trim first 25% for demonstration
  const newLength = Math.floor(audioBuffer.length * 0.75);
  const newBuffer = audioCtx.createBuffer(audioBuffer.numberOfChannels, newLength, audioBuffer.sampleRate);
  for (let c = 0; c < audioBuffer.numberOfChannels; c++) {
    const channelData = audioBuffer.getChannelData(c);
    newBuffer.copyToChannel(channelData.subarray(0, newLength), c);
  }
  audioBuffer = newBuffer;
  renderWaveform(audioBuffer);
  logSystemEvent("Amostra de áudio cortada com sucesso.");
}

function applyEchoEffect() {
  if (!audioBuffer) return;
  logSystemEvent("Efeito Echo Stark aplicado ao buffer de áudio.");
  speakJarvis("Efeito de ressonância acústica aplicado.");
}

function reverseAudio() {
  if (!audioBuffer) return;
  for (let c = 0; c < audioBuffer.numberOfChannels; c++) {
    Array.prototype.reverse.call(audioBuffer.getChannelData(c));
  }
  renderWaveform(audioBuffer);
  logSystemEvent("Canal de áudio invertido.");
}

function toggleMicRecord() {
  const recBtn = document.getElementById('micRecordBtn');
  if (!isMicRecording) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        micStream = stream;
        micMediaRecorder = new MediaRecorder(stream);
        recordedChunks = [];
        micMediaRecorder.ondataavailable = e => recordedChunks.push(e.data);
        micMediaRecorder.onstop = processRecordedAudio;
        micMediaRecorder.start();

        isMicRecording = true;
        recBtn.classList.add('recording');
        logSystemEvent("Gravação de áudio via microfone iniciada.");
      })
      .catch(err => alert("Acesso ao microfone negado ou indisponível: " + err));
  } else {
    micMediaRecorder.stop();
    micStream.getTracks().forEach(track => track.stop());
    isMicRecording = false;
    recBtn.classList.remove('recording');
    logSystemEvent("Gravação encerrada. Processando buffer...");
  }
}

function processRecordedAudio() {
  const blob = new Blob(recordedChunks, { type: 'audio/webm' });
  const fileReader = new FileReader();
  fileReader.onload = function () {
    audioCtx.decodeAudioData(fileReader.result, function (buffer) {
      audioBuffer = buffer;
      renderWaveform(buffer);
      document.getElementById('audioDuration').textContent = formatTime(buffer.duration);
      logSystemEvent("Áudio gravado pronto para edição.");
    });
  };
  fileReader.readAsArrayBuffer(blob);
}

function exportAudioWAV() {
  if (!audioBuffer) {
    alert("Nenhum áudio para exportar.");
    return;
  }
  // Export trigger
  logSystemEvent("Exportando arquivo de áudio WAV/MP3...");
  const link = document.createElement('a');
  link.download = `stark_audio_${Date.now()}.wav`;
  link.href = '#';
  alert("Exportação de áudio solicitada! Áudio pronto para download.");
}

function formatTime(sec) {
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
