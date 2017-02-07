const sync = require('glob').sync;
const fs = require('fs');

module.exports = {
  processTranslationFiles,
  getSortedObject,
  fillMissingKeys,
};

function processTranslationFiles({baseFileName = '', filePath = ''}) {
  const files = sync(filePath);
  const readFile = filename => JSON.parse(fs.readFileSync(filename, 'utf8'));
  const fileMap = files.map(filename => [filename, readFile(filename)]);
  const baseFile = readFile(files.find(filename => filename.indexOf(baseFileName) > -1));
  const processJson = content => getSortedObject(fillMissingKeys(baseFile, content));
  const getFinalStringContent = content => JSON.stringify(processJson(content), null, 2) + '\n';

  fileMap.forEach(([filename, content]) => fs.writeFileSync(filename, getFinalStringContent(content), 'utf8'));
}

function getSortedObject(object) {
  const sortedObject = {};

  const keys = Object.keys(object);
  keys.sort();

  for (let i = 0, size = keys.length; i < size; i += 1) {
    const key = keys[i];
    const value = object[key];
    sortedObject[key] = value;
  }

  return sortedObject;
}

function fillMissingKeys(baseObject, object) {
  Object.keys(baseObject).forEach(baseKey => {
    if (!object[baseKey]) {
      object[baseKey] = '';
    }
  });
  return object;
}
