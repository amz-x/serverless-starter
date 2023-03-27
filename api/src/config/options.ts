import { LogLevel } from "@nestjs/common";
import { NestApplicationContextOptions } from "@nestjs/common/interfaces/nest-application-context-options.interface";

export const AppOptions: NestApplicationContextOptions = Object.freeze({
  logger: [ 'log', 'error', 'warn', 'debug', 'verbose' ] as LogLevel[],
  bufferLogs: true
});
