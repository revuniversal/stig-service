import * as fs from 'fs';
import * as cheerio from 'cheerio';
import { ERR, Callback, StigLink } from './types';
import axios from 'axios';
import saveStigsAsJson from './save-stigs-as-json';
import iterate from './iterate';

const outdir = __dirname + '/files';

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

  iterate(stigLinks, downloadStig, report, finished);
});

function report(err: ERR, link: StigLink) {
  if (err) {
    if (link) {
      console.log(`Failed to save stig: ${link.name}`);
    }
    console.error(err);
  } else if (link) {
    console.log(`Saved stig: ${link.name}`);
  }
}

function downloadStig(err: ERR, link: StigLink, callback: Callback) {
  saveStigsAsJson(link.url, outdir, callback);
}

function finished() {
  console.log('finished');
}
