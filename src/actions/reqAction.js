import { ActionCreator } from '../utils/fetch-middleware';
import { BILL_DETAIL_LIST } from '../utils/ActionsType';

export const getBillDetaillList = (data: any) => actionGenerator({ type: BILL_DETAIL_LIST, data });

export const actionGenerator = ({ data, type }) => ActionCreator({
  type,
  method: 'POST',
  data: { ...data, TRDE_CODE: type[1] }
});
