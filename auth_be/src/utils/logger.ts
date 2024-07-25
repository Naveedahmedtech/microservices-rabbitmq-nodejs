import { createLogger, transports, format } from "winston";

const { combine, timestamp, errors, printf } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  const baseFormat = `${timestamp} \t ${level}: \t`;
  const errorFormat = stack ? `\n${stack}` : message;
  return `${baseFormat} ${errorFormat}`;
});

const logger = createLogger({
  level: "info",
  format: combine(timestamp(), errors({ stack: true }), logFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
});

export default logger;
