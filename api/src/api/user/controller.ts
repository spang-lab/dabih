import {
  Controller,
  Body,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
} from "@tsoa/runtime";
import { user, User, UserCreationParams } from "./service";

@Route("user")
export class UsersController extends Controller {
  @Get("{userId}")
  public async getUser(
    @Path() userId: number,
    @Query() name?: string
  ): Promise<User> {
    return user.get(userId, name);
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Post()
  public async createUser(
    @Body() requestBody: UserCreationParams
  ): Promise<void> {
    this.setStatus(201); // set return status 201
    user.create(requestBody);
    return;
  }
}
