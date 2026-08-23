import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { SellerLayout } from './seller-layout';

describe('SellerLayout', () => {
  let component: SellerLayout;
  let fixture: ComponentFixture<SellerLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerLayout],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SellerLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
