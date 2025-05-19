import { AlertType } from "./alert";

export interface ContactFormProps {
  alert: AlertType | null;
  removeAlert: (show: boolean, msg: string) => void;
}
