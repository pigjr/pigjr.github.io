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
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler((payload) => {
  try {
    const data = JSON.parse(payload.data.data);
    const notificationOptions = {
      body: data.body,
      actions: [
        {
          action: 'ok-action',
          title: 'OK',
        },
      ]
    };
    return self.registration.showNotification(data.title,
      notificationOptions);
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
    default:
      console.log(`Unknown action clicked: '${event.action}'`);
      break;
  }
});
