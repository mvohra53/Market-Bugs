module.exports = {
    _gRs: function(length){
        if(typeof length == 'undefined'){length = 20;}
        var text = "";
          var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=+/*({[]})";
          for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
          return text;
    },
    Users: require('./users.js')
}
