import { AlertType } from "./alert";

export interface AlertProps extends AlertType {
  removeAlert: (show: boolean, msg: string) => void;
}
