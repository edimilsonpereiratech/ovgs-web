export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export type LogContext = Record<string, unknown>

export interface Logger {
  debug(message: string, context?: LogContext): void
  info(message: string, context?: LogContext): void
  warn(message: string, context?: LogContext): void
  error(message: string, context?: LogContext): void
}

const CONSOLE_METHOD: Record<LogLevel, 'log' | 'info' | 'warn' | 'error'> = {
  debug: 'log',
  info: 'info',
  warn: 'warn',
  error: 'error',
}

function writeToConsole(level: LogLevel, message: string, context?: LogContext) {
  const entry = { level, message, timestamp: new Date().toISOString(), ...context }
  // eslint-disable-next-line no-console
  console[CONSOLE_METHOD[level]](`[${level.toUpperCase()}] ${message}`, entry)
}

export const consoleLogger: Logger = {
  debug: (message, context) => writeToConsole('debug', message, context),
  info: (message, context) => writeToConsole('info', message, context),
  warn: (message, context) => writeToConsole('warn', message, context),
  error: (message, context) => writeToConsole('error', message, context),
}

export const logger: Logger = consoleLogger
