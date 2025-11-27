import passport from "passport";
import {
  Strategy as GoogleStretegy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interfaces";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

// for credential login
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email: string, password: string, done: any) => {
      try {
        // Get user
        const user = await User.findOne({ email });

        // MUST return here
        if (!user) {
          return done(null, false, { message: "User does not exist." });
        }

        if (!user.isVerified) {
          done(`User is not verified`);
        }

        if (
          user.isActive === IsActive.BLOCKED ||
          user.isActive === IsActive.INACTIVE
        ) {
          done(`User is ${user.isActive}`);
        }
        if (user.isDeleted) {
          // throw new AppError(
          //   httpStatus.BAD_REQUEST,
          //   `User is ${user.isDeleted}`
          // );
          done(`User is deleted`);
        }

        if (!user.password) {
          return done(null, false, {
            message:
              "This account uses Google login. Please set a password first.",
          });
        }

        // bcrypt.compare ONLY after user check
        const isPasswordMatch = await bcrypt.compare(
          password,
          user.password as string
        );

        // MUST return here
        if (!isPasswordMatch) {
          return done(null, false, { message: "Password does not match." });
        }

        // Success login
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// for google login
passport.use(
  new GoogleStretegy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          done(null, false, { message: "No email found!" });
        }

        let user = await User.findOne({ email: email });

        if (!user) {
          const newUser = {
            name: profile.displayName,
            email: email as string,
            avatar: profile.photos?.[0]?.value,
            role: Role.USER,
            isVerified: true,
            auth: [{ provider: "Google", providerId: profile?.id }],
          };

          user = await User.create(newUser);
          user.save();
        }

        done(null, user);
      } catch (error) {
        console.log(error);
        done(error, false);
      }
    }
  )
);

// serializer and deserialize user

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
    console.log(error);
  }
});
