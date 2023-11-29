


export class TokensEntity {

    constructor(
        public readonly userId:number,
        public readonly accountType:string,
        public readonly tradingAs:string,
        public readonly firstName:string,
        public readonly lastName:string,
        public readonly specialization:string,
        public readonly accessToken:string,
        public readonly accessTokenExpiration:Date,
        public readonly refreshToken:string,
    ) {}
}