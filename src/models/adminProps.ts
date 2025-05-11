import { AlertType } from "./alert";

export interface AdminProps {
  alert: AlertType;
  showAlert: (show: boolean, msg: string) => void;
  activePayment: boolean;
  setActivePayment: (active: boolean) => void;
}
