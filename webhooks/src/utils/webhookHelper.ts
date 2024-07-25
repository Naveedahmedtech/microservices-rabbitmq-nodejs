import { sendEmail } from "@/lib/sendEmail";
import { compileEmailTemplate } from "./emailHelper";

export const handleAccountRegistration = async (email:string, accessToken:string) => {
  try {
    const templateName = "registration-confirmation";
    const data: {
      to: string;
      subject: string;
      text: string;
      html?: string;
      verificationLink?: string;
    } = {
      to: email,
      subject: "Welcome to Our Chillout",
      text: "Thank you for registering with us. Please verify your email address to complete the registration.",
      html: "",
      verificationLink: `${process.env.REGISTRATION_VERIFICATION_LINK}?registrationToken=${accessToken}`,
    };
    const foldername = "auth";
    const html = await compileEmailTemplate(templateName, foldername, data);
    data.html = html;
    await sendEmail(data);
  } catch (error) {
    throw error;
  }
};
