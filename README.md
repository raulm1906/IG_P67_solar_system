# Sistema Solar
### Práctica 6-7 | Informática Gráfica

**Autor:** Raúl Marrero Marichal

**Enlace codesandbox:** https://codesandbox.io/p/sandbox/ig2526-s6-forked-lfknxj

# Desarrollo

Para el desarrollo de esta práctica se han añadido varios elementos funcionales y visuales sobre la base propuesta por el guión de la práctica, los cuales se enumerarán y explicarán con detalle a continuación.

Cabe destacar que el modelo del sistema solar no está a escala, dado que de ser así, los planetas se verían demasiado pequeños como para ser observables cómodamente. Sin embargo, se mantienen las proporciones reales entre tamaños (a excepción del Sol) y de las distancias de las órbitas (a excepción de las lunas). Además, todos los datos de las órbitas están obtenidos de fuentes reales, teniendo en cuenta datos como la inclinación de la órbita, la del propio planeta y su velocidad.

## Fondo

El fondo está definido usando la función `THREE.EquirectangularReflectionMapping`, lo cual permite simular las estrellas a partir de una imagen sin necesidad de crear cada una como un objeto 3D, dando así un aspecto más vivo al sistema y sin ser una imagen completamente estática.

## El Sol

La única estrella de nuestro sistema, está en el centro de la escena para facilitar los cálculos de las órbitas. En su interior se ha situado una fuente de luz puntual `THREE.PointLight` con la capacidad de proyectar sombras. Dicha sombra, además tiene un `radius = 16` para simular el efecto del "difuminado" propio de la umbra que cabría esperar en una situación real. Además, también se ha añadido una luz de ambiente `THREE.AmbientLight` muy tenue para una mejor visibilidad de los objetos sombreados.

La esfera que da forma al sol se sitúa alrededor de la luz puntual para dar la sensación de que es la propia esfera la que emite luz. Sin embargo, al estar la fuente de luz en el interior del objeto, provoca el problema de que el propio Sol no se ilumina gracias a esta fuente. Para solucionar este inconveniente, simplemente se utiliza `THREE.MeshBasicMaterial` al crear la esfera, y así se logra que esté siempre iluminado por sí mismo.

> **Función _Estrella_**  
rad: Radio de la estrella, en kilómetros. `<String>`  
col: Color de la esfera. `<Hex number>`

## Planetas

Para representar los planetas, se ha optado por usar un modelo de grupos orbitales, donde el grupo es el encargado de calcular el movimiento de traslación de la órbita, permitiendo independencia en cada objeto asociado al grupo (planetas, lunas y anillos) respecto a la inclinación y rotación. Por lo tanto, cada planeta cuenta con un grupo, sea el único objeto del mismo, o no. Además, la función que crea el grupo, también es la encargada de dibujar el círculo de la órbita a partir de los mismos parámetros.

Los parámetros de distancia, velocidad e inclinación de la órbita se convierten al comienzo de la función, permitiendo pasarlos en forma de unidades más sencillas de entender por las personas y similares a las usadas en astronomía.

> **Función _Grupo_**  
dist: Distancia a la estrella, en unidades astronómicas. `<Number>`  
vel: Velocidad de la órbita. Se indica como los días que tarda en completar una órbita. `<Number>`  
orangle: Inclinación de la órbita respecto al plano orbital, en grados. `<Number>`  
f1, f2: Deformación de la órbita, siendo 1 órbita circular perfecta. `<Number>`  
> 
> **Returns:**  
group: El grupo recién creado. `<THREE.Group>`

En cuanto a los planetas, se crean usando otra función la cual requiere como parámetro un grupo, del cual obtendrá por herencia los datos de la órbita al añadirse con el método `group.add(planeta)`. La función admite muchos parámetros que permiten una alta personalización del planeta creado junto a las texturas.

Debido a que las texturas se han encontrado en una gran variedad de formatos distintos (color, bump, transparencia, normales y especular) y que no todas están disponibles para todos los planetas, la función tiene una gran cantidad de parámetros similares y opcionales. En caso de no definir alguno de estos, simplemente se salta sin provocar errores. Todos los planetas se añaden al array `Planetas` que será recorrido en cada frame para realizar los cálculos correspondientes.

