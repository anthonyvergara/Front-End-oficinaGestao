import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    // Exemplo simplificado de login (substitua com chamada HTTP real)
    if (username === 'admin' && password === 'admin') {
      sessionStorage.setItem(this.TOKEN_KEY, 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem(this.TOKEN_KEY) === 'true';
  }
}
