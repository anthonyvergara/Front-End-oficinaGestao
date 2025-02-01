import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private paymentCompletedSource = new Subject<void>();

  paymentCompleted$ = this.paymentCompletedSource.asObservable();

  notifyPaymentCompleted() {
    this.paymentCompletedSource.next();
  }
}
