import { AlertType } from "./alert";

export interface ContactFormProps {
  alert: AlertType;
  removeAlert: (show: boolean, msg: string) => void;
}
