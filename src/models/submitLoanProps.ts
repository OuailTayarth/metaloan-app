import { AlertType } from "./alert";

export interface SubmitLoanProps {
  getLoan: () => void;
  incrementLoanId: () => void;
  decrementLoanId: () => void;
  loanId: number;
  alert: AlertType;
  removeAlert: (show: boolean, msg: string) => void;
  activePayment: boolean;
}
