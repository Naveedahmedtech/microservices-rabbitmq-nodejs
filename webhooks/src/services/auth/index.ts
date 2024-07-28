import { registerEmailPayloadT } from "@/types";
import logger from "@/utils/logger";
import { handleAccountRegistration } from "@/utils/webhookHelper";

export const sendRegistrationEmail = async (payload: registerEmailPayloadT) => {
  const { email, access_token } = payload;

  const result = await handleAccountRegistration(email, access_token);

  if (result) {
    logger.info("Registration service successfully processed!");
    return true;
  }

  if (!result) {
    logger.error("Error processing registration service!");
    return false;
  }
};
