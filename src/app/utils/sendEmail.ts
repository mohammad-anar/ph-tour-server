import nodemailer from "nodemailer";
import { envVars } from "../config/env";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import path from "path";
import ejs from "ejs";
import AppError from "../errorHelpers/AppError";

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    fileName: string;
    contentType: string;
    content: Buffer | string;
  }[];
}

const transporter = nodemailer.createTransport({
  host: envVars.NODEMAILER.SMTP_HOST,
  port: Number(envVars.NODEMAILER.SMTP_PORT),
  secure: true,
  auth: {
    user: envVars.NODEMAILER.SMTP_USER,
    pass: envVars.NODEMAILER.SMTP_PASSWORD,
  },
} as SMTPTransport.Options);

export const sendEmail = async ({
  to,
  subject,
  attachments,
  templateName,
  templateData,
}: SendEmailOptions) => {
  try {
    const templatePath = path.join(__dirname, `template/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      from: envVars.NODEMAILER.SMTP_FROM,
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
  } catch (error: any) {
    console.log(`Email sending error ${error.message}`);
    throw new AppError(401, "Email sending error");
  }
};
