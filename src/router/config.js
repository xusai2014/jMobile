export default [{
  component:"../page/home/Index.jsx",
  path:"/home/index",
  name:"HomeIndex"
},{
  component:"../page/cardsPackage/CardsList.jsx",
  path:"/cards/cardslist",
  name:"CardsList"
},{
  component:"../page/result/Result.jsx",
  path:"/result/:type",
  name:"Result"
},{
  component:"../page/result/LoadingStatus.jsx",
  path:"/load/:type",
  name:"LoadingStatus"
},
  {
    component:"../page/cardsPackage/EditCard.jsx",
    path:"/cards/edit",
    name:"CardsEdit"
  },{
    component:"../page/bill/MethodList.jsx",
    path:"/bill/method",
    name:"BillMethodList"

  },{
    component:"../page/bill/BankCardList.jsx",
    path:"/bill/cardlist",
    name:"BankCardList"

  },{
    component:"../page/manual/HandleBill.jsx",
    path:"/manual/handlebill",
    name:"HandleBill"

  },{
    component:"../page/manual/AddBill.jsx",
    path:"/manual/add",
    name:"AddBill"

  },{
    component:"../page/email/EmailManager.jsx",
    path:"/email/manager",
    name:"EmailManager"

  },{
    component:"../page/email/EmailAdd.jsx",
    path:"/email/add",
    name:"EmailAdd"

  },{
    component:"../page/bill/BillDetail.jsx",
    path:"/bill/detail/:billId",
    name:"BillDetail"

  },{
    component:"../page/cyber/CyberBank.jsx",
    path:"/cyber/login/:bankId",
    name:"CyberBank"

  },
  {
    component:"../page/3.4.0/ImportBills.jsx",
    path:"/3.4.0/importbills",
    name:"ImportBills"
  },
  {
    component:"../page/3.4.0/ChooseBank.jsx",
    path:"/3.4.0/choosebank",
    name:"ChooseBank"
  }, {
    component:"../page/3.4.0/email/EmailAdd.jsx",
    path:"/3.4.0/email/emailadd",
    name:"EmailAdd340"
  },{
    component:"../page/3.4.0/email/EmailManager.jsx",
    path:"/3.4.0/email/EmailManager",
    name:"EmailManager340"
  },{
    component:"../page/3.4.0/BankCardList.jsx",
    path:"/3.4.0/bankcardlist",
    name:"BankCardList340"
  },
]