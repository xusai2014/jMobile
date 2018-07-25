import express from 'express';
import { renderToString } from 'react-dom/server';
import storage from '../store';
import { Provider } from "react-redux";
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import RouterAll from '../router/serverRouters';

const app = express();

app.get('/render/*',(req,res)=>{
  const { originUrl} = req;
  res.set('content-type','text/html');
  res.send(handleRender(originUrl.replace('/render','')));
  res.end();

})

function handleRender(path) {
  // Render the component to a string
  const context = {}
  return renderToString(<Provider store={ storage } >
    <StaticRouter location={path} context={context}>
      <RouterAll />
    </StaticRouter>
  </Provider>);
}

app.listen(3300,()=>{
  console.log('')
})

