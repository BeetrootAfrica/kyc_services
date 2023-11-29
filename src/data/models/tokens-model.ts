import {TokensEntity} from "../../domain/entity/tokens-entity";

export interface TokensOutputToClient {
    [TokensModel.kAccessToken]: string;
    [TokensModel.kRefreshToken]: string;
    [TokensModel.kUserId]: number;
    [TokensModel.kAccountType]:string;
    [TokensModel.kTradingAs]:string;
    [TokensModel.kFirstName]:string;
    [TokensModel.kLastName]:string;
    [TokensModel.kSpecialization]:string;
    [TokensModel.kAccessTokenExpirationMsSinceEpoch]: number;
}

export class TokensModel extends TokensEntity {
    static readonly kAccessToken = "accessToken";
    static readonly kRefreshToken = "refreshToken";
    static readonly kUserId = "userId";
    static readonly kAccountType = "accountType";
    static readonly kTradingAs = "tradingAs";
    static readonly kFirstName = "firstName";
    static readonly kLastName = "lastName";
    static readonly kSpecialization = "specialization";
    static readonly kAccessTokenExpirationMsSinceEpoch = "accessTokenExpirationMsSinceEpoch";

    output() : TokensOutputToClient {
        return {
            [TokensModel.kAccessToken]: this.accessToken,
            [TokensModel.kRefreshToken]: this.refreshToken,
            [TokensModel.kUserId]: this.userId,
            [TokensModel.kAccountType]: this.accountType,
            [TokensModel.kTradingAs]: this.tradingAs,
            [TokensModel.kFirstName]: this.firstName,
            [TokensModel.kLastName]: this.lastName,
            [TokensModel.kSpecialization]: this.specialization,
            [TokensModel.kAccessTokenExpirationMsSinceEpoch]: this.accessTokenExpiration.getTime(),
        }
    }

    static fromEntity (entity:TokensEntity) : TokensModel {
        return Object.assign(new TokensModel(null,null,null,null,null, null, null, null, null), entity);
    }

}