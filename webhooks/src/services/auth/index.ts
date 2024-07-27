import { handleAccountRegistration } from "@/utils/webhookHelper";

export const sendRegistrationEmail = async (payload: {
  email: string;
  access_token: string;
}) => {
  const { email, access_token } = payload;

  console.log("EMAIL", email, "ACCESS_TOKEN", access_token);

  const result = await handleAccountRegistration(email, access_token);

  if (result) {
    return true;
  }

  if (!result) {
    return false;
  }
};
