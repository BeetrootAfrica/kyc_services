import KafkaConfig from '../config';
import { UserEntity } from "../domain/entity/user-entity";
import { AppDataSource } from "../data/data-source/db-datasouce";
import { Equal, In, Not } from "typeorm";

class KafkaController {
  private kafkaConfig: KafkaConfig;

  constructor() {
    this.kafkaConfig = new KafkaConfig();

  }
  private readonly _usersTypeormRepo = AppDataSource.getRepository(UserEntity);

  async sendMessage(topic: string, key: string, value: any): Promise<void> {
    const messages = [{ key, value }];
    console.log('KafkaController sendMessage', topic, messages)

    await this.kafkaConfig.produce(topic, messages);
  }

  async sendMessageToKafka(message: string): Promise<any> {
    try {
      await this.sendMessage('user-response', 'user', message);

      return {
        status: 'Ok!',
        message: 'Message successfully sent!',
      };
    } catch (error) {
      console.error(error);
      return {
        status: 'Error',
        message: 'Internal server error',
      };
    }
  }

  async sendMessageUserCreated(message: string): Promise<any> {
    try {
      await this.sendMessage('user-created', 'key1', message);

      return {
        status: 'Ok!',
        message: 'Message successfully sent!',
      };
    } catch (error) {
      console.error(error);
      return {
        status: 'Error',
        message: 'Internal server error',
      };
    }
  }

  async getUser(userId: number): Promise<any> {
    try {
      console.log('getUser', userId)
      const user = await this.getUserById(userId)
      if (user) {
        // return user;
        return {
          data:user,
          status: 'Ok!',
          message: 'Query successful!',
        };

      }

    } catch (error) {
      console.error(error);
      return {
        status: 'Error',
        message: 'Internal server error',
      };
    }
  }
  async getAllUsers(params?: { exceptUserId?: number }): Promise<UserEntity[]> {
    if (params?.exceptUserId == null) {
      return this._usersTypeormRepo.find();
    }
    return this._usersTypeormRepo.find({
      where: {
        userId: Not(params.exceptUserId)
      }
    })
  }

  getUserByEmail(email: string): Promise<UserEntity> {
    return this._usersTypeormRepo.findOneBy({ email: email });
  }

  getUserByPhone(phone: string): Promise<UserEntity> {
    return this._usersTypeormRepo.findOneBy({ phone: phone });
  }
  getUserById(userId: number): Promise<UserEntity> {
    console.log('getUserById', userId);

    return this._usersTypeormRepo.findOneBy({ userId: userId });
  }
}

export default KafkaController;
