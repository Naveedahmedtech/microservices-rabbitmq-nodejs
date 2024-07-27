import { NextFunction, Request, Response } from "@/config/express.config";
import logger from "@/utils/logger";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "@/utils/responseHandler";
import { handleAccountRegistration } from "@/utils/webhookHelper";
// ** external libraries
import amqp from "amqplib/callback_api";

export const emailWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { event_type } = req.body;
  try {
    amqp.connect("amqp://localhost", (err0, conn) => {
      if (err0) throw err0;

      // Create a channel
      conn.createChannel((err1, ch) => {
        if (err1) throw err1;

        const exchange = "email_exchange";
        const routingKey = "account.registration";
        // Assert exchange
        ch.assertExchange(exchange, "topic", {
          durable: false,
        });

        // Assert queue
        ch.assertQueue(
          "",
          {
            exclusive: true,
          },
          (err2, q) => {
            if (err2) throw err2;

            // Bind queue to exchange with routing key
            ch.bindQueue(q.queue, exchange, routingKey);

            // Set up a consumer
            ch.consume(
              q.queue,
              (msg: any) => {
                if (msg.content) {
                  console.log(`Received: ${msg.content.toString()}`);
                  // Process the message here

                  // Acknowledge the message
                  ch.ack(msg);
                }
              },
              {
                noAck: true,
              }
            );

            console.log(
              `Waiting for messages in queue: ${q.queue}. To exit press CTRL+C`
            );
          }
        );
      });
    });
  } catch (error: Error | any) {
    next(error);
  }
};
