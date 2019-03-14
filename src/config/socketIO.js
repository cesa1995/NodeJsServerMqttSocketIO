const SocketIO = require('socket.io');
const server=require('../index')
//configuracion de socketIO
const io = SocketIO(server);
module.exports=io;