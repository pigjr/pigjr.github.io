### Sample .angular-cli.json

~~~
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "project": {
    "name": "pwa-workshop-angular"
  },
  "apps": [
    {
      "root": "src",
      "outDir": "dist",
      "assets": [
        "assets",
        "favicon.ico",
        "manifest.json"
      ],
      "index": "index.html",
      "main": "main.ts",
      "polyfills": "polyfills.ts",
      "test": "test.ts",
      "tsconfig": "tsconfig.app.json",
      "testTsconfig": "tsconfig.spec.json",
      "prefix": "app",
      "serviceWorker": true,
      "styles": [
        "styles.css"
      ],
      "scripts": [
      ],
      "environmentSource": "environments/environment.ts",
      "environments": {
        "dev": "environments/environment.ts",
        "prod": "environments/environment.prod.ts"
      }
    }
  ],
  "e2e": {
    "protractor": {
      "config": "./protractor.conf.js"
    }
  },
  "lint": [
    {
      "project": "src/tsconfig.app.json"
    },
    {
      "project": "src/tsconfig.spec.json"
    },
    {
      "project": "e2e/tsconfig.e2e.json"
    }
  ],
  "test": {
    "karma": {
      "config": "./karma.conf.js"
    }
  },
  "defaults": {
    "styleExt": "css",
    "component": {
    }
  }
}
~~~

### Sample manifest.json

~~~
{
  "dir": "ltr",
  "lang": "en",
  "name": "Angular Mobile Toolkit",
  "scope": "/",
  "display": "standalone",
  "start_url": "./?utm_source=web_app_manifest",
  "short_name": "AMT",
  "theme_color": "#f27b00",
  "description": "",
  "orientation": "any",
  "background_color": "#3a1c8d",
  "related_applications": [],
  "prefer_related_applications": false,
  "icons": [{
      "src": "/assets/icons/android/android-launchericon-512-512.png",
      "sizes": "512x512"
    },
    {
      "src": "/assets/icons/android/android-launchericon-192-192.png",
      "sizes": "192x192"
    },
    {
      "src": "/assets/icons/android/android-launchericon-144-144.png",
      "sizes": "144x144"
    },
    {
      "src": "/assets/icons/android/android-launchericon-96-96.png",
      "sizes": "96x96"
    },
    {
      "src": "/assets/icons/android/android-launchericon-72-72.png",
      "sizes": "72x72"
    },
    {
      "src": "/assets/icons/android/android-launchericon-48-48.png",
      "sizes": "48x48"
    },
    {
      "src": "/assets/icons/chrome/chrome-extensionmanagementpage-48-48.png",
      "sizes": "48x48"
    },
    {
      "src": "/assets/icons/chrome/chrome-favicon-16-16.png",
      "sizes": "16x16"
    },
    {
      "src": "/assets/icons/chrome/chrome-installprocess-128-128.png",
      "sizes": "128x128"
    }
  ]
}
~~~

### Sample index.html header

~~~
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">

  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#f27b00">
~~~
