export interface AddTransaction {
  paidBy: string;
  transactionName: string;
  amount: number;
  participants: string[];
  description: string;
  date: string | number;
  isEquallyDivided: boolean;
}
