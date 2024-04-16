import {
  Controller,
  Tags,
  Route,
  Post,
  Body,
  Request,
  Security,
  SuccessResponse,
  Put,
  Path,
  Header,
} from "@tsoa/runtime";



import start from "./start";
import cancel from "./cancel";
import chunk from "./chunk";

import { UploadStartBody, UploadStartResponse, RequestWithUser, Chunk } from '../types';




@Route("upload")
@Tags("Upload")
@Security("jwt", ["upload"])
export class UploadController extends Controller {
  @Post("start")
  @SuccessResponse("201", "Created")
  public async start(
    @Request() request: RequestWithUser,
    @Body() requestBody: UploadStartBody,
  ): Promise<UploadStartResponse> {
    const { user } = request;
    const response = await start(user, requestBody);
    this.setStatus(201);
    return response;
  }

  @Post("{mnemonic}/cancel")
  public async cancel(
    @Request() request: RequestWithUser,
    @Path() mnemonic: string,
  ) {
    const { user } = request;
    await cancel(user, mnemonic);
  }

  @Put("{mnemonic}/chunk")
  @SuccessResponse("201", "Created")
  public async chunk(
    @Path() mnemonic: string,
    @Request() request: RequestWithUser,
    @Header("content-range") contentRange: string,
    @Header("digest") digest: string,
  ): Promise<Chunk> {
    console.log(digest);
    console.log(contentRange);
    const result = await chunk(mnemonic, request);
    this.setStatus(201);
    return result;
  }
}
