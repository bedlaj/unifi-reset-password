import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ClipboardModule } from 'ngx-clipboard';


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
        MatSlideToggleModule,
        ClipboardModule
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
      .toBe('mongo --port 27117 --eval \'db.admin.update(\n' +
        ' {name: "admin"},\n' +
        ' {$set:\n' +
        '  {x_shadow: "$6$abcdefg$3X6B9zrxtsDSfe156ekDjYJE5pBAceZ/kH.QSD8ox8dEyWApg7m77P.AVlozLKGG9WTEbwcb/gjbMape6/Ios1"}\n' +
        ' }\n' +
        ')\' ace');
  });

  it('should render terminal content with custom values', () => {
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
      .toBe('mongo --port 1234 --eval \'db.admin.update(\n' +
        ' {name: "abc"},\n' +
        ' {$set:\n' +
        '  {x_shadow: "$6$saltsalt$v5q2KC6qDGQ2KBGFXDHm54EUKp7uFrFzr69MsvO.mvTBN3cn1A1ZQk9y33jipzU2B.d7jJth2gPjQFyNn1Okw1"}\n' +
        ' }\n' +
        ')\' ace');
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
