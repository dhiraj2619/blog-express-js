const { DataTypes } = require("sequelize");
const { sequelize } = require("../../connection");

const Blog = sequelize.define("blog",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    content:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    date:{
        type:DataTypes.DATE,
        allowNull:false
    }
})


module.exports = {Blog}