import 'altcha';

import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('client-angular-kuriosity');
  altchaVerifiedPayload = null;
  altchAuthonticatedLoginForm!: FormGroup;
  lockImagePath = 'images/lock-image.jpg';
  unlockImagePath = 'images/unlock-image.jpg';
  altchaverifyClicked = false;
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
  ) {}
  ngOnInit(): void {
    this.buildLoginForm();
  }
  buildLoginForm() {
    this.altchAuthonticatedLoginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.required]],
    });
  }
  onSubmit(form: any) {
    if (form.valid) {
      console.log(form.value, this.altchaVerifiedPayload);

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
      this.altchaverifyClicked = true;
    }
  }
  submitTheLogin() {
    if (!this.altchaVerifiedPayload) {
      this.altchaverifyClicked = false;
      return;
    } else if (this.altchAuthonticatedLoginForm.invalid) {
      this.altchAuthonticatedLoginForm.markAllAsTouched();
      return;
    } else {
      this.http
        .post('http://localhost:3333/auth/login', {
          ...this.altchAuthonticatedLoginForm.value,
          altcha: this.altchaVerifiedPayload,
        })
        .subscribe((res) => {
          console.log(res);
        });
    }
  }
}
