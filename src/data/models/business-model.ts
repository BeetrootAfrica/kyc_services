import { BusinessEntity } from "../../domain/entity/business.entity";
import {AsklessError} from "askless";


const kAdminId = "adminId";
const kBusinessId = "businessId";
const kCreatedAtMsSinceEpoch = "createdAtMsSinceEpoch";
const kBusinessName = "businessName";
const kOperationsCountry = "operationsCountry";
const kOperationsCity = "operationsCity";
const kSpecialization = "specialization";
const kTradingAs = "tradingAs";
const kTradeSector = "tradeSector";

export interface UserOutputToClient {
    [kAdminId]: number,
    [kBusinessId]: number,
    [kCreatedAtMsSinceEpoch]: number,
    [kBusinessName]: string,
    [kOperationsCountry]: string,
    [kOperationsCity]: string,
    [kSpecialization]: string,
    [kTradingAs]: string,
    [kTradeSector]: string,

}
export interface UserBodyFromClient {
    [kAdminId]: number,
    [kBusinessId]: number,
    [kBusinessName]: string,
    [kOperationsCountry]: string,
    [kOperationsCity]: string,
    [kSpecialization]: string,
    [kTradingAs]: string,
    [kTradeSector]: string,

}

export class BusinessModel extends BusinessEntity {

    output() : UserOutputToClient {
        return {
            [kAdminId]: this.adminId,
            [kBusinessId]: this.businessId,
            [kBusinessName]: this.businessName,
            [kOperationsCity]: this.operationsCity,
            [kOperationsCountry]: this.operationsCountry,
            [kSpecialization]: this.specialization,
            [kTradingAs]: this.tradingAs,
            [kTradeSector]: this.tradeSector,
            [kCreatedAtMsSinceEpoch]: this.createdAt.getTime(),
        }
    }

    static toClient(entity:BusinessEntity) : object {
        return Object.assign(new BusinessModel(), entity).output();
    }

    static async fromBody(data: UserBodyFromClient) : Promise<BusinessModel> {
        if(BusinessModel.invalid(data)) {
            throw new AsklessError({code: "BAD_REQUEST", description: BusinessModel.validationError(data)});
        }
        const res = new BusinessModel();
        res.adminId = data.adminId;
        res.businessId = data.businessId;
        res.businessName = data.businessName;
        res.tradingAs = data.tradingAs;
        res.tradeSector = data.tradeSector;
        res.specialization = data.specialization;
        res.operationsCity = data.operationsCity;
        res.operationsCountry = data.operationsCountry;
        return res;
    }

    private static invalid(data: UserBodyFromClient) : boolean {
        return Boolean(BusinessModel.validationError(data)?.length);
    }

    private static validationError(data:UserBodyFromClient) : string | null {
        const separator = '; ';
        let errors = "";
        if(!data.businessName?.length) {
            errors += `Missing '${kBusinessName}'${separator}`;
        }
        if(!data.tradeSector?.length) {
            errors += `Missing '${kTradeSector}'${separator}`;
        }
        if(!data.tradingAs?.length) {
            errors += `Missing '${kTradingAs}'${separator}`;
        }
        if(!data.specialization?.length) {
            errors += `Missing '${kSpecialization}'${separator}`;
        }
        if(!data.operationsCountry?.length) {
            errors += `Missing '${kOperationsCountry}'${separator}`;
        }
        if(!data.operationsCity?.length) {
            errors += `Missing '${kOperationsCity }'${separator}`;
        }
        if(errors?.length){
            console.error(errors);
        }
        return errors.length ? errors.substring(0, errors.length - separator.length) : null;
    }

    static fromEntity(entity: BusinessEntity) : BusinessModel {
        return Object.assign(new BusinessModel(), entity);
    }

    static fromEntityList(users: BusinessEntity[]) {
        return users.map((u) => BusinessModel.fromEntity(u));
    }
}
