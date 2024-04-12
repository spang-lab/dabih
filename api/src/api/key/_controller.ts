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
  OperationId,
} from "@tsoa/runtime";


import { RequestWithUser, PublicKey, KeyAddBody } from "../types";
import add from "./add";
import list from "./list";
import remove from "./remove";


@Route("key")
@Tags("Public Key")
@Security("api_key", ["key"])
@Security("jwt", ["key"])
export class KeyController extends Controller {
  @Post("add")
  @OperationId("addKey")
  public async add(
    @Request() request: RequestWithUser,
    @Body() requestBody: KeyAddBody,
  ): Promise<PublicKey> {
    const { user } = request;
    const key = await add(user, requestBody);
    return key;
  }



  @Get("list")
  @OperationId("listKeys")
  public async list(
    @Request() request: RequestWithUser,
  ): Promise<PublicKey[]> {
    const { user } = request;
    return list(user);
  }
  @Post("{keyId}/remove")
  @OperationId("removeKey")
  public async remove(
    @Path() keyId: number,
    @Request() request: RequestWithUser,
  ) {
    const { user } = request;
    await remove(user, keyId);

  }

}
