import jwt, { JwtPayload } from "jsonwebtoken";
import { IAuthProvider, IsActive, IUser } from "../user/user.interfaces";
export declare const AuthServices: {
    credentialsLogin: (payload: Partial<IUser>) => Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            phone?: string;
            avatar?: string;
            address?: string;
            isDeleted?: boolean;
            isActive?: IsActive;
            isVerified?: boolean;
            role: import("../user/user.interfaces").Role;
            auth: IAuthProvider[];
            bookings?: import("mongoose").Types.ObjectId[];
            guides?: import("mongoose").Types.ObjectId[];
            createdAt?: Date;
            __v: number;
        };
    }>;
    getNewAccessToken: (refreshToken: string) => Promise<{
        accessToken: string;
    }>;
    resetPassword: (newPassword: string, id: string, decodedToken: JwtPayload) => Promise<boolean>;
    changePassword: (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => Promise<boolean>;
    setPassword: (userId: string, plainPassword: string) => Promise<jwt.JwtPayload>;
    forgotPassword: (email: string) => Promise<void>;
};
//# sourceMappingURL=auth.service.d.ts.map