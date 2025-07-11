import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(15, 15, 75);//left right //up down //zoom in out 


function addStars(count = 1000) {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];

  for (let i = 0; i < count; i++) {
    const x = THREE.MathUtils.randFloatSpread(1000);
    const y = THREE.MathUtils.randFloatSpread(1000);
    const z = THREE.MathUtils.randFloatSpread(1000);
    vertices.push(x, y, z);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  const starTexture = new THREE.TextureLoader().load('./src/texture/star.jpg');
  const material = new THREE.PointsMaterial({
    map: starTexture,
    size: 2,
    transparent: true,
    alphaTest: 0.5,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const stars = new THREE.Points(geometry, material);
  scene.add(stars);
}
addStars();




// Texture
const loader = new THREE.TextureLoader();
const sunTexture = loader.load('./src/texture/sun.jpg');
const mercuryTexture = loader.load('./src/texture/mercury.jpg');
const venusTexture = loader.load('./src/texture/venus.jpg');
const earthTexture = loader.load('./src/texture/earth.jpg');
const marsTexture = loader.load('./src/texture/mars.jpg');
const jupiterTexture = loader.load('./src/texture/jupiter.jpg');
const saturnTexture = loader.load('./src/texture/saturn.jpg');
const uranusTexture = loader.load('./src/texture/uranus.jpg');
const neptuneTexture = loader.load('./src/texture/neptune.jpg');


//sun
const geometry = new THREE.SphereGeometry(3.5, 64, 32);
const material = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(geometry, material);
scene.add(sun);


//orbit
function createOrbit(radius) {
  const curve = new THREE.EllipseCurve(
    0, 0, // ax, ay(center point of orbit)
    radius, radius, // xRadius, yRadius circular orbit
    0, 2 * Math.PI, // startAngle, endAngle
    false,  // clockwise
    0 // rotation
  );
  const points = curve.getPoints(200);//smooth curve
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 'white' });
  const orbit = new THREE.Line(geometry, material);
  orbit.rotation.x = Math.PI / 2; // rotate to make it flat (XY plane)
  scene.add(orbit);
}



// Example for Mercury orbit with radius 4
const orbitDistanceMercury = 6;
createOrbit(orbitDistanceMercury);
const mercury = createPlanet(0.19, mercuryTexture, orbitDistanceMercury, 0.02, 0.01); // radius, color, orbitDistance, speed
// Venus
const orbitDistanceVenus = 9;
createOrbit(orbitDistanceVenus);
const venus = createPlanet(0.48, venusTexture, orbitDistanceVenus, 0.015, 0.008);
// Earth
const orbitDistanceEarth = 12;
createOrbit(orbitDistanceEarth);
const earth = createPlanet(0.5, earthTexture, orbitDistanceEarth, 0.01, 0.02);
// earth.rotation.y = 1
// Mars
const orbitDistanceMars = 16;
createOrbit(orbitDistanceMars);
const mars = createPlanet(0.26, marsTexture, orbitDistanceMars, 0.008, 0.018);
// Jupiter
const orbitDistanceJupiter = 25;
createOrbit(orbitDistanceJupiter);
const jupiter = createPlanet(1.5, jupiterTexture, orbitDistanceJupiter, 0.006, 0.025);
// Saturn
const orbitDistanceSaturn = 34;
createOrbit(orbitDistanceSaturn);
const saturn = createPlanet(1.3, saturnTexture, orbitDistanceSaturn, 0.005, 0.023);
// Uranus
const orbitDistanceUranus = 44;
createOrbit(orbitDistanceUranus);
const uranus = createPlanet(1.0, uranusTexture, orbitDistanceUranus, 0.003, 0.02);
// Neptune
const orbitDistanceNeptune = 54;
createOrbit(orbitDistanceNeptune);
const neptune = createPlanet(0.95, neptuneTexture, orbitDistanceNeptune, 0.002, 0.018);


//planet
// let clock = new THREE.Clock();

function createPlanet(radius, texture, orbitRadius, Revolution, Rotation) {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide });
  const planet = new THREE.Mesh(geometry, material);
  // Orbit position (initial)
  planet.position.x = orbitRadius;

  //Rotation
  planet.rotation.y = Rotation;

  // Add to scene
  scene.add(planet);

  return {
    mesh: planet,
    orbitRadius: orbitRadius,
    angle: 0,
    speed: Revolution,
    rotationSpeed: Rotation || 0.01  // Default if not provided
  };

}

const planets = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune];
const planetData = [
  { name: 'Mercury', obj: mercury },
  { name: 'Venus', obj: venus },
  { name: 'Earth', obj: earth },
  { name: 'Mars', obj: mars },
  { name: 'Jupiter', obj: jupiter },
  { name: 'Saturn', obj: saturn },
  { name: 'Uranus', obj: uranus },
  { name: 'Neptune', obj: neptune },
];

//Create and add planet speed sliders
const slidersDiv = document.getElementById('sliders');

planetData.forEach(({ name, obj }) => {
  //Create label for each planet
  const label = document.createElement('label');
  label.style.display = 'block';
  label.style.marginBottom = '8px';
  label.style.color = 'white';

  //Add planet name text
  const title = document.createElement('span');
  title.textContent = `${name}: `;
  label.appendChild(title);

  //Create slider input
  const input = document.createElement('input');
  input.type = 'range';
  input.min = '0.001';
  input.max = '0.05';
  input.step = '0.001';
  input.value = obj.speed;
  input.style.width = '150px';
  input.style.marginLeft = '10px';

  //Updte planet speed when slider changes
  input.addEventListener('input', () => {
    obj.speed = Number(input.value);
  });

  //Append slider to label, then label to UI
  label.appendChild(input);
  slidersDiv.appendChild(label);
});



function updatePlanetOrbit(planetObj) {
  planetObj.angle += planetObj.speed;
  planetObj.mesh.position.x = planetObj.orbitRadius * Math.cos(planetObj.angle);
  planetObj.mesh.position.z = planetObj.orbitRadius * Math.sin(planetObj.angle);
}


// Point Light (from Sun)
const sunLight = new THREE.PointLight(0xffffff, 50, 0);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Ambient Light (soft fill light)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
scene.add(ambientLight);


// const helper = new THREE.PointLightHelper(sunLight, 3);
// scene.add(helper);

const glowTexture = loader.load('./src/texture/glow.png');

const spriteMaterial = new THREE.SpriteMaterial({
  map: glowTexture,
  color: 'yellow',
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const sprite = new THREE.Sprite(spriteMaterial);
sprite.scale.set(13, 9, 5); // Size of glow -- width,height,dept
sun.add(sprite); // Attach to sun so it moves with it



const canvas = document.querySelector('canvas')
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);


// reponsive
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
})


// orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.enableZoom = true;
controls.minDistance = 10;
controls.maxDistance = 100;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;


function animate() {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  planets.forEach(planet => {
    updatePlanetOrbit(planet);
    planet.mesh.rotation.y += planet.rotationSpeed; // Self-rotation
  });
  controls.update();
}
animate()
