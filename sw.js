
// Label des fichiers statiques to precache
const staticCacheName = "site-static-v7"

// Fichier qui seront cacher
const assets = [
    '/',
    '/index.html',
    'styles/style.css',
    '/scripts/dependencies/chart.js',
    '/scripts/script.js',
    '/scripts/app.js',
    "/images/dog0.png",
    "/images/dog1.png",
    "/images/dog2.png",
    "/images/dog3.png",
    "/images/dog4.png",
    "/images/dog5.png",
    "/images/dog6.png",
    "/images/dog7.png",
    "/images/dog8.png",
    "/images/dog9.png",
    "/images/dog10.png",
    "/images/logo.svg",
    "/fonts/VT323-Regular.ttf",
    "/images/brain.mp4"
    
    
]
// Service worker installation
self.addEventListener("install", event=>{
    // We delay the installation process until the cache is cached lol
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache =>{
                // console.log('caching shell assets');
                return cache.addAll(assets)
        })
            .catch(err =>{
                console.log(err)
            })
    )
    self.skipWaiting();
});

// Activation 
self.addEventListener("activate", event =>{
    event.waitUntil(
        caches.keys().then(keys =>{
            // console.log(`Keys ${keys}`);
            return Promise.all(keys
            // Extract the keyname different than the cirrent keynameversion
            .filter(key => key !== staticCacheName)
            // Get the diffkey and delete it from our cache
            .map(key => caches.delete(key))
            )
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event)=>{
    // console.log("entering the fetch event")
    // console.log("an event req looks like this:", event.request)

    event.respondWith(
        caches.match(event.request)
        .then(cachedResponse =>{
            return cachedResponse || 
            fetch(event.request).then(
                (response) => {
                    return response
                },
                (error) =>{
                    return caches.match('/index.html');
                }
            )
        })
        .catch(()=> {
                console.log("the requested link doesn't exist")
            // if(event.request.url.indexOf('.html') > -1){
            //     return caches.match('/index.html');
            // }
        })
    )
})

self.addEventListener("push", event =>{
    console.log(event.data.text())
    const title = event.data.text();
    // const title = "Yay a message";
    const body = "We have received a push message.";
    const icon = "/images/icons/icon-72x72.png";
    // const tag = "simple-push-example-tag";
    event.waitUntil(
        self.registration.showNotification(title,{
            body:body,
            icon:icon,
            tag:tag
        })
    )
})

