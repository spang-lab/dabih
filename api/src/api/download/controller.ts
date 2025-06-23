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
  Produces,
} from '@tsoa/runtime';

import { Mnemonic, AESKey, RequestWithUser } from '../types';

import chunk from './chunk';
import decrypt from './decrypt';
import download from './mnemonic';
import { Readable } from 'stream';

import { TokenResponse } from '../types';

@Route('download')
@Tags('Download')
export class DownloadController extends Controller {
  @Post('{mnemonic}/decrypt')
  @Security('api_key', ['dabih:api'])
  @OperationId('decryptDataset')
  public decrypt(
    @Path() mnemonic: Mnemonic,
    @Request() request: RequestWithUser,
    @Body() body: { key: AESKey },
  ): Promise<TokenResponse> {
    const { user } = request;
    const { key } = body;
    return decrypt(user, mnemonic, key);
  }
  @Get('/')
  @Security('api_key')
  @OperationId('downloadDataset')
  public async download(
    @Request() request: RequestWithUser,
  ): Promise<Readable> {
    const { user } = request;
    const { stream, fileName, size } = await download(user);
    this.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    this.setHeader('Content-Length', size.toString());
    return stream;
  }

  @Get('{uid}/chunk/{hash}')
  @Security('api_key', ['dabih:api'])
  @OperationId('downloadChunk')
  @Produces('application/octet-stream')
  public chunk(@Path() uid: string, @Path() hash: string): Promise<Readable> {
    this.setHeader('Content-Type', 'application/octet-stream');
    return chunk(uid, hash);
  }
}
