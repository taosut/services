export interface ITransactionDetail {
  order_id: string;
  gross_amount: number;
}

export interface IBankTransfer {
  bank: string;
  va_number: string;
}

export interface IItemDetails {
  id: string;
  price: number;
  quantity: number;
  name: string;
  category: string;
  merchant_name: string;
}

export interface ICustomerDetails {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  billing_address: IDetailAddress;
  shipping_address: IDetailAddress;
}

export interface IBankTransfer {
  bank: string;
  va_number: string;
}

export interface IPayment {
  paid_at: string;
  amount: string;
}

export interface IDetailAddress {
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  country_code: string;
}

export interface IEChannel {
  bill_info1: string;
  bill_info2: string;
  bill_info3: string;
  bill_info4: string;
  bill_info5: string;
  bill_info6: string;
  bill_info7: string;
  bill_info8: string;
}

export interface ITransferRequest {
  payment_type: string;
  transaction_details: ITransactionDetail;
  bank_transfer: IBankTransfer;
  item_details: IItemDetails[];
  customer_details: ICustomerDetails;
  echannel: IEChannel;
  signature_key: string;
  custom_expiry: ICustomExpiry;
}

export interface IBankTransferResponse {
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status: string;
  status_code: string;
  status_message: string;
  va_numbers: IBankTransfer[];
  payment_amounts: IPayment;
  permata_va_number: string;
  biller_code: string;
  bill_key: string;
  signature_key: string;
}

export interface ITransferStatusResponse extends IBankTransferResponse {
  masked_card: string;
  bank: string;
  signature_key: string;
  approval_code: string;
  channel_response_code: string;
  channel_response_message: string;
  card_type: string;
  refund_amount: string;
  refunds: IRefunds[];
}

export interface IRefunds {
  refund_chargeback_id: number;
  refund_amount: string;
  created_at: string;
  reason: string;
  refund_key: string;
  refund_method: string;
}

export interface ICustomExpiry {
  order_time: Date;
  expiry_duration: number;
  unit: string;
}
