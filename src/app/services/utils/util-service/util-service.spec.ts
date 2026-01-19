import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilService } from './util-service';

describe('UtilService', () => {
  let component: UtilService;
  let fixture: ComponentFixture<UtilService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
