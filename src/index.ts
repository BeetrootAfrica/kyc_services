import { AppDataSource } from "./data/data-source/db-datasouce";
import {authController, controllers, initializeControllers} from "./domain/controllers-and-services";
import {verifyJwtAccessToken} from "./utils/jwt-utils";
import {AsklessServer} from "askless";
import constrollers from "./controllers/controller";
import KafkaConfig from "./config";

const express = require('express');
import socket from "./socket";
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello from Codedamn');
})

app.post("/api/send", constrollers.sendMessageToKafka);
app.post("/api/create-user", constrollers.sendMessageUserCreated);

// consume from topic "test-topic"
const kafkaConfig = new KafkaConfig();
kafkaConfig.consume("my-topic", (value) => {
  console.log("📨 Receive message: ", value);
});
kafkaConfig.consume("user-created", (value) => {
    console.log("📨 Receive message: ", value);
  });
const server = app.listen(3001, () => {
})
socket.connect(server);
AppDataSource.initialize().then(async () => {
    const server = new AsklessServer<number>();

    initializeControllers(server);

    // initializing all controllersAndServices
    for (let controller of controllers()) {
        controller.initializeRoutes(server);
    }

    server.init({
        wsOptions: { port: 3002, },
        debugLogs: false,
        sendInternalErrorsToClient: false,
        requestTimeoutInMs: 7 * 1000,
        authenticate: async (credential, accept, reject) : Promise<void> => {
            if (credential && credential["accessToken"]) {
                const result = verifyJwtAccessToken(credential["accessToken"]);
                if (!result.valid) {
                    reject({credentialErrorCode: "EXPIRED_ACCESS_TOKEN"});
                    return;
                }
                accept.asAuthenticatedUser({ userId: result.userId,  });
                return;
            }

            reject({credentialErrorCode: "MISSING_CREDENTIAL"});
        },
    });

    server.start();
    
    console.log("started on "+server.localUrl);

}).catch(databaseError => console.log(databaseError))
