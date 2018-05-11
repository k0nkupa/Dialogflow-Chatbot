var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var db = require('./connection');
var api = require('./api');
var mongoose = require('mongoose');

//socket.io connect
var conn = function() {
  server.listen(8010);
  app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
  });
};
//return from server and pass to botui
var fromClient = function() {
  io.on('connection', function (socket) {
    socket.on('fromClient', function (data) {
      api.getRes(data.client).then(function(res){
        var cond;
        mongoose.connection.readyState == 1 ?  cond = true :  cond = false;
          //Get all papers
          if(res.result.parameters.Course){
            if(cond) {
              var x = "<br>";
              db.find({})
              .exec()
              .then(docs => {
                for (var i in docs) {
                  x += docs[i].name + "<br>";
                }
                var result = res.result.fulfillment.speech + x;
                socket.emit('fromServer', { server: result });
                return docs;
              })//end then
              .catch(err => {console.log(err);});
            } else {
              console.log('error');
            }//end if
          }else if (res.result.parameters.Requisites == 'pre') {
            getRequisite(res,'pre',socket);
          }else {
            socket.emit('fromServer', { server: res.result.fulfillment.speech });
          }// end if
      });//end api.getRes()
    });//end socket.on
  });
};//end function

//get Requisites
var getRequisite = function (res,pre,socket) {
  var bln =true;
  //loop through the file
  db.find({})
  .exec()
  .then(docs => {
    for(let i in docs){
      //check if the paper is in the system or not
      if(res.result.parameters.Paper === docs[i].name) {
        var result = res.result.fulfillment.speech + " " + docs[i].pre;
        socket.emit('fromServer', { server: result });
        bln = true;
        break;
      }else {
        bln = false;
      }//end if
    }// end for
    if(!bln) {
      var fault = "The paper you are looking for is not in the system";
      socket.emit('fromServer', { server: fault });
    }
  })//end then
  .catch(err => {console.log(err);});
};

module.exports = {conn,fromClient}
