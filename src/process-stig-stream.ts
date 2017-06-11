import * as xml2json from 'xml2json';
import writeToFile from './write-to-file';
import { Readable } from 'stream';
import { ERR, Callback } from './types';
const streamToString: any = require('stream-to-string');

function processStigStream(
  entry: Readable,
  path: string,
  callback: Callback<string>
) {
  streamToString(entry, (err: ERR, val: string) => {
    if (err) {
      callback(err, path);
    } else {
      const tVal = xml2json.toJson(val);
      let tStream = new Readable();
      tStream.pipe(writeToFile(path, (e: ERR) => callback(e, path)));
      tStream._read = () => {};
      tStream.push(tVal);
      tStream.push(null);
    }
  });
}

export default processStigStream;
