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
const lang = new URL(location).searchParams.get('lang') || 'en';

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler((payload) => {
  try {
    const data = JSON.parse(payload.data.data);
    const lang = navigator.language.substr(0, 2);
    if (lang in data) {
      const notificationOptions = {
        body: data[lang].body,
      };
      return self.registration.showNotification(data[lang].title,
        notificationOptions);
    }
  } catch (error) {
    console.error(error);
  }
});
