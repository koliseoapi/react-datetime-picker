#!/bin/bash
# Updates the example page at ccoloma.github.io
set -e

NODE_ENV=prod node node_modules/webpack/bin/webpack.js --progress --colors --config webpack.config.js --display-error-details --display-modules 
FOLDER=.gh-pages

if [ ! -d ${FOLDER} ]; then
  git clone -b gh-pages git@github.com:ccoloma/react-moment-datetime ${FOLDER}
  cd ${FOLDER}
else
  cd ${FOLDER}
  git pull
fi

cp ../build/app.js ../test/css/datetime.css .

git add .
git commit -m "${1:-Merge master}"
git push