import { TestBed } from '@angular/core/testing';

import { Auth0ServiceService } from './auth0-service.service';

describe('Auth0ServiceService', () => {
  let service: Auth0ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Auth0ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
