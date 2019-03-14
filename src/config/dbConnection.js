const mysql=require('mysql');

module.exports=()=>{
  return mysql.createConnection({
    host: 'localhost',
    user: 'cesar',
    password: 'Cesitar95.',
    database: 'agroSmart'
  });
}