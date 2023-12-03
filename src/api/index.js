const makeHttpRequest = (url, method = 'GET', data = {}, requestHeaders) => {
  method = method.toUpperCase();
  const namespace = 'https://zrizqyz3l8.execute-api.us-east-1.amazonaws.com/dev';
  let requestUrl;
  if (!url.includes('https') && namespace !== '') {
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

const deleteRequest = (url) => {
  return makeHttpRequest(url, 'DELETE', null);
};

const getEmployeeList = () => {
  return get('getEmployees');
};

const addEmployee = (data) => {
  return post('addEmployee', data);
};

const editEmployee = (data) => {
  return patch('editEmployee', data);
}

const deleteEmployee = (id) => {
  return deleteRequest(`deleteEmployee?id=${id}`, null);
}

const authenticateUser = (data) => {
  return get('https://run.mocky.io/v3/b698e412-4bc1-4948-870f-e4d68ea7efd0', data);
  // TO DO: change url
}

export {
  getEmployeeList,
  addEmployee,
  editEmployee,
  deleteEmployee,
  authenticateUser
};
