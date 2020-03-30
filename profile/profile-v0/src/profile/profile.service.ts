import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
// import cryptoRandomString from 'crypto-random-string';
import { In, Repository } from 'typeorm';
// import { IFile } from '../interfaces/content.interface';
import { AccountService } from '../services/account.service';
import RedisService from '../services/redis.service';
import {
  BaseProfileDto,
  CreateProfileDto,
  UpdateAccountProfileDto,
} from './accountProfile.dto';
// import { FileService } from '../services/file.service';
import { Profile } from './profile.entity';

@Injectable()
export class ProfileService extends TypeOrmCrudService<Profile> {
  constructor(
    @InjectRepository(Profile) repo: Repository<Profile>,
    private readonly accountService: AccountService, // private readonly fileService: FileService
    private readonly redisService: RedisService
  ) {
    super(repo);
  }

  async findOneAndAccount(headers: any, id: string): Promise<any> {
    try {
      const profile = await this.repo.findOne({ id });
      if (!profile) {
        return Promise.reject({
          statusCode: 404,
          message: 'Profile not found',
        });
      }
      const account = await this.accountService.findOne(
        headers,
        profile.account_id
      );
      const result = {
        ...profile,
        ...account,
      };
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async updateProfileAndAccount(
    headers: any,
    id: string,
    dto: UpdateAccountProfileDto
  ): Promise<any> {
    try {
      let profile = await this.repo.findOne({ id });
      if (!profile) {
        return Promise.reject({
          statusCode: 404,
          message: 'Profile not found',
        });
      }

      await this.repo.update(id, dto);
      const account = await this.accountService.findOne(
        headers,
        profile.account_id
      );

      await this.accountService.update(headers, profile.account_id, dto);
      profile = await this.repo.findOne({ id });

      await this.redisService.clearCache('*profile*', [id, profile.account_id, account.username, account.email]);

      const result = {
        ...profile,
        ...account,
      };
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async updateProfile(id: string, dto: BaseProfileDto): Promise<any> {
    try {
      let profile = await this.repo.findOne({ id });
      if (!profile) {
        return Promise.reject({
          statusCode: 404,
          message: 'Profile not found',
        });
      }
      await this.repo.update(id, dto);
      profile = await this.repo.findOne({ id });
      await this.redisService.clearCache('*profile*', [id, profile.account_id]);
      const result = {
        ...profile,
      };
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async createProfile(headers: any, dto: CreateProfileDto): Promise<any> {
    try {
      const profile = await this.repo.findOne({ id: dto.account_id });
      if (profile) {
        return Promise.reject({
          statusCode: 400,
          message: 'Profile has already exist',
        });
      }

      const account = await this.accountService.findOne(headers, dto.account_id);

      await this.redisService.clearCache('*profile*', [profile.account_id, account.username, account.email]);

      const created = await this.repo.create(dto);
      const saved = await this.repo.save(created);
      return Promise.resolve(saved);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async searchAccount(headers: any, params: any): Promise<any> {
    try {
      const accounts = await this.accountService.find(headers, params);
      const accountIds = await accounts.map(item => item.id);
      let profiles = [];
      if (accountIds.length > 0) {
        profiles = await this.repo.find({
          account_id: In(accountIds),
        });
      }
      for (const index in accounts) {
        if (accounts[index]) {
          let findProfile = await profiles.find(
            profile => profile.account_id === accounts[index].id
          );
          if (!findProfile) {
            const created = await this.repo.create({
              account_id: accounts[index].id,
            });
            findProfile = await this.repo.save(created);
          }
          accounts[index] = {
            ...findProfile,
            ...accounts[index],
          };
        }
      }
      return Promise.resolve(accounts);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async fetchOneBy(
    headers: any,
    params: any,
    by: string = 'accountId'
  ): Promise<any> {
    try {
      let account;
      if (by === 'username') {
        account = await this.accountService.findOneByUsername(
          headers,
          params.username
        );
      } else if (by === 'email') {
        account = await this.accountService.findOneByEmail(
          headers,
          params.email
        );
      } else {
        account = await this.accountService.findOne(headers, params.account_id);
      }
      let profile: any = await this.repo.findOne({ account_id: account.id });
      if (!profile) {
        const created = await this.repo.create({ account_id: account.id });
        profile = await this.repo.save(created);
      }
      profile = {
        ...profile,
        ...account,
      };
      return Promise.resolve(profile);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async createManyAndAccount(headers: any, dto: any) {
    try {
      const results = [];
      for (const data of dto.bulk) {
        const res = await this.createOneAndAccount(headers, data);
        results.push(res);
      }
      return results;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async createOneAndAccount(headers: any, dto: any) {
    let account;
    let profile;
    try {
      account = await this.accountService.create(headers, dto);
      account = await this.accountService.findOne(headers, account.id);
      dto = {
        ...dto,
        account_id: account.id,
      };
    } catch (err) {
      return Promise.reject(err);
    }
    try {
      const profileCreated = await this.repo.create({ ...dto, id: account.id });
      profile = await this.repo.save(profileCreated);

      await this.redisService.clearCache('*profile*', [profile.account_id, account.username, account.email]);
      return {
        ...profile,
        ...account,
      };
    } catch (err) {
      await this.accountService.purge(headers, account.id);
      return Promise.reject(err);
    }
  }

  async destroy(
    headers: any,
    accountId: string,
    deleteBy: string = 'accountId'
  ) {
    let account;
    // remove from keycloak
    try {
      if (deleteBy === 'username') {
        account = await this.accountService.findOneByUsername(
          headers,
          accountId
        );
      } else if (deleteBy === 'email') {
        account = await this.accountService.findOneByEmail(headers, accountId);
      } else {
        account = await this.accountService.findOne(headers, accountId);
      }
      if (!account) {
        return Promise.reject({
          statusCode: 404,
          message: 'Account not found',
        });
      }
      await this.accountService.purgeByUsername(headers, account.username);
    } catch (err) {
      return Promise.reject(err);
    }
    // remove from profile
    try {
      const profile = await this.repo.findOne({ account_id: account.id });
      if (!profile) {
        return Promise.reject({
          statusCode: 404,
          message: 'Profile not found',
        });
      }
      await this.redisService.clearCache('*profile*', [profile.id, profile.account_id, account.username, account.email]);
      return await this.repo.delete({ id: profile.id });
    } catch (err) {
      // rollback
      account = await this.accountService.create(headers, account);
      return Promise.reject(err);
    }
  }

  // async uploadPhoto(id: string, file: IFile) {
  //   try {
  //     const profile = await this.repo.findOne({ id });
  //     if (profile && profile.photo_id) {
  //       await this.fileService.delete(profile.photo_id);
  //     }
  //     // return profile;
  //     const fileName = `${id}-${cryptoRandomString({ length: 5 })}`;

  //     const filePath = await this.fileService.upload(file, fileName);

  //     await this.repo.update({ id }, { photo_id: filePath });
  //     const fullPath = await this.fileService.getFileUrl(filePath);
  //     return Promise.resolve({ ...profile, photo_id: fullPath });
  //   } catch (err) {
  //     return Promise.reject(err);
  //   }
  // }
}
