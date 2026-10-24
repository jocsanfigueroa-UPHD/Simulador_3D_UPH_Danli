# Guiones ajustados a la versión corregida
Estos textos describen el código presente, no certifican pruebas visuales. Demuestre en navegador cada acción antes de afirmarla en exposición.

## Jocsan
“Mi parte consiste en construir las piezas y conectar el proyecto. En esta versión usamos un cuerpo rectangular, un techo a cuatro aguas formado por seis triángulos sin base y componentes del corredor. Las medidas son académicas. El modelo recibido es más detallado que nuestra propuesta inicial y tiene un conteo diferente: 350 mallas y 30976 triángulos, incluido el rótulo. Separé la creación del modelo de la inicialización del visor.”
Mostrar modelo-edificio.js y main.js. Explicar que cuatro columnas y las dimensiones actuales difieren de la guía inicial.

## Eliezer
“Las transformaciones toman como referencia el estado inicial de cada objeto. La traslación añade un desplazamiento; la escala multiplica por factores y la rotación recibe grados que se convierten una vez a radianes. Repetir el mismo valor no acumula el cambio. La rotación se interpreta como componentes Euler respecto al valor inicial, no como una composición arbitraria de rotaciones.”
Mostrar transformaciones.js y las comprobaciones numéricas registradas.

## Andrea
“La interfaz permite seleccionar el conjunto o un componente y enviar los valores a las funciones de transformación. Al cambiar de selección se recuperan sus valores. Los botones de vista vuelven a encuadrar el modelo. La cámara cambia el punto de observación y no la geometría.”
Mostrar interfaz.js, los campos y los botones; comprobar en navegador antes de presentar.

## Tatiana
“La raíz edificioCompleto contiene las piezas y los grupos de fachadas. El corredor pertenece a fachadaOeste y contiene sus columnas y rejas. Un grupo organiza objetos; transformar al padre afecta a sus descendientes. La cámara está fuera de la raíz.”
Mostrar jerarquia.js y su documento actualizado. Indicar que falta exportar el PDF si aún no se realizó.

## Katherin
“El pipeline transforma los vértices en la imagen final mediante matrices, proyección y rasterización. Three.js organiza estos datos y WebGL dibuja. Las pruebas numéricas comprobaron creación, herencia y transformaciones. También se ejecutó una revisión en Chromium con WebGL por software: vimos el modelo y probamos controles en vivo y representaciones de dibujo. Aún falta contrastar el resultado en los equipos de cada integrante.”
Mostrar Pruebas_y_Defensa.md y diferenciar los resultados numéricos de las pruebas visuales pendientes.

## Demostración añadida de Andrea
“Agregamos deslizadores por eje para ver el cambio inmediatamente. Podemos observar las superficies sólidas, los triángulos como líneas y los vértices como puntos. Estas vistas usan la misma geometría. La cuadrícula y los ejes ayudan a interpretar los movimientos. Cambiar el modo de dibujo no cambia las dimensiones del edificio.”

## Detalles añadidos de Jocsan
“La cubierta principal tiene cuatro pendientes y seis triángulos sin base. Su aspecto de tejas proviene de una textura dibujada por código. Los marcos de los arcos sí tienen geometría con espesor. Las puertas y ventanas se representan sobre la superficie del muro; no modelamos un interior transitable.”
