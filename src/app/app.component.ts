import {Component, OnInit} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
declare var sha512crypt: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private fb: FormBuilder) {
    this.salt = AppComponent.randomSalt();
  }
  terminalOut = '';
  hashCache = {};
  salt;

  inputForm = this.fb.group({
    username: ['admin', Validators.required],
    password: ['password', Validators.required],
    mongoPort: [27117, Validators.required]
  });

  private static randomSalt() {
    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ./';
    const length = 8 + Math.random() * 8;
    let result = '';
    for (let i = length; i > 0; --i) {
      result += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return result;
  }

  ngOnInit() {
    this.refreshTerminal(this.inputForm);
    this.inputForm.valueChanges.subscribe(() => {
      this.refreshTerminal(this.inputForm);
    });
  }

  private refreshTerminal(form) {
    if (form.value.password.length === 0) {
      this.terminalOut = '# Password cannot be empty';
      return;
    }

    let passwordHash;
    if (form.value.password in this.hashCache) {
      passwordHash = this.hashCache[form.value.password];
    } else {
      passwordHash = sha512crypt(form.value.password, this.salt);
      this.hashCache[form.value.password] = passwordHash;
    }
    const db = 'ace'; // ace
    const collection = 'admin'; // admin
    const username = form.value.username.replace(/["]/g, '\\"');

    this.terminalOut =
      `mongo --port ${form.value.mongoPort} --eval 'db.${collection}.update(
 {name: "${username}"},
 {$set:
  {x_shadow: "${passwordHash}"}
 }
)' ${db}`;

}
}
