import {
  Controller,
  Tags,
  Route,
  Get,
  OperationId,
} from "@tsoa/runtime";
import { DabihInfo } from "../types";
import info from "./info";


@Route("/")
@Tags("Util")
export class UtilController extends Controller {
  @Get("healthy")
  @OperationId("healthy")
  public healthy(): { healthy: boolean } {
    return {
      healthy: true,
    };
  }

  @Get("info")
  @OperationId("info")
  public async info(): Promise<DabihInfo> {
    return info();
  }
}
