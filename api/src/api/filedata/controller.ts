import { FileData, IntegrityCheckResult, RequestWithUser } from '../types';
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
export class FileDataController extends Controller {
  /**
   * Find all file data entries that are not referenced by any inode
   */
  @Get('orphaned')
  @Security('api_key', ['dabih:admin'])
  @OperationId('listOrphaned')
  public async listOrphaned(
    @Request() request: RequestWithUser,
  ): Promise<FileData[]> {
    const { user } = request;
    return orphaned(user);
  }

  @Post('{uid}/remove')
  @Security('api_key', ['dabih:admin'])
  @OperationId('removeFileData')
  public async removeFileData(
    @Request() request: RequestWithUser,
    @Path() uid: string,
  ): Promise<void> {
    const { user } = request;
    return remove(user, uid);
  }

  @Get('checkIntegrity')
  @Security('api_key', ['dabih:admin'])
  @OperationId('checkIntegrity')
  public async checkIntegrity(
    @Request() request: RequestWithUser,
  ): Promise<IntegrityCheckResult> {
    const { user } = request;
    return checkIntegrity(user);
  }
}
