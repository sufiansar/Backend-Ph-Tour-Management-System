import { envVars } from "../../config/env";
import { IAuthProvider, Iuser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";
export const seedSuparAdmin = async () => {
  try {
    const isSuperAdminExit = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdminExit) {
      console.log("SuperAdmin Already Exit");
      return;
    }

    const authProvider: IAuthProvider = {
      provider: "credientials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const hashPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUNT)
    );

    const payload: Iuser = {
      name: "super Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashPassword,
      isVerified: true,
      Role: Role.SUPER_ADMIN,
      Auth: [authProvider],
    };
    const superadmin = await User.create(payload);
  } catch (error) {}
};
