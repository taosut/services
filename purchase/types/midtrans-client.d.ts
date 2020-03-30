export class CoreApi {
    constructor(options: any);
    apiConfig: any;
    httpClient: any;
    transaction: any;
    capture(parameter: any): any;
    cardPointInquiry(tokenId: any): any;
    cardRegister(parameter: any): any;
    cardToken(parameter: any): any;
    charge(parameter: any): any;
}
export class MidtransError {
    static captureStackTrace(p0: any, p1: any): any;
    static stackTraceLimit: number;
    constructor(message: any, httpStatusCode: any, ApiResponse: any, rawHttpClientData: any);
    name: any;
    httpStatusCode: any;
    ApiResponse: any;
    rawHttpClientData: any;
}
export class Snap {
    constructor(options: any);
    apiConfig: any;
    httpClient: any;
    transaction: any;
    createTransaction(parameter: any): any;
    createTransactionRedirectUrl(parameter: any): any;
    createTransactionToken(parameter: any): any;
}
