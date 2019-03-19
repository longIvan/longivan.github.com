const CACHE_NAME = 'langyue-v3';
self.addEventListener('install', function(event) {
    console.log('Service Worker install12345');
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll([
                './',
                './index.html',
                './css/style.css',
                './js/router.js',
                './js/home.js',
                './js/detail.js',
                './js/index.js',
                './images/favicon.ico',
                './images/setting-white.png',
                './images/send.png',
                './images/back.png',
                './images/badge.png',
                './images/coffee.png',
                './images/setting.png',
                './images/right.png',
                './images/sound.mp3',
                './images/picture1.jpg',
                './images/picture2.jpg',
                './images/picture3.jpg',
                './images/picture4.jpg'
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    console.log('Service Worker Activate');
    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(
                keyList.map(function(key) {
                    if (key !== CACHE_NAME) {
                        console.log('Service Worker Removing old cache', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            // 来来来，代理可以搞一些代理的事情

            // 如果 Service Worker 有自己的返回，就直接返回，减少一次 http 请求
            if (response) {
                return response;
            }

            // 如果 service worker 没有返回，那就得直接请求真实远程服务
            const request = event.request.clone(); // 把原始请求拷过来
            return fetch(request).then(function(httpRes) {
                // http请求的返回已被抓到，可以处置了。

                // 请求失败了，直接返回失败的结果就好了。。
                if (!httpRes || httpRes.status !== 200) {
                    return httpRes;
                }

                // 请求成功的话，将请求缓存起来。
                const responseClone = httpRes.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, responseClone);
                });

                return httpRes;
            });
        })
    );
});

self.addEventListener('notificationclick', event => {
    const clickedNotification = event.notification;
    const notificationData = event.notification.data;

    console.log(notificationData);

    if (!event.action) {
        // 没有点击在按钮上
        console.log('Notification Click.');
        clickedNotification.close();
        return;
    }
    switch (event.action) {
        case 'coffee-action':
            console.log("User 's coffee.");
            break;
        case 'setting-action':
            console.log("User 's setting.");
            postMessage('setting-action');
            clickedNotification.close();
            break;
        default:
            console.log(`Unknown action clicked: '${event.action}'`);
            break;
    }
    // // 执行某些异步操作，等待它完成
    // let promiseChain = doSomething();
    // event.waitUntil(promiseChain);
});

function postMessage(setting) {
    self.clients.matchAll().then(function(clients) {
        if (clients && clients.length) {
            clients.forEach(function(client) {
                client.postMessage(setting);
            });
        }
    });
}

self.addEventListener('notificationclose', event => {
    let dismissedNotification = event.notification;
    console.log('Notification closed');

    // let promiseChain = notificationCloseAnalytics();
    // event.waitUntil(promiseChain);
});
