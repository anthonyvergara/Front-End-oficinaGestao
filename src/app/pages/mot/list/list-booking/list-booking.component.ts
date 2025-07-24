import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-list-booking',
  templateUrl: './list-booking.component.html',
  styleUrls: ['./list-booking.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('fadeBox', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ],
})
export class ListBookingComponent implements OnInit {

  isModalViewBookingOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  openModalNegociar(){
    this.isModalViewBookingOpen = true;
    document.getElementById('modal-bellow-overlay')?.classList.add('show');
  }

  closeModal() {
    document.getElementById('modal-bellow-overlay')?.classList.remove('show');
    this.isModalViewBookingOpen = false; // Emite o evento para o componente pai
  }
}
