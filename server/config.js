export default [
   {
     "/api":{
       target:"https://localhost:400",
       secure:false,
       changeOrigin: true,
       pathRewrite: {
         '^/api/test' : '/phoneclient/notify.htm',     // rewrite path
       },
     }
   },{
     '/rcsapi':{
       target: 'https://localhost:400',
       pathRewrite: {"^/rcsapi" : ""},
       secure:false,
       changeOrigin: true
     },
   }
 ]
/**
*   @author jerryxu
*   @description 项目配置信息
*/
export const config = {
  enableAutoRouter:true,// 开启动态生成路由代码,
  enableZIP:false,
}

