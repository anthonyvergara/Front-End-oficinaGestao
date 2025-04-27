import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private paymentCompletedSource = new Subject<void>();

  private clientCreatedSource = new Subject<void>();

  paymentCompleted$ = this.paymentCompletedSource.asObservable();

  clientCreated$ = this.clientCreatedSource.asObservable();

  notifyPaymentCompleted() {
    this.paymentCompletedSource.next();
  }

  notifyClientCreated(){
    this.clientCreatedSource.next();
  }
}
