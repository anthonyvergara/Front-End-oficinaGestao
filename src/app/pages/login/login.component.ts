import { Component, OnInit, OnDestroy } from '@angular/core';
import {AuthService} from '../../layouts/auth-layout/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  username = '';
  password = '';
  loginFailed = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
  }
  ngOnDestroy() {
  }

  login() {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.loginFailed = true;
    }
  }

}
