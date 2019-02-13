import { BILL_DETAIL_LIST } from "./actionType";
export const getBillDetaillList = (data: any) => actionGenerator({ type: BILL_DETAIL_LIST, data });

export const actionGenerator = ({ data, type }) => {
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