Además, todos los planetas son capaces de proyectar y recibir sombras de otros planetas y lunas con la excepción de los gigantes gaseosos, que no son capaces de proyectarla. Esto es así debido a su gran tamaño y lenta velocidad de órbita, que provocaría que estuviesen oscurecidos durante gran cantidad de tiempo, provocando un efecto visual indeseado.

La Tierra merece una mención especial, ya que es el único que cuenta con una atmósfera lo bastante poco densa como para permitir que haya transparencia y se distinga la superficie junto a las nubes. Dicha atmósfera se representa creando otro "planeta" en la misma posición (grupo) que la propia tierra, con un tamaño y velocidad de rotación ligeramente superiores. Además, este "falso planeta" no es capaz de proyectar sombra, ya que provocaba efectos visuales indeseados sobre la superficie.

> **Función _Planeta_**  
group: Grupo orbital al que pertenece el planeta. `<THREE.Group>`  
radio: Radio del planeta, en kilómetros. `<Number>`  
rot: Velocidad de rotación. Se indica como las horas que tarda en completar una órbita. `<Number>`  
tilt: Inclinación del eje de rotación, en grados. `<Number>`  
cShadow: Si el planeta es capaz de proyectar sombra. `<Boolean>`  
rShadow: Si el planeta es capaz de recibir sombra. `<Boolean>`  
text: Archivo de mapa de color. (Opcional) `<String>`  
bump: Archivo de mapa bump. (Opcional) `<String>`  
texalpha: Archivo de mapa de transparencia. (Opcional) `<String>`  
normals: Archivo de mapa de normales. (Opcional) `<String>`
spec: Archivo de mapa especular. (Opcional) `<String>`    
>   
> **Returns:**  
planeta: El planeta recién creado. `<THREE.Mesh>`

*Ejemplo: Creación del planeta Tierra y su atmósfera*
```js
// Grupo
const tierraGroup = Grupo(1, 365.26, 0.0, 1.0, 1.0);
// Superficie del planeta
Planeta(tierraGroup, 6378, 23.934, 23, true, true, "textures/earth/2k_earth_daymap.jpg", undefined, undefined, "textures/earth/2k_earth_normal_map.jpg", "textures/earth/2k_earth_specular_map.jpg");
// Atmósfera
Planeta(tierraGroup, 6700, 15, 23, false, true, "textures/earth/2k_earth_clouds.jpg", undefined, "textures/earth/2k_earth_clouds.jpg");
```

## Lunas

Actualmente, la único satélite definido es la Luna de la Tierra. Cuenta con su propia función ya que se utiliza el método el objeto "pivote" que se usaba originalmente en la práctica para generar la inclinación de la órbita. La función es muy similar a las dos anteriores vistas, mezclando elementos de ambas. A diferencia de otras funciones, la distancia no se corresponde a una unidad real, ya que las proporciones reales provocarían que la Luna estuviera "dentro" de la Tierra, por lo que sencillamente se indica una distancia apropiada manualmente.

> **Función _Luna_**  
planeta: Grupo orbital al que pertenece el planeta. `<THREE.Group>`  
radio: Radio del planeta, en kilómetros. `<Number>`
dist: Distancia a al planeta, sin unidad. `<Number>`
vel: Velocidad de la órbita. Se indica como los días que tarda en completar una órbita. `<Number>`
orangle: Inclinación de la órbita respecto al plano orbital, en grados. `<Number>`
rot: Velocidad de rotación. Se indica como las horas que tarda en completar una órbita. `<Number>`  
f1, f2: Deformación de la órbita, siendo 1 órbita circular perfecta. `<Number>`  
cShadow: Si el planeta es capaz de proyectar sombra. `<Boolean>`  
rShadow: Si el planeta es capaz de recibir sombra. `<Boolean>`  
text: Archivo de mapa de color. `<String>`  
bump: Archivo de mapa bump. `<String>`  
> 
> **Returns:**
luna: El satélite recién creado. `<THREE.Mesh>`

## Anillos

Saturno y Urano tienen anillos que son especialmente visibles, por lo que se ha decidido añadirlos a la escena, usando geometrías de anillo `new THREE.RingGeometry`. Sin embargo, esto trae una dificultad a la hora de aplicar la textura, ya que el archivo requiere que la imagen sea duplicada de forma radial sobre toda la superficie de la geometría. Esto requiere modificar las UV de la geometría para que la textura se aplique correctamente.

