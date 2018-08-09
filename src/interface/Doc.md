# APP与WEB接口

### APP提供的接口

+ 登录交互接口

**登录状态及数据随用随取，服务端与前端交互同步用户状态，只维护一份数据源即APP端存储的用户数据**

   + 登录权限功能的过滤方法
   ```
   import { loginHelper } from './jsNative.js';
   
   class Demo extends React.Component {
      
      enterWallet(){
      
        loginHelper(()=>{
        
        //如果已登录， TODO 正常逻辑
        },()=>{
            // 如果未登录，调起原生登录流程，登录流程中如果取消 提示用户需先登录
        })
      }
   
      render(){
        return (<div>
        
        <div onClick={()=>this.enterWallet()}>钱包入口<div>
        </div>)
      }
   }
```
   + 登录状态检查
   ```
   import { checkNativeLoginStatus } from './jsNative.js';
   class Demo extends React.Component {
         
         construcor(props){
            super(props);
            checkNativeLoginStatus().then((data)=>{
                this.setState({loginStatus:true})
            },data)=>{
                this.setState({loginStatus:false})              
            },)
         }
         
         enterWallet(){
               
             loginHelper(()=>{
             
                this.setState({loginStatus:true})
                
             },()=>{
                   // 如果未登录，调起原生登录流程，登录流程中如果取消 提示用户需先登录
                   this.setState({loginStatus:true})
             })
         }
     
         render(){
            const { loginStatus } = this.state;
           return (<div>
           
           { loginStatus? 已登录:未登录}
           <div onClick={()=>this.enterWallet()}>钱包入口<div>
           </div>)
         }
      }

```