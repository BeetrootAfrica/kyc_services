import {UserModel} from "../../data/models/user-model";
import {Controller} from "../../domain/controllers-and-services";
import {UserEntity} from "../../domain/entity/user-entity";
import {AsklessServer, AuthenticateUserContext} from "askless";
import {ReadRouteInstance} from "askless/route/ReadRoute";
import { BusinessService, BusinessServiceParams } from "../../domain/services/business-services";
import { BusinessEntity } from "../../domain/entity/business.entity";
import { BusinessModel } from "../../data/models/business-model";


export class BusinessController implements Controller {
    private businessListRouteInstance: ReadRouteInstance<BusinessEntity[], AuthenticateUserContext<number>>;
    private readonly businessService:BusinessService;

    constructor(initBusinessService:(params:BusinessServiceParams) => BusinessService) {
        this.businessService = initBusinessService({
            notifyNewBusinessWasCreated: (userId:number) => {
                this.businessListRouteInstance.notifyChanges({
                    where: context => {
                        return context.userId != userId;
                    }
                })
            }
        });
    }

    initializeRoutes (server: AsklessServer<number>) : void {
        server.addRoute.forAllUsers.create({
            route: 'business',
            handleCreate: async (context) => {
                const user = await BusinessModel.fromBody(context.body);
                const res = await this.businessService.saveBusiness(user);
                if(res.isRight()){
                    context.successCallback(res.value);
                    return;
                }
                context.errorCallback(res.error.errorParams);
            },
            toOutput: (entity) => UserModel.fromEntity(entity).output(),
        });

        this.businessListRouteInstance = server.addRoute.forAuthenticatedUsers.read<BusinessEntity[]>({
            route: 'business-list',
            handleRead: async (context) => {
                console.log("business-list: read started");
                const mainBusinessId:number = context.userId;
                if (mainBusinessId == null) {
                    context.errorCallback({
                        description: "Only logged users can perform this operation",
                        code: "FORBIDDEN",
                    })
                    return;
                }
                const businesses = await this.businessService.getAllBusinesses({ exceptBusinessId: mainBusinessId });
// TODO: NO GIF, MOSTRAR DESDE A CRIAÇÃO DE USUÁRIO EM REALTIME, COMO O OUTRO USUÁRIO JÁ APARECE INSTANTANEAMENTE!

                context.successCallback(businesses.sort((a,b) => {
                    const aName = `${a.businessName} ${a.tradingAs}`;
                    const bName = `${b.businessName} ${b.tradingAs}`;
                    return aName.localeCompare(bName);
                }));
            },
            toOutput: (entities) => {
                return BusinessModel.fromEntityList(entities).map((business) => business.output())
            },
        });
    }

}
