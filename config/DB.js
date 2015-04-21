// config/DB.js

function DB(){

}

DB._connection = null;


DB.getDB = function getDB(){
  return DB._connection;
};


DB.setDB = function setDB(new_conn){
  this._connection = new_conn;
};

module.exports = DB;
