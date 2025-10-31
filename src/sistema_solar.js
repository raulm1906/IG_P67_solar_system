import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, renderer;
let camera;
let info;
let grid;
let estrella,
  Planetas = [],
  Lunas = [],
  Guias = [],
  Groups = [];
let t0 = 0;
let accglobal = 0.001;
let timestamp;
let camcontrols;
let ship;

var settings = {
  translateX: 0.0,
  translateY: 0.0,
  rotateZ: 0.0,
  scale: 1.0,
};

init();
animationLoop();

function init() {
  info = document.createElement("div");
  info.style.position = "absolute";
  info.style.top = "30px";
  info.style.width = "100%";
  info.style.textAlign = "center";
  info.style.color = "#fff";
  info.style.fontWeight = "bold";
  info.style.backgroundColor = "transparent";
  info.style.zIndex = "1";
  info.style.fontFamily = "Monospace";
  info.innerHTML = "Sistema solar - Raúl Marrero Marichal";
  document.body.appendChild(info);

  //Defino cámara
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 20);


  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.shadowMap.enabled = true;

  camcontrols = new FlyControls(camera, renderer.domElement);
  camcontrols.dragToLook = true;
  camcontrols.movementSpeed = 0.1;
  camcontrols.rollSpeed = 0.01;

  // Skybox de fondo
  const stars = new THREE.TextureLoader().load('textures/2k_stars_milky_way.jpg');
  stars.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = stars;

  //Objetos
  Estrella(696350, 0xffff00);
  // Tierra
  const tierraGroup = Grupo(1, 365.26, 0.0, 1.0, 1.0);

  Planeta(tierraGroup, 6378, 23.934, 23, true, true, "textures/earth/2k_earth_daymap.jpg", undefined, undefined, "textures/earth/2k_earth_normal_map.jpg", "textures/earth/2k_earth_specular_map.jpg");

  Planeta(tierraGroup, 6700, 15, 23, false, true, "textures/earth/2k_earth_clouds.jpg", undefined, "textures/earth/2k_earth_clouds.jpg");

  // Marte
  const marteGroup = Grupo(1.52, 686.98, 1.8, 1.0, 1.0);
  Planeta(marteGroup, 3397, 24.623, 25, true, true, "textures/mars/mars_1k_color.jpg", undefined, undefined, "textures/mars/mars_1k_normal.jpg");
  
  // Mercurio
  const mercuryGroup = Grupo(0.39, 87.97, 7.0, 1.0, 1.0);
  Planeta(mercuryGroup, 2439, 1407.6, 7, true, true, "textures/2k_mercury.jpg");
  // Venus
  const venusGroup = Grupo(0.72, 224.70, 3.4, 1.0, 1.0);
  Planeta(venusGroup, 6050,  5832, 177, true, true, "textures/2k_venus_surface.jpg");
  // Jupiter
  const jupiterGroup = Grupo(4.7, 4328.9, 1.3, 1.0, 1.0);
  Planeta(jupiterGroup, 71400, 9.842, 3, false, true, "textures/jupiter2_1k.jpg");
  // Saturno
  const saturnGroup = Grupo(9.54, 10752.9, 2.5, 1.0, 1.0);
  Planeta(saturnGroup, 60000, 10.233, 27, false, true, "textures/saturn/2k_saturn.jpg");
  Anillos(saturnGroup, 67300, 140300, 27, "textures/saturn/2k_saturn_ring_alpha_vert.png");
  
  // Urano
  const uranusGroup = Grupo(19.19, 30663.65, 0.8, 1.0, 1.0);
  Planeta(uranusGroup, 26200, 22, 98, false, true, "textures/uranus/uranusmap.jpg");
  Anillos(uranusGroup, 38000, 98000, 98, "textures/uranus/uranusringcolour.jpg", "textures/uranus/uranusringtrans.jpg");
  // Neptuno
  const neptuneGroup = Grupo(30, 60148.35, 1.8, 1.0, 1.0);
  Planeta(neptuneGroup, 24200, 19, 30, false, true, "textures/2k_neptune.jpg");
  // Pluton
  const plutoGroup = Grupo(39.48, 90560, 14.53, 1.0, 1.0);
  Planeta(plutoGroup, 1222.5, 81.36, 118, false, true, "textures/plutomap1k.jpg");
 
  Luna(tierraGroup, 1737, 0.2, 28, 5.1, 28, 1.0, 1.0, true, true, "textures/moonmap1k.jpg", "textures/moonbump1k.jpg");
  
  const loader = new GLTFLoader();

  loader.load('textures/outer_wilds__the_ship.glb', (gltf) => {
      ship = gltf.scene;
      ship.scale.set(0.1, 0.1, 0.1);
      scene.add(ship);
  });

  // Música de fondo
  const listener = new THREE.AudioListener();
  camera.add(listener);

  const sound = new THREE.Audio(listener);

  const audioLoader = new THREE.AudioLoader();
  audioLoader.load('src/Timber_Hearth.mp3', (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.2);
      sound.play();
  });

  //Inicio tiempo
  t0 = Date.now();
}

