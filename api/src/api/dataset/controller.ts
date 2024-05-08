
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


import { Dataset, MemberAddBody, RequestWithUser, SearchRequestBody, SearchResponseBody } from "../types";

import get from "./get";
import remove from "./remove";
import restore from "./restore";
import rename from "./rename";
import destroy from "./destroy";
import search from "./search";
import addMember from "./addMember";

@Route("dataset")
@Tags("Dataset")
@Security("api_key", ['dataset'])
@Security("jwt", ['dataset'])
export class DatasetController extends Controller {
  @Get("{mnemonic}")
  @OperationId("datasetInfo")
  public get(
    @Path() mnemonic: string,
    @Request() request: RequestWithUser,
  ): Promise<Dataset> {
    const { user } = request;
    return get(user, mnemonic);
  }

  @Post("search")
  @OperationId("searchDatasets")
  public search(
    @Body() body: SearchRequestBody,
    @Request() request: RequestWithUser,
  ): Promise<SearchResponseBody> {
    const { user } = request;
    return search(user, body);
  }

  @Post("{mnemonic}/addMember")
  @OperationId("addMember")
  public addMember(
    @Path() mnemonic: string,
    @Body() body: MemberAddBody,
    @Request() request: RequestWithUser,
  ): Promise<void> {
    const { user } = request;
    return addMember(user, mnemonic, body);
  }

  @Post("{mnemonic}/rename")
  @OperationId("renameDataset")
  public rename(
    @Path() mnemonic: string,
    @Body() body: { name: string },
    @Request() request: RequestWithUser,
  ): Promise<void> {
    const { user } = request;
    return rename(user, mnemonic, body.name);
  }

  @Post("{mnemonic}/remove")
  @OperationId("removeDataset")
  public remove(
    @Path() mnemonic: string,
    @Request() request: RequestWithUser,
  ): Promise<void> {
    const { user } = request;
    return remove(user, mnemonic);
  }

  @Post("{mnemonic}/restore")
  @OperationId("restoreDataset")
  public restore(
    @Path() mnemonic: string,
    @Request() request: RequestWithUser,
  ): Promise<void> {
    const { user } = request;
    return restore(user, mnemonic);
  }

  @Post("{mnemonic}/destroy")
  @OperationId("destroyDataset")
  public destroy(
    @Path() mnemonic: string,
    @Body() body: { force: boolean },
    @Request() request: RequestWithUser,
  ): Promise<void> {
    const { user } = request;
    return destroy(user, mnemonic, body.force);
  }

}
