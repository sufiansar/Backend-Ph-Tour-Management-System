import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}

export interface IAuthProvider {
  provider: "google" | "credientials";
  providerId: string;
}

export enum Isactive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface Iuser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  picture?: string;
  adderess?: string;
  isdeleted?: string;
  isactive?: Isactive;
  isVerified?: boolean;
  phone?: number;
  Role: Role;
  Auth: IAuthProvider[];

  booking?: Types.ObjectId[];
  guide?: Types.ObjectId[];
}
