import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTypeManagement } from './category-type-management';

describe('CategoryTypeManagement', () => {
  let component: CategoryTypeManagement;
  let fixture: ComponentFixture<CategoryTypeManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryTypeManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryTypeManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
