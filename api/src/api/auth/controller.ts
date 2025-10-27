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
import {
  type RequestWithUser,
  type SignInResponse,
  type ErrorResponse,
  Scope,
} from '../types';
import signIn from './signIn';
import refresh from './refresh';

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
    let redirectUrl;
    try {
      redirectUrl = await login();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      redirectUrl = `/signin/error?message=${encodeURIComponent(message)}`;
    }
    this.setStatus(302);
    this.setHeader('Location', redirectUrl);
  }

  @Get('callback')
  @OperationId('loginCallback')
  @Response(302, 'Redirect to frontend with token')
  public async callback(
    @Request() request: KoaRequest,
    @Query() state: string,
  ) {
    let redirectUrl;
    try {
      const token = await callback(request, state);
      redirectUrl = `/signin/success/${token}`;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      redirectUrl = `/signin/error?message=${encodeURIComponent(message)}`;
    }
    this.setStatus(302);
    this.setHeader('Location', redirectUrl);
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
  @Security('api_key', [Scope.BASE])
  public async token(
    @Request() request: RequestWithUser,
    @Body() body: { token: string },
  ): Promise<string> {
    const { user } = request;
    const { token } = body;
    return refresh(user, token);
  }
}
