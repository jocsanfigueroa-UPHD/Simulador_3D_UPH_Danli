# Jerarquía real de la versión corregida
Responsable: Tatiana Vaytares Ochoa Aguilar.

Escena contiene edificioCompleto; la cámara y auxiliares quedan fuera de esa raíz.

| Objeto | Padre |
|---|---|
| estructuraPrincipal | edificioCompleto |
| techo | edificioCompleto |
| plataforma | edificioCompleto |
| detalles | edificioCompleto |
| fachadaSur | edificioCompleto |
| fachadaEste | edificioCompleto |
| fachadaNorte | edificioCompleto |
| fachadaOeste | edificioCompleto |

Subárboles del modelo:

- estructuraPrincipal: malla sin hijos
- techo: techoVS, techoVN, cumbrera, Mesh, Mesh, fasciaS, fasciaN, fasciaE, fasciaO
- plataforma: malla sin hijos
- detalles: rodapies, cornisas
- fachadaSur: puerta, vF1, vF2, vF3, escalones, pilarSE
- fachadaEste: vE1, vE2, vE3, vE4, vE5, puertaEste
- fachadaNorte: vN1, vN2
- fachadaOeste: mCorrPost, mCorrExt, mCorrSur, mCorrNor, techoCorredor, fasciaCorr, columnasCorredor, rejasCorredor

El mapa de selección expone grupos y componentes principales. Transformar una fachada afecta a sus hijos. Transformar la raíz afecta a todo el edificio. La posición local se interpreta respecto al padre. La matriz de mundo combina la matriz del padre con la local del hijo.

Esta versión utiliza cuatro columnas en columnasCorredor, dentro de fachadaOeste; difiere de la propuesta inicial con columnas como hijo directo de la raíz y tres columnas. El PDF debe reflejar esta decisión o debe adaptarse el código antes de exportar. PDF pendiente de exportación.

## Actualización de la versión 2
La raíz y los padres principales se conservan. El rótulo es hijo de estructuraPrincipal. El techo es ahora una cubierta a cuatro aguas con seis triángulos sin base y su grupo tiene el pivote centrado en Y=4.175. Cada columna del corredor tiene su origen en su centro; sus partes usan coordenadas locales. Las representaciones de líneas y puntos son auxiliares, hijos de las mallas originales. La cuadrícula permanece en la escena, fuera del edificio.
