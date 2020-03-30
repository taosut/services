import { IPurchase, IPurchasePayload } from './purchase.interface';

export interface IPurchaseService {
  create(data: IPurchasePayload): Promise<IPurchase>;
}
