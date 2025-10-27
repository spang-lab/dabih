import {
  FileData,
  IntegrityCheckResult,
  RequestWithUser,
  Scope,
} from '../types';
import {
  Controller,
  Tags,
  Route,
  Post,
  Get,
  Request,
  Security,
  OperationId,
  Path,
} from '@tsoa/runtime';
import orphaned from './orphaned';
import remove from './remove';
import checkIntegrity from './checkIntegrity';

@Route('filedata')
@Tags('File Data')
@Security('api_key', [Scope.ADMIN])
export class FileDataController extends Controller {
  /**
   * Find all file data entries that are not referenced by any inode
   */
  @Get('orphaned')
  @OperationId('listOrphaned')
  public async listOrphaned(
    @Request() request: RequestWithUser,
  ): Promise<FileData[]> {
    const { user } = request;
    return orphaned(user);
  }

  @Post('{uid}/remove')
  @OperationId('removeFileData')
  public async removeFileData(
    @Request() request: RequestWithUser,
    @Path() uid: string,
  ): Promise<void> {
    const { user } = request;
    return remove(user, uid);
  }

  @Get('checkIntegrity')
  @OperationId('checkIntegrity')
  public async checkIntegrity(
    @Request() request: RequestWithUser,
  ): Promise<IntegrityCheckResult> {
    const { user } = request;
    return checkIntegrity(user);
  }
}
