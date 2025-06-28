import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    const hashMD5 = CryptoJS.MD5(password).toString();

    // Exemplo simplificado de login (substitua com chamada HTTP real)
    if (username === 'admin' && password === 'admin') {
      sessionStorage.setItem(this.TOKEN_KEY, 'true');
      return true;
    }
    if (username === 'ricardo' && hashMD5 === 'a00894bbc2ed187bd18f4b354ad720fc') {
      sessionStorage.setItem(this.TOKEN_KEY, 'true');
      return true;
    }
    if (username === 'anthony' && hashMD5 === 'b3b448dbcd9f892a48ee501b0e811da0') {
      sessionStorage.setItem(this.TOKEN_KEY, 'true');
      return true;
    }
    if (username === 'ricardo' && password === 'ricardo1010') {
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
