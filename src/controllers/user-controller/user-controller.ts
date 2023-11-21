import { UserModel } from "../../data/models/user-model";
import { UsersService, UsersServiceParams } from "../../domain/services/users-service";
import { Controller } from "../../domain/controllers-and-services";
import { UserEntity } from "../../domain/entity/user-entity";
import { AsklessServer, AuthenticateUserContext } from "askless";
import { ReadRouteInstance } from "askless/route/ReadRoute";
import KafkaConfig from '../../config';


export class UserController implements Controller {
    private userListRouteInstance: ReadRouteInstance<UserEntity[], AuthenticateUserContext<number>>;
    private readonly usersService: UsersService;

    constructor(initUsersService: (params: UsersServiceParams) => UsersService) {
        this.usersService = initUsersService({
            notifyNewUserWasCreated: (userId: number) => {
                this.userListRouteInstance.notifyChanges({
                    where: context => {
                        return context.userId != userId;
                    }
                })
            }
        });
    }

    initializeRoutes(server: AsklessServer<number>): void {

        server.addRoute.forAllUsers.create({
            route: 'user',
            handleCreate: async (context) => {
                console.log('user-create', context.body)

                const user = await UserModel.fromBody(context.body);
                const res = await this.usersService.saveUser(user);
                const newUser = await this.usersService.getUserByEmail(user.email);
                console.log('user-create users', newUser)

                if (res.isRight()) {
                    console.log('now emiting event')
                    await this.sendMessageUserCreated(res.value)
                    if (newUser.accountType == 'provider') {
                        console.log('provider-user-created', newUser.accountType)
                        await this.sendMessageProviderCreated(newUser.userId);
                    }
                    context.successCallback(res.value);
                    return;
                }
                context.errorCallback(res.error.errorParams);
            },
            toOutput: (entity) => UserModel.fromEntity(entity).output(),
        });
        server.addRoute.forAllUsers.create({
            route: 'user-interest',
            handleCreate: async (context) => {
                console.log('user-interest', context.body)
                let user = await this.usersService.getUserByEmail(context.body['userEmail']);
                user.ideals = context.body['ideals']
                user.selfDescription = context.body['selfDescription']
                user.expectedExperience = context.body['expectedExperience']
                console.log('user---interest', user)
                console.log('user', user)
                const res = await this.usersService.updateUser(user.userId, user);
                if (res.isRight()) {
                    context.successCallback(res.value);
                    return;
                }
                // context.errorCallback(res.error.errorParams);
            },
            // toOutput: (entity) => UserModel.fromEntity(entity).output(),
        });


        this.userListRouteInstance = server.addRoute.forAuthenticatedUsers.read<UserEntity[]>({
            route: 'user-list',
            handleRead: async (context) => {
                console.log("user-list: read started");
                const mainUserId: number = context.userId;
                if (mainUserId == null) {
                    context.errorCallback({
                        description: "Only logged users can perform this operation",
                        code: "FORBIDDEN",
                    })
                    return;
                }
                const users = await this.usersService.getAllUsers({ exceptUserId: mainUserId });
                users.map(async (user) => {
                    if (user.accountType == 'provider') {
                        console.log('provider-user-created', user.accountType)
                        await this.sendMessageProviderCreated(user.userId);
                    }
                })
                context.successCallback(users.sort((a, b) => {
                    const aName = `${a.firstName} ${a.lastName}`;
                    const bName = `${b.firstName} ${b.lastName}`;
                    return aName.localeCompare(bName);
                }));
            },
            toOutput: (entities) => {
                return UserModel.fromEntityList(entities).map((user) => user.output())
            },
        });
    }
    sendMessageUserCreated = async (message: any) => {
        try {
            const kafkaConfig = new KafkaConfig();
            const messages = [{ key: 'key1', value: message.toString() }];
            console.log('produce user-created event message')
            await kafkaConfig.produce('user-created', messages);
        } catch (error) {
            console.log(error);
        }
    };
    sendMessageProviderCreated = async (message: any) => {
        try {
            const kafkaConfig = new KafkaConfig();
            const messages = [{ key: 'userId', value: message.toString() }];
            console.log('produce user-created event message')
            await kafkaConfig.produce('provider-user-created', messages);
        } catch (error) {
            console.log(error);
        }
    };
    // async sendKafkaMessage(topic: string, key: string, value: any): Promise<void> {
    //     const messages = [{ key, value }];
    //     console.log('KafkaController sendKafkaMessage', topic, messages)

    //     await this.kafkaConfig.produce(topic, messages);
    // }

}
