import { loadEnv } from "@/config";
import nodemailer, { Transporter, SendMailOptions } from "nodemailer";

interface Attachment {
  filename: string;
  content: Buffer;
}

loadEnv();

const EMAIL_HOST = process.env.EMAIL_HOST || "nothing";
const EMAIL_USER = process.env.EMAIL_USER || "nothing";
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "nothing";

console.log("EMAIL: " + EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD);

export const sendEmail = async (data: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: Attachment[] | [];
}): Promise<string | undefined> => {
  const { to, subject, text, html, attachments } = data;
  try {
    const transporter: Transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });

    // Message object
    const message: SendMailOptions = {
      from: EMAIL_USER,
      to: to,
      subject: subject,
      text: text,
      html: html,
      attachments: attachments || [],
    };

    // Send email with Nodemailer
    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
    return info.messageId as string;
  } catch (error) {
    console.error("Error sending email:", error);
    // throw error;
  }
};
