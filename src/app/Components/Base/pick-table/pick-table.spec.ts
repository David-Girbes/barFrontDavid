import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickTable } from './pick-table';

describe('PickTable', () => {
  let component: PickTable;
  let fixture: ComponentFixture<PickTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
