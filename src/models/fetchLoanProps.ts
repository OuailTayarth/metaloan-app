import { LoanDataType } from "./loanData";

export interface FetchLoanProps {
  LoanData: LoanDataType | null;
  isBorrowerAddress: string;
}
