// Servidor local sin instalar paquetes. Solo escucha en este equipo.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const base=__dirname;
const tipos={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
http.createServer((req,res)=>{let ruta;try{ruta=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
const file=path.resolve(base,'.'+(ruta==='/'?'/index.html':ruta));
if(!file.startsWith(base+path.sep)){res.writeHead(403);res.end();return;}
fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end('No encontrado');return;}res.writeHead(200,{'Content-Type':tipos[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);});
}).listen(8080,'127.0.0.1',()=>console.log('Abra http://localhost:8080 — Ctrl+C para cerrar'));
