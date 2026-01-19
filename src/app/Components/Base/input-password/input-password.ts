import { Component, input, model, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message, MessageModule } from 'primeng/message';

@Component({
  selector: 'app-input-password',
  imports: [MessageModule, FormsModule, ReactiveFormsModule, ButtonModule, InputText],
  templateUrl: './input-password.html',
  styleUrl: './input-password.css'
})
export class InputPassword {
  password = model<string>();
  //passwordChange = output<string>();
  validation = output<boolean>();
  profileForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  checkErrorsPassword(): boolean {
    const control = this.profileForm.get('password');
    console.log("control.errors: " + (control?.errors?.['required'] || ((control?.errors?.['minlength']) ? true : false)));
    return (control?.errors?.['required'] || ((control?.errors?.['minlength']) ? true : false))
  }
  getPasswordError(): string {
    const control = this.profileForm.get('password');
    if (control?.errors?.['required']) {
      this.validation.emit(false);
      return 'La contraseña es obligatoria';
    }
    if (control?.errors?.['minlength']) {
      this.validation.emit(false);
      return 'Mínimo 6 caracteres';
    }

    return '';
  }
  /**
   * Mètode que s'executa quan l'usuari escriu a l'input.
   * @param event L'esdeveniment del DOM (input).
   */
  onInputChange(event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    console.log("New value password: " + newValue);
    if (this.checkErrorsPassword()) {
      this.validation.emit(false);
      console.log("validation: false");
    } else {
      this.validation.emit(true);
      console.log("validation: true");
    }
    // 3. Emissió de l'esdeveniment
    // Actualitzem l'Input localment i notifiquem el pare amb el nou valor
    //this.passwordChange.emit(newValue);
    this.password.set(newValue);
  }
}
