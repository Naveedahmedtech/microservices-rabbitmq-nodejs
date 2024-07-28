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


