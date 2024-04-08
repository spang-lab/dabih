
import {
  Controller,
  Tags,
  Route,
  Post,
  Get,
  Path,
  Body,
  Request,
  Security,
} from "@tsoa/runtime";


import { RequestWithUser, TokenAddBody, TokenResponse } from "../types";

import add from './add';
import list from './list';
import remove from './remove';

@Route("token")
@Tags("Token")
export class TokenController extends Controller {
  @Security("api_key", [])
  @Security("jwt", [])
  @Get("info")
  public info(
    @Request() request: RequestWithUser,
  ) {
    const { user } = request;
    return user;
  }

  @Security("jwt", ["token"])
  @Security("api_key", ["token"])
  @Post("add")
  public async add(
    @Request() request: RequestWithUser,
    @Body() requestBody: TokenAddBody,
  ): Promise<TokenResponse> {
    const { user } = request;
    return add(user, requestBody);
  }
  @Security("jwt", ["token"])
  @Security("api_key", ["token"])
  @Get("list")
  public async list(
    @Request() request: RequestWithUser,
  ): Promise<TokenResponse[]> {
    return list(request.user);
  }
  @Security("jwt", ["token"])
  @Security("api_key", ["token"])
  @Post("remove/{tokenId}")
  public async remove(
    @Path() tokenId: number,
    @Request() request: RequestWithUser,
  ) {
    const { user } = request;
    await remove(user, tokenId);

  }

}
