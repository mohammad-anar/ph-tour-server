/* eslint-disable no-unused-vars */
import { Types } from "mongoose";

export enum Role {
    SUPER_ADMIN="SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER="USER",
    GUIDE="GUIDE"
}

// auth provicers
/**
 * email password
 * google authentication
*/

export interface IAuthProvider {
    provider: "Google" | "Credentials"; //e.g., Google, Provider
    providerId: string;
}

// active enum
export enum IsActive {
    ACTIVE="ACTIVE",
    INACTIVE="INACTIVE",
    BLOCKED="BLOCKED"
}

export interface IUser {
    _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  avatar?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  role:Role;
  auth: IAuthProvider[];
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
