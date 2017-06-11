import * as fs from 'fs';
import * as request from 'request';
const unzip: any = require('unzip');

export type Callback = (err: Error | null) => any;
export type FileTest = (filename: string) => boolean;

export function downloadFile(url: string, out: string, callback: Callback) {
  getWebStream(url, callback).pipe(writeToFile(out, callback));
}

export function saveZipFiles(
  url: string,
  outdir: string,
  filter: FileTest,
  callback: Callback
) {
  if (!fs.existsSync(outdir)) fs.mkdirSync(outdir);

  const parser = unzip.Parse();

  return getWebStream(url, callback)
    .pipe(parser)
    .on('entry', (entry: any) => {
      const filename = entry.path.split('/').pop();

      if (filter(filename)) {
        entry.pipe(writeToFile(`${outdir}/${filename}`, callback));
      } else {
        entry.autodrain();
      }
    })
    .on('error', callback)
    .on('finish', () => callback(null));
}

export function getWebStream(url: string, callback: Callback) {
  return request
    .get(url)
    .on('error', callback)
    .on('response', ({ statusCode }) => {
      if (statusCode !== 200) {
        return callback(new Error(`Response status was ${statusCode}`));
      }
    });
}

export function writeToFile(path: string, callback: Callback): fs.WriteStream {
  return fs
    .createWriteStream(path)
    .on('error', callback)
    .on('finish', () => callback(null));
}
