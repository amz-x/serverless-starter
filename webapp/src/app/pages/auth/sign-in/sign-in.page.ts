import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_ROUTES } from '@lib/constants/app.routes';
import { AuthService } from '@lib/services';

@Component({
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.css'],
})
export class SignInPage implements OnInit {

  private _callbackURL: string;

  public signInForm: FormGroup;

  constructor(private _router: Router, private _activatedRoute: ActivatedRoute, private _authService: AuthService, private _formBuilder: FormBuilder) {
    // Callback URL
    this._callbackURL = this._activatedRoute.snapshot.queryParamMap.get('callbackURL') || APP_ROUTES.ADMIN_HOME.url;

    // Sign In Form
    this.signInForm = this._formBuilder.group({
      email: ['', Validators.email],
      password: ['']
    });
  }

  public ngOnInit(): void {
    this.signInForm = this._formBuilder.group({
      email: ['', Validators.email],
      password: ['']
    });
  }

  get f() { return this.signInForm.controls; }

  public onClickSignIn(): void {

    const form = this.signInForm.controls;

    const email = String(form['email'].value).trim();
    const password = String(form['password'].value).trim();

    // this._authService.signIn(email, password);

    // this._router.navigate([this._callbackURL]);
  }
}
