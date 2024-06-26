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
  Get,
  OperationId,
  Path,
  Header,
} from "@tsoa/runtime";



import start from "./start";
import cancel from "./cancel";
import { default as chunk, RequestWithHeaders } from "./chunk";
import finish from "./finish";
import unfinished from "./unfinished";

import {
  Mnemonic,
  UploadStartBody,
  File,
  RequestWithUser,
  Chunk,
} from '../types';
import { parseDigest, parseContentRange } from "./util";




@Route("upload")
@Tags("Upload")
@Security("jwt", ["dabih:upload"])
@Security("api_key", ['dabih:upload'])
export class UploadController extends Controller {
  @Post("start")
  @OperationId("startUpload")
  @SuccessResponse("201", "Created")
  public async start(
    @Request() request: RequestWithUser,
    @Body() requestBody: UploadStartBody,
  ): Promise<File> {
    const { user } = request;
    const response = await start(user, requestBody);
    this.setStatus(201);
    return response;
  }

  @Post("{mnemonic}/cancel")
  @OperationId("cancelUpload")
  public async cancel(
    @Request() request: RequestWithUser,
    @Path() mnemonic: Mnemonic,
  ) {
    const { user } = request;
    await cancel(user, mnemonic);
  }

  @Put("{mnemonic}/chunk")
  @OperationId("chunkUpload")
  @SuccessResponse("201", "Created")
  public async chunk(
    @Path() mnemonic: Mnemonic,
    @Request() request: RequestWithHeaders,
    /**
      * The range of bytes in the chunk
      * It should be in the format `bytes {start}-{end}/{size}`
      */
    @Header("content-range") contentRange: string,
    /**
      * The SHA-256 hash of the chunk data encoded in base64url
      * It should be in the format `sha-256={hash}`
      */
    @Header("digest") digest: string,
  ): Promise<Chunk> {
    const result = await chunk({
      mnemonic,
      ...parseContentRange(contentRange),
      hash: parseDigest(digest),
    }, request);
    this.setStatus(201);
    return result;
  }

  @Post("{mnemonic}/finish")
  @OperationId("finishUpload")
  public async finish(
    @Request() request: RequestWithUser,
    @Path() mnemonic: Mnemonic,
  ): Promise<File> {
    const { user } = request;
    return finish(user, mnemonic);
  }

  @Get("unfinished")
  @OperationId("unfinishedUploads")
  public async unfinished(
    @Request() request: RequestWithUser,
  ): Promise<File[]> {
    const { user } = request;
    return unfinished(user);
  }

}
