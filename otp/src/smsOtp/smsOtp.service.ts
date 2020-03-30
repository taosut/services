import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as twilio from 'twilio';
import { DeleteResult, Repository } from 'typeorm';
import { ISmsConfiguration } from '../../src/smsConfiguration/interfaces/smsConfiguration.interface';
import { SmsConfigurationService } from '../smsConfiguration/smsConfiguration.service';
import { ISmsOtp } from './interfaces/smsOtp.interface';
import { ISmsOtpCreatePayload } from './interfaces/smsOtpCreatePayload.interface';
import { ISmsOtpUpdatePayload } from './interfaces/smsOtpUpdatePayload.interface';
import { SmsOtp } from './smsOtp.entity';

@Injectable()
export class SmsOtpService {
  constructor(
    @InjectRepository(SmsOtp) protected readonly repository: Repository<SmsOtp>,
    protected readonly smsConfigurationService: SmsConfigurationService
  ) {}

  async findAll(): Promise<ISmsOtp[]> {
    const result = await this.repository.find();

    return result;
  }

  async findById(id: string): Promise<ISmsOtp> {
    const result = await this.repository.findOne({ id });

    if (!result) {
      throw new HttpException(`Not Found`, 404);
    }

    return result;
  }

  async create(data: ISmsOtpCreatePayload): Promise<ISmsOtp> {
    const otp = await this.generateOtp();
    data.otp = otp;

    const entity = await this.repository.create(data);
    const response = await this.repository.save(entity);

    return response;
  }

  async update(id: string, data: ISmsOtpUpdatePayload): Promise<ISmsOtp> {
    const otp = await this.generateOtp();
    data.otp = otp;
    data.invalid = 0;

    const update = await this.repository.update(id, data);
    if (!update) {
      throw new HttpException('Error Updating Sms Otp Data', 400);
    }

    const result = await this.findById(id);

    return result;
  }

  // async delete(id: string): Promise<ISmsOtp> {
  //   const found = await this.repository.findOne({ id });
  //   if (!found) {
  //     throw new HttpException('User Id not registered', 404);
  //   }

  //   const update = await this.repository.update(id, { isDeleted: true });

  //   if (!update) {
  //     throw new HttpException('Error Updating User Data', 400);
  //   }

  //   const result = await this.fetch(id);

  //   return result;
  // }

  async forceDelete(id: string): Promise<DeleteResult> {
    const found = await this.repository.findOne({ id });
    if (!found) {
      throw new HttpException('Id not found', 404);
    }

    await this.repository.delete(id);

    return await this.repository.delete(id);
  }

  async sendSmsOtp(phoneNumber: string): Promise<object> {
    const config = (await this.smsConfigurationService.getSmsConfiguration()) as ISmsConfiguration;

    const found = await this.repository.findOne({ phoneNumber });

    let smsOtp: ISmsOtp = null;
    if (!found) {
      const otp = await this.generateOtp();
      const data: ISmsOtpCreatePayload = { phoneNumber, otp, invalid: 0 };

      smsOtp = await this.create(data);
    } else {
      const data: ISmsOtpUpdatePayload = { phoneNumber };
      const otp = await this.generateOtp();
      data.otp = otp;
      await this.update(found.id, data);
      smsOtp = await this.findById(found.id);
    }

    // tslint:disable-next-line:no-eval
    // const message = await this.getSmsOtpTemplate(smsOtp);

    // const config = {
    //   accountSid: 'AC9ae678e29a2fd6a87792daaab0f83892',
    //   authToken: 'caa7581b9d05d4ae238baaa65552926b',
    //   sender: '+13342316636',
    // };

    let result = {};
    if (config && smsOtp) {
      return this.viaTwilio(phoneNumber, config, `Your code ${smsOtp.otp}`);
    } else {
      result = {
        message: 'No Sms Configuration Found',
        status: false,
      };
    }
    return result;
  }

  async validateSmsOtp(phoneNumber: string, otp: string): Promise<boolean> {
    const found = await this.repository.findOne({ phoneNumber });

    // if (found && found.invalid >= 3) {
    //   throw new HttpException('Validation has been disabled for 5 minutes', 423);
    // }
    if (found && found.otp === otp) {
      await this.update(found.id, found);
      return true;
    } else {
      await this.updateInvalidCode(found.id, found);
      return false;
    }
  }

  async updateInvalidCode(
    id: string,
    data: ISmsOtpUpdatePayload
  ): Promise<ISmsOtp> {
    if (data.invalid === null) {
      data.invalid = 0;
    }
    data.invalid += 1;

    const update = await this.repository.update(id, data);
    if (!update) {
      throw new HttpException('Error Updating Sms Otp Data', 400);
    }

    const result = await this.findById(id);

    return result;
  }

  private async viaTwilio(
    phoneNumber: string,
    config: any,
    message: string
  ): Promise<object> {
    if (phoneNumber[0] === '0') {
      phoneNumber = '+62' + phoneNumber.slice(1);
    }
    const client = twilio(config.accountSid, config.authToken);

    const result = await client.messages
      .create({
        body: message,
        to: phoneNumber, // Text this number
        from: config.sender, // From a valid Twilio number
      })
      .then(() => {
        return {
          message: `Otp has been sent to ${phoneNumber}`,
          status: true,
        };
      })
      .catch(error => {
        // tslint:disable-next-line:no-console
        console.log(error);
        throw new HttpException(error.message, error.status);
      });

    return result;
    // return null;
  }

  private async generateOtp(length?: number): Promise<string> {
    const codeLength = length || 4;
    const otp =
      Math.floor(Math.random() * (Math.pow(10, codeLength - 1) * 9)) +
      Math.pow(10, codeLength - 1);
    const result = otp.toString();

    return result;
  }
}
