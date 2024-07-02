import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import admin from 'firebase-admin';
import { secrets } from '@/core';

class UtilsService {
    // hashPassword
    hashPasswordBcrypt = async (password: string) => {
        return await bcrypt.hash(password, 12);
    };

    // comparePassword
    comparePasswordBcrypt = async (password: string, hash: string) => {
        return await bcrypt.compare(password, hash);
    };

    // generateToken
    createTokenJwt = (payload: {}, secret: string, expiresIn: string) => {
        return jwt.sign(payload, secret, {
            expiresIn,
        });
    };

    // verifyToken
    verifyTokenJwt = (token: string, secret: string) => {
        return jwt.verify(token, secret);
    };

    // generateOTP
    generateOTP = () => {
        const otp = crypto.randomInt(10000, 1000000);
        return otp;
    };

    // firebase
    firebaseAdmin = () => {
        return admin.initializeApp({
            credential: admin.credential.cert({
                // @ts-ignore
                type: secrets.FIREBASE_TYPE,
                project_id: secrets.FIREBASE_PROJECT_ID,
                private_key_id: secrets.FIREBASE_PROJECT_KEY_ID,
                private_key: secrets.FIREBASE_PRIVATE_KEY,
                client_email: secrets.FIREBASE_CLIENT_EMAIL,
                client_id: secrets.FIREBASE_CLIENT_ID,
                auth_uri: secrets.FIREBASE_AUTH_URI,
                token_uri: secrets.FIREBASE_TOKEN_URI,
                auth_provider_x509_cert_url:
                    secrets.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
                client_x509_cert_url: secrets.FIREBASE_CLIENT_X509_CERT_URL,
                universe_domain: secrets.FIREBASE_UNIVERSE_DOMAIN,
            }),
        });
    };
}

export const utilsService = new UtilsService();
