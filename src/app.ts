import axios from 'axios';
import * as cheerio from 'cheerio';
import { map } from 'lodash';

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
      stigLinks.push(link);
    }
  }

  console.log('stigs: ' + stigLinks.length);
});
