import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  animations: [
    trigger('fadeIn', [
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
export class BookingComponent implements OnInit {

  isModalViewListCustomersOpen : boolean = false;

  booking = {
    date: '2025-06-27',
    startTime: '14:30',
    endTime: '18:30',
    firstName: 'Anthony Vergara',
    lastName: 'Vergara',
    phone: '07858312007',
    email: 'trevor@example.com',
    plate: 'LRR21USP',
    make: 'Honda',
    model: 'S100',
    bank: '',
    amount: '£350.00'
  };

  constructor() { }

  ngOnInit(): void { }

  openModalListCustomers(){
    this.isModalViewListCustomersOpen = true;
    document.getElementById('modal-bellow-overlay')?.classList.add('show');
  }

  closeModal() {
    document.getElementById('modal-bellow-overlay')?.classList.remove('show');
    this.isModalViewListCustomersOpen = false; // Emite o evento para o componente pai
  }
}
