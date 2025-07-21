import {
  Controller,
  Tags,
  Route,
  Post,
  Get,
  Body,
  Request,
  OperationId,
  Response,
  Security,
} from '@tsoa/runtime';

import { rateLimit } from '#lib/redis/rateLimit';
import { Request as KoaRequest } from 'koa';
import type { RequestWithUser, SignInResponse, ErrorResponse } from '../types';
import signIn from './signIn';
import refresh from './refresh';

import { parseRequest } from 'src/auth';
import verifyEmail from './verifyEmail';

@Route('auth')
@Tags('Auth')
export class AuthController extends Controller {
  @Get('info')
  @Security('api_key', [])
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
  ): Promise<SignInResponse> {
    await rateLimit(request.ip);
    const { email } = requestBody;
    return signIn(email);
  }
  @Post('verify')
  @Response<ErrorResponse>(500, 'Unknown error')
  @OperationId('verifyEmail')
  public async verify(@Body() requestBody: { token: string }): Promise<string> {
    const { token } = requestBody;
    return verifyEmail(token);
  }

  @Post('refresh')
  @OperationId('refreshToken')
  public async token(@Request() request: KoaRequest): Promise<string> {
    const tokenStr = parseRequest(request);
    return refresh(tokenStr);
  }
}
