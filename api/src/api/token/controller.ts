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

import {
  Scope,
  type RequestWithUser,
  type TokenAddBody,
  type TokenResponse,
} from '../types';

import add from './add';
import list from './list';
import remove from './remove';

@Route('token')
@Tags('Token')
@Security('api_key', [Scope.API])
export class TokenController extends Controller {
  @Post('add')
  @OperationId('addToken')
  public async add(
    @Request() request: RequestWithUser,
    @Body() requestBody: TokenAddBody,
  ): Promise<TokenResponse> {
    const { user } = request;
    return add(user, requestBody);
  }
  @Get('list')
  @OperationId('listTokens')
  public async list(
    @Request() request: RequestWithUser,
  ): Promise<TokenResponse[]> {
    return list(request.user);
  }
  @Post('remove')
  @OperationId('removeToken')
  public async remove(
    @Request() request: RequestWithUser,
    @Body() body: { tokenId: string },
  ) {
    const { user } = request;
    const { tokenId } = body;
    const id = parseInt(tokenId, 10);
    await remove(user, id);
  }
}
