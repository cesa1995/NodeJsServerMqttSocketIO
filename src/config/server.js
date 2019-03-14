//requerir modulos
const path=require('path');
const express = require('express');
//const html = require('html');

//configurar express
const app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '../app/views/chat')));
//conectar a express
module.exports=app;