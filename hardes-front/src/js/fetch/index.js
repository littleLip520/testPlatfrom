import 'whatwg-fetch';
import Promise from 'promise-polyfill';
import { ErrorCode, err } from '../utils/errorCode';

const fetchApi = (host, url, param) => {
  const { body } = param;
  const options = param;
  let fetchApiUrl = '';
  if (host.match(/^((http(|s):\/\/)|(\/\/))/)) {
    fetchApiUrl = `${host}/${url}`;
  } else {
    fetchApiUrl = `http://${host}/${url}`;
  }
  const fetchPromise = (() => {
    let fetchResolve;
    let fetchReject;
    const promise = new Promise((resolve, reject) => {
      fetchResolve = resolve;
      fetchReject = reject;
    });
    const token = localStorage.getItem('token');
    if (param.method === 'POST') {
      options.headers = {
        'Content-Type': 'application/json;charset=utf-8',
        accept: 'application/json;charset=utf-8',
        token
      };
      options.body = JSON.stringify(body);
    } else if (typeof body === 'object') {
      options.headers = {
        accept: 'application/json;charset=utf-8',
        token
      };
      let str = '?';
      if (Object.keys(body).length !==0) {
      Object.keys(body)
        .map((key) => {
          str += `${key}=${body[key]}&`;
        });
      str = str.substr(0, str.length - 1);
      fetchApiUrl += str;
      }else {
        delete options.body;
      }
    }
    fetch(fetchApiUrl, param)
      .then((res) => {
        let response = '';
        if (res.ok) {
          try {
            response = res.json();
          } catch (e) {
            response = res.text();
          }
        }else {
          response = fetchResolve(err(res.status));
        }
        if (!response) {
          response = fetchResolve(err(res.status));
        }
        fetchResolve(response);
      }).catch((e) => {
        console.error(e);
        console.error(fetchApiUrl);
        fetchResolve(err(600));
      });
    promise.abort = function () {
      fetchReject(err(ErrorCode.ABORTED));
    };
    return promise;
  })();
  return fetchPromise;
};

export default fetchApi;
