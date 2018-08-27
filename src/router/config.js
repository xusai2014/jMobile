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
  component:"../page/result/Loading.jsx",
  path:"/load/:type",
  name:"Loading"
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
    name:"BankCardList"

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

  }

]