import { AppDataSource } from "./data/data-source/db-datasouce";
import { controllers, initializeControllers } from "./domain/controllers-and-services";
import { verifyJwtAccessToken } from "./utils/jwt-utils";
import { AsklessServer } from "askless";
import KafkaController from './controllers/KafkaController';
import KafkaConfig from "./config";
import socket from "./socket";
require('dotenv').config()

const MESSAGING_SERVICE_PORT = +process.env.MESSAGING_SERVICE_PORT
const MAIN_SERVICE_PORT = +process.env.MAIN_SERVICE_PORT
const express = require('express');
const app = express();
app.use(express.json());

// Initialize KafkaController 
const kafkaController = new KafkaController();

const kafkaConfig = new KafkaConfig();
kafkaConfig.consume("get-user", async (value) => {
  console.log('get-user', value);
  const userId = JSON.parse(value).message 
  console.log('userId', userId);
  if(userId){
    return kafkaController.getUser(+userId);
  }
});
// Use async middleware to handle asynchronous operations
const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes using KafkaController
app.post('/api/send', asyncMiddleware(async (req, res) => {
  const { message } = req.body;
  const result = await kafkaController.sendMessageToKafka(message);
  res.status(result.status === 'Ok!' ? 200 : 500).json(result);
}));

app.post('/api/create-user', asyncMiddleware(async (req, res) => {
  const { message } = req.body;
  const result = await kafkaController.sendMessageUserCreated(message);
  res.status(result.status === 'Ok!' ? 200 : 500).json(result);
}));

app.post('/api/kyc/update-user', asyncMiddleware(async (req, res) => {
 console.log('/api/kyc/update-user')
 console.log('req.body', req.body)
  // const result = await kafkaController.sendMessageUserCreated(message);
  // res.status(result.status === 'Ok!' ? 200 : 500).json(result);
}));

app.post('/api/get-user', asyncMiddleware(async (req, res) => {
  console.log('/api/get-user', req.body);
  const userId = req.body['userId']
  if(userId){
    const result = await kafkaController.getUser(+userId);
  console.log('/api/get-user result', result);

    res.status(result.status === 'Ok!' ? 200 : 500).json(result);
  }

}));

const server = app.listen(MAIN_SERVICE_PORT, () => {});
socket.connect(server);

AppDataSource.initialize().then(async () => {
  const server = new AsklessServer<number>();

  initializeControllers(server);

  // initializing all controllersAndServices
  for (let controller of controllers()) {
    controller.initializeRoutes(server);
  }

  server.init({
    wsOptions: { port: MESSAGING_SERVICE_PORT },
    debugLogs: false,
    sendInternalErrorsToClient: false,
    requestTimeoutInMs: 7 * 1000,
    authenticate: async (credential, accept, reject): Promise<void> => {
      if (credential && credential["accessToken"]) {
        const result = verifyJwtAccessToken(credential["accessToken"]);
        if (!result.valid) {
          reject({ credentialErrorCode: "EXPIRED_ACCESS_TOKEN" });
          return;
        }
        accept.asAuthenticatedUser({ userId: result.userId });
        return;
      }

      reject({ credentialErrorCode: "MISSING_CREDENTIAL" });
    },
  });

  server.start();

  console.log("started on " + server.localUrl);
}).catch((databaseError) => console.log(databaseError));
