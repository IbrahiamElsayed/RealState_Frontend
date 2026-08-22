import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SellerGuard } from './seller-guard';

describe('SellerGuard', () => {
  let guard: SellerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SellerGuard, { provide: Router, useValue: {} }],
    });
    guard = TestBed.inject(SellerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
