import path from "path";
import express from "express";
import webpack from "webpack";
import webpackConfig from '../webpack.config.babel.js';
import serverConfig, {config} from './config';
import weblog from 'webpack-log';
import fs  from 'fs';
import https from 'https';
import proxyMiddleWare from "http-proxy-middleware";
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import {generateString} from './autoRouter';
import proxy from 'http-proxy-middleware'
import fileDisplay from './zipimg';
import {execFile} from 'child_process';
import flow from 'flow-bin';

global.log = weblog({name: `jerry's server`});
log.info('开始启动了');
/**
 *   @author jerryxu
 *   @description 自动生成路由
 */
if (config.enableAutoRouter) {
  generateString();
  fs.watch(path.join(__dirname, '../src/router/config.js'), function (event, filename) {
    if (filename) {
      generateString();
    } else {
      log.warn('filename not provided');
    }
  });
}

/**
 *   @author jerryxu
 *   压缩文件，开发模式下处理图片文件
 */
if (config.enableZIP) {
  const filePath = path.resolve(__dirname, '../static/img');
  fileDisplay(filePath, fileDisplay);
}

const app = express(),
  PORT = 3200, // 设置启动端口
  compiler = webpack(webpackConfig);

/**
*   @author jerryxu
*   配置webpack-dev-server中间件
*/
const dev = devMiddleware(compiler, {
  headers: {"X-Custom-Header": "yes"},//This property allows a user to pass custom HTTP headers on each request. eg. { "X-Custom-Header": "yes" }
  noInfo: false,
  index: '/index.html',//The index path for web server, defaults to "index.html". // If falsy (but not undefined), the server will not respond to requests to the root URL.
  lazy: false,//This option instructs the module to operate in 'lazy' mode, meaning that it won't recompile when files change, but rather on each request.
  mimeTypes: null,//This property allows a user to register custom mime types or extension mappings. eg. { 'text/html': [ 'phtml' ] }. Please see the documentation for node-mime for more information.
  publicPath: webpackConfig.output.publicPath,
  watchOptions: {aggregateTimeout: 200},
  serverSideRender: false,
});
dev.waitUntilValid(() => {
  //log.info("打包完成!!!!!")
  // Flow type check

});
dev.invalidate(()=>{
  execFile(flow, ['check'], (err, stdout) => {
    log.warn(stdout);
  });
})
app.use(dev);

/**
*   @author jerryxu
*   监听文件改动，触发静态检查
*/
global.watchTimer = null;
fs.watch(path.join(__dirname, '../src/'),()=>{
  if(watchTimer!=null){
    clearTimeout(watchTimer);
    watchTimer = setTimeout(()=>{
      log.warn('excuting*********')
      execFile(flow, ['check'], (err, stdout) => {
        log.warn(stdout);
      })
      watchTimer = null;
    },1000);
  } else {
    watchTimer = setTimeout(()=>{
      console.warn('excuting*********')
      execFile(flow, ['check'], (err, stdout) => {
        log.warn(stdout);
      })
      watchTimer = null;
    },1000);
  }
})
/**
 *   @author jerryxu
 *   @description 配置热推送
 */
app.use(hotMiddleware(compiler, {
  log: console.log,
  heartbeat: 10 * 1000
}));


/**
 *   @author jerryxu
 *   @description 静态资源的访问
 */
app.use('/static/*', express.static(path.join(__dirname, '../static')))

/**
 *   @author jerryxu
 *   @description 配置代理
 */
serverConfig.map((v, k) => {
  const key = Object.keys(v)[0];
  app.use(`${key}/*`, proxyMiddleWare(v[key]))
});

/**
 *   @author jerryxu
 *   @description 客户端页面请求
 */
const clientProxy = proxy({
  target: 'https://localhost:3200', // target host
  changeOrigin: true,               // needed for virtual hosted sites
  ws: true,                         // proxy websockets
  pathRewrite: {
    '^/*': '/render',     // rewrite path
  },
  router: {
    // when request.headers.host == 'dev.localhost:3000',
    // override target 'http://www.example.org' to 'http://localhost:8000'
    'localhost:3200': 'http://localhost:3300'
  },
  onError: (err, req, res) => {
    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, function (err, result) {
      if (err) {
        return next(err);
      }

      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  },
  onProxyReq: (proxyReq, req, res) => {
  },
  onProxyRes: (proxyRes, req, res) => {
    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, function (err, result) {
      if (err) {
        return next(err);
      }
      const {s} = proxyRes;
      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  }
});
app.use('/*', clientProxy);

/**
 *   @author jerryxu
 *   @description 配置HTTS子认证证书
 */
const httpsServer = https.createServer({
  key: fs.readFileSync('./cert/privatekey.pem', 'utf8'),
  cert: fs.readFileSync('./cert/certificate.crt', 'utf8')
}, app);

app.listen(PORT, () => {
  log.info(`启动服务器的端口: ${PORT}!`);
});

