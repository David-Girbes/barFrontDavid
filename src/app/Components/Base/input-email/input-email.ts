import { Component, input, model, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-input-email',
  imports: [FormsModule, ReactiveFormsModule, ButtonModule, MessageModule, InputTextModule],
  templateUrl: './input-email.html',
  styleUrl: './input-email.css'
})
export class InputEmail {
  email = model<string>('');
  validation = output<boolean>();
  //emailChange = output<string>(); //retorna el valor d'email al pare
  profileForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  checkErrorsEmail(): boolean {//true = hi ha errors en la validació de l'email
    const control = this.profileForm.get('email');
    console.log("control.errors: " + (control?.errors?.['required'] || ((control?.errors?.['minlength']) ? true : false)
      || control?.errors?.['email']));
    return this.getEmailError() != '';
    //return (control?.errors?.['required'] || ((control?.errors?.['minlength']) ? true : false)
    //  || control?.errors?.['email'])

  }
  getEmailError(): string | undefined {
    const control = this.profileForm.get('email');
    if (control?.errors?.['required']) {
      return 'El username es obligatorio';
    }
    if (control?.errors?.['minlength']) {
      return 'Mínimo 3 caracteres';
    }
    if (control?.errors?.['email']) {
      return 'email incorrecto';
    }
    return '';
  }

  onInputChange(event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    console.log("New value email: " + newValue);
    if (this.checkErrorsEmail()) {
      this.validation.emit(false);
      console.log("validation: false");
    } else {
      this.validation.emit(true);
      console.log("validation: true");
    }
    // 3. Emissió de l'esdeveniment
    // Actualitzem l'Input localment i notifiquem el pare amb el nou valor
    //this.username = newValue;
    this.email.set(newValue);
    //this.emailChange.emit(newValue);
  }
}
