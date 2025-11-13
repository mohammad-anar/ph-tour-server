import passport from "passport";
import {
  Strategy as GoogleStretegy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interfaces";

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
