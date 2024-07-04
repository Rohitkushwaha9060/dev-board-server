"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secrets = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const _secret = {
    // node env
    NODE_ENV: process.env.NODE_ENV,
    // ports
    PORT: process.env.PORT,
    // database
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    // cors
    ALLOW_ORIGIN_ONE: process.env.ALLOW_ORIGIN_ONE,
    // jwt
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    // cloudinary
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    // email
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_SECURE: process.env.EMAIL_SECURE,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    EMAIL_FORM: process.env.EMAIL_FORM,
    EMAIL_TO: process.env.EMAIL_TO,
    // firebase
    FIREBASE_TYPE: process.env.FIREBASE_TYPE,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_PROJECT_KEY_ID: process.env.FIREBASE_PROJECT_KEY_ID,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_CLIENT_ID: process.env.FIREBASE_CLIENT_ID,
    FIREBASE_AUTH_URI: process.env.FIREBASE_AUTH_URI,
    FIREBASE_TOKEN_URI: process.env.FIREBASE_TOKEN_URI,
    FIREBASE_AUTH_PROVIDER_X509_CERT_URL: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    FIREBASE_CLIENT_X509_CERT_URL: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    FIREBASE_UNIVERSE_DOMAIN: process.env.FIREBASE_UNIVERSE_DOMAIN,
};
exports.secrets = Object.freeze(_secret);
//# sourceMappingURL=secrets.js.map