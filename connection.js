const {Sequelize} = require('sequelize');

const database = process.env.DB_NAME;
const user = process.env.DB_USER
const password = process.env.DB_PASS
const db_host = process.env.HOST

const sequelize = new Sequelize(
    database,user,password,{
       host:db_host,
       dialect:'mysql'
    }
);

sequelize.authenticate().then(()=>{
    console.log('connection has established successfully');
}).catch((error)=>{
    console.log('unable to connect with database',error);
})

sequelize.sync({force:false}).then(()=>{
    console.log('re-sync done');
    
})


module.exports = {sequelize}