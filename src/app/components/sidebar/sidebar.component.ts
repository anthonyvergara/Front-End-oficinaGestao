import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, transition, animate } from '@angular/animations';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Home',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/customer', title: 'Customers',  icon:'ni-single-02 text-yellow', class: '' },
    /*{ path: '/maps', title: 'MOT Booking',  icon:'ni-calendar-grid-58 text-blue', class: '' },*/
/*
    { path: '/services/list', title: 'Listar Serviços', icon: 'ni-collection text-orange', class: 'submenu' },
    { path: '/services/create', title: 'Criar Serviço', icon: 'ni-fat-add text-orange', class: 'submenu' },
*/
    // { path: '/user-profile', title: 'Oficina',  icon:'ni-planet text-blue', class: '' },
    // { path: '/tables', title: 'Relatório',  icon:'ni-bullet-list-67 text-red', class: '' },
    //{ path: '/login', title: 'Login',  icon:'ni-key-25 text-info', class: '' },
    //{ path: '/register', title: 'Register',  icon:'ni-circle-08 text-pink', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  public isCollapsedMOT = true;

  public submenuItems: any[] = [
    { path: '/services/listar', title: 'Orders List', icon: 'ni-collection text-orange' },
    { path: '/services/criar', title: 'New Order', icon: 'ni-fat-add text-orange' }
  ];

  public submenuMot: any[] = [
    { path: '/mot/booking', title: 'New Booking', icon: 'ni-collection text-blue' },
    { path: '/mot/list', title: 'Booking List', icon: 'ni-fat-add text-blue' }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
   });
  }

  // Função para alternar o estado da navbar
  toggleNavbar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleSubmenuMot() {
    this.isCollapsedMOT = !this.isCollapsedMOT;
  }

}
