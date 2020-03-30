export enum EPaymentMethod {
  MANUAL = 'manual', // transaction doc {true}
  BANK_TRANSFER = 'bank_transfer', // bankTransferType {true}
  GOPAY = 'gopay', // callback_url {true}
  CSTORE = 'cstore', // store {true}
}

export enum EBankType {
  BCA = 'BCA',
  BNI = 'BNI',
  PERMATA = 'Permata',
  MANDIRI = 'Mandiri',
}

export enum EPaymentStatus {
  CREATED = 'created',
  WAITING = 'waiting',
  REVIEWING = 'reviewing',
  CANCELED = 'canceled',
  FAILURE = 'failure',
  EXPIRED = 'expired',
  SETTLED = 'settled',
}

export enum EStoreName {
  alfamart = 'alfamart',
  indomaret = 'indomaret',
}
