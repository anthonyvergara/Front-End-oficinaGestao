import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-modal-list-customers',
  templateUrl: './modal-list-customers.component.html',
  styleUrls: ['./modal-list-customers.component.scss']
})
export class ModalListCustomersComponent implements OnInit {
  searchTerm = '';
  users = [
    { name: 'Anthony Vergara', email: 'anthony@example.com' },
    { name: 'Sarah Connor', email: 'sarah@example.com' },
    { name: 'John Smith', email: 'johnsmith@example.com' },
    { name: 'Emily Davis', email: 'emily.d@example.com' },
    { name: 'Mark Taylor', email: 'mark.t@example.com' },
    { name: 'Mark Taylor', email: 'mark.t@example.com' },
    { name: 'Mark Taylor', email: 'mark.t@example.com' },
    { name: 'Mark Taylor', email: 'mark.t@example.com' }
  ];

  @Output() close = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  closedModal() {
    this.close.emit();  // Emite evento para o componente pai
  }

  filteredUsers() {
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(u => u.name.toLowerCase().includes(term));
  }

  selectUser(user: any): void {
    console.log('User selected:', user);
    // fechar modal programaticamente se quiser
  }


}
