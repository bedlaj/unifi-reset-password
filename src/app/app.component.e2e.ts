import {TestBed, waitForAsync, tick, fakeAsync} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {exec} from 'child_process';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
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

  it('should create new user - expects unifi instance running on localhost:18443', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.inputForm.get('username').setValue('newTestUser');
    app.inputForm.get('password').setValue('newTestPassword');
    app.inputForm.get('action').setValue('create');
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const mongoCommand = compiled.querySelector('#terminal').textContent;
    exec(mongoCommand, (error, stdout) => {
      if (error) {
        throw error;
      }
      const mongoResult = stdout.trim();
      expect(mongoResult).toContain('Access granted to site');

      fetch('https://localhost:8443/api/login', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: app.inputForm.get('password').value,
          remember: true,
          strict: true,
          username: app.inputForm.get('username').value
        })
      }).then(response => {
        expect(response.status).toBe(200);
      }).catch(reason => fail(reason));
    });
  });

  it('should reset user - expects unifi instance running on localhost:18443', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.inputForm.get('username').setValue('newTestUser');
    app.inputForm.get('password').setValue('newNewTestPassword');
    app.inputForm.get('action').setValue('update');
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const mongoCommand = compiled.querySelector('#terminal').textContent;
    exec(mongoCommand, (error, stdout) => {
      if (error) {
        throw error;
      }
      const mongoResult = stdout.trim();
      expect(mongoResult).toContain('Access granted to site');

      fetch('https://localhost:8443/api/login', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'no-cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: app.inputForm.get('password').value,
          remember: true,
          strict: true,
          username: app.inputForm.get('username').value
        })
      }).then(response => {
        expect(response.status).toBe(200);
      }).catch(reason => fail(reason));
    });
  });

});
