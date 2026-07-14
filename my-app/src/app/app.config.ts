import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpInterceptorFn } from '@angular/common/http';
 
import { routes } from './app.routes';
 
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('http://localhost:3002')) {
    const apiReq = req.clone({
      url: req.url.replace('http://localhost:3002', 'https://lightbooks-backend.onrender.com')
    });
    return next(apiReq);
  }
  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    })),
    provideHttpClient(withInterceptors([apiInterceptor]))
  ]
};
