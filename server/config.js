export default [
   {
     "/api":{
       target:"https://mpos.suixingpay.com",
       secure:false,
       changeOrigin: true,
       pathRewrite: {
         '^/api/test' : '/phoneclient/notify.htm',     // rewrite path
       },
     }
   },{
     '/rcsapi':{
       target: 'http://172.16.138.138:9010',
       pathRewrite: {"^/rcsapi" : ""},
       secure:false,
       changeOrigin: true
     },
   }
 ]
/*
*   @author jerryxu
*   @description 项目配置信息
*/
export const config = {
  enableAutoRouter:true,//开启动态生成路由代码,
  enableZIP:false,
}

