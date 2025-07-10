import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}

export interface AuthProvider {
  provider: string;
  providerId: string;
}

export enum Isactive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface Iuser {
  name: string;
  email: string;
  password?: string;
  picture?: string;
  adderess?: string;

  isdeleted?: string;
  isactive?: Isactive;
  isVerified?: string;

  Role: Role;
  Auth: AuthProvider[];

  booking?: Types.ObjectId[];
  guide?: Types.ObjectId[];
}
