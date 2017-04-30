const sync = require('glob').sync;
const fs = require('fs');
const debug = require('debug')('er-translations-fixer');

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
  const getFinalStringContent = content => JSON.stringify(mergeKeys(baseFile, content), null, 2) + '\n';

  fileMap.forEach(([filename, content]) => fs.writeFileSync(filename, getFinalStringContent(content), 'utf8'));
}

function mergeKeys(baseObject, object) {
  let newObject = object;
  newObject = fillMissingKeys(baseObject, newObject);
  newObject = deleteExtraKeys(baseObject, newObject);
  newObject = getSortedObject(newObject);
  return newObject;
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
      debug(`ADDED KEY: ${baseKey}`);
    }
  });
  return object;
}

function deleteExtraKeys(baseObject, object) {
  const baseKeys = Object.keys(baseObject) || [];
  const objectKeys = Object.keys(object) || [];

  objectKeys.forEach(prop => {
    if (!baseKeys.find(k => k === prop)) {
      delete object[prop];
      debug(`DELETED KEY: ${prop}`);
    }
  });

  return object;
}
