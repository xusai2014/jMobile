// @flow

export const ActionCreator = (args) => {
  const {
    type,
    method = 'GET',
    key = '',
    url = '/api',
    data
  } = args;
  return {
    payload: key,
    promise: () => fetchPromise(url, method, data, true),
    types: [...type]
  };
};

