

var cacheName = 'v1'; 


var cacheFiles = [
  'index.html',
				'/',
                'js/data/idbManager.js',
                'js/idb.js',
                'sw.js',
                'js/data/converter.js',
                'js/data/data.js',
                'https://free.currencyconverterapi.com/api/v5/currencies',
				'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css',
				
]


self.addEventListener('install', function(e) {
    console.log('service worker installed');

   
    e.waitUntil(

     
      caches.open(cacheName).then(function(cache) {

        
      console.log('service worker caching cachefiles');
      return cache.addAll(cacheFiles);
      })
  ); 
});


self.addEventListener('activate', function(e) {
    console.log('service worker activated');

    e.waitUntil(

    
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(thisCacheName) {

        if (thisCacheName !== cacheName) {

          console.log('service worker removing rached files from cache - ', thisCacheName);
          return caches.delete(thisCacheName);
        }
      }));
    })
  ); 

});


self.addEventListener('fetch', function(e) {
  console.log('service worker Fetch', e.request.url);

 
  e.respondWith(

  
    caches.match(e.request)


      .then(function(response) {

       // if new cache found return it
        if ( response ) {
          console.log("service worker Found in Cache", e.request.url, response);
         
          return response;
        }

        // els fetch new

        var requestClone = e.request.clone();
        return fetch(requestClone)
          .then(function(response) {

            if ( !response ) {
              console.log("service worker No response from fetch ")
              return response;
            }

            var responseClone = response.clone();

           
            caches.open(cacheName).then(function(cache) {

              
              cache.put(e.request, responseClone);
              console.log('service worker New Data Cached', e.request.url);

             
              return response;
      
                }); 

          })
          .catch(function(err) {
            console.log('service worker Error Fetching & Caching New Data', err);
          });


      }) 
  ); 
});
