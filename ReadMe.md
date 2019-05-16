
### 新增预渲染
依赖第三包
```
yarn add react-snap
```
How to use

**in package.json 新增如下内容：**
```
.....

"scripts":{

    ....

    "postbuild":"npx react-snap",
    ....

},
"reactSnap": {
    "source": "build",
    "port": "3300",
    "userAgent": "ReactSnap Android",
    "skipThirdPartyRequests": false,
    "asyncScriptTags": true,
    "cacheAjaxRequests": true,
    "minifyHtml": {
      "collapseWhitespace": false,
      "removeComments": false
    },
    "destination": "./build/dist",
    "include": [
      "/home/index",

    ]
  },
  
.....

```

**框架接入react-snap , 对路径进行自动化配置**

在 /server/autoRouter.js 中，读取 /src/router/config.js，自动配置 **include**


