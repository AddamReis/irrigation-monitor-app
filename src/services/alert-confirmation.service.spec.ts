import { TestBed } from '@angular/core/testing';

import { AlertConfirmationService } from './alert-confirmation.service';

describe('AlertConfirmationService', () => {
  let service: AlertConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertConfirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
