type ROLE = "USER" | "ADMIN"

export type registrationBodyT = {
  email: string;
  password: string;
  role: ROLE;
  postmanKey?: string;
  confirmPassword: string;
};

export type SignUpMethodT = "EMAIL" | "GOOGLE" | "FACEBOOK";

export type registrationEmailPayloadT = {
  email: string;
  access_token: string;
};


export type ENVT = {
  // Facebook
  FACEBOOK_APP_ID: string;
  FACEBOOK_APP_SECRET: string;
  FACEBOOK_REDIRECT_URI: string;
  FACEBOOK_SCOPE: string;
  FACEBOOK_RESPONSE_TYPE: string;
  FACEBOOK_OAUTH_URL: string;
  FACEBOOK_VERIFY_URL: string;
  FACEBOOK_RESPONSE_URL: string;
  FACEBOOK_FIELDS: string;
  // Google
  GOOGLE_CLIENT_ID: string;
  GOOGLE_SECRET_ID: string;
  GOOGLE_REDIRECT_URI: string;
  // JWT
  ACCESS_TOKEN_EXPIRY: string;
  REFRESH_TOKEN_EXPIRY: string;
  JWT_SECRET: string;
};


