var apiai = require('apiai');

//API Key
var app = apiai("31b03304c7c24af49813a2d978a9ecbb");

// Function which returns speech from api.ai
var getRes = function(query) {
  var request = app.textRequest(query, {
      sessionId: '<unique session id>'
  });
  const responseFromAPI = new Promise(function (resolve, reject) {
    request.on('error', function(error) {
      reject(error);
    });
    request.on('response', function(response) {
      console.log(response)
      resolve(response);
    });
  });
  request.end();
  return responseFromAPI;
};

// test the command :

module.exports = {getRes}
