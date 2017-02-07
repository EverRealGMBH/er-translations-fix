const {processTranslationFiles} = require('..');

processTranslationFiles({
  baseFileName: process.env.BASE_FILE || 'locale.en-US.json',
  filePath: process.env.FILE_PATH || './src/translations/locale/locale.*.json',
});
