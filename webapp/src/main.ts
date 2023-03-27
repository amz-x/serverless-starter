// Angular
import { enableProdMode }         from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// AWS Amplify
import { Amplify }      from 'aws-amplify';

// Amplify Configuration
import { config }       from './app/constants/amplify.config';

// Environments
import { environment }  from '@env/environment';

// App Module
import { AppModule }    from './app/app.module';

Amplify.configure(config);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).catch((err: any) => console.error(err));
