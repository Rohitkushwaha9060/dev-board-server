import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';
import { config } from 'dotenv';
import { logger } from '@/core';
config();

// create transporter
const transporter = nodemailer.createTransport({
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
const sendMail = async ({
    to,
    from,
    subject,
    mailBody,
}: {
    to?: string;
    from?: string;
    subject: string;
    mailBody: any;
}) => {
    const mailOptions = {
        from: from || process.env.EMAIL_FORM,
        to: to || process.env.EMAIL_TO,
        subject,
        html: mailBody,
    };
    try {
        await transporter.sendMail(mailOptions);
        logger.info('Mail sent successfully');
    } catch (error) {
        console.log(error);
        logger.error('Error sending mail');
    }
};

class EmailService {
    async emailReady(mailgenContent: any) {
        const mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Kite Institute - Email',
                link: '#',
            },
        });

        return mailGenerator.generate(mailgenContent);
    }

    async sendVerificationEmail(email: string, otp: string) {
        const mailgenContent = {
            body: {
                intro: 'Hi there, welcome to Kite Institute!',
                dictionary: {
                    OTP: otp,
                },
                outro: 'Please verify your email . ',
            },
        };

        await sendMail({
            to: email,
            subject: 'Verify your email',
            mailBody: await this.emailReady(mailgenContent)!,
        });
    }
}

export const emailService = new EmailService();