function Estrella(rad, col) {
  rad = rad/200000;
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("textures/2k_sun.jpg");
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  });

  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.02);
  scene.add(ambientLight);

  const light = new THREE.PointLight(0xffffff, 1, 2000); // color, intensidad, distancia
  light.position.set(0, 0, 0); // misma posición que la esfera
  light.castShadow = true;
  light.shadow.mapSize.width = 4096;
  light.shadow.mapSize.height = 4096;
  
  light.shadow.radius = 16;

  scene.add(light);
  let geometry = new THREE.SphereGeometry(rad, 32, 32);
  estrella = new THREE.Mesh(geometry, material);
  scene.add(estrella);
}

function Grupo (dist, vel, orangle, f1, f2) {
  dist = dist*20;
  vel = 20/vel;
  orangle = THREE.MathUtils.degToRad(orangle);

  const group = new THREE.Group();
  scene.add(group);

  group.userData.dist = dist;
  group.userData.speed = vel;
  group.userData.f1 = f1;
  group.userData.f2 = f2;
  group.userData.orangle = orangle;

  Groups.push(group);

  //Dibuja trayectoria, con
  let curve = new THREE.EllipseCurve(
    0,
    0, // centro
    dist * f1,
    dist * f2 // radios elipse
  );
  //Crea geometría
  let points = curve.getPoints(50);
  let geome = new THREE.BufferGeometry().setFromPoints(points);
  let mate = new THREE.LineBasicMaterial({ color: 0xffffff });
  // Objeto
  let orbita = new THREE.Line(geome, mate);
  orbita.rotation.x = Math.PI/2-orangle;


  scene.add(orbita);
  
  return group;
}

function Planeta(group, radio, rot, tilt, cShadow, rShadow, text, bump, texalpha, normals, spec) {
  radio = radio/10000;
  rot = 1/(rot*10);
  tilt = THREE.MathUtils.degToRad(tilt);

  const mat = new THREE.MeshPhongMaterial({color: 0xffffff});

  if (text != undefined) {
    const texture = new THREE.TextureLoader().load(text);
    mat.map = texture;
  }

  if (bump != undefined) {
    const bumpMap = new THREE.TextureLoader().load(bump); 
    mat.bumpMap = bumpMap;
    mat.bumpScale = 0.02;
  }
  
  if (normals != undefined) {
    const normalText = new THREE.TextureLoader().load(normals); 
    mat.normalMap = normalText;
    mat.normalScale.set(10, 10)
  }

  if (texalpha != undefined) {
    const alpha = new THREE.TextureLoader().load(texalpha);
    mat.alphaMap = alpha;
    mat.transparent = true;
    mat.side = THREE.DoubleSide;
    mat.opacity = 1.0;
  }

  if (spec != undefined) {
    const specularText = new THREE.TextureLoader().load(spec);
    mat.specular = new THREE.Color(0x4444AA);
    mat.specularMap = specularText;
    mat.shininess = 10;
  }

  let geom = new THREE.SphereGeometry(radio, 64, 64);
  //let mat = new THREE.MeshBasicMaterial({ color: col });
  let planeta = new THREE.Mesh(geom, mat);
  planeta.rotation.x = tilt;
  planeta.userData.rot = rot;

  planeta.castShadow = cShadow;
  planeta.receiveShadow = rShadow;

  Planetas.push(planeta);

  group.add(planeta);

  return planeta;
}

