import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageBox } from './message-box';

describe('MessageBox', () => {
  let component: MessageBox;
  let fixture: ComponentFixture<MessageBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
