"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const transporter = nodemailer_1.default.createTransport({
    host: env_1.envVars.NODEMAILER.SMTP_HOST,
    port: Number(env_1.envVars.NODEMAILER.SMTP_PORT),
    secure: true,
    auth: {
        user: env_1.envVars.NODEMAILER.SMTP_USER,
        pass: env_1.envVars.NODEMAILER.SMTP_PASSWORD,
    },
});
const sendEmail = async ({ to, subject, attachments, templateName, templateData, }) => {
    try {
        const templatePath = path_1.default.join(__dirname, `template/${templateName}.ejs`);
        const html = await ejs_1.default.renderFile(templatePath, templateData);
        const info = await transporter.sendMail({
            from: env_1.envVars.NODEMAILER.SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map((attachment) => ({
                filename: attachment.fileName,
                content: attachment.content,
                contentType: attachment.contentType,
            })),
        });
        console.log(`Email sent to ${to}: ${info.messageId}`);
    }
    catch (error) {
        console.log(`Email sending error ${error.message}`);
        throw new AppError_1.default(401, "Email sending error");
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map