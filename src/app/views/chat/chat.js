const socket=io();

//DOM elements
let message=document.getElementById('message');
let username=document.getElementById('username');
let btn=document.getElementById('send');
let btnSave=document.getElementById('save');
let output=document.getElementById('chat-output');
let actions=document.getElementById('actions');
let channel=document.getElementById('room');

btnSave.addEventListener('click', function () {
    socket.emit('chat:channel', {channel: channel.value});
});

btn.addEventListener('click', function () {
    socket.emit('chat:mensaje', {
        message: message.value,
        username: username.value
    });
});

message.addEventListener('keypress', function () {
    socket.emit('chat:typing', username.value);
});

socket.on('dato:new', function(data){
    var data=JSON.parse(data)
    actions.innerHTML='data';
    output.innerHTML+=
    `<p>
        <strong>${data.tipo}</strong>:
        ${data.dato}
    </p>`;
});

socket.on('tarea:create', function (data) {
    actions.innerHTML = 'crear';
    output.innerHTML += `<p><strong>${data.tarea}</strong>:
        id=${data.id}/
        inicio=${data.inicio}/
        fin=${data.fin}/
        estado=${data.estado}</p>`;
});

socket.on('tarea:update', function (data) {
    actions.innerHTML = 'actualizar';
    output.innerHTML += `<p><strong>${data.tarea}</strong>:
        id=${data.id}/
        tarea=${data.tarea}/
        inicio=${data.inicio}/
        fin=${data.fin}</p>`;
});

socket.on('tarea:delete', function (data) {
    actions.innerHTML = 'eliminar';
    output.innerHTML += `<p>id=${data.id}</p>`;
});

socket.on('tarea:updateState', function (data) {
    actions.innerHTML = 'cambiar estado';
    output.innerHTML += `<p><strong>${data.id}</strong>:
        estado=${data.estado}</p>`;
});

socket.on('chat:mensaje', function (data) {
    actions.innerHTML = '';
    output.innerHTML += `<p><strong>${data.username}</strong>:${data.message}<p>`;
});

socket.on('chat:channel', function (newChannel) {
    actions.innerHTML = `<p><em>${newChannel.channel} is the new channel</em></p>`
})

socket.on('chat:typing', function (data) {
    actions.innerHTML = `<p><em>${data} is typing a message</em></p>`
});