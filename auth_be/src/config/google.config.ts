import { OAuth2Client } from "google-auth-library";
import { ENV } from "@/constants";

export const oauth2Client = new OAuth2Client(ENV.GOOGLE_CLIENT_ID, ENV.GOOGLE_SECRET_ID, ENV.GOOGLE_REDIRECT_URI);
