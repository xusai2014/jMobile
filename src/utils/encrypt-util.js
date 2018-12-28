// @flow
import _sortBy from 'lodash/sortBy';
import CryptoJS from 'crypto-js'
export const SIGN_KEY: string = 'zxcasdqwe';
const SECRET_KEY: string = '9ce8cfcdd1f572ed9d9461f7f6d81833';

export const generateSign = (basicInfo: any, signKey: string) => {
  const arr = Object.keys(basicInfo);
  const pureData = _sortBy(arr, (a: string) => a.toLowerCase());
  let dataString = '';
  pureData.forEach((v) => {
    dataString += basicInfo[v];
  });
  dataString += signKey;
  let encodeString = '';
  dataString.split(' ').forEach((v, k) => {
    if (k + 1 === dataString.split(' ').length) {
      encodeString += encodeURIComponent(v);
    } else {
      encodeString = `${encodeString + encodeURIComponent(v)}+`;
    }
  });
  return CryptoJS.SHA256(encodeString).toString();
}

export const packageReqData = (data: any, isnv: any, encflag: any) => {
  const dataBody = {}
  // 空不加入签名
  for (let value in data) {
    if (!data[value]) {
      delete data[value];
    }
  }

  const signature = generateSign({ ...data, isnv, encflag }, SIGN_KEY)
  dataBody['sign'] = aesEncrypt(signature);
  dataBody['isnv'] = aesEncrypt(isnv)
  Object.keys(data).map((v) => {
    dataBody[v] = aesEncrypt(data[v]);
    return v;
  });
  return { ...dataBody, encflag };
}

export const aesEncrypt = (x: any) => CryptoJS.AES.encrypt(
  String(x),
  CryptoJS.enc.Hex.parse(SECRET_KEY),
  {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }
).ciphertext.toString();

export const aesDecrypt = (x: any) => {
  const wordArray = CryptoJS.enc.Hex.parse(x);
  const base64String = CryptoJS.enc.Base64.stringify(wordArray);

  return CryptoJS.AES.decrypt(
    base64String,
    CryptoJS.enc.Hex.parse(SECRET_KEY),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  ).toString(CryptoJS.enc.Utf8);
};
