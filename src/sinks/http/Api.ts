import * as pako from 'pako';

import axios from 'axios';

if (!axios.defaults.transformRequest) {
  axios.defaults.transformRequest = []
} else if (!Array.isArray(axios.defaults.transformRequest)) {
  axios.defaults.transformRequest = [ axios.defaults.transformRequest ]
}

const api = axios.create({
  withCredentials: true,
  transformRequest: axios.defaults.transformRequest.concat(
    function (data: any, headers: any) {
      // compress strings if over 1KB
      if (typeof data === 'string'/* && data.length > 1024*/) {
        headers['Content-Encoding'] = 'gzip'
        const encoded = Buffer.from(pako.gzip(data))
        return encoded
      } else {
        // delete is slow apparently, faster to set to undefined
        headers['Content-Encoding'] = undefined;
        return data;
      }
    }
  )
});

export default api;
