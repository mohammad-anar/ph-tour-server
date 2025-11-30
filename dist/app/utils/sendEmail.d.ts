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
export declare const sendEmail: ({ to, subject, attachments, templateName, templateData, }: SendEmailOptions) => Promise<void>;
export {};
//# sourceMappingURL=sendEmail.d.ts.map