const {DataTypes}=require('sequelize')
const User=require('./User')
const sequelize=require('../config/database')

const FlashCard=sequelize.define('FlashCard',{
    question:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    answer:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:User,
            key:'id'
        }
    }
},{
timestamps:true})


User.hasMany(FlashCard,{foreignKey:'userId'})
FlashCard.belongsTo(User,{foreignKey:'userId'});

module.exports=FlashCard