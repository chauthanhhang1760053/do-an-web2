const Sequelize=require('sequelize');

<<<<<<< HEAD
const connectionString= process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/doanweb';
=======
const connectionString= process.env.DATABASE_URL || 'postgres://postgres:Yennhi081199@localhost:5432/doanweb';
>>>>>>> origin/master
const db=new Sequelize(connectionString);

module.exports=db;
