import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  shouldShowHeaderbar = true;

  constructor(private router: Router) {
    // Observando as mudanças de rota
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Verifica a URL da rota atual
      const currentRoute = this.router.url;
      this.shouldShowHeaderbar = !currentRoute.includes('/user-profile'); // Esconde o headerbar na página de clientes
    });
  }

  ngOnInit() {
  }

}
