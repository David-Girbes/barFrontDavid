import { Component, input, model, OnChanges, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-message',
  imports: [ButtonModule],
  templateUrl: './message.html',
  styleUrl: './message.css'
})
export class Message implements OnChanges {

  hidden: Boolean = true;
  message = model<string>('');

  /*onInputChange(event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    console.log("New message: " + newValue);
  }*/
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message'] && changes['message'].currentValue.length > 0) {
      this.hidden = false;
    }
  }
  closeMessage() {
    this.hidden = true;
    this.message.set('')
  }



  //message_ui = this.message;

}
