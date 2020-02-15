import { Component, OnInit } from '@angular/core';
import { ToastState } from 'src/app/enums/toast-state.enum';
import { ToastMessage } from 'src/app/models/toast-message';
import { ToastService } from 'src/app/services/toast.service';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.scss'],
})
export class ToastsComponent implements OnInit {
  closeIcon: IconDefinition = faTimes;
  toasts: ToastMessage[] = [];

  constructor(public toastService: ToastService) {}

  ngOnInit() {
    this.toastService.post$.subscribe((t: ToastMessage) => {
      this.toasts.push(t);
    });
  }

  remove(toast: ToastMessage): void {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  removeAll() {
    this.toasts = [];
  }

  getDefaultHeaderForState(state: ToastState): string {
    if (state === ToastState.Error) {
      return 'Error';
    } else if (state === ToastState.Warning) {
      return 'Warning';
    } else if (state === ToastState.Success) {
      return 'Success';
    } else if (state === ToastState.Information) {
      return 'Information';
    }
  }

  isErrorOrWarning(state: ToastState): boolean {
    return state !== ToastState.Warning && state !== ToastState.Error;
  }
}
