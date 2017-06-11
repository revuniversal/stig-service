import * as fs from 'fs';
import { Callback } from './types';

function writeToFile(path: string, callback: Callback): fs.WriteStream {
  return fs
    .createWriteStream(path)
    .on('error', callback)
    .on('finish', () => callback(null));
}

export default writeToFile;
