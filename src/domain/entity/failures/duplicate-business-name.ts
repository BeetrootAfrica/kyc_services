import {Failure} from "./failure";
import {AsklessErrorParams} from "askless/client/response/AsklessError";


export class DuplicateBusinessNameFailure extends Failure {

    constructor(public readonly businessName:string, ) {
        super(`The business name ${businessName} is already registered`);
    }

    // override
    get errorParams(): AsklessErrorParams {
        return {
            code: "DUPLICATED_BUSINESS_NAME",
            description: this.description!,
        };
    }
}
