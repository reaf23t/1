import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const geometry = new THREE.SphereGeometry(15, 32, 16);

const canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 256;
const context = canvas.getContext('2d');
context.fillStyle = '#FFDD44';
context.fillRect(0, 0, 256, 256);

for (let i = 0; i < 20; i++) {
  context.fillStyle = 'rgba(139, 69, 19, 0.5)';
  context.beginPath();
  context.arc(Math.random() * 256, Math.random() * 256, Math.random() * 10, 0, 2 * Math.PI);
  context.fill();
}

const texture = new THREE.CanvasTexture(canvas);

const material = new THREE.MeshBasicMaterial({ map: texture });
const sphere = new THREE.Mesh(geometry, material);

scene.add(sphere);

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);

  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
