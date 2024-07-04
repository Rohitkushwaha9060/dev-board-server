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
exports.emailService = void 0;
const mailgen_1 = __importDefault(require("mailgen"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
const core_1 = require("../core");
(0, dotenv_1.config)();
// create transporter
const transporter = nodemailer_1.default.createTransport({
    //@ts-ignore
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// send mail
const sendMail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, from, subject, mailBody, }) {
    const mailOptions = {
        from: from || process.env.EMAIL_FORM,
        to: to || process.env.EMAIL_TO,
        subject,
        html: mailBody,
    };
    try {
        yield transporter.sendMail(mailOptions);
        core_1.logger.info('Mail sent successfully');
    }
    catch (error) {
        console.log(error);
        core_1.logger.error('Error sending mail');
    }
});
class EmailService {
    // email ready
    emailReady(mailgenContent) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailGenerator = new mailgen_1.default({
                theme: 'default',
                product: {
                    name: 'Kite Institute - Email',
                    link: '#',
                },
            });
            return mailGenerator.generate(mailgenContent);
        });
    }
    // send verification email
    sendVerificationEmail(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailgenContent = {
                body: {
                    intro: 'Hi there, welcome to Kite Institute!',
                    dictionary: {
                        OTP: otp,
                    },
                    outro: 'Please verify your email . ',
                },
            };
            yield sendMail({
                to: email,
                subject: 'Verify your email',
                mailBody: yield this.emailReady(mailgenContent),
            });
        });
    }
}
exports.emailService = new EmailService();
//# sourceMappingURL=email.js.map