function Luna(planeta, radio, dist, vel, orangle, rot, f1, f2, cShadow, rShadow, text, bump) {
  radio = radio/10000
  dist = dist*15;
  vel = 20/vel;
  rot = 1/(rot*10);
  orangle = THREE.MathUtils.degToRad(orangle);
  
  const texture = new THREE.TextureLoader().load(text);
  const bumpMap = new THREE.TextureLoader().load(bump); 
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: bumpMap,
    bumpScale: 0.02,
  });

  var pivote = new THREE.Object3D();
  pivote.rotation.x = orangle;

  planeta.add(pivote);
  var geom = new THREE.SphereGeometry(radio, 10, 10);
  //var mat = new THREE.MeshBasicMaterial({ color: col });
  var luna = new THREE.Mesh(geom, mat);
  luna.userData.rot = rot;
  luna.userData.dist = dist;
  luna.userData.speed = vel;
  luna.castShadow = true;
  luna.receiveShadow = true;

  Lunas.push(luna);
  pivote.add(luna);
}

function Anillos(group, inRad, outRad, tilt, text, texalpha) {
  inRad = inRad/10000;
  outRad = outRad/10000;

  const texture = new THREE.TextureLoader().load(text);

  const geometry = new THREE.RingGeometry(inRad, outRad, 256);

  var uvs = geometry.attributes.uv.array;
  var phiSegments = geometry.parameters.phiSegments || 0;
  var thetaSegments = geometry.parameters.thetaSegments || 0;
  phiSegments = phiSegments !== undefined ? Math.max( 1, phiSegments ) : 1;
  thetaSegments = thetaSegments !== undefined ? Math.max( 3, thetaSegments ) : 8;
  for ( var c = 0, j = 0; j <= phiSegments; j ++ ) {
      for ( var i = 0; i <= thetaSegments; i ++ ) {
          uvs[c++] = i / thetaSegments,
          uvs[c++] = j / phiSegments;
      }
  }

  
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0xaaaaaa,
    side: THREE.DoubleSide,
    transparent: true
  });

  //Transparencia
  if (texalpha != undefined) {
    const alpha = new THREE.TextureLoader().load(texalpha);
    //Con mapa de transparencia
    material.alphaMap = alpha;
    material.opacity = 1.0;
  }

  const rings = new THREE.Mesh(geometry, material);

  rings.rotation.x = THREE.MathUtils.degToRad(90+tilt);
  group.add(rings)

  return rings;
}

// distancia delante de la cámara
const distance = 2;
const offsetY = -1;

function onViewChange(event) {

//save current camera params
    var cam = scene.getObjectByName( currentCamera );
    cam.position.copy(camera.position);
    cam.rotation.copy(camera.rotation);
    cam.userData[0].tX = controls.target.x;
    cam.userData[0].tY = controls.target.y;
    cam.userData[0].tZ = controls.target.z;

//set next camera positions
    var cam = scene.getObjectByName( event.detail.view );

    currentCamera = event.detail.view;

    camera = new THREE.PerspectiveCamera(cam.fov, window.innerWidth / window.innerHeight, cam.near, cam.far);
    camera.position.copy(cam.position);
    camera.rotation.copy(cam.rotation);

    controls = new THREE.OrbitControls(camera);
    controls.target = new THREE.Vector3( cam.userData[0].tX, cam.userData[0].tY, cam.userData[0].tZ );

  }

//Bucle de animación
function animationLoop() {
  timestamp = (Date.now() - t0) * accglobal;

  requestAnimationFrame(animationLoop);

  
  //Modifica rotación de todos los objetos
  for (let object of Groups) {
    object.position.x =
      Math.cos(timestamp * object.userData.speed) *
      object.userData.f1 *
      object.userData.dist;
    const z =
      Math.sin(timestamp * object.userData.speed) *
      object.userData.f2 *
      object.userData.dist;
    object.position.y =
      Math.sin(object.userData.orangle)*z;
    object.position.z = Math.cos(object.userData.orangle)*z;
  }

  for (let object of Planetas) {
    object.rotation.y += object.userData.rot;
  }

  for (let object of Lunas) {
    object.position.x =
      Math.cos(timestamp * object.userData.speed) * object.userData.dist;
    object.position.z =
      Math.sin(timestamp * object.userData.speed) * object.userData.dist;
    object.rotation.y += object.userData.rot;
  }


  if (ship) {
    // obtener la dirección hacia adelante
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);

   
    ship.position.copy(camera.position)
    .addScaledVector(dir, distance)
    .addScaledVector(camera.up, offsetY);

    const shipBaseRotation = new THREE.Quaternion();
    shipBaseRotation.setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));

    ship.quaternion.copy(camera.quaternion).multiply(shipBaseRotation);

  }
  
  camcontrols.update(1);
  renderer.render(scene, camera);
}
