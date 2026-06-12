import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideTranslateService} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';

import {routes} from './app.routes';
import {iamInterceptor} from './iam/infrastructure/iam.interceptor';

/**
 * Root application configuration.
 *
 * @remarks
 * Wires the cross-cutting providers:
 * - HttpClient for the infrastructure layer, with the IAM interceptor
 *   attaching the (mock) session token to outgoing requests.
 * - ngx-translate loading `public/i18n/{lang}.json`, defaulting to Spanish.
 * - The router with the bounded-context route composition.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([iamInterceptor])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({prefix: './i18n/', suffix: '.json'}),
      fallbackLang: 'es'
    }),
    provideRouter(routes)
  ]
};
