const postData = (url, data) => fetch(url, {
  body: JSON.stringify(data),
  cache: 'no-cache',
  method: 'POST',
  headers: {
    'content-type': 'application/json',
  },
}).then(response => response.json()).catch(error => console.log(error))
  .then(res => console.log(res));

export default postData;
