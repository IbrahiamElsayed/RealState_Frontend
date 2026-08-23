import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { UpdatePropertyService } from './update-property';

describe('UpdatePropertyService', () => {
  let service: UpdatePropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UpdatePropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
