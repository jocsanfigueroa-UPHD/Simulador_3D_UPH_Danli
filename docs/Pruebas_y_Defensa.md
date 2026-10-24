# Pipeline y pruebas de la versión corregida
Responsable: Katherin Griselle Martínez Arita.

## Pipeline implementado
modelo-edificio.js crea geometrías BoxGeometry, CylinderGeometry y BufferGeometry. Sus atributos de posición y sus índices definen los triángulos. La jerarquía se construye en jerarquia.js. Las transformaciones se guardan respecto al ensamblaje inicial. Three.js compone las matrices locales y de mundo; la cámara proporciona vista y proyección. WebGL realiza el procesamiento gráfico, rasterización, fragmentos y pruebas de profundidad. Los materiales estándar utilizan shaders de Three.js; no se escribieron shaders propios.

Conteo real ejecutado sobre la raíz: 350 mallas, 30976 triángulos, incluido el rótulo de dos triángulos. Excluye suelo, ejes y etiquetas. No corresponde al inventario simplificado de 88 triángulos/16 líneas ni a los 160 triángulos del documento anterior.

## Resultados ejecutados
| Acción | Resultado esperado | Observado | Estado |
|---|---|---|---|
| Crear modelo y jerarquía con módulos reales | Sin ReferenceError | 27 referencias de piezas creadas; raíz y fachadas construidas | Aprobada |
| Validar vértices | Números finitos | Todos los atributos de posición comprobados son finitos | Aprobada |
| Trasladar raíz dos veces a +2 X | X=2, sin acumulación | X=2 | Aprobada |
| Rotar raíz 90° Y | π/2 radianes | π/2 | Aprobada |
| Escalar raíz 0.5 | Factor 0.5 | 0.5 | Aprobada |
| Transformar techo y luego raíz | Se combinan cambios | Techo Y inicial+1 y X de mundo=2 | Aprobada |
| Restablecer | Recuperar estado inicial | Posición y escala de raíz recuperadas | Aprobada |
| Iniciar servidor y solicitar recursos | HTTP 200 y MIME JavaScript | Comprobado con script HTTP | Aprobada |
| Iniciar y renderizar en Chromium WebGL | Modelo visible | Captura revisada; sin errores JavaScript | Aprobada |
| Elegir líneas y puntos y regresar a sólido | Cambiar representación | Estados lineas, puntos y solido observados; captura de líneas revisada | Aprobada |
| Mover deslizador de traslación X a 2 | Cambiar raíz sin pulsar Aplicar | Posición X=2 | Aprobada |
| Girar techo con deslizador Y a 45° | π/4 radianes | 0.7853981633974483 | Aprobada |
| Cambiar selección y regresar | Recuperar valores propios | Campo X de raíz conserva 2 | Aprobada |
| Escribir escala cero | Rechazar sin cambiar escala | Escala anterior 1 conservada | Aprobada |
| Introducir 90° en rotación Y | Conversión única a π/2 | Comparación numérica correcta | Aprobada |
| Ocultar techo y restablecer todo | Ocultar y recuperar | visible=false y luego true | Aprobada |
| Revisar techo principal | Seis triángulos sin base | position.count/3=6 | Aprobada |
| Revisar móvil a 390 px | Sin desbordamiento horizontal | innerWidth=390, scrollWidth=390 | Aprobada |
| Probar otras GPU y navegadores del equipo | Compatibilidad visual | No ejecutado | No ejecutada |

La prueba de navegador se realizó con Chromium y WebGL por software. No se atribuyen a esta prueba mediciones de rendimiento en equipos reales.

## Comprobación en su equipo
Abra el proyecto con el servidor, compruebe el edificio, pruebe las tres vistas y el selector. Aplique traslación X=2, rotación Y=90 y escala 0.5 sobre la raíz por separado, restableciendo entre acciones. Pruebe luego el techo y la herencia de la raíz. Cambie de objeto y confirme los valores guardados. Pruebe visibilidad, alambre, etiquetas y entradas vacías. Anote el resultado observado antes de aprobar.

No se certifica correspondencia con las dimensiones originales: la versión recibida usa un modelo detallado diferente, descrito en README.

## Nuevos modos de dibujo y acabados
modos-dibujo.js genera LineSegments con WireframeGeometry y Points sobre las geometrías existentes. Los auxiliares son hijos de cada malla, por lo que heredan su transformación y visibilidad. Los materiales originales se ocultan temporalmente; la geometría del edificio se conserva. Los auxiliares no forman parte del inventario de triángulos del edificio.
La cubierta principal contiene seis triángulos sin base. Esto no convierte al edificio completo en el inventario original de 88 triángulos: los arcos, rejas y detalles añaden geometría.
La textura de tejas se genera con CanvasTexture. El rótulo institucional también usa una textura de lienzo sobre dos triángulos. No se programaron shaders propios.

## Verificación de V3: panel de visibilidad
| Acción | Esperado | Observado | Estado |
|---|---|---|---|
| Revisar contraste de los nombres | Texto legible | Texto RGB(242,245,251) sobre RGB(35,49,73), relación aproximada 11.97:1; captura revisada | Aprobada |
| Mostrar y ocultar todo | Cambiar visibilidad del conjunto | Raíz oculta y luego todos los componentes visibles | Aprobada |
| Aislar techo seleccionado | Solo techo y antecesores necesarios | Techo y raíz visibles; muros ocultos | Aprobada |
| Ocultar corredor | Informar la herencia | Columnas indican “Oculto por grupo” | Aprobada |
| Alternar modo de dibujo y aislar | No activar auxiliares de otro modo | Líneas y puntos permanecen ocultos al aislar en sólido | Aprobada |
| Revisar lista | Sin segunda barra interna | overflow visible y max-height none | Aprobada |
| Revisar ancho 390 px | Sin desbordamiento | Ancho de página coincide con viewport | Aprobada |
| Revisar consola | Sin errores | 0 errores JavaScript | Aprobada |

## Versión 4: logo
Prueba ejecutada en Chromium: imagen cargada con dimensiones naturales mayores que cero en escritorio y a 390 px; sin desbordamiento horizontal y sin errores JavaScript. Captura móvil revisada. Estado: Aprobada.
