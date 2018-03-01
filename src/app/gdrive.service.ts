import {Injectable} from '@angular/core';
import {getRandomString} from 'selenium-webdriver/safari';

@Injectable()
export class GdriveService {

  constructor() {
  }

  const;
  private gdriveConfig = {
    'RestURL': 'https://www.googleapis.com/drive/v3/files/',
    'FileURL': 'https://docs.google.com/uc?id=',
    'Data': [
      {
        'key': 'AIzaSyDcPAYckM8eq3NkntNijLzq_pI2p-n_-SA',
        'folder': '0B-HW4voEJgOgamFpanhnVlVwRzA'
      },
      {
        'key': 'AIzaSyCaC82KAUysQ2FBgAo_Ks1kEg43SKv-3uE',
        'folder': '0B3v6z-kU8mPpYVVoczI2NEhfMnM'
      }
    ]
  };
  let;
  files = [];

  private getRandomChar() {
    return String.fromCharCode(Math.random() * 26 + 65);
  }

  async getFileListPromised(apiKey, folderId, jsonSTR) {
    try {
      let nextPageToken;
      let previousToken;
      const loggingChar = getRandomString();
      console.log('loading file list-' + loggingChar + '\'');
      for (let iteration = 0; nextPageToken === undefined; iteration++) {
        const requestUrl = this.createQuery(nextPageToken, apiKey, folderId);
        const data = await this.httpGetPromised(requestUrl);
        const document = JSON.parse(data);
        for (const file of document.files) {
          if (file === undefined) {
            continue;
          }
          file.APIKey = apiKey;
          this.files.push(file);
        }
        previousToken = nextPageToken;
        nextPageToken = document.nextPageToken;
      }
    } catch (e) {

    }
  }


  createQuery(pageTokenValue, apiKey, folderId) {
    if (pageTokenValue === undefined) {
      pageTokenValue = '';
    }
    const query = {
      baseURL: 'https://www.googleapis.com/drive/v3/files?',
      parameters: {
        pageSize: 1000,
        q: '%27' + folderId + '%27+in+parents',
        key: apiKey,
        pageToken: pageTokenValue,
      }

    };
    let queryStr = '';
    for (const z in query.parameters) {
      if (typeof(z) === 'function') {
        continue;
      }
      queryStr += '&' + z + '=' + query.parameters[z];
    }
    queryStr = this.gdriveConfig.RestURL + '?' + queryStr.substring(1);
    return queryStr;
  }

  async httpGetPromised(theUrl) {
    return await  new Promise((resolve, reject) => {
      const xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
          resolve(xmlHttp.responseText);
        }
      };
      xmlHttp.open('GET', theUrl, true); // true for asynchronous
      xmlHttp.send(null);
    });
  }

  async loadFilesPromised() {
    let ar = [];
    // return await getFileListPromised(gdriveConfig.Data[1].key, gdriveConfig.Data[1].folder);
    await Promise.all(this.gdriveConfig.Data.map((element) =>
      this.getFileListPromised(element.key, element.folder, '')
        .then(x => ar.push(...x))
        .catch(x => process.stderr.write('ERROR in getFileListPromised' + JSON.stringify(x)))
    ));
    return ar;
  }

  async loadFile(key) {
    return await  this.httpGetPromised(this.gdriveConfig.FileURL + key);
  }

  getFiles() {
    return this.files;
  }

}
