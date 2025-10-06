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
  Query,
} from '@tsoa/runtime';

import { rateLimit } from '#lib/redis/rateLimit';
import { Request as KoaRequest } from 'koa';
import type { RequestWithUser, SignInResponse, ErrorResponse } from '../types';
import signIn from './signIn';
import refresh from './refresh';

import { parseRequest } from 'src/auth';
import verifyEmail from './verifyEmail';
import login from './login';
import callback from './callback';
import { OpenIDProvider } from '../types/auth';
import { getProvider } from '#lib/openid/index';

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

  @Get('provider')
  @OperationId('authProvider')
  public provider(): OpenIDProvider | null {
    return getProvider();
  }

  @Get('login')
  @OperationId('loginRedirect')
  @Response(302, 'Redirect to OIDC provider')
  public async login() {
    const url = await login();
    this.setStatus(302);
    this.setHeader('Location', url);
    return;
  }

  @Get('callback')
  @OperationId('loginCallback')
  @Response(302, 'Redirect to frontend with token')
  public async callback(
    @Request() request: KoaRequest,
    @Query() state: string,
    @Query() code: string,
  ) {
    return callback(request.url, state, code);
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
