const makeHttpRequest = (url, method = 'GET', data = {}, requestHeaders) => {
  method = method.toUpperCase();
  const namespace = '';
  let requestUrl;
  if (url && namespace !== '') {
    requestUrl = `${namespace}/${url}`;
  } else {
    requestUrl = `${url}`;
  }

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  let requestBody = {
    method,
  };
  
  if (requestHeaders) {
    requestBody.headers = requestHeaders;
  } else {
    requestBody.headers = headers;
  }

  if (data) {
    requestBody.body = JSON.stringify(data);
  }
  return fetch(requestUrl, requestBody).then((response) => {
    if (response.headers?.get('content-type')?.includes('application/json')) {
      return response.json().then((responseObject) => {
        return responseObject;
      });
    } else {
      return response.text();
    }
  });
};

const get = (url) => {
  return makeHttpRequest(url, 'get', null);
};

const post = (url, data = {}, headers) => {
  return makeHttpRequest(url, 'post', data, headers);
};

const patch = (url, data = {}) => {
  return makeHttpRequest(url, 'PATCH', data);
};

const getEmployeeList = () => {
  return get('https://run.mocky.io/v3/e4192315-3ac2-4b21-b5ca-274a3c205cee');
};

const addEmployee = (data) => {
  return get('https://run.mocky.io/v3/0bb7f0c8-2e2e-439e-9dad-5f20adde3555', null);
  // TO DO: return post('https://run.mocky.io/v3/0bb7f0c8-2e2e-439e-9dad-5f20adde3555', data);
};

const addProfileImageEmployee = (data, id) => {
  return post('https://run.mocky.io/v3/0bb7f0c8-2e2e-439e-9dad-5f20adde3555', data, {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  });
  // TO DO: return post(`add-profile-image/${id}`, data,{
  //  'Content-Type': 'multipart/form-data',
  // })
}

const editEmployee = (data) => {
  return get('https://run.mocky.io/v3/a336bccd-afcd-4107-8c26-57bc43bf62e1', null);
  // TO DO: return patch('https://run.mocky.io/v3/0bb7f0c8-2e2e-439e-9dad-5f20adde3555', data);
}

const deleteEmployee = (id) => {
  return get('https://run.mocky.io/v3/a336bccd-afcd-4107-8c26-57bc43bf62e1', null);
  // TO DO: return delete('https://run.mocky.io/v3/0bb7f0c8-2e2e-439e-9dad-5f20adde3555', data);
}
export {
  getEmployeeList,
  addEmployee,
  editEmployee,
  deleteEmployee,
  addProfileImageEmployee
};
