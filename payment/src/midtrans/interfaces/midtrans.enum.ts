export enum EMidtransStatus {
  authorize = 'authorize',
  capture = 'capture',
  settlement = 'settlement',
  deny = 'deny',
  pending = 'pending',
  cancel = 'cancel',
  refund = 'refund',
  partial_refund = 'partial_refund',
  chargeback = 'chargeback',
  partial_chargeback = 'partial_chargeback',
  expire = 'expire',
  failure = 'failure',
}
