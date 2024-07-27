import { sendRegistrationEmail } from "@/services/auth";
import { setupRabbitMQ } from "@/utils/rabbitmq/rabbitmqSetup";
import { consumeMessages } from "@/utils/rabbitmq/messageConsumer";

export const registerEmail = async () => {
  setupRabbitMQ(
    "amqp://localhost",
    "email_exchange",
    "account.registration",
    (err: any, ch: any, queue: any) => {
      if (err) throw err;

      const logMessage = "Email has been sent successfully";
      consumeMessages(ch, queue, sendRegistrationEmail, logMessage);
    }
  );
};
