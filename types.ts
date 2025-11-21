export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  EARNING = 'EARNING',
  INVESTMENT = 'INVESTMENT'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  FAILED = 'FAILED'
}

export interface BankDetails {
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
}

export interface User {
  id: string;
  fullName: string;
  phone: string;
  password?: string;
  balance: number;
  role: Role;
  joinedDate: string;
  referredBy?: string; // ID of the user who referred this user
  bankDetails?: BankDetails;
}

export interface Plan {
  id: string;
  name: string;
  cost: number;
  dailyReturn: number;
  durationDays: number;
  description: string;
}

export interface Investment {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  startDate: string;
  dailyReturn: number;
  totalReturn: number;
  claimedDays: number;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: TransactionType;
  amount: number;
  method?: string; // Bank, UPI, etc.
  details?: string; // Account no, etc.
  status: TransactionStatus;
  date: string;
}

export interface AppState {
  currentUser: User | null;
}