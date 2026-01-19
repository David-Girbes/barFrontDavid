import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadBarProducts } from './load-bar-products';

describe('LoadBarProducts', () => {
  let component: LoadBarProducts;
  let fixture: ComponentFixture<LoadBarProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadBarProducts]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoadBarProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
