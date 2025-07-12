import { model, Schema } from "mongoose";
import { IAuthProvider, Isactive, Iuser, Role } from "./user.interface";

const authschema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<Iuser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    picture: { type: String },
    adderess: { type: String },
    phone: { type: Number },
    isactive: {
      type: String,
      enum: Object.values(Isactive),
      default: Isactive.ACTIVE,
    },
    isdeleted: { type: Boolean, default: false },
    isVerified: { type: String, default: true },
    Role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    Auth: [authschema],
  },

  {
    timestamps: true,
    versionKey: false,
  }
);
export const User = model<Iuser>("User", userSchema);
