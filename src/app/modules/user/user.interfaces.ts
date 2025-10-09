import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}

// auth providers

/**
 * email, password
 * google
 * */

export interface IAuthProvider {
  provider: string; //google, credentials
  providerId: string;
}

// isActive
export enum isActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCK = "BLOCKED",
}
export interface IUser {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  profilePicture?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: isActive;
  isVerified?: boolean;
  role: Role;
  auths: IAuthProvider[];
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
