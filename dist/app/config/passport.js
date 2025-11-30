"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_1 = require("./env");
const user_model_1 = require("../modules/user/user.model");
const user_interfaces_1 = require("../modules/user/user.interfaces");
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// for credential login
passport_1.default.use(new passport_local_1.Strategy({ usernameField: "email", passwordField: "password" }, async (email, password, done) => {
    try {
        // Get user
        const user = await user_model_1.User.findOne({ email });
        // MUST return here
        if (!user) {
            return done(null, false, { message: "User does not exist." });
        }
        if (!user.isVerified) {
            return done(`User is not verified`);
        }
        if (user.isActive === user_interfaces_1.IsActive.BLOCKED ||
            user.isActive === user_interfaces_1.IsActive.INACTIVE) {
            return done(`User is ${user.isActive}`);
        }
        if (user.isDeleted) {
            // throw new AppError(
            //   httpStatus.BAD_REQUEST,
            //   `User is ${user.isDeleted}`
            // );
            return done(`User is deleted`);
        }
        if (!user.password) {
            return done(null, false, {
                message: "This account uses Google login. Please set a password first.",
            });
        }
        // bcrypt.compare ONLY after user check
        const isPasswordMatch = await bcryptjs_1.default.compare(password, user.password);
        // MUST return here
        if (!isPasswordMatch) {
            return done(null, false, { message: "Password does not match." });
        }
        // Success login
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
// for google login
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(null, false, { message: "No email found!" });
        }
        let user = await user_model_1.User.findOne({ email: email });
        if (user && !user.isVerified) {
            return done(null, false, { message: `User is not verified` });
        }
        if ((user && user.isActive === user_interfaces_1.IsActive.BLOCKED) ||
            (user && user.isActive === user_interfaces_1.IsActive.INACTIVE)) {
            return done(`User is ${user.isActive}`);
        }
        if (user && user.isDeleted) {
            // throw new AppError(
            //   httpStatus.BAD_REQUEST,
            //   `User is ${user.isDeleted}`
            // );
            return done(null, false, { message: `User is deleted` });
        }
        if (!user) {
            const newUser = {
                name: profile.displayName,
                email: email,
                avatar: profile.photos?.[0]?.value,
                role: user_interfaces_1.Role.USER,
                isVerified: true,
                auth: [{ provider: "Google", providerId: profile?.id }],
            };
            user = await user_model_1.User.create(newUser);
            user.save();
        }
        return done(null, user);
    }
    catch (error) {
        console.log(error);
        return done(error, false);
    }
}));
// serializer and deserialize user
passport_1.default.serializeUser((user, done) => {
    return done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = user_model_1.User.findById(id);
        return done(null, user);
    }
    catch (error) {
        return done(error);
        console.log(error);
    }
});
//# sourceMappingURL=passport.js.map