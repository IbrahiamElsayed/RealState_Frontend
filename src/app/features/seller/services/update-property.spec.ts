import { TestBed } from '@angular/core/testing';

import { UpdateProperty } from './update-property';

describe('UpdateProperty', () => {
  let service: UpdateProperty;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateProperty);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
