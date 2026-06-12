import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {provideTranslateService} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';

import {routes} from './app.routes';

/**
 * Root application configuration.
 *
 * @remarks
 * Wires the cross-cutting providers:
 * - HttpClient for the infrastructure layer.
 * - ngx-translate loading `public/i18n/{lang}.json`, defaulting to Spanish.
 * - The router with the bounded-context route composition.
 *
 * The IAM HTTP interceptor will be registered here (via `withInterceptors`)
 * once the IAM bounded context is implemented.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({prefix: './i18n/', suffix: '.json'}),
      fallbackLang: 'es'
    }),
    provideRouter(routes)
  ]
};
