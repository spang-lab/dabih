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
} from '@tsoa/runtime';

import file from './file';
import listParents from './listParents';
import listFiles from './listFiles';
import remove from './remove';
import addMembers from './addMembers';
import addDirectory from './addDirectory';
import move from './move';
import duplicate from './duplicate';
import tree from './tree';
import list from './list';
import searchStart from './searchStart';
import searchResults from './searchResults';
import searchCancel from './searchCancel';

import {
  AddDirectoryBody,
  Directory,
  FileDownload,
  FileKeys,
  MemberAddBody,
  Mnemonic,
  MoveInodeBody,
  RequestWithUser,
  Inode,
  InodeTree,
  ListResponse,
  InodeMembers,
  InodeSearchBody,
  InodeSearchResults,
} from '../types';

@Route('fs')
@Tags('Filesystem')
@Security('api_key', ['dabih:api'])
export class FilesystemController extends Controller {
  /**
   * Get all the file information required to download a single file
   */
  @Get('{mnemonic}/file')
  @OperationId('fileInfo')
  public file(
    @Path() mnemonic: Mnemonic,
    @Request() request: RequestWithUser,
  ): Promise<FileDownload> {
    const { user } = request;
    return file(user, mnemonic);
  }
  /**
   * Recursively list all files in a directory
   */
  @Get('{mnemonic}/file/list')
  @OperationId('listFiles')
  public async listFiles(
    @Path() mnemonic: Mnemonic,
    @Request() request: RequestWithUser,
  ): Promise<FileKeys[]> {
    const { user } = request;
    return listFiles(user, mnemonic);
  }

  @Get('{mnemonic}/parent/list')
  @OperationId('listParents')
  public async listParents(
    @Path() mnemonic: Mnemonic,
    @Request() request: RequestWithUser,
  ): Promise<InodeMembers[]> {
    const { user } = request;
    return listParents(user, mnemonic);
  }
  @Post('{mnemonic}/member/add')
  @OperationId('addMembers')
  public async addMembers(
    @Path() mnemonic: Mnemonic,
    @Body() body: MemberAddBody,
    @Request() request: RequestWithUser,
  ): Promise<void> {
    const { user } = request;
    return addMembers(user, mnemonic, body);
  }
  @Post('{mnemonic}/duplicate')
  @OperationId('duplicateInode')
  public async duplicate(
    @Path() mnemonic: Mnemonic,
    @Request() request: RequestWithUser,
  ): Promise<Inode> {
    const { user } = request;
    return duplicate(user, mnemonic);
  }
  @Post('{mnemonic}/remove')
  @OperationId('removeInode')
  public async remove(
    @Path() mnemonic: Mnemonic,
    @Request() request: RequestWithUser,
  ): Promise<void> {
    const { user } = request;
    return remove(user, mnemonic);
  }

  @Get('{mnemonic}/tree')
  @OperationId('inodeTree')
  public async tree(
    @Path() mnemonic: Mnemonic,
    @Request() request: RequestWithUser,
  ): Promise<InodeTree> {
    const { user } = request;
    return tree(user, mnemonic);
  }

  @Post('move')
  @OperationId('moveInode')
  public async move(
    @Body() body: MoveInodeBody,
    @Request() request: RequestWithUser,
  ): Promise<void> {
    const { user } = request;
    return move(user, body);
  }

  @Get('list')
  @OperationId('listHome')
  public async listHome(
    @Request() request: RequestWithUser,
  ): Promise<ListResponse> {
    const { user } = request;
    return list(user);
  }

  @Get('{mnemonic}/list')
  @OperationId('listInodes')
  public async listInodes(
    @Request() request: RequestWithUser,
    @Path() mnemonic?: Mnemonic,
  ): Promise<ListResponse> {
    const { user } = request;
    return list(user, mnemonic);
  }

  @Post('directory/add')
  @OperationId('addDirectory')
  public async addDirectory(
    @Body() body: AddDirectoryBody,
    @Request() request: RequestWithUser,
  ): Promise<Directory> {
    const { user } = request;
    return addDirectory(user, body);
  }

  @Post('search')
  @OperationId('searchFs')
  public async search(
    @Body() body: InodeSearchBody,
    @Request() request: RequestWithUser,
  ): Promise<{ jobId: string }> {
    const { user } = request;
    return searchStart(user, body);
  }

  @Post('search/{jobId}')
  @OperationId('searchResults')
  public async searchResults(
    @Path() jobId: string,
    @Request() request: RequestWithUser,
  ): Promise<InodeSearchResults> {
    const { user } = request;
    return searchResults(user, jobId);
  }
  @Post('search/{jobId}/cancel')
  @OperationId('searchCancel')
  public async searchCancel(
    @Path() jobId: string,
    @Request() request: RequestWithUser,
  ): Promise<void> {
    const { user } = request;
    return searchCancel(user, jobId);
  }
}
