//importar configuraciones
const app=require('./config/server');
const mysqlConnection=require('./config/dbConnection');
const server = app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});
module.exports=server;

const io=require('./config/socketIO');
const mqttCon=require('./config/mqtt');

mqttCon.subscribe('agroSmart/get/+');
mqttCon.subscribe('agroSmart/+');

io.on('connection', (socket) =>{
    console.log('new connection', socket.id);

    var channel='';
    socket.join(channel);
    socket.on('chat:channel', (newChannel) => {
        socket.leave(channel);
        socket.join(newChannel.channel);
        channel=newChannel.channel;
        io.sockets.emit('chat:channel', newChannel);
        console.log(newChannel.channel);
    });

    socket.on('tarea:create', (data) =>{
        io.sockets.in(channel).emit('tarea:create', data, socket.id);
        console.log(data);
    });

    socket.on('tarea:update', (data) =>{
        io.sockets.in(channel).emit('tarea:update', data, socket.id);
        console.log(data);
    });

    socket.on('tarea:delete', (data) =>{
        io.sockets.in(channel).emit('tarea:delete', data, socket.id);
        console.log(data);
    });

    socket.on('tarea:updateState', (data) =>{
        io.sockets.in(channel).emit('tarea:updateState', data, socket.io);
        console.log(data);
    });

    socket.on('chat:mensaje', (data) =>{
        io.sockets.in(channel).emit('chat:mensaje', data, socket.id);
        console.log(data);
        //io.sockets.emit('chat:mensaje', data);
    });

    socket.on('chat:typing', (data) => {
        socket.broadcast.to(channel).emit('chat:typing', data, socket.id);
        //socket.broadcast.emit('chat:typing', data);
    });

    socket.on('dato:new', (dato)=>{
        io.sockets.in(channel).emit('dato:new', dato, socket.id);
        console.log(dato);
    });
});

const iom=require('socket.io-client');
const socket=iom('http://localhost:3000', {reconnect:true});
//websockets
mqttCon.on('message', function (topic, message) {
    const topicSplit=topic.split("/");
    var fechaJson=JSON.stringify(getDateTime());
    var fechaParse=JSON.parse(fechaJson);
    var fecha=fechaParse.year+"-"+fechaParse.month+"-"+fechaParse.day+" "+fechaParse.hour+":"+fechaParse.min+":"+fechaParse.sec;
    var msg=JSON.parse(message.toString());
    if (topicSplit[1]=="get") {
        if(msg.get=="time"){
            console.log(fecha);
            mqttCon.publish('agroSmart/'+topicSplit[2]+'/R', fechaJson);
        }
    }else{
        const conn=mysqlConnection();
        for(var key in msg){
            console.log(topicSplit[1]+"/"+key+":"+msg[key]+"/"+fecha);
            var query='INSERT INTO datos SET?'
            conn.query(query, {
                idelemento: topicSplit[1],
                tipo: key,
                dato: msg[key],
                horafecha:fecha
            }, (err,result)=>{
                if(err){
                    throw err;
                }
            });
            var data=JSON.stringify({tipo:key, dato:msg[key]});
            socket.emit('chat:channel', {channel:topicSplit[1]});
            socket.emit('dato:new',data);
        }
        conn.end();
    }
});

function getDateTime(){
    var date = new Date();

    var hour = date.getHours();

    var min  = date.getMinutes();

    var sec  = date.getSeconds();

    var year = date.getFullYear();

    var month = date.getMonth() + 1;

    var day  = date.getDate();

    return {year:year,month:month,day:day,hour:hour,min:min,sec:sec};
}
