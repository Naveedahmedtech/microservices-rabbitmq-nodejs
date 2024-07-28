export type registerEmailPayloadT = {
  email: string;
  access_token: string;
};

export type registrationEmailDataT = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  verificationLink?: string;
};

export type templateFoldernameT = "auth";

export type constantTemFNamesT = {
  AUTH: "auth";
};

export type consumeMessagesT = (
  ch: any,
  queue: string,
  processMessage: (payload: any) => Promise<any>,
  loggerMessage: string
) => void;

export type setupRabbitMQT = (
  url: string,
  exchange: string,
  routing_key: string,
  callback: any
) => void;

export type ENVT = {
  AMQP_HOST: string;
};

export type emailTemplateT = (
  templateName: string,
  foldername: string,
  data: any
) => Promise<string>;


export type connectToAmqpT = (url: string, callback: any) => void;
