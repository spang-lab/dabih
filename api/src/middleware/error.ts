import logger from "#lib/logger";
import { Context, Next } from "koa";
import { ValidateError } from "@tsoa/runtime";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
      logger.error(`${ctx.status}: ${error.message}`);
      logger.verbose(error.details);

      ctx.body = {
        message: error.message,
        details: error.details,
      };
    };
    await next();
  } catch (err) {
    if (!(err instanceof Error)) {
      logger.error(`Unexpected Error: Type ${typeof err} was thrown,
                   only Errors should be thrown in Koa middleware.`);
      logger.error(err);
      ctx.error('Internal Server Error');
      return;
    }
    if (err instanceof PrismaClientKnownRequestError) {
      const { code, message } = err;
      ctx.error({
        message: `Database Error with code "${code}"`,
        details: message,
        code: 400,
      });
    }
    if (err instanceof ValidateError) {
      ctx.error({
        message: 'Validation Failed',
        details: err?.fields,
        code: 422,
      });
      return;
    }
    if ("code" in err && typeof err.code === 'number') {
      ctx.error({
        message: err.message,
        code: err.code,
      });
      return;
    }
    const stack = getStackMessage(err);
    ctx.error({
      message: err.message,
      details: stack,
      code: 500,
    });
  }
};
export default () => error;

