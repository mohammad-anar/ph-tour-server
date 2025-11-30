"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const notFoundRoute_1 = require("./app/middlewares/notFoundRoute");
const routes_1 = require("./app/routes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
require("./app/config/passport");
const env_1 = require("./app/config/env");
exports.app = (0, express_1.default)();
exports.app.use((0, express_session_1.default)({
    secret: "your secret",
    resave: false,
    saveUninitialized: false,
}));
exports.app.use(passport_1.default.initialize());
exports.app.use(passport_1.default.session());
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, cors_1.default)({
    origin: env_1.envVars.FRONT_END_URL,
    credentials: true,
}));
exports.app.use("/api/v1", routes_1.router);
exports.app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to Tour mamangement server!!" });
});
// global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.app.use(globalErrorHandler_1.globalErrorHandler);
// not found route handler
exports.app.use(notFoundRoute_1.notFoundRoute);
//# sourceMappingURL=app.js.map