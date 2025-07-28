import nodeMailer from "nodemailer";
import { envVars } from "../config/env";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import AppError from "../errorHelpers/AppError";
import path from "path";
import ejs from "ejs";

const transporter = nodeMailer.createTransport({
  // port: envVars.EMAIL_SENDER.SMTP_PORT,
  secure: true,
  auth: {
    user: envVars.SMTP.SMTP_USER,
    pass: envVars.SMTP.SMTP_PASS,
  },
  port: Number(envVars.SMTP.SMTP_PORT),
  host: envVars.SMTP.SMTP_HOST,
} as SMTPTransport.Options);

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: SendEmailOptions) => {
  try {
    const templatePath = path.join(__dirname, `template/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: String(envVars.SMTP.SMTP_FROM),
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
  } catch (error: any) {
    console.log("email sending error", error.message);
    throw new AppError(401, "Email error", "");
  }
};
