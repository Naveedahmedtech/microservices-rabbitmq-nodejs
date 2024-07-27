import connectToAmqp from "@/config/rabbitmq.config";

export const setupRabbitMQ = (url:string, exchange:string, routingKey:string, callback:any) => {
  connectToAmqp(url, (err:any, ch:any) => {
    if (err) return callback(err);

    ch.assertExchange(exchange, "topic", { durable: true });

    ch.assertQueue("", { exclusive: true }, (err2:any, q:any) => {
      if (err2) return callback(err2);

      ch.bindQueue(q.queue, exchange, routingKey);

      callback(null, ch, q.queue);
    });
  });
};
