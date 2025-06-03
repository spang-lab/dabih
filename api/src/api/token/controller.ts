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

import { RequestWithUser, TokenAddBody, TokenResponse } from '../types';

import add from './add';
import list from './list';
import remove from './remove';

@Route('token')
@Tags('Token')
export class TokenController extends Controller {
  @Security('jwt', ['dabih:api'])
  @Security('api_key', ['dabih:api'])
  @Post('add')
  @OperationId('addToken')
  public async add(
    @Request() request: RequestWithUser,
    @Body() requestBody: TokenAddBody,
  ): Promise<TokenResponse> {
    const { user } = request;
    return add(user, requestBody);
  }
  @Security('jwt', ['dabih:api'])
  @Security('api_key', ['dabih:api'])
  @Get('list')
  @OperationId('listTokens')
  public async list(
    @Request() request: RequestWithUser,
  ): Promise<TokenResponse[]> {
    return list(request.user);
  }
  @Security('jwt', ['dabih:api'])
  @Security('api_key', ['dabih:api'])
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
