import amqp from "amqplib/callback_api";

const connectToAmqp = (url:string, callback:any) => {
  amqp.connect(url, (err0, conn) => {
    if (err0) {
      callback(err0);
    } else {
      conn.createChannel((err1, ch) => {
        if (err1) {
          callback(err1);
        } else {
          callback(null, ch);
        }
      });
    }
  });
};

export default connectToAmqp;
