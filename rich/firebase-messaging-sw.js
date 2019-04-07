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
  },
  zh: {
    male: '先生',
    female: '女士',
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
      };
      return self.registration.showNotification(data[lang].title,
        notificationOptions);
    }
  } catch (error) {
    console.error(error);
  }
});
