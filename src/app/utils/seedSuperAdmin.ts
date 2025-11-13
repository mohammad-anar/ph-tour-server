import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interfaces";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      return;
    }
    //
    const hashedPassword = await bcrypt.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "Credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      isVerified: true,
      password: hashedPassword,
      auth: [authProvider],
    };
    const superAdmin = await User.create(payload);
    console.log("Super Admin Created Successfully", superAdmin);

    // return superAdmin;
  } catch (error) {
    console.log(error);
  }
};
