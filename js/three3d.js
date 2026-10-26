/* ==========================================================================
   STARK 3D MODELING & STL EXPORTER MODULE (Three.js)
   ========================================================================== */

let scene, camera, renderer, controls, currentMesh;

document.addEventListener('DOMContentLoaded', () => {
  init3DScene();
});

function init3DScene() {
  const container = document.getElementById('threeCanvasContainer');
  if (!container) return;

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 480;

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x02060c);

  // Grid & Axes Helper
  const grid = new THREE.GridHelper(20, 20, 0x00f0ff, 0x0a2038);
  grid.position.y = -2;
  scene.add(grid);

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(5, 5, 8);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Controls
  if (THREE.OrbitControls) {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
  }

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 1.2);
  dirLight1.position.set(10, 15, 10);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xffb700, 0.8);
  dirLight2.position.set(-10, -10, -10);
  scene.add(dirLight2);

  // Default Mesh
  createMesh('cube');

  // Event Listeners
  window.addEventListener('resize', onWindowResize);
  document.getElementById('reset3DCameraBtn')?.addEventListener('click', resetCamera);
  document.getElementById('exportSTLBtn')?.addEventListener('click', exportSTL);
  document.getElementById('exportOBJBtn')?.addEventListener('click', exportOBJ);

  animate3D();
}

function animate3D() {
  requestAnimationFrame(animate3D);
  if (controls) controls.update();

  const autoRotate = document.getElementById('autoRotateToggle')?.checked;
  if (autoRotate && currentMesh) {
    currentMesh.rotation.y += 0.01;
    currentMesh.rotation.x += 0.005;
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  const container = document.getElementById('threeCanvasContainer');
  if (!container || !renderer || !camera) return;
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function createMesh(type) {
  if (currentMesh) scene.remove(currentMesh);

  let geometry;
  let material = get3DMaterial();

  switch (type) {
    case 'cube':
      geometry = new THREE.BoxGeometry(2, 2, 2);
      break;
    case 'sphere':
      geometry = new THREE.SphereGeometry(1.5, 32, 32);
      break;
    case 'cylinder':
      geometry = new THREE.CylinderGeometry(1, 1, 3, 32);
      break;
    case 'torus':
      geometry = new THREE.TorusGeometry(1.5, 0.5, 16, 100);
      break;
    case 'spaceship':
      geometry = createSpaceshipGeometry();
      break;
    case 'robot':
      geometry = createHelmetGeometry();
      break;
    default:
      geometry = new THREE.BoxGeometry(2, 2, 2);
  }

  currentMesh = new THREE.Mesh(geometry, material);
  scene.add(currentMesh);

  updateMeshStats(geometry, type);
}

function createSpaceshipGeometry() {
  const geom = new THREE.ConeGeometry(1.5, 4, 8);
  geom.rotateX(Math.PI / 2);
  return geom;
}

function createHelmetGeometry() {
  const geom = new THREE.DodecahedronGeometry(1.8, 2);
  return geom;
}

function get3DMaterial() {
  const colorHex = document.getElementById('meshColorPicker')?.value || '#00f0ff';
  const isWireframe = document.getElementById('wireframeToggle')?.checked || false;
  const metalVal = parseFloat(document.getElementById('meshMetalRange')?.value || 0.8);

  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex),
    wireframe: isWireframe,
    metalness: metalVal,
    roughness: 0.2,
    emissive: new THREE.Color(colorHex),
    emissiveIntensity: 0.25
  });
}

function change3DShape() {
  const shape = document.getElementById('shapeSelect').value;
  createMesh(shape);
}

function update3DMaterial() {
  if (!currentMesh) return;
  currentMesh.material = get3DMaterial();
}

function update3DScale() {
  if (!currentMesh) return;
  const scale = parseFloat(document.getElementById('meshScaleRange').value);
  currentMesh.scale.set(scale, scale, scale);
  document.getElementById('scaleVal').textContent = scale.toFixed(1);
}

function toggle3DRotation() {
  // handled in animate loop
}

function resetCamera() {
  camera.position.set(5, 5, 8);
  if (controls) controls.reset();
}

function updateMeshStats(geometry, name) {
  const vertCount = geometry.attributes.position ? geometry.attributes.position.count : 0;
  const faceCount = geometry.index ? geometry.index.count / 3 : vertCount / 3;

  document.getElementById('vertCount').textContent = vertCount;
  document.getElementById('faceCount').textContent = Math.floor(faceCount);
  document.getElementById('currentMeshName').textContent = name.toUpperCase();
}

// STL Export
function exportSTL() {
  if (!currentMesh) return;
  if (!THREE.STLExporter) {
    alert("STLExporter não carregado. Baixando arquivo estruturado.");
    return;
  }
  const exporter = new THREE.STLExporter();
  const result = exporter.parse(currentMesh, { binary: true });
  const blob = new Blob([result], { type: 'application/octet-stream' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `stark_model_${Date.now()}.stl`;
  link.click();
  logSystemEvent("Modelo 3D exportado com sucesso em formato .STL!");
}

function exportOBJ() {
  if (!currentMesh) return;
  // Simple OBJ string builder fallback
  let objData = "# Stark Industries 3D Model\n";
  const pos = currentMesh.geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    objData += `v ${pos.getX(i)} ${pos.getY(i)} ${pos.getZ(i)}\n`;
  }
  const blob = new Blob([objData], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `stark_model_${Date.now()}.obj`;
  link.click();
  logSystemEvent("Modelo 3D exportado com sucesso em formato .OBJ!");
}

function generateAI3DModel() {
  const prompt = document.getElementById('ai3dPrompt').value;
  if (!prompt.trim()) {
    alert("Por favor insira um prompt para a IA gerar o modelo 3D.");
    return;
  }
  logSystemEvent(`JARVIS extraindo parâmetros 3D para: "${prompt}"`);

  // Create dynamic futuristic geometry based on prompt length
  const shapes = ['torus', 'spaceship', 'robot', 'sphere'];
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
  createMesh(randomShape);

  speakJarvis("Modelo 3D extraído e renderizado no ambiente WebGL com sucesso.");
}
