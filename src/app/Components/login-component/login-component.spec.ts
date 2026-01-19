import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCompoment } from './login-component';

describe('LoginCompoment', () => {
  let component: LoginCompoment;
  let fixture: ComponentFixture<LoginCompoment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginCompoment]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginCompoment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
