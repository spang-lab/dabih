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
  Path,
  Produces
} from "@tsoa/runtime";

import { Mnemonic, AESKey, RequestWithUser } from "../types";

import chunk from "./chunk";
import decrypt from "./decrypt";
import download from "./mnemonic";
import { Readable } from "stream";



@Route("download")
@Tags("Download")
@Security("api_key", ['dabih:api'])
@Security("jwt", ['dabi:api'])
export class DownloadController extends Controller {
  @Post("{mnemonic}/decrypt")
  @OperationId("decryptDataset")
  public decrypt(
    @Path() mnemonic: Mnemonic,
    @Request() request: RequestWithUser,
    @Body() body: { key: AESKey },
  ): Promise<void> {
    const { user } = request;
    const { key } = body;
    return decrypt(user, mnemonic, key);
  }
  @Get("{mnemonic}")
  @OperationId("downloadDataset")
  public async download(
    @Path() mnemonic: Mnemonic,
    @Request() request: RequestWithUser,
  ): Promise<Readable> {
    const { user } = request;
    const { stream, fileName, size } = await download(user, mnemonic);
    this.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    this.setHeader("Content-Length", size.toString());
    return stream;
  }

  @Get("{mnemonic}/chunk/{hash}")
  @OperationId("downloadChunk")
  @Produces('application/octet-stream')
  public chunk(
    @Path() mnemonic: Mnemonic,
    @Path() hash: string,
  ): Promise<Readable> {
    this.setHeader("Content-Type", "application/octet-stream");
    return chunk(mnemonic, hash);
  }
}
