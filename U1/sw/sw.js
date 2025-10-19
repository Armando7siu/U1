//Nombre del cache actual (identificador unico)
const CACHE_NAME = "mi-app-cache-v1";

//Listar los archivos que se guardaran en cache
const urlsToCache = [
    "./", //Ruta de la raiz
    "./index.html", //Documento raiz
    "./styles.css", //Hoja de estilos
    "./app.js", //Script del cliente
    "./logo.png" //Logotipo de canvas
]; 

//Evento de instalacion (se dispara cuando se instala el sw)
self.addEventListener("install", (event) => {
    console.log("SW: Instalado");

    //event.waitUntil() asegura que la instalacion esoere hasta que se complete la promise() de cachear los archivos
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("SW: Archivos cacheados");

            //cache.addAll() agrega todos los archivos de urlsToCache al cache final
            return cache.addAll(urlsToCache).catch((error) => {
                console.error('SW: Error al cachear archivos:', error);
                // Si falla algún archivo, continuamos con los que sí se pudieron cachear
                return Promise.resolve();
            });
        })
    );

    //mostrar notificacion en sistema
    self.registration.showNotification("Service worker activo", 
        {
        body: "El cache inicial se configuro correctamente",
        icon: "logo.png"
    });
});

//Evento de activacion (se dispara cuando el sw toma el control).
self.addEventListener("activate", (event) => {
    console.log("SW: activado");

    event.waitUntil(
        //Caches.keys() obtiene todos los nombres de caches almacenados
        caches.keys().then((cacheNames) => 
            //Promises.all() espera a que se eliminen todos los caches viejos
            Promise.all(
                cacheNames.map((cache) => {
                    //si el cache no coincide con el actual se elimina
                    if (cache !== CACHE_NAME) {
                        console.log("SW: Cache viejo eliminado");
                        return caches.delete(cache);
                    }
                })
            )
        )
    );
});

//evento de interceptacion de peticiones (para cada vez que la app pida un recurso)
self.addEventListener("fetch", (event)=> {
    event.respondWith(
        //caches.match() busca un recurso ua em cacje
        caches.match(event.request).then((response) => {
             //si esta en cache se devuelve uuna copia guardada
             //sino esta en cache se hace una peticion normal a la red de fetch()
            return response || fetch(event.request);
        })
    );
});