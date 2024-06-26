
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

import file from "./file";

import { Mnemonic, RequestWithUser, FileResponse } from "../types";

@Route("fs")
@Tags("Filesystem")
@Security("api_key", ['dabih:api'])
@Security("jwt", ['dabih:api'])
export class FilesystemController extends Controller {
  @Get("file/{mnemonic}")
  @OperationId("fileInfo")
  public file(
    @Path() mnemonic: Mnemonic,
    @Request() request: RequestWithUser,
  ): Promise<FileResponse> {
    const { user } = request;
    return file(user, mnemonic);
  }

}
