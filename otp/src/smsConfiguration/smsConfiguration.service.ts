import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as twilio from 'twilio';
import { DeleteResult, Repository } from 'typeorm';
import { ISmsConfiguration } from './interfaces/smsConfiguration.interface';
import { ISmsConfigurationCreatePayload } from './interfaces/smsConfigurationCreatePayload.interface';
import { ISmsConfigurationUpdatePayload } from './interfaces/smsConfigurationUpdatePayload.interface';
import { SmsConfiguration } from './smsConfiguration.entity';

@Injectable()
export class SmsConfigurationService {
  constructor(
    @InjectRepository(SmsConfiguration)
    protected readonly repository: Repository<SmsConfiguration>
  ) {}

  async findAll(): Promise<ISmsConfiguration[]> {
    const result = await this.repository.find();

    return result;
  }

  async findById(id: string): Promise<ISmsConfiguration> {
    const result = await this.repository.findOne({ id });

    if (!result) {
      throw new HttpException(`Not Found`, 404);
    }

    return result;
  }

  async create(
    data: ISmsConfigurationCreatePayload
  ): Promise<ISmsConfiguration> {
    let otherActive = null;
    if (data.isActive === true) {
      otherActive = await this.repository.findOne({ isActive: true });
    }

    const entity = await this.repository.create(data);
    const result = await this.repository.save(entity);

    if (otherActive) {
      otherActive.isActive = false;
      await this.repository.update(otherActive.id, otherActive);
    }

    return result;
  }

  async forceDelete(id: string): Promise<DeleteResult> {
    const found = await this.repository.findOne({ id });
    if (!found) {
      throw new HttpException('Id not found', 404);
    }

    await this.repository.delete(id);

    return await this.repository.delete(id);
  }

  async update(
    id: string,
    data: ISmsConfigurationUpdatePayload
  ): Promise<ISmsConfiguration> {
    let otherActive = null;
    if (data.isActive === true) {
      otherActive = await this.repository.findOne({ isActive: true });
    }

    await this.repository.update(id, data);

    if (otherActive) {
      otherActive.isActive = false;
      await this.repository.update(otherActive.id, otherActive);
    }

    const result = await this.findById(id);

    return result;
  }

  async getSmsConfiguration(): Promise<ISmsConfiguration> {
    const config = await this.repository.findOne({
      isActive: true,
    });
    if (!config) {
      throw new HttpException('No Sms Configuration Found', 404);
    }

    return config;
  }

  async notification(phoneNumber: string, message: string): Promise<object> {
    if (!message) {
      throw new HttpException('No Message to Send', 404);
    }
    const config = await this.getSmsConfiguration();
    if (config.isActive) {
      return this.notificationViaTwilio(phoneNumber, config, message);
    } else {
      throw new HttpException('No Sms Configuration Active', 404);
    }
  }

  async multiplePhoneNumberNotification(
    phoneNumbers: string[],
    message
  ): Promise<object[]> {
    if (!message) {
      throw new HttpException('No Message to Send', 404);
    }
    const config = await this.getSmsConfiguration();
    if (config.isActive) {
      const results = [];
      await Promise.all(
        phoneNumbers.map(async phoneNumber => {
          if (phoneNumber) {
            const result = await this.notificationViaTwilio(
              phoneNumber,
              config,
              message
            );
            results.push(result);
          }
        })
      );
      return results;
    } else {
      throw new HttpException('No Sms Configuration Active', 404);
    }
  }

  async notificationViaTwilio(phoneNumber, config, message) {
    const client = twilio(config.accountSid, config.authToken);

    if (phoneNumber[0] === '0') {
      phoneNumber = '+62' + phoneNumber.slice(1);
    }

    const result = await client.messages
      .create({
        body: message,
        to: phoneNumber, // Text this number
        from: config.sender, // From a valid Twilio number
      })
      .then(() => {
        return {
          message: `Notification has been sent to ${phoneNumber}`,
          status: true,
        };
      })
      .catch(() => {
        return {
          message: `Notification FAILED to sent, phone number: ${phoneNumber}`,
          status: false,
        };
      });
    return result;
  }
}
