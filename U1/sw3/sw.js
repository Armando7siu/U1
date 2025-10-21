self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open('v3')
        .then(cache => {
            cache.addAll([
                './',                  
                './script.js',
                './objet.png'
            ]);
            console.log("Assets cached.");
        })
        .catch(err => console.log("Could not cache."))
    )
});

self.addEventListener('fetch', event => {
    console.log("INTERCEPTED");

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                console.log("V3 the request: ", event.request);
                console.log("V3 got the response...", response);
                
                //from cache or fetch if not 
                //return response || fetch(event.request);

                //targets a specific request objectand respond with different data but same type; save response to cache
                // if (event.request.url === 'http://127.0.0.1:8080/obj,png') {
                //     return fetch('https://picsum.photos/800');
                // } else {
                //     return response;
                // }

                // target specific request object and respond with different data but same type; save response to cache
                // if (event.request.url === 'http://localhost/sw3/objet.png') {
                //     return fetch('https://picsum.photos/800')
                                //.then(res => {
                                //    return caches.open('v1').then(cache => {
                                //        cache.put(event.request, res.clone());
                                //        return res;
                                //    })
                                //});
                // } else {
                //     return response;
                // }

                // return other site - must be non CORS-bloqued instead of the inistal index.html (index.html always first to be fetched)
                // return fetch('https://jsonplaceholder.typicode.com/todos/1');

                
                // return an empty RESPONSE object or a RESPONSE object with data inside                
                // return new Response();

            })
            .catch(err => {
                console.log("Could not find matching request.");
                return null;
            })
    );
});

// Elimina caché con código
// self.addEventListener('activate', event => {
//     event.waitUntil(
//         caches.keys()
//         .then(keys => {
//             keys.forEach(key => {
//                 if (key === 'v3') caches.delete(key);
//             });
//         })
//     );
// });