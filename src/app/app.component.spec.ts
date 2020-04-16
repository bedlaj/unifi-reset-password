import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatRadioModule,
        MatCardModule,
        MatSlideToggleModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render terminal content', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.salt = 'abcdefg';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#terminal').textContent).toContain('mongo');
    expect(compiled.querySelector('#terminal').textContent)
      .toBe('mongo --quiet --port 27117 --eval \'\n' +
        ' if(db.admin.update(\n' +
        '  {name:"admin"},\n' +
        '  {$set: {x_shadow:"$6$abcdefg$3X6B9zrxtsDSfe156ekDjYJE5pBAceZ/kH.QSD8ox8dEyWApg7m77P.AVlozLKGG9WTEbwcb/gjbMape6/Ios1"}}\n' +
        '  )["nMatched"] > 0) {\n' +
        '   print("User admin updated successfully");\n' +
        ' } else {\n' +
        '  print("User admin does not exists.");\n' +
        '  print("Available users:");\n' +
        '  db.admin.find({},{name: 1}).forEach(function(d) { print("  " + d.name); })\n' +
        ' }\' ace');
  });

  it('should render terminal content with custom values existing user', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.salt = 'saltsalt';
    app.inputForm.get('username').setValue('abc');
    app.inputForm.get('password').setValue('def');
    app.inputForm.get('mongoPort').setValue('1234');
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#terminal').textContent).toContain('mongo');
    expect(compiled.querySelector('#terminal').textContent)
      .toBe('mongo --quiet --port 1234 --eval \'\n' +
        ' if(db.admin.update(\n' +
        '  {name:"abc"},\n' +
        '  {$set: {x_shadow:"$6$saltsalt$v5q2KC6qDGQ2KBGFXDHm54EUKp7uFrFzr69MsvO.mvTBN3cn1A1ZQk9y33jipzU2B.d7jJth2gPjQFyNn1Okw1"}}\n' +
        '  )["nMatched"] > 0) {\n' +
        '   print("User abc updated successfully");\n' +
        ' } else {\n' +
        '  print("User abc does not exists.");\n' +
        '  print("Available users:");\n' +
        '  db.admin.find({},{name: 1}).forEach(function(d) { print("  " + d.name); })\n' +
        ' }\' ace');
  });

  it('should escape username', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.salt = 'saltsalt';
    app.inputForm.get('username').setValue('apostrophe \', backslash \\ and quote "');
    app.inputForm.get('password').setValue('def');
    app.inputForm.get('mongoPort').setValue('1234');
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#terminal').textContent).toContain('mongo');
    expect(compiled.querySelector('#terminal').textContent)
      .toBe('mongo --quiet --port 1234 --eval \'\n' +
        ' if(db.admin.update(\n' +
        '  {name:"apostrophe \\\', backslash \\\\ and quote \\""},\n' +
        '  {$set: {x_shadow:"$6$saltsalt$v5q2KC6qDGQ2KBGFXDHm54EUKp7uFrFzr69MsvO.mvTBN3cn1A1ZQk9y33jipzU2B.d7jJth2gPjQFyNn1Okw1"}}\n' +
        '  )["nMatched"] > 0) {\n' +
        '   print("User apostrophe \\\', backslash \\\\ and quote \\" updated successfully");\n' +
        ' } else {\n' +
        '  print("User apostrophe \\\', backslash \\\\ and quote \\" does not exists.");\n' +
        '  print("Available users:");\n' +
        '  db.admin.find({},{name: 1}).forEach(function(d) { print("  " + d.name); })\n' +
        ' }\' ace');
  });

  it('should render terminal content with custom values new user', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.salt = 'saltsalt';
    app.unixTimestamp = 1234567890;
    app.inputForm.get('username').setValue('abc');
    app.inputForm.get('password').setValue('def');
    app.inputForm.get('mongoPort').setValue('1234');
    app.inputForm.get('action').setValue('create');
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#terminal').textContent).toContain('mongo');
    expect(compiled.querySelector('#terminal').textContent)
      .toBe('mongo --quiet --port 1234 --eval \'\n' +
        ' var admin_id = db.admin.insertOne({\n' +
        '  "email" : "abc@localhost", "last_site_name" : "default", "name" : "abc", "time_created" : NumberLong(1234567890),\n' +
        '  "x_shadow" : "$6$saltsalt$v5q2KC6qDGQ2KBGFXDHm54EUKp7uFrFzr69MsvO.mvTBN3cn1A1ZQk9y33jipzU2B.d7jJth2gPjQFyNn1Okw1"\n' +
        ' })["insertedId"].str;\n' +
        ' if (db.site.count() > 0) {\n' +
        '  db.site.find().forEach(function(d) {\n' +
        '   db.privilege.insert({ "admin_id" : admin_id, "permissions" : [ ], "role" : "admin", "site_id" : d["_id"].str });\n' +
        '   print("Access granted to site " + d.name)\n' +
        '  });\n' +
        ' } else {\n' +
        '  print("No sites available.");\n' +
        ' }\' ace');
  });

  it('should validate input - username', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.inputForm.get('username').setValue('');
    expect(app.validateInput(app.inputForm)).toBeFalsy();
    expect(app.terminalOut).toBe('# Username cannot be empty');
    fixture.detectChanges();
  });

  it('should validate input - password', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.inputForm.get('password').setValue('');
    expect(app.validateInput(app.inputForm)).toBeFalsy();
    expect(app.terminalOut).toBe('# Password cannot be empty');
  });

  it('should validate input - empty port', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.inputForm.get('mongoPort').setValue('');
    expect(app.validateInput(app.inputForm)).toBeFalsy();
    expect(app.terminalOut).toBe('# MongoDB port must be in range 0-65535');
  });

  it('should validate input - zero port', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.inputForm.get('mongoPort').setValue('0');
    expect(app.validateInput(app.inputForm)).toBeFalsy();
    expect(app.terminalOut).toBe('# MongoDB port must be in range 0-65535');
  });

  it('should validate input - high port', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.inputForm.get('mongoPort').setValue('100000');
    expect(app.validateInput(app.inputForm)).toBeFalsy();
    expect(app.terminalOut).toBe('# MongoDB port must be in range 0-65535');
  });

  it('should have salt filled', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.salt).toBeTruthy();
    expect(app.salt.length).toBeGreaterThanOrEqual(8);
    expect(app.salt.length).toBeLessThanOrEqual(16);

    app.inputForm.get('username').setValue('123');
    app.inputForm.get('password').setValue('456');
    app.inputForm.get('mongoPort').setValue('789');
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#terminal').textContent).toContain('mongo');
    expect(compiled.querySelector('#terminal').textContent).toContain(`$6$${app.salt}`);
  });
});
