const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    income: {
        type: Number,
        defaultValue: 0
    },
    expense: {
        type: Number,
        defaultValue: 0
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Expense', expenseSchema)

// const Sequelize = require('sequelize')
// const sequelize = require('../util/database')

// const Expense = sequelize.define('expense', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   income: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     defaultValue: 0,
//   },
//   expense: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     defaultValue: 0,
//   },
//   Description: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   category: {
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// });

// module.exports = Expense;
