export interface IPurchase {
  id: string;
  membershipType: string;
  membershipAmount: number;
  timePeriod: string;
  periodUnit: string;
  unitPrices: number;
  totalPrices: number;
  receipt: string;
  createdAt: Date;
  updatedAt: Date;
  paidAt: Date;
  paymentMethod: string;
  status: string;
  transactionId?: string;
  transactionTime?: string;
  vaNumber?: string;
  billerCode?: string;
  billerKey?: string;
}

export interface IPurchasePayload {
  id: string;
  membershipType: string;
  membershipAmount: number;
  timePeriod: string;
  periodUnit: string;
  unitPrices: number;
  totalPrices: number;
  receipt: string;
  createdAt: Date;
  updatedAt: Date;
  paidAt: Date;
  paymentMethod: string;
  status: string;
  transactionId?: string;
  transactionTime?: string;
  vaNumber?: string;
  billerCode?: string;
  billerKey?: string;
}
