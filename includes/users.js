exports.checkUserName = function(username,callback){
    var sql ="SELECT ID FROM node_users WHERE user_login = ? OR user_email = ?";
    con.query(sql, [username,username], function (err, result, fields) {
        if (err) throw err;
        callback(result);
      });
}
exports.checkUserPassword = function(u,p,callback){
    var sql ="SELECT user_pass,user_login,display_name FROM node_users WHERE user_login='"+u+"' OR user_email='"+u+"'";
    var dataResult = false;
    return con.query(sql, function (err, result, fields) {
        if (err) throw err;
        var passwordHash = require('password-hash');
        if(passwordHash.verify(p,result[0].user_pass)){
            callback(result);
        }
      });
      //console.log(dataResult);
    //return dataResult;
}

exports.createHashPassword = function(password){
    var passwordHash = require('password-hash');
    var hashedPassword = passwordHash.generate(password);
    return hashedPassword;
}
exports.verifyPassword = function(hash,password){
    var passwordHash = require('password-hash');
    return passwordHash.verify(password, hash);
}
exports.getUserData = function(id){
    var sql ="SELECT * FROM node_users WHERE ID = ?";
    var dataResult = '';
    con.query(sql, username, function (err, result, fields) {
        if (err) throw err;
        dataResult = result;
        return result;
      });
      return dataResult[0];
}
