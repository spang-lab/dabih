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
import { SignInBody, AuthResponse, RequestWithUser } from '../types';

@Route('auth')
@Tags('Auth')
export class AuthController extends Controller {
  @Security('api_key', [])
  @Security('jwt', [])
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
  ): Promise<AuthResponse> {
    await rateLimit(request.ip);
    const { email } = requestBody;
    console.log(`Email auth requested for: ${email}`);
    throw new Error('Not implemented');
  }
}
