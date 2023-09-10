import { createLogger, format, transports } from "winston";

export const log = createLogger({
  format: format.json(),
  transports: [
    new transports.Console({
      format: format.json(),
    }),
  ],
});
