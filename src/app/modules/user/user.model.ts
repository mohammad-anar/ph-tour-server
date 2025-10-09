import { model, Schema } from "mongoose";
import { IAuthProvider, isActive, IUser, Role } from "./user.interfaces";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    phone: { type: String },
    profilePicture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(isActive),
      default: isActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    auths: [authProviderSchema],
  },
  //   bookings referance,
  // guide referance
  {
    timestamps: true,
    versionKey: false,
  }
);

// model for user
export const User = model<IUser>("User", userSchema);
