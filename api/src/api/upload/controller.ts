import {
  Controller,
  Tags,
  Route,
  Post,
  Body,
  Request,
  Security,
  Put
} from "@tsoa/runtime";



import start from "./start";

import { UploadStartBody, UploadStartResponse, RequestWithUser } from '../types';
import dbg from "#util/dbg";




@Route("upload")
@Tags("Upload")
@Security("jwt", ["upload"])
export class UploadController extends Controller {
  @Post("start")
  public async start(
    @Request() request: RequestWithUser,
    @Body() requestBody: UploadStartBody,
  ): Promise<UploadStartResponse> {
    const { user } = request;
    const response = await start(user, requestBody);
    return response;
  }
  @Put("chunk")
  public async chunk(
    @Request() request: RequestWithUser,
  ) {
    dbg(request);
  }
}
