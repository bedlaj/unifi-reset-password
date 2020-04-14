import {Component, OnInit} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
declare var sha512crypt: any;

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
    user: ['existing', Validators.required],
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

    if (form.value.user === 'existing') {
      this.terminalOut =
        `mongo --quiet --port ${form.value.mongoPort} --eval '
 if(db.${collection}.update(
  {name:"${username}"},
  {$set: {x_shadow:"${passwordHash}"}}
  )["nMatched"] > 0) {
   print("User ${username} updated successfully");
 } else {
  print("User ${username} does not exists.");
  print("Available users:");
  db.${collection}.find({},{name: 1}).forEach(function(d) { print("  " + d.name); })
 }' ${db}`;
    } else {
      this.terminalOut =
        `mongo --quiet --port ${form.value.mongoPort} --eval '
var admin_id = db.${collection}.insertOne(
 {"email" : "${username}@localhost",
  "last_site_name" : "default",
  "name" : "${username}",
  "time_created" : NumberLong(${this.unixTimestamp}),
  "x_shadow" : "${passwordHash}"}
  )["insertedId"].str;
if (db.site.count() > 0) {
 db.site.find().forEach(function(d) {
   db.privilege.insert({ "admin_id" : admin_id, "permissions" : [ ], "role" : "admin", "site_id" : d["_id"].str });
   print("Access granted to site " + d.name)
 });
} else {
 print("No sites available.");
}' ${db}`;
    }
}
}
