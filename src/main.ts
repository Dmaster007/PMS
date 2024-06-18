import { bootstrapApplication } from '@angular/platform-browser';
import { provideAuth0 } from '@auth0/auth0-angular';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideAuth0({
      domain: 'dev-n1lb40exoxfu2fwu.us.auth0.com',
      clientId: 'BvXEhZ8flXDPnd2H3NLkk7B7RQvCyS2N',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
  ]
});