import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PropertyHomeService } from './property-home';

describe('PropertyHomeService', () => {
  let service: PropertyHomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PropertyHomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
