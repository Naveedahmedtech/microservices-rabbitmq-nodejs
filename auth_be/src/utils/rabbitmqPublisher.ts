import amqp from "amqplib/callback_api";
import logger from "@/utils/logger"; // Assuming you have a logger utility

export const publishToRabbitMQ = (
  url: string,
  exchange: string,
  routingKey: string,
  message: any
) => {
  amqp.connect(url, (err0, conn) => {
    if (err0) {
      logger.error(`RabbitMQ connection error: ${err0.message}`);
      throw err0;
    }
    conn.createChannel((err1, ch) => {
      if (err1) {
        logger.error(`RabbitMQ channel error: ${err1.message}`);
        throw err1;
      }

      ch.assertExchange(exchange, "topic", { durable: true });
      // persistent to remember the message
      ch.publish(exchange, routingKey, Buffer.from(message), {
        persistent: true,
      });
      logger.info(
        `Message sent to ${exchange} with routing key ${routingKey}: ${message}`
      );
    });
  });
};
