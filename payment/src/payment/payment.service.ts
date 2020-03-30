import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { DeleteResult, Repository } from 'typeorm';
import { FileStorageService } from '../fileStorage/fileStorage.service';
import { IFile } from '../fileStorage/interfaces/fileStorage.interface';
import { EMidtransStatus } from '../midtrans/interfaces/midtrans.enum';
import { MidtransService } from '../midtrans/midtrans.service';
import { EPaymentMethod, EPaymentStatus } from './interfaces/payment.enum';
import { IPayment } from './interfaces/payment.interface';
import { IPaymentPayload } from './interfaces/paymentPayload.interface';
import { InvoiceService } from './invoice.service';
import { Payment } from './payment.entity';
import { UserService } from './user.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly repository: Repository<Payment>,
    @Inject(forwardRef(() => MidtransService))
    private readonly midtransService: MidtransService,
    private readonly userService: UserService,
    private readonly invoiceService: InvoiceService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async create(data: IPaymentPayload): Promise<IPayment> {
    // tslint:disable-next-line:no-console
    if (_.isEmpty(data)) {
      throw new Error('Cannot create Empty data');
    }

    const invoiceExist = await this.invoiceService.findById(data.invoiceId);

    if (!invoiceExist) {
      throw new HttpException('Invoice not found', 404);
    }

    const userExist = await this.userService.findById(data.userId);

    if (!userExist) {
      throw new HttpException('User not found', 404);
    }

    data.status = EPaymentStatus.CREATED;
    data.paymentNumber = await this.generate();

    const entity = await this.repository.create(data);

    const paymentCreated = await this.repository.save(entity);
    let midtransResponse = null;

    if (paymentCreated.paymentMethod === EPaymentMethod.BANK_TRANSFER) {
      if (!paymentCreated.bankTransferType) {
        throw new HttpException('Bank not specified', 400);
      }
      midtransResponse = await this.midtransService.bankTransfer(
        paymentCreated,
      );
      if (midtransResponse.permata_va_number) {
        paymentCreated.vaNumber = midtransResponse.permata_va_number;
      } else if (midtransResponse.bill_key) {
        paymentCreated.billKey = midtransResponse.bill_key;
        paymentCreated.billerCode = midtransResponse.biller_code;
      } else if (
        midtransResponse.va_numbers &&
        midtransResponse.va_numbers.length > 0
      ) {
        paymentCreated.vaNumber = midtransResponse.va_numbers[0].va_number;
      }
    } else if (paymentCreated.paymentMethod === EPaymentMethod.GOPAY) {
      midtransResponse = await this.midtransService.gopay(paymentCreated);
      paymentCreated.gopayAction = await midtransResponse.actions.toString();
    } else if (paymentCreated.paymentMethod === EPaymentMethod.CSTORE) {
      if (!paymentCreated.storeName) {
        throw new HttpException(
          'Store not specified (alfamart/indomaret)',
          400,
        );
      }
      midtransResponse = await this.midtransService.cstore(paymentCreated);
      paymentCreated.cStorePaymentCode = midtransResponse.cStorePaymentCode;
    }

    if (midtransResponse) {
      paymentCreated.grossAmount = midtransResponse.gross_amount;
      paymentCreated.midtransTransactionId = midtransResponse.transaction_id;
      paymentCreated.midtransTransactionTime =
        midtransResponse.transaction_time;
      paymentCreated.midtransStatus = midtransResponse.transaction_status;
    }

    paymentCreated.status = EPaymentStatus.WAITING;
    paymentCreated.statusUpdatedAt = new Date();

    const result = await this.update(paymentCreated.id, paymentCreated);

    return result;
  }

  async update(id: string, data: IPaymentPayload): Promise<IPayment> {
    const found = await this.repository.findOne({ id });
    if (!found) {
      throw new HttpException('Payment Id not registered', 404);
    }

    const entity = await this.repository.update(id, data);
    if (!entity) {
      throw new HttpException('Failed to Update Payment', 400);
    }

    const result = await this.repository.findOne({ id });
    return result;
  }

  async approve(id: string): Promise<IPayment> {
    const found = await this.repository.findOne({ id });
    if (!found) {
      throw new HttpException('Payment Id not registered', 404);
    }

    found.status = EPaymentStatus.SETTLED;

    const result = await this.update(id, found);

    return result;
  }

  async updatePaymentStatus(
    transactionId: string,
    status: string,
  ): Promise<IPayment> {
    const payment = await this.repository.findOne({
      midtransTransactionId: transactionId,
    });
    if (!payment) {
      throw new HttpException('Payment Id not registered', 404);
    }

    if (status === EMidtransStatus.settlement) {
      payment.status = EPaymentStatus.SETTLED;
    } else if (status === EMidtransStatus.cancel) {
      payment.status = EPaymentStatus.CANCELED;
    } else if (status === EMidtransStatus.failure) {
      payment.status = EPaymentStatus.FAILURE;
    } else if (status === EMidtransStatus.expire) {
      payment.status = EPaymentStatus.EXPIRED;
    }
    payment.midtransStatus = status;
    payment.statusUpdatedAt = new Date();

    const result = await this.update(payment.id, payment);

    return result;
  }

  async fetch(id: string): Promise<IPayment> {
    const result = await this.repository.findOne({ id });
    if (!result) {
      throw new HttpException(`Not Found`, 404);
    }
    return result;
  }

  async findByTransactionId(transactionId: string): Promise<IPayment> {
    const result = await this.repository
      .createQueryBuilder('payment')
      .where('midtransTransactionId = :midtransTransactionId', {
        midtransTransactionId: transactionId,
      })
      .getOne();

    return result;
  }

  async findAll(): Promise<IPayment[]> {
    const result = await this.repository
      .createQueryBuilder('payment')
      .orderBy('payment.createdAt', 'ASC')
      .limit(10)
      .getMany();

    return result;
  }

  async findOne(options: object): Promise<IPayment> {
    const result = await this.repository.findOne(options);
    return result;
  }

  async uploadReceipt(
    fileData: IFile,
    fileName: string,
    id: string,
  ): Promise<IPayment> {
    const found = await this.repository.findOne({ id });
    if (!found) {
      throw new HttpException('Payment Id not registered', 404);
    }
    const filePath = await this.fileStorageService.upload(fileData, fileName);
    found.transactionDocument = filePath;
    found.status = EPaymentStatus.REVIEWING;

    const result = await this.update(id, found);

    return result;
  }

  async deleteReceipt(fileName: string, id: string): Promise<IPayment> {
    const found = await this.repository.findOne({ id });
    if (!found) {
      throw new HttpException('Payment Id not registered', 404);
    }
    const deleteResult = await this.fileStorageService.delete(fileName);
    if (!deleteResult) {
      throw new HttpException('Failed to delete receipt file', 400);
    }
    found.transactionDocument = null;

    const result = await this.update(id, found);

    return result;
  }

  async forceDelete(id: string): Promise<DeleteResult> {
    const response = await this.repository.delete(id);
    return response;
  }

  private async generate(): Promise<string> {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const year = today
      .getFullYear()
      .toString()
      .substr(-2);

    let day = '' + dd;
    let month = '' + mm;
    if (dd < 10) {
      day = '0' + dd;
    }

    if (mm < 10) {
      month = '0' + mm;
    }

    const first6digits = '' + year + month + day;
    const last4digits =
      Math.floor(Math.random() * (Math.pow(10, 3) * 9)) + Math.pow(10, 3);
    const generatedNumber = '' + first6digits + last4digits;

    const order = await this.findOne({
      paymentNumber: generatedNumber,
    });
    if (order) {
      return this.generate();
    }

    return generatedNumber;
  }
}
