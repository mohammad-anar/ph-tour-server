import cors from "cors";
import express, { Request, Response } from "express";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { UserRoutes } from "./app/modules/user/user.routes";
import { notFoundRoute } from "./app/middlewares/notFoundRoute";

export const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1/user", UserRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to Tour mamangement server!!" });
});

// global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(globalErrorHandler);

// not found route handler
app.use(notFoundRoute);
