const unzip: any = require('unzip2');
import { ERR, Callback } from './types';
import processStigStream from './process-stig-stream';
import getWebStream from './get-web-stream';
import createDirectoryIfNotExists from './create-directory-if-not-exists';

function saveStigsAsJson(
  url: string,
  outdir: string,
  callback: Callback<string[]>
) {
  const parser = unzip.Parse();
  let outFiles: string[] = [];

  createDirectoryIfNotExists(outdir);
  return getWebStream(url, e => callback(e, []))
    .pipe(parser)
    .on('entry', (entry: any) => {
      const filename = entry.path.split('/').pop();

      if (filename.indexOf('xccdf.xml') > -1) {
        const jsonFilename = filename.replace('xccdf.xml', '.json');
        processStigStream(
          entry,
          `${outdir}/${jsonFilename}`,
          (err: ERR, file: string) => {
            outFiles.push(file);
          }
        );
      } else {
        entry.autodrain();
      }
    })
    .on('error', console.error)
    .on('finish', (err: ERR) => callback(err, outFiles));
}

export default saveStigsAsJson;
