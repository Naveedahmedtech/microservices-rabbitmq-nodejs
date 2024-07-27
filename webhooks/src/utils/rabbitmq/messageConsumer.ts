import logger from "@/utils/logger";

const MAX_RETRIES = 5;

export const consumeMessages = (
  ch: any,
  queue: any,
  processMessage: any,
  loggerMessage: any
) => {
  ch.consume(
    queue,
    async (msg: any) => {
      if (msg.content) {
        const payload = JSON.parse(msg.content.toString()) || {};
        console.log(`Received: ${payload}`);

        let attempts = 0;
        let success = false;

        while (attempts < MAX_RETRIES && !success) {
          try {
            const result = await processMessage(payload);
            if (result) {
              logger.info(loggerMessage);
              success = true;
              ch.ack(msg); // Acknowledge the message only after successful processing
            } else {
              attempts++;
              logger.error(
                `Failed to process message. Attempt ${attempts}/${MAX_RETRIES}`
              );
            }
          } catch (error: any) {
            attempts++;
            logger.error(
              `Error processing message. Attempt ${attempts}/${MAX_RETRIES}: ${error.message}`
            );
          }

          if (!success && attempts >= MAX_RETRIES) {
            logger.error("Message processing failed after maximum retries");
            ch.nack(msg, false, false); // Optionally, we'll reject and discard the message
          }
        }
      }
    },
    { noAck: false }
  );

  console.log(`Waiting for messages in queue: ${queue}. To exit press CTRL+C`);
};
