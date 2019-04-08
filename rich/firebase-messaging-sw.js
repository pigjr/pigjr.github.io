// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '683862053510'
});
const params = new URL(location).searchParams;
const lang = params.get('lang') || 'en';
const profile = {
  _gender: params.get('gender'),
  _lastname: params.get('lastname'),
};
const translations = {
  en: {
    male: 'Mr.',
    female: 'Ms.',
    ok: 'Got it.',
    unwanted: 'Stop bugging me.',
  },
  zh: {
    male: '先生',
    female: '女士',
    ok: '知道了',
    unwanted: '别烦我',
  }
}
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
function getMessageBody(data) {
  let customized = data.customized;
  if (customized) {
    if (customized.includes(`%lastname%`)) {
      if (profile[`_lastname`]) {
        customized = customized.replace(`%lastname%`, profile[`_lastname`]);
      } else {
        return data.body;
      }
    }
    if (customized.includes(`%gender%`)) {
      if (profile[`_gender`]) {
        customized = customized.replace(`%gender%`, translations[lang][profile[`_gender`]]);
      } else {
        return data.body;
      }
    }
    return customized;
  } else {
    return data.body;
  }
}
messaging.setBackgroundMessageHandler((payload) => {
  try {
    const data = JSON.parse(payload.data.data);
    if (lang in data) {
      const notificationOptions = {
        body: getMessageBody(data[lang]),
        icon: './icon.png',
        actions: [
          {
            action: 'ok-action',
            title: translations[lang].ok,
          },
          {
            action: 'unwanted-action',
            title: translations[lang].unwanted,
          }
        ]
      };
      return self.registration.showNotification(data[lang].title,
        notificationOptions);
    }
  } catch (error) {
    console.error(error);
  }
});

self.addEventListener('notificationclick', function (event) {
  const clickedNotification = event.notification;
  clickedNotification.close();

  if (!event.action) {
    // Was a normal notification click
    console.log('Notification Click.');
    return;
  }

  switch (event.action) {
    case 'ok-action':
      console.log('User responses with OK.');
      break;
    case 'unwanted-action':
      const page = '/rich/?step=2';
      const urlToOpen = new URL(page, self.location.origin).href;
      const promiseChain = clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then((windowClients) => {
        let matchingClient = null;
        for (let i = 0; i < windowClients.length; i++) {
          const windowClient = windowClients[i];
          if (windowClient.url === urlToOpen) {
            matchingClient = windowClient;
            break;
          }
        }
        if (matchingClient) {
          return matchingClient.focus();
        } else {
          return clients.openWindow(urlToOpen);
        }
      });
      event.waitUntil(promiseChain);
      break;
    default:
      console.log(`Unknown action clicked: '${event.action}'`);
      break;
  }
});
