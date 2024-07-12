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
import listMembers from './listMembers';
import listFiles from './listFiles';
import removeFile from './removeFile';
import addMembers from './addMembers';
import addDirectory from './addDirectory';
import move from './move';
import duplicate from './duplicate';
import tree from './tree';

import {
  AddDirectoryBody,
  Directory,
  FileDownload,
  FileKeys,
  Member,
  MemberAddBody,
  Mnemonic,
  MoveInodeBody,
  RequestWithUser,
  Inode,
  InodeTree,
} from '../types';

@Route('fs')
@Tags('Filesystem')
@Security('api_key', ['dabih:api'])
@Security('jwt', ['dabih:api'])
export class FilesystemController extends Controller {
  @Get('{mnemonic}/file')
  @OperationId('fileInfo')
  public file(
    @Path() mnemonic: Mnemonic,
    @Request() request: RequestWithUser,
  ): Promise<FileDownload> {
    const { user } = request;
    return file(user, mnemonic);
  }
  @Get('{mnemonic}/file/list')
  @OperationId('listFiles')
  public async listFiles(
    @Path() mnemonic: Mnemonic,
    @Request() request: RequestWithUser,
  ): Promise<FileKeys[]> {
    const { user } = request;
    return listFiles(user, mnemonic);
  }
  @Post('{mnemonic}/file/remove')
  @OperationId('removeFile')
  public async removeFile(
    @Path() mnemonic: Mnemonic,
    @Request() request: RequestWithUser,
  ): Promise<void> {
    const { user } = request;
    return removeFile(user, mnemonic);
  }

  @Get('{mnemonic}/member/list')
  @OperationId('listMembers')
  public async listMembers(
    @Path() mnemonic: Mnemonic,
    @Request() request: RequestWithUser,
  ): Promise<Member[]> {
    const { user } = request;
    return listMembers(user, mnemonic);
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

  @Post('directory/add')
  @OperationId('addDirectory')
  public async addDirectory(
    @Body() body: AddDirectoryBody,
    @Request() request: RequestWithUser,
  ): Promise<Directory> {
    const { user } = request;
    return addDirectory(user, body);
  }
}
