import { ToastState } from 'src/app/enums/toast-state.enum';

export interface ToastMessage {
  header?: string;
  body: string;
  state: ToastState;
  delay?: number;
}
