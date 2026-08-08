import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { REPOSITORY_PROVIDERS } from './core/repositories/repository.providers';
import { authInterceptor, loadingInterceptor, errorInterceptor, requestIdInterceptor } from './core/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      authInterceptor,
      loadingInterceptor,
      errorInterceptor,
      requestIdInterceptor
    ])),
    ...REPOSITORY_PROVIDERS
  ]
};
