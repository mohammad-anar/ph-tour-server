interface EnvConfig {
    PORT: string;
    DB_URL: string;
    NODE_ENV: "development" | "production";
    BCRYPT_SALT_ROUND: string;
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRES: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES: string;
    SUPER_ADMIN_EMAIL: string;
    SUPER_ADMIN_PASSWORD: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URL: string;
    EXPRESS_SESSION_SECRET: string;
    FRONT_END_URL: string;
    SSL: {
        STORE_ID: string;
        STORE_PASS: string;
        SSL_PAYMENT_API: string;
        SSL_VALIDATION_API: string;
        SSL_SUCCESS_BACKEND_URL: string;
        SSL_FAILED_BACKEND_URL: string;
        SSL_CANCEL_BACKEND_URL: string;
        SSL_SUCCESS_FRONTEND_URL: string;
        SSL_FAILED_FRONTEND_URL: string;
        SSL_CANCEL_FRONTEND_URL: string;
        SSL_IPN_URL: string;
    };
    CLOUDINARY: {
        CLOUDINARY_CLOUD_NAME: string;
        CLOUDINARY_API_KEY: string;
        CLOUDINARY_API_SECRET: string;
    };
    NODEMAILER: {
        SMTP_PASSWORD: string;
        SMTP_HOST: string;
        SMTP_PORT: string;
        SMTP_USER: string;
        SMTP_FROM: string;
    };
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_USERNAME: string;
    REDIS_PASSWORD: string;
}
export declare const envVars: EnvConfig;
export {};
//# sourceMappingURL=env.d.ts.map