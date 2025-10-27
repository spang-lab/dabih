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
  NoSecurity,
} from '@tsoa/runtime';

import {
  type RequestWithUser,
  type UserAddBody,
  type UserResponse,
  type KeyAddBody,
  type KeyEnableBody,
  type KeyRemoveBody,
  type PublicKey,
  type UserSub,
  Scope,
} from '../types';
import get from './get';
import add from './add';
import list from './list';
import remove from './remove';
import addKey from './addKey';
import enableKey from './enableKey';
import removeKey from './removeKey';
import findKey from './findKey';
import setAdmin from './setAdmin';

@Route('user')
@Tags('User')
@Security('api_key', [Scope.API])
export class UserController extends Controller {
  @Post('add')
  @OperationId('addUser')
  @SuccessResponse('201', 'Created')
  public async add(
    @Request() request: RequestWithUser,
    @Body() requestBody: UserAddBody,
  ): Promise<UserResponse> {
    const { user } = request;
    const response = await add(user, requestBody);
    this.setStatus(201);
    return response;
  }
  @Get('me')
  @Security('api_key', ['dabih:base'])
  @OperationId('me')
  public async me(
    @Request() request: RequestWithUser,
  ): Promise<UserResponse | null> {
    const { user } = request;
    return get(user.sub);
  }

  @Post('find')
  @OperationId('findUser')
  public async get(@Body() body: UserSub): Promise<UserResponse | null> {
    const { sub } = body;
    return get(sub);
  }

  @Get('findKey/{hash}')
  @OperationId('findKey')
  @NoSecurity()
  public async findKey(hash: string): Promise<UserResponse | null> {
    return findKey(hash);
  }

  @Get('list')
  @OperationId('listUsers')
  public async list(): Promise<UserResponse[]> {
    return list();
  }

  @Post('admin')
  @OperationId('setAdmin')
  @Security('api_key', [Scope.ADMIN])
  public async setAdmin(
    @Body() body: { sub: string; admin: boolean },
  ): Promise<UserResponse | null> {
    const { sub, admin } = body;
    return setAdmin(sub, admin);
  }

  @Post('remove')
  @OperationId('removeUser')
  public async remove(
    @Request() request: RequestWithUser,
    @Body() body: UserSub,
  ) {
    const { sub } = body;
    const { user } = request;
    await remove(user, sub);
  }

  @Post('key/add')
  @OperationId('addKey')
  @Security('api_key', ['dabih:base'])
  @SuccessResponse('201', 'Created')
  public async addKey(
    @Request() request: RequestWithUser,
    @Body() body: KeyAddBody,
  ): Promise<PublicKey> {
    const { user } = request;
    const key = await addKey(user, body);
    this.setStatus(201);
    return key;
  }

  @Post('key/enable')
  @OperationId('enableKey')
  public async enableKey(
    @Request() request: RequestWithUser,
    @Body() body: KeyEnableBody,
  ): Promise<PublicKey> {
    const { user } = request;
    return enableKey(user, body);
  }
  @Post('key/remove')
  @OperationId('removeKey')
  public async removeKey(
    @Request() request: RequestWithUser,
    @Body() body: KeyRemoveBody,
  ) {
    const { user } = request;
    await removeKey(user, body);
  }
}
