import passport from "passport";
import { Strategy as GoogleStretegy } from "passport-google-oauth20";
import { envVars } from "./env";

passport.use(
  new GoogleStretegy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async () => {
        
    }
  )
);
