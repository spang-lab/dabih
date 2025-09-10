import { Mnemonic } from './base';

export interface UploadStartBody {
  /**
   * The name of the file to upload
   */
  fileName: string;
  /**
   * The mnemonic of the directory to upload the file to
   */
  directory?: Mnemonic;
  /**
   * The original path of the file
   */
  filePath?: string;
  /**
   * The size of the file in bytes
   * @isLong
   * @minimum 0
   */
  size?: number;
  /**
   * A custom searchable tag for the file
   */
  tag?: string;
}

export interface ChunkAddBody {
  mnemonic: Mnemonic;
  hash: string;
  /**
   * @isLong
   * @minimum 0
   */
  start: number;
  /**
   * @isLong
   * @minimum 0
   */
  end: number;
  /**
   * @isLong
   * @minimum 0
   */
  size?: number;
}

export type ChunkUpload = ChunkAddBody & {
  data: Blob;
};

export interface ExistingFileBody {
  chunkHash: string;
  fileName: string;
  /**
   * @isLong
   * @minimum 0
   */
  size: number;
}
