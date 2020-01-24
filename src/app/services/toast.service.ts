import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ToastMessage } from '../models/toast-message';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastSubject = new Subject<ToastMessage>();

  post$: Observable<ToastMessage> = this.toastSubject.asObservable();

  post(message: ToastMessage) {
    this.toastSubject.next(message);
  }
}
