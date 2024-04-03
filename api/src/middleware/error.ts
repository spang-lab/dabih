import logger from "#logger";
import { Context, Next } from "koa";
import { ValidateError } from "@tsoa/runtime";

interface DabihError {
  message: string;
  code?: number;
  details?: unknown;
}

declare module "koa" {
  interface BaseContext {
    error: (error: DabihError | string) => void;
  }
}


const getStackMessage = (error: Error) => {
  const { stack } = error;
  if (!stack) {
    return '';
  }
  const messages = stack.split('\n');
  if (messages.length < 2) {
    return '';
  }

  const pwd = process.cwd();
  const shortMessage = messages
    .map((m) => m.replaceAll(pwd, '').trim())
    .join('    ');
  return shortMessage;
};

const error = async (ctx: Context, next: Next) => {
  try {
    ctx.error = (error: DabihError | string) => {
      if (typeof error === 'string') {
        error = {
          message: error,
        };
      }
      ctx.status = error.code ?? 500;
      ctx.body = {
        message: error.message,
        details: error.details,
      };
    };
    await next();
  } catch (err) {
    if (err instanceof ValidateError) {
      ctx.error({
        message: 'Validation Failed',
        details: err?.fields,
        code: 422,
      });
      return;
    }
    if (err instanceof Error) {
      const stack = getStackMessage(err);
      ctx.error({
        message: err.message,
        details: stack,
        code: 500,
      });
      return;
    }
    logger.error(`Unexpected Error: Type ${typeof err} was thrown,
                 only Errors should be thrown in Koa middleware.`);
    logger.error(err);
    ctx.error('Internal Server Error');
  }
};
export default () => error;

