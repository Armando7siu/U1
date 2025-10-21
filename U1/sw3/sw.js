self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open('v3')
        .then(cache => {
            return cache.addAll([
                './',                  
                './index.html',
                './script.js',
                './objet.jpg'  // Cambié a .jpg
            ]);
        })
        .then(() => {
            console.log("Assets cached.");
        })
        .catch(err => console.log("Could not cache.", err))
    );
});

self.addEventListener('fetch', event => {
    console.log("INTERCEPTED:", event.request.url);

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                console.log("V3 the request: ", event.request.url);
                
                // FROM CACHE OR FETCH - USA ESTA LÍNEA SIMPLE
                return response || fetch(event.request);

                // SI QUIERES PROBAR LA FUNCIONALIDAD ESPECIAL, USA ESTO:
                // if (event.request.url.includes('objet.jpg')) {
                //     console.log("Intercepting image request");
                //     return fetch('https://picsum.photos/800')
                //         .then(networkResponse => {
                //             return caches.open('v3').then(cache => {
                //                 cache.put(event.request, networkResponse.clone());
                //                 return networkResponse;
                //             });
                //         });
                // } else {
                //     return response || fetch(event.request);
                // }
            })
            .catch(err => {
                console.log("Could not find matching request.", err);
                return fetch(event.request);
            })
    );
});