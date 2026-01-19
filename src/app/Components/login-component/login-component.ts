import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { EnterpriseService } from '../../services/enterprise/enterprise-service';

import { Message } from '../Base/message/message';
import { InputEmail } from "../Base/input-email/input-email";
import { InputPassword } from '../Base/input-password/input-password';
@Component({
  selector: 'app-login-component',
  imports: [Message, ReactiveFormsModule, IftaLabelModule, FormsModule,
    ButtonModule, InputTextModule, InputPassword, InputEmail,
    DialogModule, MessageModule, InputTextModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
  providers: [EnterpriseService]
})
export class LoginComponent {
  username: any;
  message: string = "";
  email: string = "";
  password: string = "";
  emailValid: boolean = false;
  passwordValid: boolean = false;

  isPasswordValid(validity: boolean): boolean {
    return validity;
  }
  isEmailValid(validity: boolean): boolean {
    return validity;
  }

  onLoginClicked() {
    console.log("Login clicked: " + this.username + " " + this.password);
    let enterprise = this.enterpriseService.checkCredentials(this.username, this.password);
    if (enterprise) {
      this.message = "Login successful: " + enterprise.name + "/" + enterprise.passwd;
    }
    else {
      this.message = "Login unsuccessful: " + this.username + "/" + this.password;
    }
  }
  cancel() {
  }
  constructor(private enterpriseService: EnterpriseService) {

  }
}
