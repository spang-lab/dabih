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
   * @isInt
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
  start: number;
  end: number;
  size?: number;
}
