import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interfaces";
import { createUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuths";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);

router.get(
  "/get-me",
  checkAuth(...Object.values(Role)),
  UserControllers.getMe
);
// update user
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);

export const UserRoutes = router;
