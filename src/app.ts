import * as fs from 'fs';
import * as cheerio from 'cheerio';
import * as _ from 'lodash';
import axios from 'axios';
import { Callback, saveZipFiles } from './download-file';

type StigLink = {
  name: string;
  url: string;
};

axios.get('http://iase.disa.mil/stigs/Pages/a-z.aspx').then(res => {
  const html: string = res.data;
  const $ = cheerio.load(html);
  const links = $('a');
  const stigLinks: StigLink[] = [];

  for (let i = 0; i < links.length; i++) {
    let el = $(links[i]);
    let link = {
      name: el.text(),
      url: el.attr('href')
    };

    if (link.url && link.url.indexOf('.zip') > -1) {
      if (link.url.indexOf('/') === 0) {
        link.url = 'http://iase.disa.mil' + link.url;
      }

      stigLinks.push(link);
    }
  }

  const downloadDirectory = __dirname + '/files';
  const finished = (err: Error | null, results: Partitioned<StigLink>) => {
    console.log('finished');
  };

  const report = (err: Error | null, link: StigLink) => {
    if (err) {
      console.log(`Failed to save stig: ${link.name}`);
      console.error(err);
    } else if (link) {
      console.log(`Saved stig: ${link.name}`);
    }
  };

  // TODO: parse xccdf file into JSON
  // TODO: save JSON
  const downloadStig = (
    err: Error,
    link: StigLink,
    callback: (err: Error | null) => void
  ) => {
    var path = downloadDirectory + '/' + link.name + '.zip';
    saveZipFiles(
      link.url,
      downloadDirectory,
      x => x.indexOf('xccdf.xml') > -1,
      callback
    );
  };
  iterate(stigLinks, downloadStig, report, finished);
});

type Partitioned<T> = [T[], T[]];
type VoidCallback = (err: Error | null) => void;
type Iterator<T> = (err: Error | null, x: T, cb: VoidCallback) => void;
type Reporter<T> = (err: Error | null, x: T) => void;
type DoneCallback<T> = (err: Error | null, results: Partitioned<T>) => void;

function iterate<T>(
  list: T[],
  iterator: Iterator<T>,
  reporter: Reporter<T>,
  callback: DoneCallback<T>
) {
  let nextIndex = 0;
  let [successes, failures]: Partitioned<T> = [[], []];

  function report(err: Error | null) {
    const prevItem = list[nextIndex];

    if (err) {
      failures.push(prevItem);
    } else {
      successes.push(prevItem);
    }

    reporter(err, prevItem);

    nextIndex++;

    if (nextIndex === list.length) {
      callback(null, [successes, failures]);
    } else {
      iterator(null, list[nextIndex], report);
    }
  }

  iterator(null, list[0], report);
}
