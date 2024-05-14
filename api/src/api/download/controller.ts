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
} from "@tsoa/runtime";

import { AESKey, RequestWithUser } from "../types";

import chunk from "./chunk";
import decrypt from "./decrypt";
import download from "./mnemonic";
import { Readable } from "stream";



@Route("download")
@Tags("Download")
@Security("api_key", ['dataset'])
@Security("jwt", ['dataset'])
export class DownloadController extends Controller {
  @Post("{mnemonic}/decrypt")
  @OperationId("decrypt")
  public decrypt(
    @Path() mnemonic: string,
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
    @Path() mnemonic: string,
    @Request() request: RequestWithUser,
  ): Promise<Readable> {
    const { user } = request;
    const { stream, fileName, size } = await download(user, mnemonic);
    this.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    this.setHeader("Content-Length", size.toString());
    return stream;
  }

  @Get("{mnemonic}/chunk/{hash}")
  @OperationId("chunk")
  public chunk(
    @Path() mnemonic: string,
    @Path() hash: string,
  ): Promise<Readable> {
    return chunk(mnemonic, hash);
  }
}
