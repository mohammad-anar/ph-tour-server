import { Response } from "express";
interface IAuthTokenInfo {
    accessToken?: string;
    refreshToken?: string;
}
export declare const setAuthCookies: (res: Response, tokenInfo: IAuthTokenInfo) => void;
export {};
//# sourceMappingURL=setCookie.d.ts.map