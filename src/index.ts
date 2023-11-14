import { AppDataSource } from "./data/data-source/db-datasouce";
import {authController, controllers, initializeControllers} from "./domain/controllers-and-services";
import {verifyJwtAccessToken} from "./utils/jwt-utils";
import {AsklessServer} from "askless";
const express = require('express');
import socket from "./socket";
// const app = express();

// app.get('/', (req, res) => {
//     res.send('Hello from Codedamn');
// })
// const server = app.listen(3001, () => {
// })

AppDataSource.initialize().then(async () => {
    const server = new AsklessServer<number>();

    initializeControllers(server);

    // initializing all controllersAndServices
    for (let controller of controllers()) {
        controller.initializeRoutes(server);
    }

    server.init({
        wsOptions: { port: 3000, },
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
    socket.connect(3001);
    console.log("started on "+server.localUrl);

}).catch(databaseError => console.log(databaseError))
