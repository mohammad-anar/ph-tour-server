import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { checkAuth } from "../../middlewares/checkAuths";
import { Role } from "../user/user.interfaces";
import { AuthControllers } from "./auth.controller";
import { envVars } from "../../config/env";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.changePassword
);
router.post(
  "/set-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.setPassword
);
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
);
router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONT_END_URL}/login?error=There is some issue on your account. Please contact with support team.`,
  }),
  AuthControllers.googleCallbackController
);

export const AuthRoutes = router;
