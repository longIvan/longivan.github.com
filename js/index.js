const routeMap = {
    '/': router => {
        renderHome(router);
    },
    '/detail': () => {
        renderDetail();
    },
    '/setting': () => {
        renderSetting();
    }
};
window.router = new Route(routeMap);
router.init(location.pathname);

const serviceWorkerInstance = registerServiceWorker();
//注册 Service-Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        return navigator.serviceWorker
            .register('service-worker.js')
            .then(function(registration) {
                router.go('/');
                if (registration.installing) {
                    console.log('Service worker installing');
                } else if (registration.waiting) {
                    console.log('Service worker installed');
                } else if (registration.active) {
                    console.log('Service worker active');
                }
                return registration;
            })
            .catch(function(error) {
                console.log('Registration failed with ' + error);
            });
    }
}

// const version = '1.0.1';
// navigator.serviceWorker.register('service-worker.js').then(function(reg) {
//     if (localStorage.getItem('sw_version') !== version) {
//         reg.update().then(function() {
//             localStorage.setItem('sw_version', version);
//         });
//     }
// });

const sendMessageButton = document.querySelector('.push-message');
sendMessageButton.addEventListener('click', () => {
    if (!('serviceWorker' in navigator)) {
        // Service Worker isn't supported on this browser, disable or hide UI.
        return;
    }

    if (!('PushManager' in window)) {
        // Push isn't supported on this browser, disable or hide UI.
        return;
    }

    let promiseChain = new Promise((resolve, reject) => {
        const permissionPromise = Notification.requestPermission(result => {
            resolve(result);
        });

        if (permissionPromise) {
            permissionPromise.then(resolve);
        }
    }).then(result => {
        if (result === 'granted') {
            sendMessage();
        } else {
            console.log('no permission');
        }
    });
});

function sendMessage() {
    serviceWorkerInstance.then(registration => {
        registration.showNotification('this is a pwa notation', {
            body: '不同浏览器和操作系统有不同的样式',
            icon: './images/icon.png',
            badge: './images/badge.png',
            actions: [
                {
                    action: 'coffee-action',
                    title: 'Coffee',
                    icon: 'images/coffee.png'
                },
                {
                    action: 'setting-action',
                    title: 'Setting',
                    icon: 'images/setting.png'
                }
            ],
            vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500],
            sound: 'images/sound.mp3',
            data: {
                time: new Date().toString(),
                message: 'PWA Notation!'
            }
        });
    });
}

navigator.serviceWorker.addEventListener('message', event => {
    if (event.data === 'setting-action') {
        router.go('/setting');
    }
});

const appSettingDom = document.querySelector('.app-setting');
appSettingDom.addEventListener(
    'click',
    () => {
        router.go('/setting');
    },
    false
);
