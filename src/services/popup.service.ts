import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private messageSubject = new BehaviorSubject<{ message: string, type: string } | null>(null);
  message$ = this.messageSubject.asObservable();

  showSuccess(message: string, timeSecondes: number = 10) {
    this.showMessage(message, 'success', timeSecondes * 1000);
  }

  showError(message: string, timeSecondes: number = 10) {
    this.showMessage(message, 'error', timeSecondes * 1000);
  }

  showWarning(message: string, timeSecondes: number = 10) {
    this.showMessage(message, 'warning', timeSecondes * 1000);
  }

  private showMessage(message: string, type: string, time: number) {
    this.messageSubject.next({ message, type });
    setTimeout(() => {
      this.messageSubject.next(null);
    }, time); // 10 seconds
  }
}
