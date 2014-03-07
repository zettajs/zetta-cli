var ws = require('ws');
var socket = new ws('ws://elroy-cloud.herokuapp.com/events');

socket.on('open',function(){
  socket.send( JSON.stringify({cmd : 'subscribe',name : 'photosensor/value'}) );  
});


socket.on('message',function(data){
  console.log(data);
});

