import { AlertType } from "./alert";

export interface PayLoanProps {
  payLoan: () => void;
  alert: AlertType;
  removeAlert: (show: boolean, msg: string) => void;
  incrementLoanId: () => void;
  decrementLoanId: () => void;
  loanId: number;
  activePayment: boolean;
}
