const CACHE_NAME= "clothes-app-cache-v1";
const ASSETS= ["/",
    "/src/pages/Home.html",
    "/src/pages/Shop.html",
    "/src/pages/Cart.html",
    "/assets/styles/Home.css",
    "/assets/styles/Shop.css",
    "/assets/styles/Cart.css",
    "/assets/styles/Index.css",
    "/assets/styles/Transition.css",
    "/app.js",
    "/src/scripts/cart.js",
    "/manifest.json"];

self.addEventListener("install",event=>{event.waitUntil(
    caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS))
);self.skipWaiting();});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch",event=>{
event.respondWith(
    caches.match(event.request).then(response =>{
        return response ||fetch(event.request);
    })
);
});