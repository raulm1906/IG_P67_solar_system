# Sistema Solar
### Práctica 6-7 Informática Gráfica

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
**rad:** Radio de la estrella, en kilómetros. `<String>`  
**col:** Color de la esfera. `<Hex number>`

## Planetas

Para representar los planetas, se ha optado por usar un modelo de grupos orbitales, donde el grupo es el encargado de calcular el movimiento de traslación de la órbita, permitiendo independencia en cada objeto asociado al grupo (planetas, lunas y anillos) respecto a la inclinación y rotación. Por lo tanto, cada planeta cuenta con un grupo, sea el único objeto del mismo, o no. Además, la función que crea el grupo, también es la encargada de dibujar el círculo de la órbita a partir de los mismos parámetros.

Los parámetros de distancia, velocidad e inclinación de la órbita se convierten al comienzo de la función, permitiendo pasarlos en forma de unidades más sencillas de entender por las personas y similares a las usadas en astronomía.

> **Función _Grupo_**  
**dist:** Distancia a la estrella, en unidades astronómicas. `<Number>`  
**vel:** Velocidad de la órbita. Se indica como los días que tarda en completar una órbita. `<Number>`  
**orangle:** Inclinación de la órbita respecto al plano orbital, en grados. `<Number>`  
**f1, f2:** Deformación de la órbita, siendo 1 órbita circular perfecta. `<Number>`



## Créditos adicionales

**Música de fondo:** [Outer Wilds - Timber Hearth](https://youtu.be/SPa8bPqQfmo?si=mWU8BQ1_AWHjs6UY)

**Modelo 3D nave**: [courgeon - Outer Wilds : The ship](https://sketchfab.com/3d-models/outer-wilds-the-ship-f6797d8650794c8387708f7ef78ee0d5)
