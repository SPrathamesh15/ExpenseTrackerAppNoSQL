const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isPremiumUser: {
        type: Boolean,
        default: false
    },
    totalIncome: {
        type: Number,
        default: 0
    },
    totalExpense: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('User', userSchema)

// const Sequelize = require('sequelize')

// const sequelize = require('../util/database')

// const UserDetails = sequelize.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   username: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   useremail: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   userpassword: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   ispremiumuser: {
//     type: Sequelize.BOOLEAN,
//     allowNull: false,
//     defaultValue: false 
//   },
//   totalExpense: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     defaultValue: 0,
//   },
  
// });

// module.exports = UserDetails;
