import { Reporter, Iterator, StigLink, Callback } from './types';

function iterate<T>(
  list: T[],
  iterator: Iterator<T>,
  reporter: Reporter<T>,
  callback: Callback
) {
  let nextIndex = 0;

  function report(err: Error | null) {
    reporter(err, list[nextIndex]);
    nextIndex++;

    if (nextIndex === list.length) {
      callback(null);
    } else {
      iterator(null, list[nextIndex], report);
    }
  }

  iterator(null, list[0], report);
}

export default iterate;
