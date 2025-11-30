"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSuperAdmin = void 0;
const env_1 = require("../config/env");
const user_interfaces_1 = require("../modules/user/user.interfaces");
const user_model_1 = require("../modules/user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await user_model_1.User.findOne({
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
        });
        if (isSuperAdminExist) {
            return;
        }
        //
        const hashedPassword = await bcryptjs_1.default.hash(env_1.envVars.SUPER_ADMIN_PASSWORD, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const authProvider = {
            provider: "Credentials",
            providerId: env_1.envVars.SUPER_ADMIN_EMAIL,
        };
        const payload = {
            name: "Super Admin",
            role: user_interfaces_1.Role.SUPER_ADMIN,
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
            isVerified: true,
            password: hashedPassword,
            auth: [authProvider],
        };
        const superAdmin = await user_model_1.User.create(payload);
        console.log("Super Admin Created Successfully", superAdmin);
        // return superAdmin;
    }
    catch (error) {
        console.log(error);
    }
};
exports.seedSuperAdmin = seedSuperAdmin;
//# sourceMappingURL=seedSuperAdmin.js.map