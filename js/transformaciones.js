// Transformaciones: Eliezer Yair Reyes Ávila
function registrarEstado(obj) {
  obj.userData.ini = {
    pos : obj.position.clone(),
    rot : obj.rotation.clone(),
    esc : obj.scale.clone(),
  };
}
function registrarTodos(mapa) {
  for (const o of Object.values(mapa)) registrarEstado(o);
}
function aplicarTraslacion(obj, dx, dy, dz) {
  if (!obj.userData.ini) return;
  const { pos } = obj.userData.ini;
  obj.position.set(pos.x + dx, pos.y + dy, pos.z + dz);
}
function aplicarRotacion(obj, gx, gy, gz) {
  if (!obj.userData.ini) return;
  const { rot } = obj.userData.ini;
  const r = Math.PI / 180;
  obj.rotation.set(rot.x + gx * r, rot.y + gy * r, rot.z + gz * r, rot.order);
}
function aplicarEscala(obj, fx, fy, fz) {
  if (!obj.userData.ini) return;
  const { esc } = obj.userData.ini;
  obj.scale.set(esc.x * fx, esc.y * fy, esc.z * fz);
}
function restablecer(obj) {
  if (!obj.userData.ini) return;
  const { pos, rot, esc } = obj.userData.ini;
  obj.position.copy(pos);
  obj.rotation.copy(rot);
  obj.scale.copy(esc);
}
function restablecerTodos(mapa) {
  for (const o of Object.values(mapa)) restablecer(o);
}

// ══════════════════════════════════════════════════════════════════════════════
// INTERFAZ  (Andrea Celeste Cubas Rodríguez — interfaz.js)
// ══════════════════════════════════════════════════════════════════════════════

export { registrarTodos, aplicarTraslacion, aplicarRotacion, aplicarEscala, restablecer, restablecerTodos };
