import * as request from 'request';
import { Callback } from './types';

function getWebStream(url: string, callback: Callback) {
  return request
    .get(url)
    .on('error', console.error)
    .on('response', ({ statusCode }) => {
      if (statusCode !== 200) {
        return callback(new Error(`Response status was ${statusCode}`));
      }
    })
    .on('finish', callback);
}

export default getWebStream;
