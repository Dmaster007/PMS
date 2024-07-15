import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { provideAuth0 } from '@auth0/auth0-angular';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), provideHttpClient(),provideClientHydration(), provideAnimationsAsync(),
    provideAuth0({
      domain: 'dev-n1lb40exoxfu2fwu.us.auth0.com',
      clientId: 'BvXEhZ8flXDPnd2H3NLkk7B7RQvCyS2N',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }), provideAnimationsAsync(),
  ]
});