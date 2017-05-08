## 1. Add service worker

Add `"serviceWorker": true,` in `.angular-cli.json` then `yarn add --dev @angular/service-worker`

## 2. Add manifest.json and assets

Add `manifest.json` into `assets` section in `.angular-cli.json`

## 3. Add @angular/router

https://angular.io/docs/ts/latest/guide/router.html, go through `The Basics`

### Spec testing

After adding Router, the following code are added to keep Spec testing working

```

import {APP_BASE_HREF} from '@angular/common';
// App components
import { TestRouterComponent } from './test-router/test-router.component';
import { TestMaterialComponent } from './test-material/test-material.component';

import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: 'test-router', component: TestRouterComponent },
  { path: 'hero/:id',      component: TestRouterComponent },
  {
    path: 'test-material',
    component: TestMaterialComponent,
    data: { title: 'Heroes List' }
  },
  { path: '',
    redirectTo: '/test-material',
    pathMatch: 'full'
  },
  { path: '**', component: TestMaterialComponent }
];

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        TestRouterComponent,
        TestMaterialComponent
      ],
      imports: [
        RouterModule.forRoot(appRoutes),
      ],
      providers: [{provide: APP_BASE_HREF, useValue : '/' }]

    }).compileComponents();
  }));

```

### e2e testing

not affected

## 4. Add @angular/material

https://material.angular.io/guide/getting-started

`/src/styles.css` can be used to include material's prebuilt themes, e.g., put `pink-bluegrey.css` into `/src/assets` then:

```
@import "./assets/pink-bluegrey.css"
```

Add any material piece like:

```
<div class="example-container">
  <h3>Normal Buttons</h3>
  <div class="button-row">
    <button md-button>Flat button</button>
    <button md-raised-button>Raised button</button>
    <button md-fab><md-icon>check</md-icon></button>
    <button md-mini-fab><md-icon>check</md-icon></button>
  </div>

  <h3>Link Buttons</h3>
  <div class="example-button-row">
    <a md-button routerLink=".">Flat button</a>
    <a md-raised-button routerLink=".">Raised button</a>
    <a md-fab routerLink="."><md-icon>check</md-icon></a>
    <a md-mini-fab routerLink="."><md-icon>check</md-icon></a>
  </div>
</div>
```

### Spec testing

For each component that includes material components, add the relevant dependency into `.spec.js`, e.g.:

```
// Test for MaterialModule
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdButtonModule, MdCheckboxModule} from '@angular/material';
import 'hammerjs';

describe('TestMaterialComponent', () => {
  let component: TestMaterialComponent;
  let fixture: ComponentFixture<TestMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestMaterialComponent ],
      imports: [
        // Test for MaterialModule
        BrowserAnimationsModule,
        MdButtonModule, MdCheckboxModule
      ]
    })
    .compileComponents();
  }));

```

This kind of component injection should apply to all non-native components

### e2e testing

not affected

## code snippets

### Sample .angular-cli.json

```
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
```

### Sample manifest.json

```
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
```

### Sample index.html header

```
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">

  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#f27b00">
```

### Sample styles.css

```
/* You can add global styles to this file, and also import other style files */

@import './assets/pink-bluegrey.css';

body {
    margin: 0;
    background: #eee;
}

.content {
    padding: 16px;
}

.mat-card {
    margin-bottom: 16px;
}
```
