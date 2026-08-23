import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { BuyerGuard } from './buyer-guard';

describe('BuyerGuard', () => {
  let guard: BuyerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BuyerGuard, provideHttpClient(), provideHttpClientTesting()],
    });
    guard = TestBed.inject(BuyerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