```js
// Modificación de UV de la geometría
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
```

Textura del anillo:

![plot](./textures/saturn/2k_saturn_ring_alpha_vert.png)

La textura además se aplica en ambas caras del anillo, y permite aplicar la transparencia tanto como una textura aparte, como en la misma textura de color en formato `.png`.

> **Función _Anillos_**  
group: Grupo orbital al que pertenece el planeta. `<THREE.Group>`  
inRad: Radio interior de los anillos, en kilómetros. `<Number>`  
outRad: Radio exterior de los anillos, en kilómetros. `<Number>`  
tilt: Inclinación de los anillos, en grados. `<Number>`  
text: Archivo de mapa de color. `<String>`  
texalpha: Archivo de mapa de transparencia. (Opcional) `<String>`  
> 
> **Returns:**
rings: Los anillos recién creados. `<THREE.Mesh>`

_Ejemplo: Creación de Saturno y sus anillos_
```js
// Saturno
const saturnGroup = Grupo(9.54, 10752.9, 2.5, 1.0, 1.0);
Planeta(saturnGroup, 60000, 10.233, 27, false, true, "textures/saturn/2k_saturn.jpg");
Anillos(saturnGroup, 67300, 140300, 27, "textures/saturn/2k_saturn_ring_alpha_vert.png");
```

---

## Animación

En el bucle de animación, se recorren varios arrays que incluyen todos los objetos y grupos que deben ser animados, cada uno de forma independiente con lo que necesitan. El caso más complejo es, sin duda, el de los grupos ya que tiene que tener en cuenta la inclinación de la órbita respecto al plano orbital, a la hora de calcular la traslación.

```js
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
```

En el caso de los planetas, únicamente debe calcular la rotación sobre su eje ya que el resto de datos los obtiene por herencia del grupo.
```js
for (let object of Planetas) {
  object.rotation.y += object.userData.rot;
}
```

Dado que las lunas tienen también su propia órbita, deben calcularla también, aunque es más simple que en los grupos ya que la inclinación de la órbita viene dada por herencia del objeto pivote.
```js
for (let object of Lunas) {
  object.position.x =
    Math.cos(timestamp * object.userData.speed) * object.userData.dist;
  object.position.z =
    Math.sin(timestamp * object.userData.speed) * object.userData.dist;
  object.rotation.y += object.userData.rot;
}
```

## Nave

Para navegar por la escena, se usa un `FlyControls` con asignación de teclas por defecto, cambiando únicamente las velocidades para que sea cómodo viajar por los planetas, sobre todo los más cercanos. Sin embargo, tiene el añadido visual de tener el objeto de una nave espacial frente a la cámara en todo momento, para simular que se está viajando por el Sistema Solar. El modelo 3D de la nave se ha obtenido de internet y se carga en la función `init()` junto a los planetas.

```js
const loader = new GLTFLoader();
loader.load('textures/outer_wilds__the_ship.glb', (gltf) => {
    ship = gltf.scene;
    ship.scale.set(0.1, 0.1, 0.1);
    scene.add(ship);
});
```

Además, en cada frame se actualiza la posición de la nave respecto a la cámara, para dar la impresión de estar pilotánola.

```js
// obtener la dirección hacia adelante
const dir = new THREE.Vector3();
camera.getWorldDirection(dir);


ship.position.copy(camera.position)
.addScaledVector(dir, distance)
.addScaledVector(camera.up, offsetY);

const shipBaseRotation = new THREE.Quaternion();
shipBaseRotation.setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));

ship.quaternion.copy(camera.quaternion).multiply(shipBaseRotation);
```

## Música de fondo

Como detalle final de la escena, se ha añadido una música tranquila de fondo para acompañar la experiencia de moverse por el sistema solar con la nave.

```js
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
```

## Créditos adicionales

**Música de fondo:** [Outer Wilds - Timber Hearth](https://youtu.be/SPa8bPqQfmo?si=mWU8BQ1_AWHjs6UY)

**Modelo 3D nave**: [courgeon - Outer Wilds : The ship](https://sketchfab.com/3d-models/outer-wilds-the-ship-f6797d8650794c8387708f7ef78ee0d5)
