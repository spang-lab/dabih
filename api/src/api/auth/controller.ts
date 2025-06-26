import {
  Controller,
  Tags,
  Route,
  Post,
  Get,
  Body,
  Request,
  Security,
  OperationId,
  SuccessResponse,
} from '@tsoa/runtime';

import { rateLimit } from '#lib/redis/rateLimit';
import { Request as KoaRequest } from 'koa';
import { RequestWithUser } from '../types';
import token from './token';
import signIn from './signIn';

import { parseRequest } from 'src/auth';
import verifyEmail from './verifyEmail';

@Route('auth')
@Tags('Auth')
export class AuthController extends Controller {
  @Security('api_key', [])
  @Get('info')
  @OperationId('authInfo')
  public info(@Request() request: RequestWithUser) {
    const { user } = request;
    return user;
  }

  @Post('signIn')
  @OperationId('signIn')
  public async signIn(
    @Request() request: KoaRequest,
    @Body() requestBody: { email: string },
  ): Promise<string | null> {
    await rateLimit(request.ip);
    const { email } = requestBody;
    return signIn(email);
  }
  @Post('verify')
  @OperationId('verifyEmail')
  @SuccessResponse('204', 'No Content')
  public async verify(@Body() requestBody: { token: string }): Promise<void> {
    const { token } = requestBody;
    return verifyEmail(token);
  }

  @Post('token')
  @OperationId('token')
  public async token(@Request() request: KoaRequest): Promise<string> {
    const tokenStr = parseRequest(request);
    return token(tokenStr);
  }
}
