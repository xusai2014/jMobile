const key = 'fdsa1234';
export const SIGN_KEY = 'zxcasdqwe';


export const generateSign = (basicInfo, signKey) => {
  const arr = Object.keys(basicInfo)
  const pureData = _.sortBy(arr,(a) => {
    return a.toLowerCase();
  });
  let dataString = '';
  pureData.map((v, k) => {
    dataString = dataString + basicInfo[v];

  })
  dataString = dataString + signKey;
  let encodeString = ''
  dataString.split(" ").map((v,k)=>{
    if(k+1 == dataString.split(" ").length){
      encodeString =encodeString+encodeURIComponent(v);
    } else {
      encodeString =encodeString+encodeURIComponent(v)+'+';
    }

  })
  return CryptoJS.SHA256(encodeString).toString();
}

export const packageReqData = (data, isnv, encflag) => {
  const dataBody = {}
  // 空不加入签名
  for (let value in data) {
    if (!data[value]) {
      delete data[value]
    }
  }
  const signature = generateSign({...data, isnv, encflag}, SIGN_KEY)
  dataBody["sign"] = aesEncrypt(signature);
  dataBody["isnv"] = aesEncrypt(isnv)
  Object.keys(data).map((v, k) => {
    dataBody[v] = aesEncrypt(data[v])
  });
  return {...dataBody, encflag}
}


export const aesEncrypt = (x)=> {
  //
  return CryptoJS.AES.encrypt(
    String(x),
    CryptoJS.enc.Hex.parse("9ce8cfcdd1f572ed9d9461f7f6d81833"),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).ciphertext.toString()
}

export const aesDecrypt = (x) => {
  var wordArray = CryptoJS.enc.Hex.parse(x);
  var base64String = CryptoJS.enc.Base64.stringify(wordArray);

  return CryptoJS.AES.decrypt(
    base64String,
    CryptoJS.enc.Hex.parse("9ce8cfcdd1f572ed9d9461f7f6d81833"),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8)

}