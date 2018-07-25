import path from 'path';
import fs from 'fs';
import {exec} from 'child_process';

export default (filePath,func)=>{
  fs.readdir(filePath,(err,files)=>{
    if(err) log.warning('读取文件异常');
    exec(`npx imagemin ${filePath}/* --out-dir=${filePath}/`, function (err, stdout, stderr) {
      if (err) {
        console.log('imagemin failed to minfy the imagefile err:' + stderr);
      } else {
        log.info('压缩图片成功！', stdout);
      }
    });
    files.forEach((filename)=>{
      var filedir = path.join(filePath,filename);
      //根据文件路径获取文件信息，返回一个fs.Stats对象
      fs.stat(filedir,function(eror,stats){
        if(eror){
          console.warn('获取文件stats失败');
        }else{
          const isFile = stats.isFile();//是文件
          const isDir = stats.isDirectory();//是文件夹
          if(isFile){
            console.log(filedir);
          }
          if(isDir){
            func(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
          }
        }
      })
    })
  })
}