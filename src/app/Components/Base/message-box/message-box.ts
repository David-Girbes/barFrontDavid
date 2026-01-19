import { Component, input, model, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-message-box',
  imports: [DialogModule, ButtonModule],
  templateUrl: './message-box.html',
  styleUrl: './message-box.css'
})
export class MessageBox {

  visible: boolean = false;
  header = input<string>('');
  message = model<string>('');
  labelAccept = input<string>('Accept')
  labelCancel = input<string>('Cancel')
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message'] && changes['message'].currentValue.length > 0) {
      this.visible = true;
    }
  }
  clickAccept($event: Event) {
    this.message.set('');
    this.visible = false;
  }
}
