import { TEMPLATE_FOLDER_NAME } from "@/constants";
import { sendEmail } from "@/lib/sendEmail";
import { registrationEmailDataT, templateFoldernameT } from "@/types";
import { compileEmailTemplate } from "@/utils/emailHelper";
import logger from "@/utils/logger";

export const handleAccountRegistration = async (email:string, accessToken:string) => {
  try {
    const templateName = "registration-confirmation";
    const data: registrationEmailDataT  = {
      to: email,
      subject: "Welcome to Our Chillout",
      text: "Thank you for registering with us. Please verify your email address to complete the registration.",
      html: "",
      verificationLink: `${process.env.REGISTRATION_VERIFICATION_LINK}?registrationToken=${accessToken}`,
    };
    const foldername: templateFoldernameT  = TEMPLATE_FOLDER_NAME.AUTH;
    const html = await compileEmailTemplate(templateName, foldername, data);
    data.html = html;
    await sendEmail(data);
    return true;
  } catch (error) {
    logger.error("Couldn't send email")
    return false;
  }
};
