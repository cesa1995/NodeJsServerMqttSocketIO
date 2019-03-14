const mqtt=require('mqtt');

//configurar mqtt
var mqttCon  = mqtt.connect([{host:'localhost',port:1883}]);
module.exports=mqttCon;