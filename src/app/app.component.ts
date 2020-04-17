import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Template} from '../utils/template';
import {sha512} from 'sha512-crypt-ts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  terminalOut = '';
  hashCache = {};
  salt;
  unixTimestamp;

  inputForm = this.fb.group({
    username: ['admin', Validators.required],
    action: ['reset', Validators.required],
    password: ['password', Validators.required],
    mongoPort: [27117, Validators.required]
  });

  constructor(private fb: FormBuilder) {
    this.salt = AppComponent.randomSalt();
    this.unixTimestamp = Math.floor(new Date().getTime() / 1000);
  }

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
      if (this.validateInput(this.inputForm)) {
        this.refreshTerminal(this.inputForm);
      }
    });
  }

  validateInput(form) {
    if (form.value.password.length === 0) {
      this.terminalOut = '# Password cannot be empty';
      return false;
    }
    if (form.value.username.length === 0) {
      this.terminalOut = '# Username cannot be empty';
      return false;
    }
    if (form.value.mongoPort <= 0 || form.value.mongoPort > 65535) {
      this.terminalOut = '# MongoDB port must be in range 0-65535';
      return false;
    }
    return true;
  }

  getHashCached(password) {
    let passwordHash;
    if (password in this.hashCache) {
      passwordHash = this.hashCache[password];
    } else {
      passwordHash = sha512.crypt(password, this.salt);
      this.hashCache[password] = passwordHash;
    }
    return passwordHash;
  }

  refreshTerminal(form) {
    const passwordHash = this.getHashCached(form.value.password);
    const username = form.value.username
        .replace(/[\\]/g, '\\\\')
        .replace(/["]/g, '\\"')
        .replace(/[']/g, '\\\'');

    switch (form.value.action) {
      case 'reset': this.terminalOut = Template.reset(form.value.mongoPort, username, passwordHash); break;
      case 'create': this.terminalOut = Template.create(form.value.mongoPort, username, passwordHash, this.unixTimestamp); break;
    }
}
}
