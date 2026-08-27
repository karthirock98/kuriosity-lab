import 'altcha';

import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('client-angular-kuriosity');
  altchaVerifiedPayload = '';
  altchAuthonticationForm: FormGroup | undefined;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
  ) {}

  onSubmit(form: any) {
    if (form.valid) {
      // console.log(form.value, this.altchaVerifiedPayload);

      this.http
        .post('http://localhost:3333/auth/login', {
          ...form.value,
          altcha: this.altchaVerifiedPayload,
        })
        .subscribe((res) => {
          console.log(res);
        });
    }
  }

  onAltchaStateChange(event: Event): void {
    const customEvent = event as CustomEvent;

    console.log('ALTCHA event:', customEvent);
    console.log('ALTCHA state:', customEvent.detail);

    if (customEvent.detail?.state === 'verified') {
      this.altchaVerifiedPayload = customEvent.detail.payload;
      console.log('ALTCHA verified');
    }
  }
}
