import { Types } from "mongoose";
export declare enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE"
}
/**
 * email password
 * google authentication
 */
export interface IAuthProvider {
    provider: "Google" | "Credentials";
    providerId: string;
}
export declare enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}
export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    avatar?: string;
    address?: string;
    isDeleted?: boolean;
    isActive?: IsActive;
    isVerified?: boolean;
    role: Role;
    auth: IAuthProvider[];
    bookings?: Types.ObjectId[];
    guides?: Types.ObjectId[];
    createdAt?: Date;
}
//# sourceMappingURL=user.interfaces.d.ts.map