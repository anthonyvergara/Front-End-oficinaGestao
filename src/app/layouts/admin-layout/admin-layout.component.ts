import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  shouldShowHeaderbar = true;

  c// Lista de rotas onde o header não será mostrado
  private routesToHideHeaderbar = ['/user-profile', '/criar'];

  constructor(private router: Router) {
    // Observando as mudanças de rota
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Verifica a URL da rota atual
      const currentRoute = this.router.url;
      // Verifica se a URL atual está em alguma das rotas onde o header deve ser ocultado
      this.shouldShowHeaderbar = !this.routesToHideHeaderbar.some(route => currentRoute.includes(route));
    });
  }

  ngOnInit() {
  }

}
