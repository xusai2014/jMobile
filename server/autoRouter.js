/*
 *   @author jerryxu
 *   @description 监控路由发生变化，自动生成代码。
 *   @warning 在变更config 文件后，请务必启动开发模式，生成路由文件
 */
import routerConfig from '../src/router/config';
import path from 'path';
import fs from 'fs';


export const generateString = ()=>{
  const routerString = routerConfig.map((v,k)=>{
    return `<Route exact={${v.path=='/cca'?true:false}} path={'${v.path}'} component={ Loadable({loader: () => import('${v.component}'),loading: Loading,})} />\n`
  })
  const string = `/*
*   @author jerryxu
*   @description 此文件由自动生成，不允许修改！！！！
*/
import React from 'react';
import { Switch,Route} from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from '../compoents/Loading';
export default ()=>(<Switch>${routerString.join('')}</Switch>)`;
  fs.writeFileSync(path.join(__dirname,`../src/router/index.jsx`),string,'utf-8');

  const imports = routerConfig.map((v,k)=>{
    return `import ${v.name} from '${v.component}';\n`
  })
  const routers = routerConfig.map((v,k)=>{
    return `<Route exact={${v.path=='/cca'?true:false}} path={'${v.path}'} component={${v.name}} />\n`
  })
  const string1 = `/*
*   @author jerryxu
*   @description 此文件由自动生成，不允许修改！！！！
*/
import React from 'react';
import { Switch,Route} from 'react-router-dom';
${imports.join('')}
export default ()=>(<Switch>${routers.join('')}</Switch>)`;
  fs.writeFileSync(path.join(__dirname,`../src/router/serverRouters.jsx`),string1,'utf-8');
}


