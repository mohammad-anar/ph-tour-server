import { IUser } from "../modules/user/user.interfaces";
export declare const createUserTokens: (user: Partial<IUser>) => {
    accessToken: string;
    refreshToken: string;
};
export declare const getNewAccessTokenWithRefreshToken: (refreshToken: string) => Promise<string>;
//# sourceMappingURL=userToken.d.ts.map