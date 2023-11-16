import { Request, Response } from 'express';
import KafkaConfig from '../config';

const sendMessageToKafka = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const kafkaConfig = new KafkaConfig();
    const messages = [{ key: 'key1', value: message }];
    await kafkaConfig.produce('my-topic', messages);

    res.status(200).json({
      status: 'Ok!',
      message: 'Message successfully sent!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
    });
  }
};
const sendMessageUserCreated = async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      const kafkaConfig = new KafkaConfig();
      const messages = [{ key: 'key1', value: message }];
      await kafkaConfig.produce('user-created', messages);
  
      res.status(200).json({
        status: 'Ok!',
        message: 'Message successfully sent!',
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      });
    }
  };
const controllers = { sendMessageToKafka, sendMessageUserCreated };

export default controllers;
