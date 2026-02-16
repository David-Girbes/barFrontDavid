import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProductsBar } from './manage-products-bar';

describe('ManageProductsBar', () => {
  let component: ManageProductsBar;
  let fixture: ComponentFixture<ManageProductsBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageProductsBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageProductsBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
