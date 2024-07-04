"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utilsService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const core_1 = require("../core");
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const slugify_1 = __importDefault(require("slugify"));
cloudinary_1.v2.config({
    cloud_name: core_1.secrets.CLOUDINARY_CLOUD_NAME,
    api_key: core_1.secrets.CLOUDINARY_API_KEY,
    api_secret: core_1.secrets.CLOUDINARY_API_SECRET,
});
class UtilsService {
    constructor() {
        // hashPassword
        this.hashPasswordBcrypt = (password) => __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(password, 12);
        });
        // comparePassword
        this.comparePasswordBcrypt = (password, hash) => __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(password, hash);
        });
        // generateToken
        this.createTokenJwt = (payload, secret, expiresIn) => {
            return jsonwebtoken_1.default.sign(payload, secret, {
                expiresIn,
            });
        };
        // verifyToken
        this.verifyTokenJwt = (token, secret) => {
            return jsonwebtoken_1.default.verify(token, secret);
        };
        // generateOTP
        this.generateOTP = () => {
            const otp = crypto_1.default.randomInt(10000, 1000000);
            return otp;
        };
        // firebase
        this.firebaseAdmin = () => {
            return firebase_admin_1.default.initializeApp({
                credential: firebase_admin_1.default.credential.cert({
                    // @ts-ignore
                    type: core_1.secrets.FIREBASE_TYPE,
                    project_id: core_1.secrets.FIREBASE_PROJECT_ID,
                    private_key_id: core_1.secrets.FIREBASE_PROJECT_KEY_ID,
                    private_key: core_1.secrets.FIREBASE_PRIVATE_KEY,
                    client_email: core_1.secrets.FIREBASE_CLIENT_EMAIL,
                    client_id: core_1.secrets.FIREBASE_CLIENT_ID,
                    auth_uri: core_1.secrets.FIREBASE_AUTH_URI,
                    token_uri: core_1.secrets.FIREBASE_TOKEN_URI,
                    auth_provider_x509_cert_url: core_1.secrets.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
                    client_x509_cert_url: core_1.secrets.FIREBASE_CLIENT_X509_CERT_URL,
                    universe_domain: core_1.secrets.FIREBASE_UNIVERSE_DOMAIN,
                }),
            });
        };
        // cloudinary upload
        this.uploadToCloudinary = (filePath) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!filePath)
                    return null;
                const response = yield cloudinary_1.v2.uploader.upload(filePath, {
                    folder: 'devBoard',
                    resource_type: 'auto',
                });
                fs_1.default.unlinkSync(filePath);
                return response;
            }
            catch (error) {
                fs_1.default.unlinkSync(filePath);
                return null;
            }
        });
        // cloudinary delete
        this.deleteFromCloudinary = (public_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (public_id) {
                    const res = yield cloudinary_1.v2.uploader.destroy(public_id);
                    return res;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                return null;
            }
        });
        // slugify
        this.slugifyData = (title) => {
            return (0, slugify_1.default)(title, {
                lower: true,
                strict: true,
                replacement: '_',
                remove: /[*+~.()'"!:@]/g,
                locale: 'en',
                trim: true,
            });
        };
    }
}
exports.utilsService = new UtilsService();
//# sourceMappingURL=utils.js.map