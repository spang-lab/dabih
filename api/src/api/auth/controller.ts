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
} from '@tsoa/runtime';

import { rateLimit } from '#lib/redis/rateLimit';
import { Request as KoaRequest } from 'koa';
import { SignInBody, RequestWithUser, AuthToken } from '../types';
import token from './token';
import signIn from './email';

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
    @Body() requestBody: SignInBody,
  ): Promise<AuthToken | null> {
    await rateLimit(request.ip);
    const { email } = requestBody;
    return signIn(email);
  }
  @Post('verify')
  @OperationId('verifyEmail')
  public async verify(@Body() requestBody: { token: string }): Promise<void> {
    const { token } = requestBody;
    console.log('verify', token);
    throw new Error('unimplemented');
  }

  @Post('token')
  @OperationId('token')
  @Security('api_key', ['dabih:token'])
  public async token(@Request() request: RequestWithUser): Promise<AuthToken> {
    const { user } = request;
    return token(user);
  }
}
