var botui = new BotUI('api-bot');

var socket = io.connect(window.location.hostname);

socket.removeAllListeners();
botui.message.add({
    content: 'Lets Start Talking...'
  }).then(() => {init()});

socket.on('fromServer', function (data) { // recieveing a reply from server.
  console.log(data);
  botui.message.add({
      content: data.server,
      delay: 500,
    });
});

function init(){
      botui.action.text({
        action: {
          placeholder: 'Say Hello'
        }
      }).then(function (res) {
        socket.emit('fromClient', { client : res.value }); // sends the message typed to server
        console.log(res);
      }).then(init);
    };
init();
