# Simulador 3D UPH Danlí — versión 2

## Inicio en Windows
1. Extraiga todo el ZIP. No ejecute los archivos dentro del comprimido.
2. Con Node.js instalado, haga doble clic en INICIAR_WINDOWS.bat.
3. Mantenga abierta la consola y visite http://localhost:8080.
4. Si el navegador se abre antes de iniciar el servidor, actualice la página.

Alternativa desde la terminal de Kiro, dentro de esta carpeta:
```
node servidor.cjs
```
También puede ejecutar `npm run dev`. No requiere `npm install` para este inicio: Three.js y OrbitControls están incluidos en vendor/.
No abra index.html con doble clic: los módulos necesitan el servidor HTTP.
Si el puerto 8080 está ocupado, cierre el otro servidor antes de iniciar.

## Uso
Arrastre para orbitar, use la rueda para zoom y el botón derecho para desplazar.
Encuadrar edificio recupera la vista del modelo. Ver corredor muestra el lado amarillo.
Seleccione un objeto, introduzca desplazamientos, grados y factores y pulse Aplicar.
Los controles conservan los valores al cambiar de selección. Restablecer objeto recupera sus transformaciones. Restablecer todo recupera las transformaciones de todos los componentes y su visibilidad.
Las etiquetas se muestran con su botón y permanecen fuera del edificio. Su ubicación identifica la orientación inicial, no sigue las transformaciones del modelo.

## Correcciones
- Eliminadas referencias a variables inexistentes de fachadas que detenían main.js.
- Separado el código activo entre modelo, jerarquía, transformaciones e interfaz.
- Techo a cuatro aguas de seis triángulos sin base, con textura procedural de tejas.
- Corregida orientación de cubierta del corredor, muro exterior bajo y plataforma extendida.
- Cámara con encuadre automático y vistas predefinidas.
- Dependencias locales, rutas relativas y mensaje de error de inicio.
- Tamaño estable del visor y distribución adaptable.

## Alcance y medidas
Se conserva la versión detallada del ZIP recibido: cuerpo 16×3.4×8, cuatro columnas en el corredor y más ventanas y detalles que la propuesta inicial. Es una variante académica; NO coincide con la referencia anterior de 8×3×4 y tres columnas. No son medidas reales. Si deben respetarse aquellas dimensiones, este modelo requiere una adaptación adicional de geometría y jerarquía.
La referencia original de 88 triángulos y 16 líneas no corresponde a esta versión. El conteo comprobado es de 350 mallas y 30976 triángulos (incluye el rótulo), excluyendo suelo, ejes y etiquetas.
Las fachadas posteriores son interpretaciones; no se consideran reconstrucciones verificadas.

## Organización
- Jocsan: js/modelo-edificio.js, js/main.js e integración.
- Eliezer: js/transformaciones.js.
- Andrea: index.html, css/estilos.css, js/interfaz.js.
- Tatiana: js/jerarquia.js y docs/Jerarquia_UPH_Danli.md.
- Katherin: docs/Pruebas_y_Defensa.md.

Three.js y OrbitControls son dependencias de terceros, con su licencia en vendor/LICENSE-three.txt. La base es del equipo, no una plantilla docente.

## Verificación
Se ejecutaron comprobaciones numéricas con los módulos reales y comprobaciones de entrega HTTP. Se ejecutaron pruebas de navegador Chromium con WebGL por software, captura visual de vistas, controles en vivo y diseño móvil a 390 px. Esto no equivale a probar todos los equipos o controladores gráficos. Consulte docs/Pruebas_y_Defensa.md. Falta exportar el documento de jerarquía a PDF.

## Funciones nuevas de la versión 2
- Deslizadores X/Y/Z y campos numéricos conectados en tiempo real. Aplicar sigue disponible, pero no es necesario al mover un deslizador.
- Primitivas a dibujar: TRIÁNGULOS (sólido), LÍNEAS (triangulación) y PUNTOS (vértices). Son representaciones Three.js de la misma geometría; no se modifican las mallas originales ni se programan llamadas WebGL propias.
- Cuadrícula y guía X ancho, Y altura y Z profundidad. Las líneas y puntos usan fondo oscuro y cuadrícula inicial; el botón permite ocultarla.
- Puertas de dos hojas y ventanas con arcos, marcos con espesor y detalles de hierro.
- Pivote de cada columna centrado; el techo gira alrededor del centro de su grupo.
- Iluminación ambiental y sombras, rótulo institucional y corredor frontal abierto sobre un zócalo.

Las aberturas se simulan mediante superficies oscuras delante de los muros: no son perforaciones booleanas ni representan interiores transitables. La textura de tejas es un dibujo procedural sobre la cubierta; no se modeló cada teja. La fachada posterior sigue siendo una interpretación.

Los rangos iniciales de los deslizadores son traslación -10 a 10, rotación -180° a 180° y escala 0.1 a 3. Se pueden introducir otros números válidos en el campo numérico; el rango se amplía para reflejarlos. La escala debe ser positiva.

Se conserva el cuerpo detallado de 16×3.4×8 y cuatro columnas del ZIP recibido; no se certifica equivalencia con la propuesta inicial de 8×3×4 y tres columnas.

## Corrección V3: visibilidad legible
Filas oscuras y texto claro con mayor contraste. La lista no tiene desplazamiento interno; el panel utiliza una única barra. Cada casilla controla la visibilidad local y el texto informa si un padre impide ver el componente. Mostrar todo, Ocultar todo y Solo seleccionado permiten recuperar rápidamente la escena. Solo seleccionado muestra sus descendientes y antecesores necesarios, conservando las transformaciones.

## Versión 4: logo del proyecto
El encabezado incluye images/logo-simulador-uph.png, con el logo creado para este simulador. Se conserva el PNG con transparencia y se muestra sobre una tarjeta blanca para mantener legible el texto azul. El tamaño se adapta a celular. El logo identifica el proyecto académico.
