import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { BuyerGuard } from './buyer-guard';

describe('buyerGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => buyerGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
