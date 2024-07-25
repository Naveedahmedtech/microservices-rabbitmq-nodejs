import express from "express";
import proxy from "express-http-proxy";
import { config } from "dotenv";

config();

// TODO: handle case where PORT not found

const app = express();

const PORT = process.env.PORT;

const AUTH_ROUTE = process.env.AUTH_ROUTE;
const AUTH_PORT = process.env.AUTH_PORT;
const WEBHOOK_PORT = process.env.WEBHOOK_PORT;
const WEBHOOK_ROUTE = process.env.WEBHOOK_ROUTE;

app.use(`/${AUTH_ROUTE}`, proxy(`http://localhost:${AUTH_PORT}`));
app.use(`/${WEBHOOK_ROUTE}`, proxy(`http://localhost:${WEBHOOK_PORT}`));

app.listen(PORT, () => {
  console.log(`SERVER IS LISTING ON ${PORT}`);
});
