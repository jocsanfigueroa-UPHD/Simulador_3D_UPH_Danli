// vite.config.js
// Configuración mínima de Vite para el simulador UPH Danlí.
// Establece la raíz del proyecto en el directorio actual.
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    open: true,   // abre el navegador automáticamente al ejecutar npm run dev
  },
});
