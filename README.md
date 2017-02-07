# er-translations-fix

Scripts that helps you keep translation files in sync and ordered.

By default it will look for these types of files `./src/translations/locale/locale.*.json` and it will use the base file as `locale.en-US.json`.

- It will sync the files, meaning that every key that exists in the base file will be added to the other translation files
- It will order all files by key

```
npm install er-translations-fix -g

# run the script
translations-fix

# override parameters
BASE_FILE=locale.de-DE.json FILE_PATH=./sources/locale/locale.*.json translations-fix
```
