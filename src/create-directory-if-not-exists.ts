import * as fs from 'fs';

function createDirectoryIfNotExists(directory: string) {
  if (!fs.existsSync(directory)) fs.mkdirSync(directory);
}

export default createDirectoryIfNotExists;
